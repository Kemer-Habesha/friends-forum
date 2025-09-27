import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: {
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasApiVersion: !!process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      hasToken: !!process.env.SANITY_API_TOKEN,
      nodeEnv: process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString(),
  })
}
