import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, isValidBase64DataUri } from '@/lib/fal-client';
import { FAL_CONFIG, EDIT_CONFIG } from '@/lib/constants';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

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
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unauthorized. Please sign in to use the photo editor.' 
        },
        { status: 401 }
      );
    }

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

      const result: FalNanaBananaResponse = await response.json();

      if (!result.images || result.images.length === 0) {
        throw new Error('No images returned from Fal.ai API');
      }

      // Return the first edited image
      const editedImage = result.images[0];

      try {
        // Get user's workspace and project
        const workspace = await prisma.workspace.findFirst({
          where: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
          include: {
            projects: {
              where: {
                status: 'ACTIVE',
              },
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        if (workspace && workspace.projects.length > 0) {
          const project = workspace.projects[0];
          
          // Create photo record
          const photo = await prisma.photo.create({
            data: {
              filename: `photo-${Date.now()}.jpg`,
              url: image, // Original base64 image
              projectId: project.id,
              workspaceId: workspace.id,
              uploadedById: session.user.id,
              fileSize: Math.round(image.length * 0.75), // Approximate base64 size
              format: 'jpeg',
            },
          });

          // Create photo edit record
          await prisma.photoEdit.create({
            data: {
              photoId: photo.id,
              editedUrl: editedImage.url,
              prompt: enhancedPrompt,
              modelUsed: FAL_CONFIG.MODEL_NAME,
              cost: EDIT_CONFIG.COST_PER_IMAGE,
              editedById: session.user.id,
              width: editedImage.width,
              height: editedImage.height,
              format: falRequest.output_format,
            },
          });

          // Update workspace edit count
          await prisma.workspace.update({
            where: {
              id: workspace.id,
            },
            data: {
              currentMonthEdits: {
                increment: 1,
              },
            },
          });
        }
      } catch (dbError) {
        console.error('Error saving photo edit to database:', dbError);
        // Don't fail the request if database save fails
      }

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