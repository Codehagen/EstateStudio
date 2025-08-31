'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Loader2, Sparkles, History, ArrowLeft } from 'lucide-react';
import { imageToBase64, downloadImage } from '@/lib/image-utils';
import { PromptSelector } from './PromptSelector';
import { EditHistoryDB } from './EditHistoryDB';
import { ComparisonView } from './ComparisonView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface PhotoEditorDashboardProps {
  imageFile: File;
  onReset: () => void;
  workspace: any;
  project: any;
  userId: string;
  recentEdits: any[];
}

export function PhotoEditorDashboard({ 
  imageFile, 
  onReset, 
  workspace, 
  project,
  userId,
  recentEdits: initialEdits
}: PhotoEditorDashboardProps) {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentEdits, setRecentEdits] = useState(initialEdits);
  const [activeView, setActiveView] = useState<'edit' | 'compare' | 'history'>('edit');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const remainingEdits = workspace.monthlyEditLimit - workspace.currentMonthEdits;

  useEffect(() => {
    const loadImage = async () => {
      const base64 = await imageToBase64(imageFile);
      setOriginalImage(base64);
    };
    loadImage();
  }, [imageFile]);

  const handleEdit = async () => {
    if (!prompt.trim()) return;
    
    if (remainingEdits <= 0) {
      setError('You have reached your monthly edit limit. Please upgrade your plan to continue.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/edit-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: originalImage,
          prompt: prompt.trim(),
          projectId: project.id,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.editedImage) {
        setEditedImage(data.editedImage);
        // Refresh the page to update the edit count and history
        router.refresh();
      } else {
        throw new Error(data.error || 'Failed to edit image');
      }
    } catch (error) {
      console.error('Edit failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to edit photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleHistorySelect = (historyItem: any) => {
    setEditedImage(historyItem.editedUrl);
    setPrompt(historyItem.prompt);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onReset} size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Editing Photo</h2>
            <p className="text-sm text-muted-foreground">
              Project: {project.name} • {remainingEdits} edits remaining
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onReset}>
          Upload New Photo
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit">
            <Sparkles className="w-4 h-4 mr-2" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="compare" disabled={!editedImage}>
            Compare
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
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
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Cost per edit: ${0.039}
                  </p>
                  <Button
                    onClick={handleEdit}
                    disabled={isLoading || !prompt.trim() || remainingEdits <= 0}
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
          <EditHistoryDB
            workspaceId={workspace.id}
            projectId={project.id}
            onSelectHistory={handleHistorySelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}