'use client';
import { useState, useEffect } from 'react';

export type TopicProgress = {
  id: string;
  completed: boolean;
  completionDate: number | null;
  revisions: [boolean, boolean, boolean, boolean]; // [rev1, rev2, rev3, final]
};

export function useSyllabus() {
  const [progress, setProgress] = useState<Record<string, TopicProgress>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pcm_tracker_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old data if necessary
        const migrated: Record<string, TopicProgress> = {};
        for (const key in parsed) {
          const item = parsed[key];
          if (typeof item.revisions === 'number') {
            // Old format
            migrated[key] = {
              ...item,
              revisions: [
                item.revisions >= 1,
                item.revisions >= 2,
                item.revisions >= 3,
                item.revisions >= 4
              ]
            };
          } else {
            migrated[key] = {
              ...item,
              revisions: item.revisions || [false, false, false, false]
            };
          }
        }
        setProgress(migrated);
      } catch (e) {
        console.error("Failed to parse saved progress", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('pcm_tracker_progress', JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const toggleTopic = (id: string): { success: boolean, message?: string } => {
    const current = progress[id] || { id, completed: false, completionDate: null, revisions: [false, false, false, false] };
    const nowCompleted = !current.completed;
    
    if (!nowCompleted && current.completionDate) {
      const timePassed = Date.now() - current.completionDate;
      if (timePassed > 20000) {
        const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        const userInput = window.prompt(`To undo this topic, type this key exactly: ${randomKey}`);
        if (userInput !== randomKey) {
          return { success: false, message: "Key did not match. Undo cancelled." };
        }
      }
    }

    setProgress(prev => ({
      ...prev,
      [id]: {
        ...current,
        completed: nowCompleted,
        completionDate: nowCompleted ? Date.now() : null,
        revisions: nowCompleted ? current.revisions : [false, false, false, false]
      }
    }));
    return { success: true };
  };

  const toggleRevision = (id: string, revIndex: number): { success: boolean, message?: string } => {
    const current = progress[id];
    if (!current || !current.completed || !current.completionDate) {
      return { success: false, message: "Topic not completed." };
    }

    const newRevisions = [...current.revisions] as [boolean, boolean, boolean, boolean];
    const isMarking = !newRevisions[revIndex];

    if (isMarking) {
      if (revIndex > 0 && !newRevisions[revIndex - 1]) {
        return { success: false, message: "Complete previous revisions first." };
      }

      const REVISION_INTERVALS = [3, 7, 14, 30, 90];
      const revsDone = newRevisions.filter(Boolean).length;
      const nextDue = current.completionDate! + (REVISION_INTERVALS[revsDone] * 86400000);
      
      if (Date.now() < nextDue) {
        const daysLeft = Math.ceil((nextDue - Date.now()) / 86400000);
        return { success: false, message: `Revision in cooldown. Due in ${daysLeft} days.` };
      }
    } else {
      if (revIndex < 3 && newRevisions[revIndex + 1]) {
        return { success: false, message: "Unmark subsequent revisions first." };
      }
    }

    newRevisions[revIndex] = !newRevisions[revIndex];
    setProgress(prev => ({
      ...prev,
      [id]: {
        ...current,
        revisions: newRevisions
      }
    }));
    
    return { success: true };
  };

  return { progress, toggleTopic, toggleRevision, mounted };
}
