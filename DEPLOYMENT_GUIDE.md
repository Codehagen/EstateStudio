# AI Real Estate Photo Editor - Complete Setup Guide

This guide provides everything needed to deploy the AI Real Estate Photo Editor using Fal.ai's Nano Banana model.

## 🚀 Quick Overview

- **Framework**: Next.js 15.5.2 with TypeScript
- **AI Provider**: Fal.ai (Nano Banana model)
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Cost**: $0.039 per image edit
- **Features**: Virtual staging, lighting enhancement, decluttering, exterior improvements

## 📋 Prerequisites

- Node.js 18+ or Bun
- Package manager (npm, yarn, or pnpm)
- Fal.ai API key ([Get one here](https://fal.ai/dashboard/keys))

## 🛠 Step 1: Project Setup

### Create New Next.js Project
```bash
npx create-next-app@latest real-estate-photo-editor --typescript --tailwind --eslint
cd real-estate-photo-editor
```

### Install Dependencies
```bash
# Using npm
npm install ai @ai-sdk/fal react-dropzone zustand sonner
npm install @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-toast
npm install class-variance-authority clsx lucide-react tailwind-merge

# Using pnpm (recommended)
pnpm add ai @ai-sdk/fal react-dropzone zustand sonner
pnpm add @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-slider @radix-ui/react-toast
pnpm add class-variance-authority clsx lucide-react tailwind-merge
```

## 🔧 Step 2: Configuration Files

### Environment Variables (.env.local)
```env
# Fal.ai Configuration for Nano Banana Image Editing
# Get your API key from: https://fal.ai/dashboard/keys
FAL_API_KEY=your_fal_api_key_here

# Optional: Rate limiting
RATE_LIMIT_PER_MINUTE=10

# Optional: Image size limits (in MB)
MAX_IMAGE_SIZE=10

# Optional: Number of output images (1-4)
NUM_OUTPUT_IMAGES=1

# Optional: Output format (jpeg or png)
OUTPUT_FORMAT=jpeg
```

### Update package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Components Configuration (components.json)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## 📁 Step 3: File Structure

Create the following directory structure:
```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── api/
│   └── edit-photo/
│       └── route.ts
└── photo-editor/
    ├── layout.tsx
    └── page.tsx
components/
├── ImageUpload.tsx
├── PhotoEditor.tsx
├── PromptSelector.tsx
├── EditHistory.tsx
├── ComparisonView.tsx
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── tabs.tsx
    ├── input.tsx
    └── textarea.tsx
lib/
├── utils.ts
├── fal-client.ts
├── image-utils.ts
├── prompts.ts
└── constants.ts
```

## 📄 Step 4: Core Files

### lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### lib/constants.ts
```typescript
export const APP_NAME = 'AI Real Estate Photo Editor';
export const APP_DESCRIPTION = 'Transform real estate photos with AI-powered editing using Nano Banana';

export const ROUTES = {
  HOME: '/',
  EDITOR: '/photo-editor',
  API_EDIT: '/api/edit-photo',
} as const;

export const IMAGE_CONFIG = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  DEFAULT_QUALITY: 0.9,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
} as const;

export const EDIT_CONFIG = {
  MAX_HISTORY: 10,
  RATE_LIMIT_PER_MINUTE: 10,
  MODEL: 'fal-ai/nano-banana/edit',
  MAX_OUTPUT_IMAGES: 4,
  DEFAULT_OUTPUT_IMAGES: 1,
  COST_PER_IMAGE: 0.039,
} as const;

export const FAL_CONFIG = {
  MODEL_NAME: 'fal-ai/nano-banana/edit',
  BASE_URL: 'https://fal.run',
  DEFAULT_OUTPUT_FORMAT: 'jpeg',
  SUPPORTED_FORMATS: ['jpeg', 'png'] as const,
  MAX_INPUT_IMAGES: 10,
} as const;

export const UI_MESSAGES = {
  UPLOAD: {
    TITLE: 'Upload Your Photo',
    DESCRIPTION: 'Drag and drop or click to select a real estate photo',
    BUTTON: 'Select Photo',
  },
  EDITING: {
    PROCESSING: 'Processing your photo with Nano Banana AI...',
    SUCCESS: 'Photo edited successfully!',
    ERROR: 'Failed to edit photo. Please try again.',
  },
  VALIDATION: {
    FILE_TOO_LARGE: `File is too large. Maximum size is ${IMAGE_CONFIG.MAX_SIZE_MB}MB`,
    INVALID_FORMAT: 'Invalid file format. Please use JPEG, PNG, or WebP',
    NO_API_KEY: 'Fal.ai API key not configured. Please check settings.',
  },
} as const;
```

### lib/fal-client.ts
```typescript
import { fal } from '@ai-sdk/fal';
import { FAL_CONFIG } from './constants';

// Initialize Fal.ai client with API key from environment
export function getFalModel() {
  const apiKey = process.env.FAL_API_KEY;
  
  if (!apiKey) {
    throw new Error('FAL_API_KEY is not set in environment variables');
  }

  return fal.image(FAL_CONFIG.MODEL_NAME, {
    apiKey,
  });
}

// Helper to validate API key
export function validateApiKey(): boolean {
  return !!process.env.FAL_API_KEY;
}

// Helper function to validate base64 data URI format
export function isValidBase64DataUri(dataUri: string): boolean {
  const dataUriPattern = /^data:image\/(jpeg|jpg|png|webp);base64,/i;
  return dataUriPattern.test(dataUri);
}

// Model capabilities for Fal.ai Nano Banana
export const modelCapabilities = {
  'fal-ai/nano-banana/edit': {
    supportsImageGeneration: true,
    supportsImageEditing: true,
    maxImageSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['jpeg', 'jpg', 'png', 'webp'],
    maxInputImages: 10,
    maxOutputImages: 4,
    costPerImage: 0.039,
    outputFormats: ['jpeg', 'png'],
  },
};

export type ModelName = keyof typeof modelCapabilities;
```

### lib/image-utils.ts
```typescript
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type. Please use: ${supportedTypes.join(', ')}`,
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
    };
  }
  
  return { valid: true };
}

