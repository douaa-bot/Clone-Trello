import { Sparkles, Code, Smartphone, Rocket } from 'lucide-react';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  defaultColumns: Array<{
    name: string;
    type: 'todo' | 'doing' | 'done';
  }>;
  defaultTasks?: Array<{
    title: string;
    description: string;
    column: 'todo' | 'doing' | 'done';
    priority: 'low' | 'medium' | 'high';
  }>;
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'web',
    name: 'Projet Web',
    description: 'Template pour développement web avec phases classiques',
    icon: <Code className="w-6 h-6" />,
    color: '#3b82f6',
    defaultColumns: [
      { name: 'À Faire', type: 'todo' },
      { name: 'En Développement', type: 'doing' },
      { name: 'En Test', type: 'doing' },
      { name: 'Terminé', type: 'done' },
    ],
    defaultTasks: [
      {
        title: 'Design de la maquette',
        description: 'Créer les maquettes UI/UX',
        column: 'todo',
        priority: 'high',
      },
      {
        title: 'Setup du projet',
        description: 'Initialiser le repository et la structure',
        column: 'todo',
        priority: 'high',
      },
    ],
  },
  {
    id: 'mobile',
    name: 'Application Mobile',
    description: 'Template pour développement mobile (iOS/Android)',
    icon: <Smartphone className="w-6 h-6" />,
    color: '#10b981',
    defaultColumns: [
      { name: 'Backlog', type: 'todo' },
      { name: 'En Développement', type: 'doing' },
      { name: 'Review', type: 'doing' },
      { name: 'Terminé', type: 'done' },
    ],
    defaultTasks: [
      {
        title: 'Configuration environnement',
        description: 'Setup React Native / Flutter',
        column: 'todo',
        priority: 'high',
      },
      {
        title: 'Design des écrans',
        description: 'Créer les écrans principaux',
        column: 'todo',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'agile',
    name: 'Sprint Agile',
    description: 'Template pour méthodologie Agile/Scrum',
    icon: <Rocket className="w-6 h-6" />,
    color: '#8b5cf6',
    defaultColumns: [
      { name: 'Product Backlog', type: 'todo' },
      { name: 'Sprint Backlog', type: 'todo' },
      { name: 'En Cours', type: 'doing' },
      { name: 'En Review', type: 'doing' },
      { name: 'Terminé', type: 'done' },
    ],
    defaultTasks: [
      {
        title: 'Planning Sprint',
        description: 'Organiser les tâches du sprint',
        column: 'todo',
        priority: 'high',
      },
      {
        title: 'Daily Standup',
        description: 'Réunion quotidienne de suivi',
        column: 'doing',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'custom',
    name: 'Personnalisé',
    description: 'Créer un projet vide avec colonnes personnalisées',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#6366f1',
    defaultColumns: [
      { name: 'À Faire', type: 'todo' },
      { name: 'En Cours', type: 'doing' },
      { name: 'Terminé', type: 'done' },
    ],
  },
];
