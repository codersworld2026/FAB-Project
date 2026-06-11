// Science proof-vertical seed content. ALL content here is original and
// non-copyrighted — no exam-board specifications, past papers, mark schemes or
// student data. One proof vertical per science (no full-curriculum expansion).
//
// Year stages are real (year-7..year-11). Each vertical has one home topic under
// year-7 and an ordered concept chain. Edges are derived in seed.ts: each
// consecutive pair A→B gets a `next` (B after A) AND a `prerequisite` (A before
// B); a few `related` links are listed explicitly per vertical.

export type Phase = 'KS3' | 'KS4' | 'GCSE' | 'IGCSE';
export type Difficulty = 'foundational' | 'developing' | 'secure' | 'stretch';
export type Ability = 'support' | 'core' | 'challenge';

export interface SeedConcept {
  slug: string;
  title: string;
  orderIndex: number;
  shortDescription: string;
  detailedExplanation: string;
  priorLearningSummary: string;
  nextLearningSummary: string;
  commonMisconceptions: string[];
  keyVocabulary: string[];
  lessonGuidance: string;
  assessmentGuidance: string;
  practicalLinks: string[];
  difficultyLevel: Difficulty;
  abilitySuitability: Ability[];
  scienceSkillsLinks: string[];
}

export interface SeedVertical {
  subject: { slug: string; name: string };
  topic: {
    title: string;
    description: string;
    orderIndex: number;
    yearStageSlug: string;
  };
  concepts: SeedConcept[];
  /** Extra `related` edges within the vertical, by concept slug pairs. */
  relatedPairs: Array<[string, string]>;
}

export const SEED_YEAR_STAGES: Array<{
  slug: string;
  name: string;
  phase: Phase;
  orderIndex: number;
}> = [
  { slug: 'year-7', name: 'Year 7', phase: 'KS3', orderIndex: 1 },
  { slug: 'year-8', name: 'Year 8', phase: 'KS3', orderIndex: 2 },
  { slug: 'year-9', name: 'Year 9', phase: 'KS3', orderIndex: 3 },
  { slug: 'year-10', name: 'Year 10', phase: 'KS4', orderIndex: 4 },
  { slug: 'year-11', name: 'Year 11', phase: 'KS4', orderIndex: 5 },
];

