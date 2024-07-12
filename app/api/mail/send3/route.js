// app/api/sendEmail/route.js
import Mailjet from "node-mailjet";

export async function POST(req) {

  try {

    const body = await req.json();
    const { email, subject, text } = body;

    const mailjet = Mailjet.apiConnect(
      '9ccee8556931875545dc9213f7f74cc5',
      'eac59a2c3390b60665fa7a27fd336371'
    );

    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: "noreply@miwabox.live",
              Name: "Miwabox"
            },
            To: [
              {
                Email: email,
              }
            ],
            Subject: subject,
            HTMLPart: text,
          }
        ]
      });

    const result = await request;
    
    return new Response(JSON.stringify({ message: 'Email sent successfully', info: result.body }), {
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
