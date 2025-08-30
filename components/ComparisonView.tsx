'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadImage } from '@/lib/image-utils';

interface ComparisonViewProps {
  originalImage: string;
  editedImage: string;
}

export function ComparisonView({ originalImage, editedImage }: ComparisonViewProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Before & After Comparison</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'slider' ? 'default' : 'outline'}
              onClick={() => setViewMode('slider')}
            >
              Slider
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
              onClick={() => setViewMode('side-by-side')}
            >
              Side by Side
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'slider' ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {/* Original Image (full width) */}
              <div className="absolute inset-0">
                <Image
                  src={originalImage}
                  alt="Original"
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Edited Image (clipped by slider) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <Image
                  src={editedImage}
                  alt="Edited"
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={[sliderPosition]}
                onValueChange={([value]) => setSliderPosition(value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Original</span>
                <span>{sliderPosition}%</span>
                <span>Edited</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Original</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={originalImage}
                  alt="Original"
                  fill
                  className="object-contain"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => downloadImage(originalImage, 'original.jpg')}
              >
                <Download className="w-3 h-3 mr-1" />
                Download Original
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Edited</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={editedImage}
                  alt="Edited"
                  fill
                  className="object-contain"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => downloadImage(editedImage, 'edited.jpg')}
              >
                <Download className="w-3 h-3 mr-1" />
                Download Edited
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}