const biology: SeedVertical = {
  subject: { slug: 'biology', name: 'Biology' },
  topic: {
    title: 'Cells and organisation',
    description:
      'How living things are built up from cells into tissues, organs and whole organ systems.',
    orderIndex: 1,
    yearStageSlug: 'year-7',
  },
  concepts: [
    {
      slug: 'cells',
      title: 'Cells',
      orderIndex: 1,
      shortDescription: 'Cells are the smallest building blocks of every living organism.',
      detailedExplanation:
        'A cell is the basic unit of life: every plant and animal is made of one or more cells. Animal cells contain a nucleus that controls the cell, cytoplasm where reactions happen, and a cell membrane that controls what enters and leaves. Plant cells have these too, plus a cell wall for support, a vacuole holding sap, and chloroplasts for photosynthesis. Cells are far too small to see without a microscope.',
      priorLearningSummary:
        'Pupils know that animals and plants are living things and can name some body parts.',
      nextLearningSummary:
        'Pupils go on to see how cells become specialised for particular jobs.',
      commonMisconceptions: [
        'Thinking cells are only found in skin or blood, not throughout the whole body.',
        'Believing plant and animal cells are identical.',
        'Assuming you can see individual cells with the naked eye.',
      ],
      keyVocabulary: ['cell', 'nucleus', 'cytoplasm', 'cell membrane', 'cell wall', 'chloroplast'],
      lessonGuidance:
        'Open with a microscope or microscope images so the idea feels real. Build an animal cell first, then add the extra plant-cell parts so the difference is explicit.',
      assessmentGuidance:
        'Check that pupils can label a cell and state the job of each part, and can compare plant and animal cells.',
      practicalLinks: [
        'Observe onion-skin and cheek cells under a light microscope.',
        'Make a labelled scale drawing from what is seen down the microscope.',
      ],
      difficultyLevel: 'foundational',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Using a microscope', 'Scientific drawing'],
    },
    {
      slug: 'specialised-cells',
      title: 'Specialised cells',
      orderIndex: 2,
      shortDescription: 'Cells change shape and structure to carry out particular jobs.',
      detailedExplanation:
        'Most cells become specialised: their structure is adapted to their function. A red blood cell is small and has no nucleus so it can carry more oxygen; a nerve cell is long to carry signals; a root hair cell has a large surface area to absorb water; a sperm cell has a tail to swim. Specialisation lets a complex organism do many different jobs efficiently.',
      priorLearningSummary:
        'Pupils know what a cell is and can name the main parts of plant and animal cells.',
      nextLearningSummary:
        'Pupils see how many similar specialised cells group together to form tissues.',
      commonMisconceptions: [
        'Thinking every cell in the body looks the same.',
        'Believing a cell chooses to change shape rather than being adapted to its job.',
        'Assuming all cells have a nucleus (red blood cells do not).',
      ],
      keyVocabulary: ['specialised cell', 'adaptation', 'function', 'red blood cell', 'nerve cell', 'root hair cell'],
      lessonGuidance:
        'Give pupils a set of specialised-cell cards and ask them to match structure to function before revealing the answers, drawing out the structure–function link.',
      assessmentGuidance:
        'Ask pupils to explain how one named feature of a specialised cell helps it do its job.',
      practicalLinks: [
        'Examine prepared slides of blood, nerve or root tissue.',
      ],
      difficultyLevel: 'developing',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Linking structure to function'],
    },
    {
      slug: 'tissues',
      title: 'Tissues',
      orderIndex: 3,
      shortDescription: 'A tissue is a group of similar cells working together on one job.',
      detailedExplanation:
        'When many cells of the same type group together they form a tissue, and the whole group carries out a shared function. Muscle tissue contracts to create movement, the lining of the gut is an epithelial tissue, and xylem is a plant tissue that carries water. A tissue does a job that a single cell could not do alone.',
      priorLearningSummary:
        'Pupils understand that cells can be specialised for particular functions.',
      nextLearningSummary:
        'Pupils see how different tissues combine to form an organ.',
      commonMisconceptions: [
        'Thinking a tissue is just one cell.',
        'Believing a tissue must contain many different cell types rather than mainly one type.',
        'Confusing the everyday meaning of "tissue" (paper) with the biological term.',
      ],
      keyVocabulary: ['tissue', 'muscle tissue', 'epithelial tissue', 'xylem', 'function'],
      lessonGuidance:
        'Use the levels-of-organisation ladder (cell → tissue → organ → system) and place the lesson firmly on the "tissue" rung, referring back to specialised cells.',
      assessmentGuidance:
        'Check pupils can define a tissue and give an example of a tissue and its job.',
      practicalLinks: [
        'Look at muscle or leaf tissue under the microscope and identify repeating similar cells.',
      ],
      difficultyLevel: 'developing',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Classifying and ordering'],
    },
    {
      slug: 'organs',
      title: 'Organs',
      orderIndex: 4,
      shortDescription: 'An organ is several tissues working together to perform a function.',
      detailedExplanation:
        'An organ is made of more than one tissue, and together those tissues carry out an important function. The heart contains muscle tissue to pump, nerve tissue to control the beat and other tissues that supply it with blood. The stomach, lungs, leaves and roots are all organs. Because an organ combines tissues, it can do a more complex job than any single tissue.',
      priorLearningSummary:
        'Pupils know that similar cells form tissues with shared functions.',
      nextLearningSummary:
        'Pupils see how several organs work together as an organ system.',
      commonMisconceptions: [
        'Thinking an organ is made of just one kind of tissue.',
        'Believing only animals have organs (leaves and roots are plant organs).',
        'Assuming bigger always means more important when comparing organs.',
      ],
      keyVocabulary: ['organ', 'heart', 'stomach', 'leaf', 'tissue'],
      lessonGuidance:
        'Dissect or model an organ such as the heart to show that several tissues are present, reinforcing that "organ = tissues combined".',
      assessmentGuidance:
        'Ask pupils to name an organ and at least two tissues it contains, and state its function.',
      practicalLinks: [
        'Examine a heart or kidney (or a detailed model) and identify different tissues.',
      ],
      difficultyLevel: 'secure',
      abilitySuitability: ['core', 'challenge'],
      scienceSkillsLinks: ['Observation', 'Working safely in dissection'],
    },
    {
      slug: 'organ-systems',
      title: 'Organ systems',
      orderIndex: 5,
      shortDescription: 'An organ system is a group of organs that together do a major job.',
      detailedExplanation:
        'An organ system is several organs working together to carry out one of the body’s major functions. The digestive system includes the mouth, stomach, intestines and other organs that break down and absorb food. The circulatory system moves blood, and the respiratory system exchanges gases. Organ systems work together to keep the whole organism alive.',
      priorLearningSummary:
        'Pupils know that organs are made of several tissues with a shared function.',
      nextLearningSummary:
        'Pupils go on to study individual systems (such as digestion and circulation) in depth.',
      commonMisconceptions: [
        'Thinking each organ system works completely independently of the others.',
        'Believing the body has only one organ system.',
        'Confusing an organ with a whole system (e.g. calling the stomach the digestive system).',
      ],
      keyVocabulary: ['organ system', 'digestive system', 'circulatory system', 'respiratory system', 'organism'],
      lessonGuidance:
        'Finish the levels-of-organisation ladder by assembling organs into a system, then zoom out to show systems cooperating in one organism.',
      assessmentGuidance:
        'Check pupils can order the levels cell → tissue → organ → organ system → organism and give an example of each.',
      practicalLinks: [
        'Build a labelled poster or model of one organ system from its component organs.',
      ],
      difficultyLevel: 'secure',
      abilitySuitability: ['core', 'challenge'],
      scienceSkillsLinks: ['Modelling', 'Organising information'],
    },
  ],
  relatedPairs: [
    ['cells', 'tissues'],
    ['specialised-cells', 'organs'],
  ],
};

