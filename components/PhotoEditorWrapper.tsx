'use client';

import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { PhotoEditorDashboard } from '@/components/PhotoEditorDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info, Edit2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProject } from '@/actions/project-actions';
import { useRouter } from 'next/navigation';

interface PhotoEditorWrapperProps {
  workspace: any;
  project: any;
  projectPhotos?: any[];
  userId: string;
}

export function PhotoEditorWrapper({ 
  workspace, 
  project,
  projectPhotos = [],
  userId 
}: PhotoEditorWrapperProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const remainingEdits = workspace.monthlyEditLimit - workspace.currentMonthEdits;

  const handleReset = () => {
    setSelectedFile(null);
  };

  const handleSaveProjectName = async () => {
    if (projectName.trim() === project.name) {
      setIsEditingName(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await updateProject({
        id: project.id,
        name: projectName.trim(),
      });
      setIsEditingName(false);
      router.refresh();
    } catch (error) {
      console.error('Failed to update project name:', error);
      setProjectName(project.name);
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedFile) {
    return (
      <PhotoEditorDashboard 
        imageFile={selectedFile} 
        onReset={handleReset}
        workspace={workspace}
        project={project}
        userId={userId}
        recentEdits={[]}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Editable Project Name */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Rediger nytt bilde</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Eiendomsadresse:</label>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveProjectName();
                  if (e.key === 'Escape') {
                    setProjectName(project.name);
                    setIsEditingName(false);
                  }
                }}
                className="w-64"
                placeholder="f.eks. Storgata 15, Oslo"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSaveProjectName}
                disabled={isSaving}
              >
                {isSaving ? 'Lagrer...' : 'Lagre'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setProjectName(project.name);
                  setIsEditingName(false);
                }}
                disabled={isSaving}
              >
                Avbryt
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium">{project.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Usage Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">
            {remainingEdits > 0 
              ? `Du har ${remainingEdits} redigeringer igjen denne måneden`
              : 'Du har nådd din månedlige grense'
            }
          </span>
          {' '}
          ({workspace.currentMonthEdits}/{workspace.monthlyEditLimit} brukt)
          {workspace.subscriptionTier === 'FREE' && (
            <span className="ml-2">
              • <a href="/dashboard/billing" className="underline">Oppgrader</a> for flere redigeringer
            </span>
          )}
        </AlertDescription>
      </Alert>


      {/* Upload Area */}
      {remainingEdits > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Last opp bilde</CardTitle>
            <CardDescription>
              Last opp bilder for denne eiendommen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload onImageSelect={setSelectedFile} className="h-64" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Månedlig grense nådd</CardTitle>
            <CardDescription>
              Du har brukt alle dine redigeringer for denne måneden. Grensen tilbakestilles ved begynnelsen av neste måned.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/billing">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Oppgrader din plan
              </button>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Photos for this Property */}
      {projectPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bilder for denne eiendommen</CardTitle>
            <CardDescription>
              Alle bilder og redigeringer for {project.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {projectPhotos.map((photo) => (
                <div key={photo.id} className="space-y-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        Original
                      </p>
                    </div>
                  </div>
                  {photo.edits && photo.edits.length > 0 && (
                    <div className="text-xs text-muted-foreground text-center">
                      {photo.edits.length} redigering{photo.edits.length !== 1 ? 'er' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}