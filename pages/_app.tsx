import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='author' content='Ben Elferink' />

        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />

        <title>$BANK</title>
      </Head>

      <Component {...pageProps} />
    </Fragment>
  )
}