const chemistry: SeedVertical = {
  subject: { slug: 'chemistry', name: 'Chemistry' },
  topic: {
    title: 'Particles and matter',
    description:
      'How everything is built from particles, atoms and elements, and how they combine into compounds and mixtures.',
    orderIndex: 1,
    yearStageSlug: 'year-7',
  },
  concepts: [
    {
      slug: 'particles',
      title: 'Particles',
      orderIndex: 1,
      shortDescription: 'All matter is made of tiny particles that are always moving.',
      detailedExplanation:
        'The particle model says everything is made of tiny particles with spaces between them. In a solid the particles are packed closely in a fixed arrangement and only vibrate; in a liquid they are close but can move past each other; in a gas they are far apart and move quickly in all directions. Heating gives particles more energy, which is why solids melt and liquids evaporate.',
      priorLearningSummary:
        'Pupils can sort materials as solids, liquids and gases by their everyday properties.',
      nextLearningSummary:
        'Pupils learn that the particles themselves are atoms.',
      commonMisconceptions: [
        'Thinking the particles of a substance expand when heated (it is their movement and spacing that change).',
        'Believing there is air in the gaps between particles.',
        'Imagining particles are static in solids rather than vibrating.',
      ],
      keyVocabulary: ['particle', 'solid', 'liquid', 'gas', 'particle model', 'state of matter'],
      lessonGuidance:
        'Use a physical particle model (pupils as particles, or trays of beads) to show arrangement and movement in each state before introducing the formal diagrams.',
      assessmentGuidance:
        'Check pupils can draw the particle arrangement for each state and explain melting in terms of particles.',
      practicalLinks: [
        'Observe melting and evaporation and describe them using the particle model.',
      ],
      difficultyLevel: 'foundational',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Using models to explain'],
    },
    {
      slug: 'atoms',
      title: 'Atoms',
      orderIndex: 2,
      shortDescription: 'Atoms are the extremely small particles that all substances are made from.',
      detailedExplanation:
        'An atom is the smallest particle of a substance that still behaves like that substance. Atoms are incredibly small — millions would fit across a full stop. Everything around us, from water to metal, is built from atoms. Different substances are made from different kinds of atoms, and understanding atoms helps explain why materials behave as they do.',
      priorLearningSummary:
        'Pupils understand the particle model of solids, liquids and gases.',
      nextLearningSummary:
        'Pupils learn that a substance made of only one kind of atom is an element.',
      commonMisconceptions: [
        'Thinking atoms are alive or can be seen with a school microscope.',
        'Believing atoms are the same as cells.',
        'Assuming all atoms are identical.',
      ],
      keyVocabulary: ['atom', 'particle', 'substance', 'matter'],
      lessonGuidance:
        'Stress the scale of atoms with comparisons, and connect back to the particle model: the "particles" pupils met are atoms (or groups of atoms).',
      assessmentGuidance:
        'Check pupils can define an atom and explain that different substances are made of different atoms.',
      practicalLinks: [
        'Estimate scale using an oil-film or "how many atoms" thought experiment.',
      ],
      difficultyLevel: 'developing',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Reasoning about scale'],
    },
    {
      slug: 'elements',
      title: 'Elements',
      orderIndex: 3,
      shortDescription: 'An element is a substance made of only one type of atom.',
      detailedExplanation:
        'An element contains only one kind of atom and cannot be broken down into simpler substances by chemical means. Examples include oxygen, carbon, iron and gold. The periodic table lists all the known elements, each with its own chemical symbol such as O, C, Fe and Au. Elements are the building blocks from which all other substances are made.',
      priorLearningSummary:
        'Pupils know that all substances are made of atoms.',
      nextLearningSummary:
        'Pupils learn that atoms of different elements can join to form compounds.',
      commonMisconceptions: [
        'Thinking an element can contain different types of atom.',
        'Believing the periodic table lists every substance, not just elements.',
        'Confusing the chemical symbol with the first letters of the English name in every case.',
      ],
      keyVocabulary: ['element', 'atom', 'periodic table', 'chemical symbol'],
      lessonGuidance:
        'Give pupils element cards (name, symbol, everyday use) and let them explore the periodic table as an organised list rather than something to memorise.',
      assessmentGuidance:
        'Check pupils can define an element and read a chemical symbol from the periodic table.',
      practicalLinks: [
        'Examine samples of common elements (carbon, iron, copper) and match them to symbols.',
      ],
      difficultyLevel: 'developing',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Using the periodic table', 'Classifying'],
    },
    {
      slug: 'compounds',
      title: 'Compounds',
      orderIndex: 4,
      shortDescription: 'A compound forms when atoms of different elements join chemically.',
      detailedExplanation:
        'A compound is a substance made when atoms of two or more elements are chemically bonded together. Water is a compound of hydrogen and oxygen; carbon dioxide is a compound of carbon and oxygen. A compound has different properties from the elements that made it, and it can only be separated back into them by a chemical reaction, not by physical methods.',
      priorLearningSummary:
        'Pupils know that an element is made of only one kind of atom.',
      nextLearningSummary:
        'Pupils learn how compounds and elements can be mixed without bonding, forming mixtures.',
      commonMisconceptions: [
        'Thinking a compound is just a mixture of elements.',
        'Believing a compound keeps the properties of the elements it is made from.',
        'Assuming compounds can be separated by physical methods like filtering.',
      ],
      keyVocabulary: ['compound', 'chemical bond', 'reaction', 'formula', 'element'],
      lessonGuidance:
        'Contrast the dramatic difference between sodium, chlorine and the compound salt to make the "new properties" idea memorable; emphasise that bonding, not mixing, is what makes a compound.',
      assessmentGuidance:
        'Check pupils can name a compound, state the elements in it, and explain that it has new properties.',
      practicalLinks: [
        'Heat iron and sulfur (teacher demonstration) to show a compound forming with new properties.',
      ],
      difficultyLevel: 'secure',
      abilitySuitability: ['core', 'challenge'],
      scienceSkillsLinks: ['Comparing properties', 'Observing reactions'],
    },
    {
      slug: 'mixtures',
      title: 'Mixtures',
      orderIndex: 5,
      shortDescription: 'A mixture contains substances that are not chemically joined.',
      detailedExplanation:
        'In a mixture, two or more substances are together but not chemically bonded, so each keeps its own properties. Air, sea water and sand-and-salt are mixtures. Because the substances are not bonded, mixtures can be separated by physical methods such as filtering, evaporating or using a magnet. This is a key difference from compounds, which need a chemical reaction to separate.',
      priorLearningSummary:
        'Pupils know that compounds are elements chemically bonded together.',
      nextLearningSummary:
        'Pupils go on to study separation techniques and chemical reactions in more detail.',
      commonMisconceptions: [
        'Thinking a mixture is the same as a compound.',
        'Believing mixtures always need a chemical reaction to separate them.',
        'Assuming the substances in a mixture lose their own properties.',
      ],
      keyVocabulary: ['mixture', 'separation', 'filtering', 'evaporation', 'compound'],
      lessonGuidance:
        'Run a hands-on separation challenge (e.g. recover salt and sand) so pupils experience that physical methods work because nothing is bonded.',
      assessmentGuidance:
        'Check pupils can explain the difference between a mixture and a compound and choose a method to separate a named mixture.',
      practicalLinks: [
        'Separate a salt–sand mixture by dissolving, filtering and evaporating.',
      ],
      difficultyLevel: 'secure',
      abilitySuitability: ['core', 'challenge'],
      scienceSkillsLinks: ['Planning a separation', 'Practical technique'],
    },
  ],
  relatedPairs: [
    ['particles', 'atoms'],
    ['compounds', 'mixtures'],
  ],
};

