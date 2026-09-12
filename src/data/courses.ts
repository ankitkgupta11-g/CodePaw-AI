import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'ai-fundamentals',
    slug: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description:
      'A beginner-friendly introduction to core AI concepts, systems, and practical use cases.',
    level: 'Beginner',
    durationMinutes: 90,
    category: 'ai',
    isFreemium: true,
    accentColor: '#16a34a',
    tagColor: '#dcfce7',
    iconType: 'ai',
    chapters: [
      {
        id: 'aif-ch1',
        chapterNumber: 1,
        title: 'What is AI?',
        description:
          'Get oriented with the core ideas, history, and everyday impact of artificial intelligence.',
        durationMin: 10,
        isLocked: false,
        xpReward: 50,
        gemReward: 15,
        question:
          'Which of the following best describes modern Artificial Intelligence systems like Large Language Models?',
        codeSnippet: `// Example AI input & output\nconst prompt = "Explain recursion simply";\nconst response = await aiModel.generate(prompt);`,
        options: [
          {
            id: 'opt1',
            text: 'Magic consciousness that thinks exactly like a human soul.',
            isCorrect: false,
            explanation:
              'AI systems are mathematical statistical models, not sentient or conscious organisms.',
          },
          {
            id: 'opt2',
            text: 'Computational models trained on large data to recognize patterns and generate predictions.',
            isCorrect: true,
            explanation:
              'Exactly! Modern AI leverages neural networks and statistical patterns learned from vast datasets.',
          },
          {
            id: 'opt3',
            text: 'A hardcoded set of 1,000 if/else statements written manually by engineers.',
            isCorrect: false,
            explanation:
              'While early expert systems used rules, modern AI uses learned statistical representations.',
          },
          {
            id: 'opt4',
            text: 'A physical robot that only functions inside research laboratories.',
            isCorrect: false,
            explanation:
              'AI is software and algorithms deployed everywhere from phones to cloud servers.',
          },
        ],
        explanation:
          'Artificial Intelligence refers to computer systems engineered to perform tasks that traditionally required human intelligence—such as recognizing speech, identifying visual objects, translating languages, and generating coherent text.',
      },
      {
        id: 'aif-ch2',
        chapterNumber: 2,
        title: 'How AI Systems Learn',
        description:
          'Understand training data, patterns, feedback loops, and why models improve over time.',
        durationMin: 12,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
        question:
          'What role does "Training Data" play when teaching an AI model?',
        codeSnippet: `// Training loop concept\nloss = calculateDifference(prediction, actual);\nadjustModelWeights(loss);`,
        options: [
          {
            id: 'opt1',
            text: 'It serves as the reference examples from which the model extracts patterns and features.',
            isCorrect: true,
            explanation:
              'Correct! Models learn associations, grammar, logic, and factual correlations from the provided training corpora.',
          },
          {
            id: 'opt2',
            text: 'It is only used once to power down the server cooling fan.',
            isCorrect: false,
            explanation: 'Training data is the core input that shapes neural network weights.',
          },
          {
            id: 'opt3',
            text: 'It prevents the computer from using electricity during computations.',
            isCorrect: false,
            explanation: 'Training actually requires high compute and energy.',
          },
        ],
        explanation:
          'Machine learning models iteratively review millions or billions of examples, adjusting their internal mathematical parameters (weights) to minimize error against the target objective.',
      },
      {
        id: 'aif-ch3',
        chapterNumber: 3,
        title: 'Types of AI',
        description:
          'Compare narrow AI, generative AI, and emerging capabilities across real-world systems.',
        durationMin: 15,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
        question:
          'What distinguishes Generative AI from traditional discriminative classifiers (e.g. spam filters)?',
        options: [
          {
            id: 'opt1',
            text: 'Generative AI creates new synthetic content (text, images, code), whereas classifiers categorize existing data.',
            isCorrect: true,
            explanation:
              'Spot on! Classifiers output category labels (e.g. Spam / Not Spam), while generative models synthesize novel output sequences.',
          },
          {
            id: 'opt2',
            text: 'Generative AI can never run on computers, only on mechanical typewriters.',
            isCorrect: false,
            explanation: 'Generative AI is purely digital software.',
          },
          {
            id: 'opt3',
            text: 'There is no difference; they are identical algorithms with different names.',
            isCorrect: false,
            explanation: 'Their architectures and loss objectives are fundamentally different.',
          },
        ],
        explanation:
          'Generative models (such as GPT-4, Gemini, Claude, and Stable Diffusion) model the probability distribution of tokens or pixels to produce original compositions.',
      },
      {
        id: 'aif-ch4',
        chapterNumber: 4,
        title: 'AI Tools in Daily Work',
        description:
          'See how AI supports writing, research, planning, automation, and decision support.',
        durationMin: 10,
        isLocked: true,
        xpReward: 70,
        gemReward: 25,
      },
      {
        id: 'aif-ch5',
        chapterNumber: 5,
        title: 'Data, Models, and Outputs',
        description:
          'Connect the relationship between data quality, model behavior, and output reliability.',
        durationMin: 12,
        isLocked: true,
        xpReward: 70,
        gemReward: 25,
      },
      {
        id: 'aif-ch6',
        chapterNumber: 6,
        title: 'Risks and Limitations',
        description:
          'Learn where hallucinations, bias, privacy concerns, and weak reasoning can appear.',
        durationMin: 10,
        isLocked: true,
        xpReward: 80,
        gemReward: 30,
      },
      {
        id: 'aif-ch7',
        chapterNumber: 7,
        title: 'Responsible AI Basics',
        description:
          'Review practical guardrails for safe, transparent, and ethical AI-assisted work.',
        durationMin: 10,
        isLocked: true,
        xpReward: 80,
        gemReward: 30,
      },
      {
        id: 'aif-ch8',
        chapterNumber: 8,
        title: 'Your First AI Workflow',
        description:
          'Combine the fundamentals into a simple repeatable workflow you can use immediately.',
        durationMin: 15,
        isLocked: true,
        xpReward: 100,
        gemReward: 40,
      },
    ],
  },
  {
    id: 'prompt-engineering',
    slug: 'prompt-engineering',
    title: 'Prompt Engineering',
    description:
      'Learn how to craft effective prompts, iterate on outputs, and get reliable results from LLMs.',
    level: 'Beginner',
    durationMinutes: 75,
    category: 'prompt',
    isFreemium: true,
    accentColor: '#3b82f6',
    tagColor: '#dbeafe',
    iconType: 'prompt',
    chapters: [
      {
        id: 'pe-ch1',
        chapterNumber: 1,
        title: 'Crafting Core Directives',
        description:
          'Learn how clear instructions, constraints, and context eliminate vague or noisy responses.',
        durationMin: 10,
        isLocked: false,
        xpReward: 50,
        gemReward: 15,
        question:
          'Which prompt structure is most likely to yield an accurate, actionable summary from an LLM?',
        options: [
          {
            id: 'opt1',
            text: '"Summarize stuff fast."',
            isCorrect: false,
            explanation: 'Too ambiguous; lacks length, target audience, format, or tone constraints.',
          },
          {
            id: 'opt2',
            text: '"You are a technical editor. Summarize the following meeting notes into 3 bullet points, highlighting action items and assignees."',
            isCorrect: true,
            explanation:
              'Excellent! It defines role, task, format (3 bullet points), and specific focus areas (actions & assignees).',
          },
          {
            id: 'opt3',
            text: '"Tell me everything you know about meetings since the dawn of humanity."',
            isCorrect: false,
            explanation: 'Lacks scoping and will produce an overwhelming, unfocused dump.',
          },
        ],
        explanation:
          'Prompt clarity relies on four pillars: Role Definition, Specific Objective, Contextual Constraints, and Desired Output Schema.',
      },
      {
        id: 'pe-ch2',
        chapterNumber: 2,
        title: 'Few-Shot Learning & In-Context Examples',
        description:
          'Provide high-quality input-output pairs to guide format, tone, and deterministic behavior.',
        durationMin: 12,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
      },
      {
        id: 'pe-ch3',
        chapterNumber: 3,
        title: 'Chain-of-Thought Reasoning',
        description:
          'Instruct models to "think step by step" to dramatically boost multi-step logic and math accuracy.',
        durationMin: 15,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
      },
      {
        id: 'pe-ch4',
        chapterNumber: 4,
        title: 'Structured Outputs & JSON Mode',
        description:
          'Enforce strict JSON schemas so AI responses seamlessly plug into production APIs and databases.',
        durationMin: 15,
        isLocked: true,
        xpReward: 70,
        gemReward: 25,
      },
      {
        id: 'pe-ch5',
        chapterNumber: 5,
        title: 'Mitigating Hallucinations',
        description:
          'Ground prompts with source documentation and enforce strict "If unknown, reply with Not Found" rules.',
        durationMin: 15,
        isLocked: true,
        xpReward: 80,
        gemReward: 30,
      },
    ],
  },
  {
    id: 'machine-learning-basics',
    slug: 'machine-learning-basics',
    title: 'Machine Learning Basics',
    description:
      'Understand supervised learning, model evaluation, and the building blocks of modern ML.',
    level: 'Intermediate',
    durationMinutes: 110,
    category: 'ml',
    isFreemium: false,
    accentColor: '#eab308',
    tagColor: '#fef9c3',
    iconType: 'ml',
    chapters: [
      {
        id: 'ml-ch1',
        chapterNumber: 1,
        title: 'Supervised vs. Unsupervised Learning',
        description:
          'Understand labeled ground truth datasets versus clustering and exploratory pattern discovery.',
        durationMin: 15,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
        question:
          'In Supervised Learning, what must be present alongside the input training features?',
        options: [
          {
            id: 'opt1',
            text: 'Ground-truth target labels (e.g. house price or image category).',
            isCorrect: true,
            explanation:
              'Correct! Supervised learning pairs inputs (X) with desired outputs (y) so the model learns the mapping function.',
          },
          {
            id: 'opt2',
            text: 'A mechanical hard drive with at least 50 RPM.',
            isCorrect: false,
            explanation: 'Hardware specifications are independent of algorithmic paradigm.',
          },
          {
            id: 'opt3',
            text: 'No labels or answers whatsoever.',
            isCorrect: false,
            explanation: 'Learning without labels is Unsupervised Learning.',
          },
        ],
        explanation:
          'Supervised learning trains models on labeled pairs (X, y) to minimize empirical risk, enabling accurate predictions on unseen data.',
      },
      {
        id: 'ml-ch2',
        chapterNumber: 2,
        title: 'Features, Weights, and Biases',
        description:
          'See how mathematical dot products and activation functions produce neural outputs.',
        durationMin: 18,
        isLocked: false,
        xpReward: 70,
        gemReward: 25,
      },
      {
        id: 'ml-ch3',
        chapterNumber: 3,
        title: 'Train, Validation, and Test Splits',
        description:
          'Protect against data leakage and verify generalization on completely untouched validation holdouts.',
        durationMin: 15,
        isLocked: true,
        xpReward: 70,
        gemReward: 25,
      },
      {
        id: 'ml-ch4',
        chapterNumber: 4,
        title: 'Overfitting and Regularization',
        description:
          'Use dropout, weight decay (L1/L2), and early stopping to prevent memorization of noise.',
        durationMin: 20,
        isLocked: true,
        xpReward: 80,
        gemReward: 30,
      },
    ],
  },
  {
    id: 'data-science-essentials',
    slug: 'data-science-essentials',
    title: 'Data Science Essentials',
    description:
      'Explore data preparation, analysis, and storytelling with modern data science workflows.',
    level: 'Advanced',
    durationMinutes: 120,
    category: 'datascience',
    isFreemium: false,
    accentColor: '#f97316',
    tagColor: '#ffedd5',
    iconType: 'data',
    chapters: [
      {
        id: 'ds-ch1',
        chapterNumber: 1,
        title: 'Data Ingestion & Cleaning',
        description:
          'Handle missing values, deduplicate records, parse datetime types, and clean real-world dirty data.',
        durationMin: 18,
        isLocked: false,
        xpReward: 70,
        gemReward: 25,
        question:
          'Why is data cleaning typically considered 80% of the work in real-world data science?',
        options: [
          {
            id: 'opt1',
            text: 'Because real data is messy, incomplete, inconsistently formatted, and prone to collection bias.',
            isCorrect: true,
            explanation:
              'Correct! "Garbage in, garbage out"—high-quality modeling is impossible without pristine, normalized data.',
          },
          {
            id: 'opt2',
            text: 'Because computers refuse to turn on if a single CSV row has a comma.',
            isCorrect: false,
            explanation: 'Modern parsers handle basic syntax, but domain accuracy requires cleaning.',
          },
          {
            id: 'opt3',
            text: 'Because models prefer dirty data to learn creativity.',
            isCorrect: false,
            explanation: 'Dirty data degrades accuracy and causes spurious correlations.',
          },
        ],
        explanation:
          'Data cleaning involves outlier detection, imputation strategies, schema validation, and categorical encoding to prepare raw telemetry for modeling.',
      },
      {
        id: 'ds-ch2',
        chapterNumber: 2,
        title: 'Exploratory Data Analysis (EDA)',
        description:
          'Calculate descriptive statistics, correlation matrices, and distributions to uncover patterns.',
        durationMin: 20,
        isLocked: false,
        xpReward: 80,
        gemReward: 30,
      },
      {
        id: 'ds-ch3',
        chapterNumber: 3,
        title: 'Visual Storytelling & Dashboards',
        description:
          'Translate complex tabular findings into intuitive charts and executive summaries.',
        durationMin: 22,
        isLocked: true,
        xpReward: 80,
        gemReward: 30,
      },
    ],
  },
  {
    id: 'python-programming',
    slug: 'python-programming',
    title: 'Python Programming',
    description: 'Learn clean, expressive Python from basic variables to functions, data structures, and virtual pet scripting.',
    level: 'Beginner',
    durationMinutes: 95,
    category: 'python',
    isFreemium: true,
    accentColor: '#38bdf8',
    tagColor: '#e0f2fe',
    iconType: 'python',
    chapters: [
      {
        id: 'py-ch1',
        chapterNumber: 1,
        title: 'Python Variables & Types',
        description: 'Understand how Python handles integers, floats, strings, and f-strings without boilerplate.',
        durationMin: 12,
        isLocked: false,
        xpReward: 50,
        gemReward: 15,
        language: 'python',
        explanation: 'Python uses dynamic typing and intuitive syntax. Variable declaration is as simple as assigning a name to a value. Strings can be interpolated seamlessly using f-strings (formatted string literals).',
        codeSnippet: `# CodePaw Companion Introduction
pet_name = "Byte"
species = "Cyber Pup"
energy_level = 95
happiness = 100

greeting = f"🐾 Meet {pet_name}, a loyal {species}! Energy: {energy_level}%"
print(greeting)
print("Type of energy:", type(energy_level))`,
        question: 'How do you insert variable values cleanly inside a Python string?',
        options: [
          {
            id: 'opt1',
            text: 'Using an f-string: f"Hello {pet_name}"',
            isCorrect: true,
            explanation: 'Correct! Prefixing the string with f allows expressions inside curly braces {} to be evaluated directly.'
          },
          {
            id: 'opt2',
            text: 'Using square brackets: "Hello [pet_name]"',
            isCorrect: false,
            explanation: 'Square brackets are for lists and indexing, not string formatting.'
          },
          {
            id: 'opt3',
            text: 'You cannot use variables inside strings in Python.',
            isCorrect: false,
            explanation: 'Python supports f-strings, format(), and concatenation.'
          }
        ]
      },
      {
        id: 'py-ch2',
        chapterNumber: 2,
        title: 'Loops & Conditionals',
        description: 'Master if/elif/else decisions and for/while loops with strict indentation.',
        durationMin: 15,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
        language: 'python',
        explanation: 'In Python, whitespace and indentation define blocks of code. Use "for item in collection" to iterate cleanly over ranges or lists.',
        codeSnippet: `# Training your pet with loops
treats_given = 0
for day in range(1, 6):
    treats_given += 2
    if treats_given >= 8:
        print(f"Day {day}: Pet is fully energized! Treats: {treats_given}")
    else:
        print(f"Day {day}: Snack time! Treats: {treats_given}")

print("Training session finished!")`,
        question: 'What defines a block of code (like a loop body) in Python?',
        options: [
          {
            id: 'opt1',
            text: 'Consistent indentation (usually 4 spaces) after a colon (:)',
            isCorrect: true,
            explanation: 'Spot on! Python uses indentation rather than curly braces to delineate code blocks.'
          },
          {
            id: 'opt2',
            text: 'Enclosing the code in curly braces { }',
            isCorrect: false,
            explanation: 'Curly braces define dictionaries and sets in Python, not code blocks.'
          }
        ]
      },
      {
        id: 'py-ch3',
        chapterNumber: 3,
        title: 'Functions & Return Values',
        description: 'Encapsulate reusable logic with def, default arguments, and return statements.',
        durationMin: 15,
        isLocked: false,
        xpReward: 70,
        gemReward: 25,
        language: 'python',
        explanation: 'Define functions using the "def" keyword. Functions can accept positional and keyword arguments and return any Python object.',
        codeSnippet: `def feed_pet(pet_name, snack_type="Berry", quantity=1):
    xp_gained = quantity * 15
    return f"✨ Fed {quantity}x {snack_type} to {pet_name}! Gained {xp_gained} XP."

print(feed_pet("Byte"))
print(feed_pet("Byte", snack_type="Cyber Burger", quantity=3))`,
        question: 'What keyword defines a function in Python?',
        options: [
          {
            id: 'opt1',
            text: 'def',
            isCorrect: true,
            explanation: 'Correct! "def function_name(params):" defines a new function in Python.'
          },
          {
            id: 'opt2',
            text: 'function',
            isCorrect: false,
            explanation: '"function" is used in JavaScript, not Python.'
          }
        ]
      },
      {
        id: 'py-ch4',
        chapterNumber: 4,
        title: 'Lists, Dictionaries & Comprehensions',
        description: 'Manipulate ordered lists, key-value mappings, and fast list comprehensions.',
        durationMin: 18,
        isLocked: true,
        xpReward: 80,
        gemReward: 30,
        language: 'python',
      }
    ]
  },
  {
    id: 'html-foundations',
    slug: 'html-foundations',
    title: 'HTML Foundations',
    description: 'Master modern semantic HTML5, structural tags, forms, accessibility, and clean web layout.',
    level: 'Beginner',
    durationMinutes: 70,
    category: 'web',
    isFreemium: true,
    accentColor: '#f97316',
    tagColor: '#ffedd5',
    iconType: 'code',
    chapters: [
      {
        id: 'html-ch1',
        chapterNumber: 1,
        title: 'Semantic HTML5 Structure',
        description: 'Understand the document tree, doctype, header, main, section, and article elements.',
        durationMin: 10,
        isLocked: false,
        xpReward: 50,
        gemReward: 15,
        language: 'html',
        explanation: 'Semantic HTML conveys meaning to browsers, search engines, and screen readers. Tags like <header>, <main>, <nav>, and <article> are much more descriptive than generic <div>s.',
        codeSnippet: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>CodePaw Sanctuary</title>
  </head>
  <body>
    <header>
      <h1>🐾 CodePaw AI Sanctuary</h1>
    </header>
    <main>
      <article>
        <h2>Cyber Pup: Byte</h2>
        <p>Level 3 • Happy & Ready to learn!</p>
      </article>
    </main>
  </body>
</html>`,
        question: 'Why should you prefer semantic elements like <article> or <header> over generic <div> tags?',
        options: [
          {
            id: 'opt1',
            text: 'They provide accessible meaning for screen readers, SEO, and developer readability.',
            isCorrect: true,
            explanation: 'Exactly! Semantic elements give meaningful structure to content.'
          },
          {
            id: 'opt2',
            text: 'Because browsers will refuse to render regular <div> tags.',
            isCorrect: false,
            explanation: 'Browsers render divs fine, but they lack semantic clarity.'
          }
        ]
      },
      {
        id: 'html-ch2',
        chapterNumber: 2,
        title: 'Forms, Inputs & Validation',
        description: 'Build user inputs with labels, validation attributes, and accessible controls.',
        durationMin: 14,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
        language: 'html',
        explanation: 'Always connect <label for="inputId"> with <input id="inputId"> for accessibility. HTML5 also offers native validation attributes like required, min, max, and pattern.',
        codeSnippet: `<form action="/adopt" method="POST">
  <label for="petName">Pet Name:</label>
  <input type="text" id="petName" name="petName" required placeholder="e.g. Byte" />

  <label for="petSpecies">Species:</label>
  <select id="petSpecies" name="petSpecies">
    <option value="cyber-pup">Cyber Pup</option>
    <option value="quantum-cat">Quantum Cat</option>
  </select>

  <button type="submit">Adopt Pet 🐾</button>
</form>`,
        question: 'How do you associate a <label> with its corresponding form <input>?',
        options: [
          {
            id: 'opt1',
            text: 'By setting the label "for" attribute to match the input "id"',
            isCorrect: true,
            explanation: 'Correct! This binds the label to the control for assistive technologies.'
          },
          {
            id: 'opt2',
            text: 'By placing them in completely different files.',
            isCorrect: false,
            explanation: 'They must be linked by matching "for" and "id" attributes.'
          }
        ]
      }
    ]
  },
  {
    id: 'css-styling',
    slug: 'css-styling',
    title: 'CSS Styling & Animations',
    description: 'Learn modern CSS layouts, Flexbox, Grid, transitions, variables, and responsive design.',
    level: 'Beginner',
    durationMinutes: 85,
    category: 'web',
    isFreemium: true,
    accentColor: '#a855f7',
    tagColor: '#f3e8ff',
    iconType: 'code',
    chapters: [
      {
        id: 'css-ch1',
        chapterNumber: 1,
        title: 'Flexbox Layout Fundamentals',
        description: 'Align items, distribute space, and manage directions effortlessly with display: flex.',
        durationMin: 12,
        isLocked: false,
        xpReward: 50,
        gemReward: 15,
        language: 'css',
        explanation: 'Flexbox provides one-dimensional layout control. Use justify-content along the main axis and align-items along the cross axis.',
        codeSnippet: `/* CodePaw Companion Badge Flexbox */
.pet-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.pet-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
}`,
        question: 'Which CSS property aligns children along the main axis in a flex container?',
        options: [
          {
            id: 'opt1',
            text: 'justify-content',
            isCorrect: true,
            explanation: 'Spot on! justify-content manages spacing along the main axis.'
          },
          {
            id: 'opt2',
            text: 'align-items',
            isCorrect: false,
            explanation: 'align-items controls alignment across the cross axis.'
          }
        ]
      },
      {
        id: 'css-ch2',
        chapterNumber: 2,
        title: 'CSS Keyframe Animations',
        description: 'Bring pet avatars to life with smooth bounce, glow, and float keyframe animations.',
        durationMin: 15,
        isLocked: false,
        xpReward: 60,
        gemReward: 20,
        language: 'css',
        explanation: 'Use @keyframes to define states at 0%, 50%, and 100%, then attach it with the animation property.',
        codeSnippet: `@keyframes petFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.floating-pet {
  display: inline-block;
  animation: petFloat 2s ease-in-out infinite;
}`,
        question: 'What at-rule is used to define custom animation stages in CSS?',
        options: [
          {
            id: 'opt1',
            text: '@keyframes',
            isCorrect: true,
            explanation: 'Correct! @keyframes defines the intermediate animation milestones.'
          },
          {
            id: 'opt2',
            text: '@animate',
            isCorrect: false,
            explanation: 'There is no @animate rule in standard CSS.'
          }
        ]
      }
    ]
  },
  {
    id: 'javascript-essentials',
    slug: 'javascript-essentials',
    title: 'JavaScript Essentials',
    description: 'Master modern ES6+ JavaScript: const/let, arrow functions, promises, and array transformations.',
    level: 'Beginner',
    durationMinutes: 90,
    category: 'web',
    isFreemium: true,
    accentColor: '#eab308',
    tagColor: '#fef9c3',
    iconType: 'code',
    chapters: [
      {
        id: 'js-ch1',
        chapterNumber: 1,
        title: 'Variables, Types & Arrow Functions',
        description: 'Understand const, let, block scoping, and concise arrow function expressions.',
        durationMin: 12,
        isLocked: false,
        xpReward: 50,
        gemReward: 15,
        language: 'javascript',
        explanation: 'Prefer const for variables that will not be reassigned, and let when mutation is necessary. Arrow functions provide concise syntax and lexical this binding.',
        codeSnippet: `// Modern JavaScript Companion Logic
const petName = "Byte";
let energy = 80;

const feedPet = (snack, amount = 10) => {
  energy = Math.min(100, energy + amount);
  return \`Fed \${snack}! \${petName}'s energy is now \${energy}%\`;
};

console.log(feedPet("Cyber Berry", 15));`,
        question: 'When should you choose "const" over "let" in modern JavaScript?',
        options: [
          {
            id: 'opt1',
            text: 'Whenever the variable identifier will not be reassigned.',
            isCorrect: true,
            explanation: 'Correct! Using const prevents accidental reassignment and signals intent.'
          },
          {
            id: 'opt2',
            text: 'Only for numbers, never for strings or objects.',
            isCorrect: false,
            explanation: 'const applies to all JavaScript data types.'
          }
        ]
      },
      {
        id: 'js-ch2',
        chapterNumber: 2,
        title: 'Array Pipelines: map, filter, reduce',
        description: 'Transform, filter, and aggregate datasets declaratively without imperative for-loops.',
        durationMin: 16,
        isLocked: false,
        xpReward: 65,
        gemReward: 20,
        language: 'javascript',
        explanation: 'Functional array methods produce clean pipelines without mutating original arrays.',
        codeSnippet: `const questScores = [75, 92, 40, 88, 95, 60];

// Pipeline: keep passing scores (>=70) and award 5 bonus XP
const passingAwarded = questScores
  .filter(score => score >= 70)
  .map(score => score + 5);

console.log("Original Scores:", questScores);
console.log("Awarded Passing Scores:", passingAwarded);`,
        question: 'Which array method filters elements based on a predicate function returning true or false?',
        options: [
          {
            id: 'opt1',
            text: 'Array.prototype.filter()',
            isCorrect: true,
            explanation: 'Spot on! filter() creates a new array with all elements that pass the test.'
          },
          {
            id: 'opt2',
            text: 'Array.prototype.map()',
            isCorrect: false,
            explanation: 'map() transforms every element into a new representation.'
          }
        ]
      }
    ]
  },
];
