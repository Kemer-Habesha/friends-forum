#!/bin/bash

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
    echo "Error: NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is not set"
    echo "Please set it before running this script:"
    echo "export NEXT_PUBLIC_SANITY_PROJECT_ID='your-project-id'"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
    echo "Warning: NEXT_PUBLIC_SANITY_DATASET not set, using 'production' as default"
    export NEXT_PUBLIC_SANITY_DATASET="production"
fi

if [ -z "$NEXT_PUBLIC_SANITY_API_VERSION" ]; then
    echo "Warning: NEXT_PUBLIC_SANITY_API_VERSION not set, using '2025-08-23' as default"
    export NEXT_PUBLIC_SANITY_API_VERSION="2025-08-23"
fi

# Build the Docker image with environment variables
docker build \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID="$NEXT_PUBLIC_SANITY_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_SANITY_DATASET="$NEXT_PUBLIC_SANITY_DATASET" \
  --build-arg NEXT_PUBLIC_SANITY_API_VERSION="$NEXT_PUBLIC_SANITY_API_VERSION" \
  -t friends-forum:latest \
  .

echo "Docker image built successfully!"
echo "To run locally: docker run -p 8080:8080 friends-forum:latest"
