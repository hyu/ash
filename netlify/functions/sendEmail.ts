import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import sgMail from '@sendgrid/mail'

interface FormData {
  name: string
  email: string
  note: string
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  // CORS headers for development and production
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    // Parse the request body
    const body: FormData = JSON.parse(event.body || '{}')
    const { name, email, note } = body

    // Validate required fields
    if (!name || !email || !note) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields: name, email, and note are required',
        }),
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      }
    }

    // Get SendGrid API key from environment variables
    const sendGridApiKey = process.env.SENDGRID_API_KEY
    if (!sendGridApiKey) {
      console.error('SENDGRID_API_KEY is not set')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server configuration error. Please contact support.',
        }),
      }
    }

    // Get recipient email from environment variables (default to test email)
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'han@sent.com'
    const senderEmail = process.env.SENDER_EMAIL || 'noreply@example.com'

    // Initialize SendGrid
    sgMail.setApiKey(sendGridApiKey)

    // Prepare email content
    const emailContent = {
      to: recipientEmail,
      from: senderEmail,
      subject: `New Contact Form Submission from ${name}`,
      text: `
New contact form submission:

Name: ${name}
Email: ${email}

Note:
${note}

---
This email was sent from the contact form on your website.
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #163F00;">New Contact Form Submission</h2>
          <div style="background-color: #FFF9F0; border: 1px solid #99B292; padding: 20px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #99B292;">Note:</h3>
            <p style="white-space: pre-wrap; line-height: 1.7;">${note}</p>
          </div>
          <hr style="border: none; border-top: 1px dashed #FFCF8A; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This email was sent from the contact form on your website.</p>
        </div>
      `,
    }

    // Send email
    await sgMail.send(emailContent)

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Email sent successfully!',
      }),
    }
  } catch (error: unknown) {
    console.error('Error sending email:', error)
    
    // Type guard for error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send email. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      }),
    }
  }
}

