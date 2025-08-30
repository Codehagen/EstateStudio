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