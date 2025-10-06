import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { projectId, dataset, apiVersion } from '@/sanity/env'
import { Resend } from 'resend'

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
    const { firstName, lastName, email, subject, message, source = 'contact_page' } = await request.json()

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }


    // Get client information
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'Unknown'
    const referrer = request.headers.get('referer') || 'Unknown'

    // Create contact form submission document
    const submissionData = {
      _type: 'contactFormSubmission',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'new',
      priority: 'medium',
      source,
      userAgent,
      ipAddress,
      referrer,
    }
    
    const submission = await client.create(submissionData)

    // Send email notification to admin
    try {
      // Initialize Resend only when needed (at runtime)
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      // Get site settings to get the contact email from footer
      const siteSettings = await client.fetch(
        `*[_type == "siteSettings"][0]{
          footer {
            contactInfo {
              email
            }
          }
        }`
      )

      const adminEmail = siteSettings?.footer?.contactInfo?.email || 'info@friendsforum.org'
      
      if (adminEmail) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Source:</strong> ${source}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
              <h3 style="color: #495057; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #6c757d;">
              <p><strong>Technical Details:</strong></p>
              <p>IP Address: ${ipAddress}</p>
              <p>User Agent: ${userAgent}</p>
              <p>Referrer: ${referrer}</p>
              <p>Submission ID: ${submission._id}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 12px;">
                This email was sent automatically from your FRIENDS Forum contact form.
              </p>
            </div>
          </div>
        `

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'no-reply@notifications.friendsforum.org',
          to: [adminEmail],
          subject: `New Contact Form Submission: ${subject}`,
          html: emailHtml,
        })

        console.log('Email notification sent successfully to:', adminEmail)
      } else {
        console.log('Contact email not configured in site settings')
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submission: {
        id: submission._id,
        submittedAt: submission.submittedAt,
      },
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to submit contact form. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Test Sanity client connection
    const testResult = await client.fetch('*[_type == "homePage"][0]{title}')
    
    return NextResponse.json({
      message: 'Contact form API endpoint',
      sanityConnection: 'OK',
      testResult: testResult ? 'Connected' : 'No data found'
    }, { status: 200 })
  } catch (error) {
    console.error('GET endpoint error:', error)
    return NextResponse.json({
      message: 'Contact form API endpoint',
      sanityConnection: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
