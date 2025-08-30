'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download, RotateCcw } from 'lucide-react';
import { downloadImage } from '@/lib/image-utils';

interface EditHistoryProps {
  history: Array<{
    prompt: string;
    image: string;
    timestamp: Date;
  }>;
  onSelectHistory: (item: { prompt: string; image: string }) => void;
}

export function EditHistory({ history, onSelectHistory }: EditHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No edit history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {history.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <Image
              src={item.image}
              alt={`Edit ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleString()}
              </div>
              <p className="text-sm line-clamp-2">{item.prompt}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onSelectHistory(item)}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Restore
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => downloadImage(item.image, `history-${index + 1}.jpg`)}
              >
                <Download className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}