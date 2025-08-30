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