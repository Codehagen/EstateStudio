'use client';

import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { PhotoEditor } from '@/components/PhotoEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Camera, Wand2 } from 'lucide-react';

export default function PhotoEditorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleReset = () => {
    setSelectedFile(null);
  };

  if (selectedFile) {
    return <PhotoEditor imageFile={selectedFile} onReset={handleReset} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">AI Real Estate Photo Editor</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your real estate photos with AI-powered editing using Google's Gemini 2.0 Flash (Nano Banana)
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mx-auto">
              <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold">Virtual Staging</h3>
            <p className="text-sm text-muted-foreground">
              Add furniture and decor to empty rooms with AI-generated staging
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
              Improve lighting, remove clutter, and enhance curb appeal
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
              Maintain photorealistic quality with Gemini's advanced AI
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <ImageUpload onImageSelect={setSelectedFile} className="h-96" />

      {/* Info */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm flex items-center justify-center">
                1
              </span>
              Upload Your Photo
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Select a real estate photo from your device (JPEG, PNG, or WebP up to 10MB)
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm flex items-center justify-center">
                2
              </span>
              Choose Your Edit
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Select from templates or write custom instructions for AI editing
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-medium flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 text-sm flex items-center justify-center">
                3
              </span>
              Download Results
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Get your professionally edited photo in seconds, ready for listings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}