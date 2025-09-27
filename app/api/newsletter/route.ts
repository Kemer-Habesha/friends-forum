import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from '@/sanity/env'

// Initialize Sanity client
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN!, // This needs to be a write token
  useCdn: false,
})

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'homepage' } = await request.json()
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingSubscription = await client.fetch(
      `*[_type == "newsletterSubscription" && email == $email && status == "active"][0]`,
      { email }
    )
    
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Email is already subscribed to our newsletter' },
        { status: 409 }
      )
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'Unknown'

    // Create subscription document
    const subscriptionData = {
      _type: 'newsletterSubscription',
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source,
      userAgent,
      ipAddress,
    }
    
    const subscription = await client.create(subscriptionData)
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscription: {
        id: subscription._id,
        email: subscription.email,
        subscribedAt: subscription.subscribedAt,
      },
    })
  } catch (error) {
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    
    // Try to fetch a simple document to test the connection
    const testResult = await client.fetch('*[_type == "homePage"][0]{title}')
    
    return NextResponse.json({
      message: 'Newsletter API endpoint',
      sanityConnection: 'OK',
      testResult: testResult ? 'Connected' : 'No data found'
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      message: 'Newsletter API endpoint',
      sanityConnection: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
