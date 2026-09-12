import { PetDefinition, PetId } from '../types';

export const COMPANIONS: PetDefinition[] = [
  {
    id: 'byte',
    name: 'Byte',
    tagline: 'The Cyber Pup',
    speciesTitle: 'The Cyber Pup',
    description:
      'Enjoys debugging code and eating bits of data. Perfect for beginner developers.',
    specializedCourses: ['Intro to Python', 'Data Structures', 'SQL Queries'],
    color: '#38bdf8',
    accentColor: '#0ea5e9',
    bgColor: '#f0f9ff',
    personality: 'Energetic, loyal, and always ready to fetch syntax solutions.',
  },
  {
    id: 'hedge',
    name: 'Hedge',
    tagline: 'The Prickly Coder',
    speciesTitle: 'The Prickly Coder',
    description:
      'Meticulous problem solver who loves clean algorithms and structured logic.',
    specializedCourses: ['Algorithm Design', 'TypeScript', 'System Architecture'],
    color: '#f59e0b',
    accentColor: '#d97706',
    bgColor: '#fffbeb',
    personality: 'Methodical, sharp, and resistant to hasty runtime errors.',
  },
  {
    id: 'kumo',
    name: 'Kumo',
    tagline: 'The Cloud Kitty',
    speciesTitle: 'The Cloud Kitty',
    description:
      'Light on its feet and curious about every server, cloud architecture, and microservice.',
    specializedCourses: ['Cloud Computing', 'Docker Basics', 'DevOps Foundations'],
    color: '#64748b',
    accentColor: '#475569',
    bgColor: '#f8fafc',
    personality: 'Calm, adaptable, and naturally scales across distributed clusters.',
  },
  {
    id: 'milo',
    name: 'Milo',
    tagline: 'The Logic Monkey',
    speciesTitle: 'The Logic Monkey',
    description:
      'Quick-witted and relentless when testing edge cases and automating repetitive tasks.',
    specializedCourses: ['Unit Testing', 'Automated Workflows', 'API Integrations'],
    color: '#d97706',
    accentColor: '#b45309',
    bgColor: '#fffbeb',
    personality: 'Playful, inventive, and agile at swinging through tricky code loops.',
  },
  {
    id: 'nimbus',
    name: 'Nimbus',
    tagline: 'The Wise Storm Owl',
    speciesTitle: 'The Wise Storm Owl',
    description:
      'Deep thinker with profound mastery of AI models, neural weights, and data pipelines.',
    specializedCourses: ['Machine Learning', 'Neural Networks', 'Deep Learning'],
    color: '#6366f1',
    accentColor: '#4f46e5',
    bgColor: '#eef2ff',
    personality: 'Scholarly, observant, and sees patterns across massive dimensional spaces.',
  },
  {
    id: 'pip',
    name: 'Pip',
    tagline: 'The Scripting Penguin',
    speciesTitle: 'The Scripting Penguin',
    description:
      'Enjoys writing swift automation scripts, shell pipelines, and clean terminal commands.',
    specializedCourses: ['Bash Scripting', 'Linux Essentials', 'Python Automation'],
    color: '#eab308',
    accentColor: '#ca8a04',
    bgColor: '#fefce8',
    personality: 'Witty, organized, and casts magical command-line incantations with ease.',
  },
  {
    id: 'rexi',
    name: 'Rexi',
    tagline: 'The Data Dino',
    speciesTitle: 'The Data Dino',
    description:
      'Loves crunching massive datasets, visualizing metrics, and uncovering hidden patterns.',
    specializedCourses: ['Data Science Essentials', 'Pandas & NumPy', 'Data Visualization'],
    color: '#22c55e',
    accentColor: '#16a34a',
    bgColor: '#f0fdf4',
    personality: 'Friendly, colossal curiosity, and stomps right through messy data cleaning.',
  },
  {
    id: 'uni',
    name: 'Uni',
    tagline: 'The Creative Unicorn',
    speciesTitle: 'The Creative Unicorn',
    description:
      'Master of design systems, CSS magic, user experience, and generative AI aesthetics.',
    specializedCourses: ['UI/UX Design', 'Modern CSS & Tailwind', 'Creative Coding'],
    color: '#ec4899',
    accentColor: '#db2777',
    bgColor: '#fdf2f8',
    personality: 'Inspiring, visionary, and turns blank viewports into vibrant works of art.',
  },
];

export const COMPANIONS_BY_ID: Record<PetId, PetDefinition> = COMPANIONS.reduce(
  (acc, comp) => {
    acc[comp.id] = comp;
    return acc;
  },
  {} as Record<PetId, PetDefinition>
);