export function downloadImage(dataUrl: string, filename: string = 'edited-photo.jpg') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function resizeImage(
  dataUrl: string,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } else {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}
```

### lib/prompts.ts
```typescript
export interface EditPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'staging' | 'lighting' | 'declutter' | 'exterior' | 'repair';
  icon?: string;
}

export const realEstatePrompts: EditPrompt[] = [
  // Staging prompts
  {
    id: 'modern-staging',
    label: 'Modern Staging',
    prompt: 'Add modern furniture staging with neutral colors, including contemporary sofa, coffee table, and minimal decor',
    category: 'staging',
  },
  {
    id: 'luxury-staging',
    label: 'Luxury Staging',
    prompt: 'Stage with high-end furniture, designer pieces, artwork, and premium finishes',
    category: 'staging',
  },
  {
    id: 'cozy-staging',
    label: 'Cozy Staging',
    prompt: 'Add warm, inviting furniture with soft textures, throw pillows, and comfortable seating',
    category: 'staging',
  },
  
  // Lighting prompts
  {
    id: 'bright-natural',
    label: 'Bright Natural Light',
    prompt: 'Enhance with bright, natural lighting, remove shadows, and create a welcoming atmosphere',
    category: 'lighting',
  },
  {
    id: 'golden-hour',
    label: 'Golden Hour',
    prompt: 'Add warm golden hour lighting with soft shadows and inviting ambiance',
    category: 'lighting',
  },
  {
    id: 'professional-lighting',
    label: 'Professional Lighting',
    prompt: 'Apply professional real estate photography lighting, bright and even throughout',
    category: 'lighting',
  },
  
  // Declutter prompts
  {
    id: 'remove-clutter',
    label: 'Remove Clutter',
    prompt: 'Remove all personal items, clutter, and unnecessary objects, keep space clean and minimal',
    category: 'declutter',
  },
  {
    id: 'clean-surfaces',
    label: 'Clean Surfaces',
    prompt: 'Clean all surfaces, remove stains, dust, and imperfections, make everything pristine',
    category: 'declutter',
  },
  {
    id: 'organize-space',
    label: 'Organize Space',
    prompt: 'Organize and arrange items neatly, create a tidy and appealing environment',
    category: 'declutter',
  },
  
  // Exterior prompts
  {
    id: 'enhance-landscaping',
    label: 'Enhance Landscaping',
    prompt: 'Add beautiful landscaping with green lawn, flowers, and well-maintained plants',
    category: 'exterior',
  },
  {
    id: 'blue-sky',
    label: 'Perfect Sky',
    prompt: 'Replace sky with clear blue sky, remove clouds, create perfect weather conditions',
    category: 'exterior',
  },
  {
    id: 'curb-appeal',
    label: 'Boost Curb Appeal',
    prompt: 'Enhance curb appeal with fresh paint, clean driveway, and attractive entrance',
    category: 'exterior',
  },
  
  // Repair prompts
  {
    id: 'fix-walls',
    label: 'Fix Walls',
    prompt: 'Repair wall damage, remove cracks, holes, and imperfections, apply fresh paint',
    category: 'repair',
  },
  {
    id: 'update-fixtures',
    label: 'Update Fixtures',
    prompt: 'Replace outdated fixtures with modern alternatives, update hardware and fittings',
    category: 'repair',
  },
  {
    id: 'refresh-paint',
    label: 'Refresh Paint',
    prompt: 'Apply fresh, neutral paint colors throughout, remove scuffs and marks',
    category: 'repair',
  },
];

