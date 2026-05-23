export const JOB_STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected'];

export const APTITUDE_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const APTITUDE_CATEGORIES = {
  "Quantitative Aptitude": [
    "Number System", "HCF & LCM", "Simplification & Approximation", 
    "Fractions & Decimals", "Percentages", "Profit & Loss", 
    "Simple & Compound Interest", "Ratio & Proportion", "Averages", 
    "Mixtures & Alligations", "Time & Work", "Pipes & Cisterns", 
    "Time, Speed & Distance", "Trains", "Boats & Streams", "Ages", 
    "Partnership", "Mensuration (2D & 3D)", "Permutations & Combinations", 
    "Probability", "Progressions (AP, GP, HP)", "Surds & Indices", 
    "Logarithms", "Clocks & Calendars", "Data Sufficiency"
  ],
  "Data Interpretation": [
    "Bar Graphs", "Line Graphs", "Pie Charts", "Tables", 
    "Mixed Graphs", "Caselets"
  ],
  "Logical Reasoning": [
    "Number & Letter Series", "Analogies", "Coding & Decoding", 
    "Blood Relations", "Direction & Distance", "Seating Arrangements", 
    "Puzzles", "Syllogisms", "Input-Output", "Order & Ranking", 
    "Inequalities", "Statements & Conclusions", "Statements & Assumptions", 
    "Cause & Effect", "Course of Action", "Critical Reasoning", 
    "Logical Sequence", "Venn Diagrams", "Clocks & Mirrors", "Cubes & Dice"
  ],
  "Verbal Ability": [
    "Reading Comprehension", "Synonyms & Antonyms", "Fill in the Blanks", 
    "Sentence Correction", "Para Jumbles", "Cloze Test", 
    "Idioms & Phrases", "One Word Substitution", "Active & Passive Voice", 
    "Direct & Indirect Speech", "Vocabulary", "Spellings"
  ],
  "Technical Aptitude": [
    "C / C++ / Java basics", "Data Structures & Algorithms", 
    "DBMS & SQL queries", "Operating Systems concepts", "Networking basics", 
    "OOPs concepts", "Pseudocode / Output-based questions"
  ]
};

export const FLAT_APTITUDE_TOPICS = Object.values(APTITUDE_CATEGORIES).flat();

export const PLATFORMS = ['IndiaBix', 'GeeksforGeeks', 'HackerRank', 'InterviewBit', 'Other'];

export const APTITUDE_STATUSES = ['Solved', 'Attempted', 'Todo'];

export const JOB_STATUS_COLORS = {
  Applied: { bg: '#1e3a5f', text: '#60a5fa', border: '#3b82f6' },
  OA: { bg: '#3b2a00', text: '#facc15', border: '#eab308' },
  Interview: { bg: '#2d1b69', text: '#a78bfa', border: '#7c3aed' },
  Offer: { bg: '#052e16', text: '#4ade80', border: '#22c55e' },
  Rejected: { bg: '#450a0a', text: '#f87171', border: '#ef4444' },
};

export const DIFFICULTY_COLORS = {
  Easy: { bg: '#052e16', text: '#4ade80', border: '#22c55e' },
  Medium: { bg: '#3b2a00', text: '#facc15', border: '#eab308' },
  Hard: { bg: '#450a0a', text: '#f87171', border: '#ef4444' },
};

export const APTITUDE_STATUS_COLORS = {
  Solved: { bg: '#052e16', text: '#4ade80', border: '#22c55e' },
  Attempted: { bg: '#3b2a00', text: '#facc15', border: '#eab308' },
  Todo: { bg: '#1e293b', text: '#94a3b8', border: '#475569' },
};
