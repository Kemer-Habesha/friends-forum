# Google Cloud Run Deployment Guide

## Problem
The original deployment was failing because the Sanity configuration requires environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`) that were not available during the Docker build process.

## Solution
We've updated the Dockerfile to accept build arguments and created deployment configurations that properly pass these environment variables **without hardcoding sensitive values**.

## Option 1: Using Google Cloud Build (Recommended)

1. **Set up a Cloud Build trigger** with the following substitutions:
   - `_SANITY_PROJECT_ID`: Your actual Sanity project ID (set this in the trigger, not in the file)
   - `_SANITY_DATASET`: `production` (safe to keep as default)
   - `_SANITY_API_VERSION`: `2025-08-23` (safe to keep as default)
   - `_REGION`: Your preferred region

2. **Or use the cloudbuild.yaml with substitutions**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml \
     --substitutions=_SANITY_PROJECT_ID="YOUR_ACTUAL_PROJECT_ID"
   ```

## Option 2: Manual Deployment

1. **Set environment variables locally**:
   ```bash
   export NEXT_PUBLIC_SANITY_PROJECT_ID="your-actual-project-id"
   export NEXT_PUBLIC_SANITY_DATASET="production"
   export NEXT_PUBLIC_SANITY_API_VERSION="2025-08-23"
   ```

2. **Build the Docker image locally**:
   ```bash
   ./build.sh
   ```

3. **Tag and push to Google Container Registry**:
   ```bash
   docker tag friends-forum:latest gcr.io/YOUR_PROJECT_ID/friends-forum:latest
   docker push gcr.io/YOUR_PROJECT_ID/friends-forum:latest
   ```

4. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy friends-forum \
     --image gcr.io/YOUR_PROJECT_ID/friends-forum:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id,NEXT_PUBLIC_SANITY_DATASET=production,NEXT_PUBLIC_SANITY_API_VERSION=2025-08-23"
   ```

## Option 3: Set Environment Variables in Cloud Run Console

1. Go to the Cloud Run console
2. Select your service
3. Go to "Edit & Deploy New Revision"
4. Under "Variables & Secrets", add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your actual Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET`: `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION`: `2025-08-23`

## Environment Variables Required

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID (keep this secret!)
- `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset (usually `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION`: Your Sanity API version (e.g., `2025-08-23`)

## Security Notes

⚠️ **IMPORTANT**: Never commit sensitive values like project IDs to your repository!

- The `cloudbuild.yaml` file now has empty substitutions that should be set in your Cloud Build trigger
- The `build.sh` script checks for environment variables and won't work without them
- Use Google Cloud Secret Manager or environment variables in your CI/CD pipeline
- Consider using `.env.example` files to show the required structure without real values

## Example .env.example file

Create a `.env.example` file in your repository:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-08-23
```

Then add `.env.example` to your repository and keep `.env.local` in your `.gitignore`.
