import type { NextApiRequest, NextApiResponse } from 'next'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body

    const message = `New email submission: ${email}`

    try {
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
        res.status(200).json({ message: 'Message sent to Telegram' })
      } else {
        const errorData = await response.json()
        console.error('Error sending message to Telegram:', errorData)
        res.status(500).json({ error: 'Failed to send message to Telegram', details: errorData })
      }
    } catch (error) {
      console.error('Error:', error)
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to send message to Telegram', details: error.message })
      } else {
        res.status(500).json({ error: 'Failed to send message to Telegram', details: 'Unknown error' })
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
