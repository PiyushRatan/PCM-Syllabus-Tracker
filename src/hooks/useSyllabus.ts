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

  const toggleTopic = (id: string): { success: boolean, message?: string, requiresVerification?: boolean, expectedKey?: string } => {
    const current = progress[id] || { id, completed: false, completionDate: null, revisions: [false, false, false, false] };
    const nowCompleted = !current.completed;
    
    if (!nowCompleted && current.completionDate) {
      const timePassed = Date.now() - current.completionDate;
      if (timePassed > 20000) {
        const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        return { success: false, requiresVerification: true, expectedKey: randomKey };
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

  const forceToggleTopic = (id: string) => {
    setProgress(prev => {
      const current = prev[id] || { id, completed: false, completionDate: null, revisions: [false, false, false, false] };
      return {
        ...prev,
        [id]: {
          ...current,
          completed: false,
          completionDate: null,
          revisions: [false, false, false, false]
        }
      };
    });
  };

  const toggleRevision = (id: string, revIndex: number): { success: boolean, message?: string, requiresVerification?: boolean, expectedKey?: string } => {
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
      // Require verification to unmark a revision
      const randomKey = Math.random().toString(36).substring(2, 8).toUpperCase();
      return { success: false, requiresVerification: true, expectedKey: randomKey };
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

  const forceToggleRevision = (id: string, revIndex: number) => {
    setProgress(prev => {
      const current = prev[id];
      if (!current) return prev;
      const newRevisions = [...current.revisions] as [boolean, boolean, boolean, boolean];
      newRevisions[revIndex] = false;
      return {
        ...prev,
        [id]: {
          ...current,
          revisions: newRevisions
        }
      };
    });
  };

  const injectMockData = (syllabusData: any[]) => {
    const newProgress: Record<string, TopicProgress> = {}; // overwrite for fresh state
    const REVISION_INTERVALS = [3, 7, 14, 30, 90];
    
    syllabusData.forEach(sClass => {
      sClass.subjects.forEach((subject: any) => {
        subject.topics.forEach((topic: any) => {
          if (Math.random() < 0.3) { // 30% chance to complete
            const daysAgo = Math.floor(Math.random() * 40) + 1;
            const completionDate = Date.now() - (daysAgo * 86400000);
            let revs: [boolean, boolean, boolean, boolean] = [false, false, false, false];
            
            if (daysAgo >= REVISION_INTERVALS[0]) {
               if (Math.random() > 0.3) revs[0] = true;
            }
            if (revs[0] && daysAgo >= REVISION_INTERVALS[0] + REVISION_INTERVALS[1]) {
               if (Math.random() > 0.3) revs[1] = true;
            }
            if (revs[1] && daysAgo >= REVISION_INTERVALS[0] + REVISION_INTERVALS[1] + REVISION_INTERVALS[2]) {
               if (Math.random() > 0.3) revs[2] = true;
            }
            if (revs[2] && daysAgo >= REVISION_INTERVALS[0] + REVISION_INTERVALS[1] + REVISION_INTERVALS[2] + REVISION_INTERVALS[3]) {
               if (Math.random() > 0.3) revs[3] = true;
            }

            newProgress[topic.id] = {
              id: topic.id,
              completed: true,
              completionDate,
              revisions: revs
            };
          }
        });
      });
    });
    setProgress(newProgress);
  };

  return { progress, toggleTopic, toggleRevision, forceToggleTopic, forceToggleRevision, injectMockData, mounted };
}
