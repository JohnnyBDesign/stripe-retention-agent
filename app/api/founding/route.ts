import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, mrrBand } = body;

    if (!name || !email || !company || !mrrBand) {
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
          subject: `Founding application: ${name} from ${company}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nStripe MRR Band: ${mrrBand}\n\nApplied at: ${new Date().toISOString()}`,
        });

        console.log('[founding] Sent via Resend:', { name, email, company, mrrBand });
        
        try {
          await prisma.foundingApplication.create({
            data: { name, email, company, mrrBand },
          });
        } catch (dbError) {
          console.error('[founding] DB persist failed (non-fatal):', dbError);
        }
        
        return NextResponse.json({ success: true });
      } catch (resendError) {
        console.error('[founding] Resend failed, falling back to DB:', resendError);
        
        try {
          await prisma.foundingApplication.create({
            data: { name, email, company, mrrBand },
          });
          console.log('[founding] Persisted to DB after Resend failure');
          return NextResponse.json({ success: true });
        } catch (dbError) {
          console.error('[founding] DB persist also failed:', dbError);
          return NextResponse.json(
            { error: 'Failed to process application. Please try again or contact hello@signal.dev' },
            { status: 500 }
          );
        }
      }
    }

    try {
      await prisma.foundingApplication.create({
        data: { name, email, company, mrrBand },
      });
      console.log('[founding] No RESEND_API_KEY, persisted to DB:', { name, email, company, mrrBand });
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('[founding] DB persist failed:', dbError);
      return NextResponse.json(
        { error: 'Failed to save application. Please try again or contact hello@signal.dev' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[founding] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
