import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { name, email } = await request.json();

    console.log(
        `__MOCK: Sending magic link to ${name} <${email}> (Resend stubbed)`,
    );

    // TODO: Implement actual Resend.emails.send stub/logic if needed for testing

    return NextResponse.json({ message: "Magic link sent (mock)" }, { status: 200 });
} 