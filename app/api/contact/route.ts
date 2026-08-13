import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const operatorEmail = process.env.OPERATOR_EMAIL || 'hello@signal.dev';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Signal <onboarding@resend.dev>',
          to: operatorEmail,
          subject: `Contact form: ${name} from ${company}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`,
        });

        console.log('[contact] Sent via Resend:', { name, email, company });
        return NextResponse.json({ success: true });
      } catch (resendError) {
        console.error('[contact] Resend failed:', resendError);
        console.log('[contact] Fallback log:', { name, email, company, message });
        return NextResponse.json({ success: true });
      }
    }

    console.log('[contact] No RESEND_API_KEY, logging only:', { name, email, company, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[contact] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
