// app/api/sendEmail/route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {

    const body = await req.json();
    const { email, subject, text } = body;

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '780b5d001@smtp-brevo.com',
        pass: 'jMTfkZ4snQEAJKBX',
      },
    });

    const mailOptions = {
      from: 'noreply@miwabox.live',
      to: email,
      subject: subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully', info }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error sending email', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
