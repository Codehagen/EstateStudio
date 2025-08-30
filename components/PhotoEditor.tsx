'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Loader2, Sparkles, History } from 'lucide-react';
import { imageToBase64, downloadImage } from '@/lib/image-utils';
import { PromptSelector } from './PromptSelector';
import { EditHistory } from './EditHistory';
import { ComparisonView } from './ComparisonView';

interface PhotoEditorProps {
  imageFile: File;
  onReset: () => void;
}

export function PhotoEditor({ imageFile, onReset }: PhotoEditorProps) {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editHistory, setEditHistory] = useState<Array<{ prompt: string; image: string; timestamp: Date }>>([]);
  const [activeView, setActiveView] = useState<'edit' | 'compare' | 'history'>('edit');

  useEffect(() => {
    const loadImage = async () => {
      const base64 = await imageToBase64(imageFile);
      setOriginalImage(base64);
    };
    loadImage();
  }, [imageFile]);

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/edit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: originalImage,
          prompt: prompt.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success && data.editedImage) {
        setEditedImage(data.editedImage);
        setEditHistory(prev => [...prev, {
          prompt: prompt.trim(),
          image: data.editedImage,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error(data.error || 'Failed to edit image');
      }
    } catch (error) {
      console.error('Edit failed:', error);
      alert('Failed to edit photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleHistorySelect = (historyItem: { prompt: string; image: string }) => {
    setEditedImage(historyItem.image);
    setPrompt(historyItem.prompt);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Photo Editor</h2>
        <Button variant="outline" onClick={onReset}>
          Upload New Photo
        </Button>
      </div>

      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">
            <Sparkles className="w-4 h-4 mr-2" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="compare" disabled={!editedImage}>
            Compare
          </TabsTrigger>
          <TabsTrigger value="history" disabled={editHistory.length === 0}>
            <History className="w-4 h-4 mr-2" />
            History ({editHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Photo</CardTitle>
              </CardHeader>
              <CardContent>
                {originalImage && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={originalImage}
                      alt="Original"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Edited Photo</CardTitle>
              </CardHeader>
              <CardContent>
                {editedImage ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={editedImage}
                        alt="Edited"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      onClick={() => downloadImage(editedImage, `edited-${Date.now()}.jpg`)}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Edited Photo
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Edit preview will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PromptSelector onSelectPrompt={handlePromptSelect} />
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe how you want to edit the photo..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button
                  onClick={handleEdit}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply AI Edit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          {originalImage && editedImage && (
            <ComparisonView
              originalImage={originalImage}
              editedImage={editedImage}
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          <EditHistory
            history={editHistory}
            onSelectHistory={handleHistorySelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}