export function getPromptsByCategory(category: EditPrompt['category']): EditPrompt[] {
  return realEstatePrompts.filter(prompt => prompt.category === category);
}

export function combinePrompts(...prompts: string[]): string {
  return prompts.filter(Boolean).join('. ');
}

export function enhancePromptForRoom(basePrompt: string, roomType?: string): string {
  const roomEnhancements: Record<string, string> = {
    kitchen: 'modern appliances, clean countertops, organized cabinets',
    bedroom: 'comfortable bedding, soft lighting, organized closet',
    bathroom: 'clean fixtures, spa-like atmosphere, fresh towels',
    'living-room': 'comfortable seating, entertainment center, welcoming atmosphere',
    'dining-room': 'elegant table setting, proper lighting, spacious feel',
    office: 'organized workspace, professional appearance, good lighting',
    garage: 'clean floor, organized storage, proper lighting',
  };
  
  if (roomType && roomEnhancements[roomType]) {
    return `${basePrompt}, ${roomEnhancements[roomType]}`;
  }
  
  return basePrompt;
}
```

## 🔌 Step 5: API Route

### app/api/edit-photo/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, isValidBase64DataUri } from '@/lib/fal-client';
import { FAL_CONFIG, EDIT_CONFIG } from '@/lib/constants';

interface EditRequest {
  image: string; // base64 image
  prompt: string;
}

interface FalNanoBananaRequest {
  prompt: string;
  image_urls: string[];
  num_images?: number;
  output_format?: 'jpeg' | 'png';
  sync_mode?: boolean;
}

interface FalNanoBananaResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Fal.ai API key not configured. Please set FAL_API_KEY environment variable.' 
        },
        { status: 500 }
      );
    }

    const body: EditRequest = await request.json();
    const { image, prompt } = body;

    // Validate request
    if (!image || !prompt) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing image or prompt in request' 
        },
        { status: 400 }
      );
    }

    try {
      // Validate base64 data URI format
      if (!isValidBase64DataUri(image)) {
        throw new Error('Invalid image format. Please provide a valid base64 data URI for JPEG, PNG, or WebP image.');
      }

      // Create comprehensive real estate editing prompt
      const enhancedPrompt = `Edit this real estate photo: ${prompt}. Maintain photorealistic quality, proper lighting, and professional real estate photography standards. Keep the original architecture and layout intact while making the requested improvements.`;

      // Prepare request for Fal.ai Nano Banana API - use base64 data URI directly
      const falRequest: FalNanaBananaRequest = {
        prompt: enhancedPrompt,
        image_urls: [image], // Pass base64 data URI directly
        num_images: parseInt(process.env.NUM_OUTPUT_IMAGES || '1'),
        output_format: (process.env.OUTPUT_FORMAT as 'jpeg' | 'png') || 'jpeg',
        sync_mode: true, // Return results synchronously
      };

      // Call Fal.ai Nano Banana API directly
      const response = await fetch(`${FAL_CONFIG.BASE_URL}/${FAL_CONFIG.MODEL_NAME}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${process.env.FAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(falRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fal.ai API error:', response.status, errorText);
        throw new Error(`Fal.ai API error: ${response.status} - ${errorText}`);
      }

      const result: FalNanoBananaResponse = await response.json();

      if (!result.images || result.images.length === 0) {
        throw new Error('No images returned from Fal.ai API');
      }

      // Return the first edited image
      const editedImage = result.images[0];

      return NextResponse.json({
        success: true,
        editedImage: editedImage.url,
        prompt: enhancedPrompt,
        model: FAL_CONFIG.MODEL_NAME,
        description: result.description,
        metadata: {
          width: editedImage.width,
          height: editedImage.height,
          format: falRequest.output_format,
          cost: EDIT_CONFIG.COST_PER_IMAGE,
        },
      });
    } catch (modelError) {
      console.error('Fal.ai model error:', modelError);
      return NextResponse.json(
        { 
          success: false, 
          error: modelError instanceof Error ? modelError.message : 'Failed to process image with AI model. Please try again.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    provider: 'fal.ai',
    model: FAL_CONFIG.MODEL_NAME,
    apiKeyConfigured: validateApiKey(),
    costPerImage: EDIT_CONFIG.COST_PER_IMAGE,
    timestamp: new Date().toISOString(),
  });
}
```

## 🎨 Step 6: UI Components

### components/ui/button.tsx
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

### components/ui/card.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-b]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
```

