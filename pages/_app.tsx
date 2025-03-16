import type { AppProps } from 'next/app'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
