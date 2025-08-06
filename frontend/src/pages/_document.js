import { Typography } from '@mui/material'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    const { locale } = this.props.__NEXT_DATA__
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    return (
      <Html dir={dir} lang={locale}>
        <Head>
          <link rel='icon' href='/logo/logo D.png'/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
