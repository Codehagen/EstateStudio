# Cloudflare R2 Storage Implementation TODO

## Overview
Currently, images are stored as:
- **Original photos**: Base64 data URIs directly in PostgreSQL (inefficient)
- **Edited photos**: External URLs from Fal.ai CDN (no control, may expire)

## Implementation Plan

### 1. Setup Cloudflare R2
- [ ] Create Cloudflare R2 bucket
- [ ] Set up R2 API credentials
- [ ] Configure CORS for direct browser uploads
- [ ] Add environment variables:
  ```env
  CLOUDFLARE_ACCOUNT_ID=
  CLOUDFLARE_R2_ACCESS_KEY_ID=
  CLOUDFLARE_R2_SECRET_ACCESS_KEY=
  CLOUDFLARE_R2_BUCKET_NAME=
  CLOUDFLARE_R2_PUBLIC_URL=
  ```

### 2. Install Dependencies
```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 3. Create R2 Client Library
Create `/lib/cloudflare-r2.ts`:
- Upload function for base64 images
- Download function from URLs
- Generate presigned URLs for direct uploads
- Delete function for cleanup

### 4. Update Photo Upload Flow
In `/app/api/edit-photo/route.ts`:
1. Convert base64 to Buffer
2. Upload to R2 with path: `photos/original/{workspaceId}/{photoId}.jpg`
3. Store R2 URL in `Photo.url` instead of base64

### 5. Update Edit Storage Flow
In `/app/api/edit-photo/route.ts`:
1. Download edited image from Fal.ai URL
2. Upload to R2 with path: `photos/edited/{workspaceId}/{editId}.jpg`
3. Store R2 URL in `PhotoEdit.editedUrl`

### 6. Migration Strategy
- [ ] Create migration script for existing base64 photos
- [ ] Batch process existing records
- [ ] Update database URLs
- [ ] Verify all images accessible

### 7. Benefits
- ✅ Reduced database size (no base64 storage)
- ✅ Faster queries (only URLs in DB)
- ✅ Better performance (CDN delivery)
- ✅ Full control over image retention
- ✅ Cost-effective storage
- ✅ Automatic image optimization via Cloudflare

### 8. Optional Enhancements
- [ ] Image resizing on upload
- [ ] Thumbnail generation
- [ ] WebP conversion for better performance
- [ ] Signed URLs for private images
- [ ] Automatic cleanup of orphaned images

## File Locations to Update
- `/app/api/edit-photo/route.ts` - Main upload/edit logic
- `/prisma/schema.prisma` - Update field comments
- `/lib/cloudflare-r2.ts` - New R2 client (to be created)
- `/components/ImageUpload.tsx` - Consider direct browser upload