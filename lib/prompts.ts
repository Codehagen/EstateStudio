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