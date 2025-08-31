'use client';

import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { PhotoEditorDashboard } from '@/components/PhotoEditorDashboard';
import { ProjectSelector } from '@/components/ProjectSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Camera, Wand2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhotoEditorWrapperProps {
  workspace: any;
  currentProject: any;
  projects: any[];
  recentEdits: any[];
  userId: string;
}

export function PhotoEditorWrapper({ 
  workspace, 
  currentProject: initialProject, 
  projects, 
  recentEdits,
  userId 
}: PhotoEditorWrapperProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProject, setCurrentProject] = useState(initialProject);
  const remainingEdits = workspace.monthlyEditLimit - workspace.currentMonthEdits;

  const handleReset = () => {
    setSelectedFile(null);
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  if (selectedFile) {
    return (
      <PhotoEditorDashboard 
        imageFile={selectedFile} 
        onReset={handleReset}
        workspace={workspace}
        project={currentProject}
        userId={userId}
        recentEdits={recentEdits}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Project Selector */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Photo Editor</h1>
          <p className="text-muted-foreground">
            Transform your real estate photos with AI-powered editing
          </p>
        </div>
        <ProjectSelector
          projects={projects}
          currentProject={currentProject}
          workspaceId={workspace.id}
          onProjectChange={handleProjectChange}
        />
      </div>

      {/* Usage Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">
            {remainingEdits > 0 
              ? `You have ${remainingEdits} edits remaining this month`
              : 'You have reached your monthly edit limit'
            }
          </span>
          {' '}
          ({workspace.currentMonthEdits}/{workspace.monthlyEditLimit} used)
          {workspace.subscriptionTier === 'FREE' && (
            <span className="ml-2">
              • <a href="/dashboard/billing" className="underline">Upgrade</a> for more edits
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mx-auto">
              <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold">Virtual Staging</h3>
            <p className="text-sm text-muted-foreground">
              Add furniture and decor to empty rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto">
              <Wand2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold">Smart Enhancement</h3>
            <p className="text-sm text-muted-foreground">
              Improve lighting and remove clutter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 w-fit mx-auto">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold">Professional Quality</h3>
            <p className="text-sm text-muted-foreground">
              Photorealistic results with AI
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      {remainingEdits > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>
              Select a photo to start editing. Current project: {currentProject.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload onImageSelect={setSelectedFile} className="h-64" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Limit Reached</CardTitle>
            <CardDescription>
              You've used all your edits for this month. Your limit will reset at the beginning of next month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/billing">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Upgrade Your Plan
              </button>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Recent Edits */}
      {recentEdits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Edits</CardTitle>
            <CardDescription>
              Your latest photo edits across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentEdits.slice(0, 8).map((edit) => (
                <div key={edit.id} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={edit.editedUrl}
                    alt={edit.photo.filename}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">
                      {new Date(edit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}