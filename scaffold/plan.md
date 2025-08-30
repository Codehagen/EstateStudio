# Real Estate Photo Editor Scaffolding Plan

## Project Overview
AI-powered real estate photo editor using Gemini 2.5 Flash Image (Nano Banana) and Vercel AI SDK

## Architecture
- Framework: Next.js 15.5.2 with TypeScript
- Styling: Tailwind CSS + shadcn/ui
- AI Model: Google Gemini 2.5 Flash Image
- State: Zustand for edit history
- Package Manager: pnpm

## Components to Create

### Phase 1: Core Setup
- [x] Install dependencies
- [x] Create scaffold tracking
- [ ] Environment configuration (.env.local)
- [ ] Update Next.js config

### Phase 2: UI Components (shadcn)
- [ ] Button component
- [ ] Card component
- [ ] Tabs component
- [ ] Input component
- [ ] Textarea component
- [ ] Badge component
- [ ] Slider component
- [ ] Toast component

### Phase 3: Library Utilities
- [ ] lib/gemini-client.ts - Gemini API client
- [ ] lib/image-utils.ts - Image processing
- [ ] lib/prompts.ts - Real estate prompts
- [ ] lib/constants.ts - App constants

### Phase 4: Feature Components
- [ ] components/ImageUpload.tsx - Drag & drop
- [ ] components/PhotoEditor.tsx - Main editor
- [ ] components/EditHistory.tsx - History tracker
- [ ] components/PromptSelector.tsx - Quick prompts
- [ ] components/ComparisonView.tsx - Before/after

### Phase 5: API & Pages
- [ ] app/api/edit-photo/route.ts - Edit endpoint
- [ ] app/photo-editor/page.tsx - Main page
- [ ] app/photo-editor/layout.tsx - Layout
- [ ] Update app/page.tsx - Landing page

## Progress
Total files: 22
Created: 2
Remaining: 20