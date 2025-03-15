import type { NextApiRequest, NextApiResponse } from 'next'

const TELEGRAM_BOT_TOKEN = '8131686927:AAFGC5J9yOpiO8Z0WuvGGjtI2xWo0E27dik'
const TELEGRAM_CHAT_ID = '6015407610'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body

    const message = `New email submission: ${email}`

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    })

    if (response.ok) {
      res.status(200).json({ message: 'Email sent to Telegram' })
    } else {
      const errorData = await response.json()
      res.status(500).json({ error: 'Failed to send email to Telegram', details: errorData })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
