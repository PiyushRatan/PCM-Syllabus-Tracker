export type Topic = {
  id: string;
  name: string;
};

export type Subject = {
  id: string;
  name: string;
  topics: Topic[];
};

export type ClassSyllabus = {
  classLevel: string; // '11' or '12'
  subjects: Subject[];
};

export const syllabusData: ClassSyllabus[] = [
  {
    classLevel: "11",
    subjects: [
      {
        id: "math11",
        name: "Mathematics",
        topics: [
          { id: "m11_1", name: "Sets" },
          { id: "m11_2", name: "Relations & Functions" },
          { id: "m11_3", name: "Trigonometric Functions" },
          { id: "m11_4", name: "Complex Numbers" },
          { id: "m11_5", name: "Linear Inequalities" },
          { id: "m11_6", name: "Permutations & Combinations" },
          { id: "m11_7", name: "Binomial Theorem" },
          { id: "m11_8", name: "Sequences & Series" },
          { id: "m11_9", name: "Straight Lines" },
          { id: "m11_10", name: "Conic Sections" },
          { id: "m11_11", name: "Introduction to 3D Geometry" },
          { id: "m11_12", name: "Limits & Derivatives" },
          { id: "m11_13", name: "Statistics" },
          { id: "m11_14", name: "Probability" }
        ]
      },
      {
        id: "phy11",
        name: "Physics",
        topics: [
          { id: "p11_1", name: "Units and Measurements" },
          { id: "p11_2", name: "Motion in a Straight Line" },
          { id: "p11_3", name: "Motion in a Plane" },
          { id: "p11_4", name: "Laws of Motion" },
          { id: "p11_5", name: "Work, Energy and Power" },
          { id: "p11_6", name: "System of Particles and Rotational Motion" },
          { id: "p11_7", name: "Gravitation" },
          { id: "p11_8", name: "Mechanical Properties of Solids" },
          { id: "p11_9", name: "Mechanical Properties of Fluids" },
          { id: "p11_10", name: "Thermal Properties of Matter" },
          { id: "p11_11", name: "Thermodynamics" },
          { id: "p11_12", name: "Kinetic Theory" },
          { id: "p11_13", name: "Oscillations" },
          { id: "p11_14", name: "Waves" }
        ]
      },
      {
        id: "chem11",
        name: "Chemistry",
        topics: [
          { id: "c11_1", name: "Some Basic Concepts of Chemistry" },
          { id: "c11_2", name: "Structure of Atom" },
          { id: "c11_3", name: "Classification of Elements" },
          { id: "c11_4", name: "Chemical Bonding" },
          { id: "c11_5", name: "Thermodynamics" },
          { id: "c11_6", name: "Equilibrium" },
          { id: "c11_7", name: "Redox Reactions" },
          { id: "c11_8", name: "Organic Chemistry: Some Basic Principles" },
          { id: "c11_9", name: "Hydrocarbons" }
        ]
      }
    ]
  },
  {
    classLevel: "12",
    subjects: [
      {
        id: "math12",
        name: "Mathematics",
        topics: [
          { id: "m12_1", name: "Relations and Functions" },
          { id: "m12_2", name: "Inverse Trigonometric Functions" },
          { id: "m12_3", name: "Matrices" },
          { id: "m12_4", name: "Determinants" },
          { id: "m12_5", name: "Continuity and Differentiability" },
          { id: "m12_6", name: "Application of Derivatives" },
          { id: "m12_7", name: "Integrals" },
          { id: "m12_8", name: "Application of Integrals" },
          { id: "m12_9", name: "Differential Equations" },
          { id: "m12_10", name: "Vector Algebra" },
          { id: "m12_11", name: "Three Dimensional Geometry" },
          { id: "m12_12", name: "Linear Programming" },
          { id: "m12_13", name: "Probability" }
        ]
      },
      {
        id: "phy12",
        name: "Physics",
        topics: [
          { id: "p12_1", name: "Electric Charges and Fields" },
          { id: "p12_2", name: "Electrostatic Potential and Capacitance" },
          { id: "p12_3", name: "Current Electricity" },
          { id: "p12_4", name: "Moving Charges and Magnetism" },
          { id: "p12_5", name: "Magnetism and Matter" },
          { id: "p12_6", name: "Electromagnetic Induction" },
          { id: "p12_7", name: "Alternating Current" },
          { id: "p12_8", name: "Electromagnetic Waves" },
          { id: "p12_9", name: "Ray Optics and Optical Instruments" },
          { id: "p12_10", name: "Wave Optics" },
          { id: "p12_11", name: "Dual Nature of Radiation and Matter" },
          { id: "p12_12", name: "Atoms" },
          { id: "p12_13", name: "Nuclei" },
          { id: "p12_14", name: "Semiconductor Electronics" }
        ]
      },
      {
        id: "chem12",
        name: "Chemistry",
        topics: [
          { id: "c12_1", name: "Solutions" },
          { id: "c12_2", name: "Electrochemistry" },
          { id: "c12_3", name: "Chemical Kinetics" },
          { id: "c12_4", name: "d- and f-Block Elements" },
          { id: "c12_5", name: "Coordination Compounds" },
          { id: "c12_6", name: "Haloalkanes and Haloarenes" },
          { id: "c12_7", name: "Alcohols, Phenols and Ethers" },
          { id: "c12_8", name: "Aldehydes, Ketones and Carboxylic Acids" },
          { id: "c12_9", name: "Amines" },
          { id: "c12_10", name: "Biomolecules" }
        ]
      }
    ]
  }
];
