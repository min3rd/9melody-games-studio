import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { useEffect } from 'react'
import clsx from 'clsx'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // initial theme class, respects prefers-color-scheme
    const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (preferDark) document.documentElement.classList.add('dark')
  }, [])

  return <Component {...pageProps} />
}
