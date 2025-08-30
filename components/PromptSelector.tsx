'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { realEstatePrompts, getPromptsByCategory } from '@/lib/prompts';
import { Home, Sun, Sparkles, Trees, Wrench } from 'lucide-react';

interface PromptSelectorProps {
  onSelectPrompt: (prompt: string) => void;
}

const categoryIcons = {
  staging: <Home className="w-4 h-4" />,
  lighting: <Sun className="w-4 h-4" />,
  declutter: <Sparkles className="w-4 h-4" />,
  exterior: <Trees className="w-4 h-4" />,
  repair: <Wrench className="w-4 h-4" />,
};

export function PromptSelector({ onSelectPrompt }: PromptSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('staging');

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Quick Edit Templates</h3>
      
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="staging" className="text-xs">
            {categoryIcons.staging}
            <span className="ml-1 hidden sm:inline">Stage</span>
          </TabsTrigger>
          <TabsTrigger value="lighting" className="text-xs">
            {categoryIcons.lighting}
            <span className="ml-1 hidden sm:inline">Light</span>
          </TabsTrigger>
          <TabsTrigger value="declutter" className="text-xs">
            {categoryIcons.declutter}
            <span className="ml-1 hidden sm:inline">Clean</span>
          </TabsTrigger>
          <TabsTrigger value="exterior" className="text-xs">
            {categoryIcons.exterior}
            <span className="ml-1 hidden sm:inline">Exterior</span>
          </TabsTrigger>
          <TabsTrigger value="repair" className="text-xs">
            {categoryIcons.repair}
            <span className="ml-1 hidden sm:inline">Repair</span>
          </TabsTrigger>
        </TabsList>

        {['staging', 'lighting', 'declutter', 'exterior', 'repair'].map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {getPromptsByCategory(category as any).map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto py-2 px-3"
                  onClick={() => onSelectPrompt(prompt.prompt)}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-xs">{prompt.label}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {prompt.prompt}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}