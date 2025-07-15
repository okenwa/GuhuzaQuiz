import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email, inviteLink } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Guhuza Quiz" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "You're invited to join Guhuza Quiz!",
      html: `
        <h2>Join me on Guhuza Quiz!</h2>
        <p>Click the link below to sign up and start playing:</p>
        <a href="${inviteLink}">${inviteLink}</a>
        <p>Can you beat my score?</p>
      `,
    });

    return NextResponse.json({ message: "Invite sent!" });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ message: "Failed to send invite", error }, { status: 500 });
  }
} 