### components/ui/input.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

### components/ui/textarea.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

### components/ui/tabs.tsx
```typescript
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

## 🖼 Step 7: Feature Components

### components/ImageUpload.tsx
```typescript
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
          {isDragActive ? 'Drop your photo here' : 'Upload Real Estate Photo'}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to select
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded">JPEG</span>
          <span className="px-2 py-1 bg-secondary rounded">PNG</span>
          <span className="px-2 py-1 bg-secondary rounded">WebP</span>
          <span className="px-2 py-1 bg-secondary rounded">Max 10MB</span>
        </div>
      </div>
    </Card>
  );
}
```

## 🚀 Step 8: Running the Application

### Development
```bash
npm run dev
# or
pnpm dev
```

### Production Build
```bash
npm run build && npm start
# or  
pnpm build && pnpm start
```

### API Testing
```bash
# Health check
curl http://localhost:3000/api/edit-photo

# Should return:
# {"status":"ok","provider":"fal.ai","model":"fal-ai/nano-banana/edit",...}
```

## 🌐 Step 9: Deployment Options

### Vercel (Recommended)
1. Push to GitHub repository
2. Import project to Vercel
3. Add `FAL_API_KEY` environment variable
4. Deploy!

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Server
```bash
# Build the application
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "photo-editor" -- start
```

## 📊 Cost & Usage

- **Cost per image**: $0.039 USD
- **Processing time**: 3-10 seconds
- **Supported formats**: JPEG, PNG, WebP
- **Max file size**: 10MB
- **Max input images**: 10 per request

## 🔧 Customization

### Adding New Prompts
Edit `lib/prompts.ts` to add new categories or prompts:

```typescript
{
  id: 'custom-prompt',
  label: 'Custom Enhancement',
  prompt: 'Your custom prompt here',
  category: 'staging', // or new category
}
```

### Styling Changes
- Edit Tailwind classes in components
- Modify `app/globals.css` for global styles
- Update colors in `tailwind.config.js`

### API Modifications
- Change model parameters in `app/api/edit-photo/route.ts`
- Adjust processing options in `FAL_CONFIG`

## ❗ Troubleshooting

### Common Issues

1. **API Key Error**: Ensure `FAL_API_KEY` is set correctly
2. **Image Upload Failed**: Check file size (max 10MB) and format
3. **Build Errors**: Run `npm install` to ensure dependencies
4. **Slow Processing**: Normal for AI processing, 5-10 seconds expected

### Debug Mode
Add to `.env.local`:
```env
DEBUG=true
NODE_ENV=development
```

## 📞 Support

- **Fal.ai Documentation**: https://docs.fal.ai/
- **Next.js Docs**: https://nextjs.org/docs
- **Issue Tracker**: Create issues in your repository

---

🎉 **You're all set!** Your AI Real Estate Photo Editor is ready to transform property photos with professional-quality results.