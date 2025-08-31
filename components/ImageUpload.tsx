'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateImageFile } from '@/lib/image-utils';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  className?: string;
}

export function ImageUpload({ onImageSelect, className }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          onImageSelect(file);
        } else {
          alert(validation.error);
        }
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all',
        'border-2 border-dashed hover:border-primary',
        isDragActive && 'border-primary bg-primary/5',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 text-primary" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive ? 'Slipp bildet ditt her' : 'Last opp eiendomsbilde'}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Dra og slipp eller klikk for å velge
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded">JPEG</span>
          <span className="px-2 py-1 bg-secondary rounded">PNG</span>
          <span className="px-2 py-1 bg-secondary rounded">WebP</span>
          <span className="px-2 py-1 bg-secondary rounded">Maks 10MB</span>
        </div>
      </div>
    </Card>
  );
}