const physics: SeedVertical = {
  subject: { slug: 'physics', name: 'Physics' },
  topic: {
    title: 'Forces and motion',
    description:
      'How forces act on objects, combine into a resultant, and change how things move.',
    orderIndex: 1,
    yearStageSlug: 'year-7',
  },
  concepts: [
    {
      slug: 'forces',
      title: 'Forces',
      orderIndex: 1,
      shortDescription: 'A force is a push or a pull that acts on an object.',
      detailedExplanation:
        'A force is a push or a pull. Forces can be contact forces, such as friction and air resistance, or act at a distance, such as gravity and magnetism. Forces are measured in newtons (N) using a force meter and have a direction as well as a size, so we draw them as arrows. Forces can change an object’s shape, speed or direction.',
      priorLearningSummary:
        'Pupils have everyday experience of pushing, pulling and lifting objects.',
      nextLearningSummary:
        'Pupils learn how several forces on one object combine into a resultant force.',
      commonMisconceptions: [
        'Thinking a moving object must always have a force pushing it along.',
        'Believing only living things can exert forces.',
        'Forgetting that forces have direction, not just size.',
      ],
      keyVocabulary: ['force', 'push', 'pull', 'newton', 'friction', 'gravity'],
      lessonGuidance:
        'Use force meters to measure real pushes and pulls, and introduce force arrows early so direction is built in from the start.',
      assessmentGuidance:
        'Check pupils can identify forces acting on an object and draw them as labelled arrows with units in newtons.',
      practicalLinks: [
        'Measure forces with a newton (force) meter for a range of objects.',
      ],
      difficultyLevel: 'foundational',
      abilitySuitability: ['support', 'core', 'challenge'],
      scienceSkillsLinks: ['Measuring with instruments', 'Using units'],
    },
    {
      slug: 'resultant-forces',
      title: 'Resultant forces',
      orderIndex: 2,
      shortDescription: 'The resultant force is the single force that has the same effect as all the forces combined.',
      detailedExplanation:
        'When more than one force acts on an object, we add them up — taking direction into account — to find the resultant force. Forces in the same direction add together; forces in opposite directions partly cancel. If the forces are balanced the resultant is zero; if they are unbalanced there is a non-zero resultant in one direction. The resultant force decides whether and how the object’s motion changes.',
      priorLearningSummary:
        'Pupils can identify individual forces and represent them as arrows.',
      nextLearningSummary:
        'Pupils learn how a resultant force changes an object’s motion.',
      commonMisconceptions: [
        'Adding force sizes while ignoring their directions.',
        'Thinking balanced forces mean no forces are acting.',
        'Believing the larger force "wins" and the others disappear.',
      ],
      keyVocabulary: ['resultant force', 'balanced forces', 'unbalanced forces', 'newton', 'direction'],
      lessonGuidance:
        'Use tug-of-war and free-body arrow diagrams to combine forces; insist pupils show direction when adding or subtracting.',
      assessmentGuidance:
        'Check pupils can calculate a resultant from two forces and state whether the forces are balanced or unbalanced.',
      practicalLinks: [
        'Investigate balanced and unbalanced forces using a trolley and pulleys.',
      ],
      difficultyLevel: 'developing',
      abilitySuitability: ['core', 'challenge'],
      scienceSkillsLinks: ['Vector reasoning', 'Drawing force diagrams'],
    },
    {
      slug: 'motion',
      title: 'Motion',
      orderIndex: 3,
      shortDescription: 'Motion describes how an object’s position changes, including its speed.',
      detailedExplanation:
        'An object is in motion when its position changes over time. Speed tells us how far something travels each second and is calculated as distance divided by time. A balanced (zero) resultant force keeps an object moving at a steady speed or keeps it still; an unbalanced force is needed to change the speed. Distance–time graphs are a useful way to show and compare motion.',
      priorLearningSummary:
        'Pupils understand resultant force and balanced/unbalanced forces.',
      nextLearningSummary:
        'Pupils learn how changing speed over time is described as acceleration.',
      commonMisconceptions: [
        'Confusing distance and speed.',
        'Thinking a steady speed needs a constant driving force.',
        'Believing a stationary object has no forces acting on it.',
      ],
      keyVocabulary: ['motion', 'speed', 'distance', 'time', 'distance–time graph'],
      lessonGuidance:
        'Time pupils moving at steady speeds and plot distance–time graphs, linking the steady speed to a zero resultant force.',
      assessmentGuidance:
        'Check pupils can calculate speed from distance and time and interpret a simple distance–time graph.',
      practicalLinks: [
        'Measure speed over a fixed distance using timing gates or stopwatches.',
      ],
      difficultyLevel: 'developing',
      abilitySuitability: ['core', 'challenge'],
      scienceSkillsLinks: ['Calculating from data', 'Drawing and reading graphs'],
    },
    {
      slug: 'acceleration',
      title: 'Acceleration',
      orderIndex: 4,
      shortDescription: 'Acceleration is how quickly an object’s speed changes.',
      detailedExplanation:
        'Acceleration is the rate at which speed changes: an object accelerates when it speeds up, decelerates when it slows down, and also when it changes direction. An unbalanced resultant force is what causes acceleration, and the bigger the resultant force (for a given mass) the greater the acceleration. On a distance–time graph a curving line shows changing speed, i.e. acceleration.',
      priorLearningSummary:
        'Pupils can describe motion and calculate speed from distance and time.',
      nextLearningSummary:
        'Pupils go on to relate force, mass and acceleration quantitatively in later study.',
      commonMisconceptions: [
        'Thinking acceleration and speed mean the same thing.',
        'Believing an object only accelerates when speeding up (slowing down is acceleration too).',
        'Assuming no resultant force is needed to change speed.',
      ],
      keyVocabulary: ['acceleration', 'deceleration', 'speed', 'resultant force', 'mass'],
      lessonGuidance:
        'Use a ramp and trolley to show how a larger resultant force gives a larger acceleration, connecting back to resultant forces.',
      assessmentGuidance:
        'Check pupils can distinguish speed from acceleration and link a non-zero resultant force to a change in speed.',
      practicalLinks: [
        'Investigate how the size of a force affects the acceleration of a trolley.',
      ],
      difficultyLevel: 'secure',
      abilitySuitability: ['challenge'],
      scienceSkillsLinks: ['Controlling variables', 'Interpreting graphs'],
    },
  ],
  relatedPairs: [
    ['forces', 'motion'],
    ['resultant-forces', 'acceleration'],
  ],
};

export const SEED_VERTICALS: SeedVertical[] = [biology, chemistry, physics];
