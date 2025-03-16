import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email } = req.body

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('Missing email credentials in environment variables')
      return res.status(500).json({ error: 'Missing email credentials in environment variables' })
    }

    try {
      // Configure the transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for port 465 (SSL), false for port 587 (TLS)
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      })

      // Email details
      const mailOptions = {
        from: `"HanJaemi" <${EMAIL_USER}>`,
        to: email,
        subject: "🎉 You're In! Welcome to HanJaemi.",
        text: `Hey ${firstName} ${lastName},

Awesome news—you’re officially on the waitlist for HanJaemi! 🚀 We’re super excited to have you on board.

We’re working hard to bring you something amazing, and because you signed up early, you’ll be one of the first to try it out. Here’s what’s next:

✨ Early Access – You’ll get first access before the public launch.
🔥 Insider Updates – We’ll keep you in the loop with sneak peeks & cool features.
🎁 Exclusive Perks – Maybe even some surprises along the way. 😉

Thanks for joining us! We can’t wait to show you what we’ve been working on. Stay tuned! 💙

Cheers,
HanJaemi Team
HanJaemi
https://hanjemi-v1.vercel.app/
`, 
      }

      // Send email
      const info = await transporter.sendMail(mailOptions)

      console.log('Email sent:', info.response)

      res.status(200).json({ message: 'Email sent to user' })
    } catch (error) {
      console.error('Error sending email:', error)
      res.status(500).json({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
