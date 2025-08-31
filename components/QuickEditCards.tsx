'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Sun, Sparkles, Trees, Wrench, Sofa } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickEditCardsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

const quickEditTemplates = [
  {
    id: 'scandinavian',
    icon: <Sofa className="h-6 w-6" />,
    title: 'Skandinavisk design',
    description: 'Lyse møbler og minimalistisk stil',
    prompt: 'Møbler rommet med skandinavisk design - lyse trefarger, minimalistisk stil, funksjonelle møbler, naturlige materialer. Ikke plasser møbler foran dører eller vinduer. Bruk hvite og beige farger med enkle, rene linjer',
    color: 'blue',
  },
  {
    id: 'nordic-light',
    icon: <Sun className="h-6 w-6" />,
    title: 'Lys og luftig',
    description: 'Naturlig nordisk belysning',
    prompt: 'Forbedre med naturlig, nordisk lys - lyst og luftig atmosfære, myke skygger, behagelig dagslys som fremhever rommets beste sider',
    color: 'yellow',
  },
  {
    id: 'minimalist',
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Minimalistisk',
    description: 'Ryddig og enkelt',
    prompt: 'Fjern unødvendige gjenstander, skap ren skandinavisk minimalisme med fokus på rom, lys og enkelhet',
    color: 'purple',
  },
  {
    id: 'cozy',
    icon: <Home className="h-6 w-6" />,
    title: 'Koselig interiør',
    description: 'Varm og innbydende',
    prompt: 'Skap et koselig interiør med myke tekstiler, ulltepper, puter og komfortable møbler. Legg til stearinlys og varme elementer for hygge-stemning',
    color: 'orange',
  },
  {
    id: 'exterior',
    icon: <Trees className="h-6 w-6" />,
    title: 'Oppfrisk fasade',
    description: 'Moderne eksteriør',
    prompt: 'Oppfrisk fasaden med rene linjer og moderne norsk stil, fjern skitt og slitasje, fremhev arkitektoniske detaljer',
    color: 'green',
  },
  {
    id: 'organize',
    icon: <Wrench className="h-6 w-6" />,
    title: 'Rydd og organiser',
    description: 'Profesjonell oppussing',
    prompt: 'Rydd alle overflater, fjern personlige eiendeler og rot, reparer synlige skader, mal i lyse moderne farger',
    color: 'slate',
  },
];

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900',
  yellow: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900',
  purple: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900',
  orange: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900',
  green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900',
  slate: 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900',
};

export function QuickEditCards({ onSelectPrompt, className }: QuickEditCardsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">Hurtigvalg for redigering</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickEditTemplates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer transition-all hover:scale-105 hover:shadow-md"
            onClick={() => onSelectPrompt(template.prompt)}
          >
            <CardContent className="p-4">
              <div className={cn(
                "rounded-lg p-3 mb-3 w-fit",
                colorClasses[template.color as keyof typeof colorClasses]
              )}>
                {template.icon}
              </div>
              <h4 className="font-semibold text-sm mb-1">{template.title}</h4>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}