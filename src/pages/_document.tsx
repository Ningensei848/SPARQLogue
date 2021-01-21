import { ServerStyleSheets as MaterialServerStyleSheets } from '@material-ui/core'
import { RenderPageResult } from 'next/dist/next-server/lib/utils'
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

import theme from '~/src/common/_theme'

export default class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
// type definition below: cf. https://bit.ly/2UiaE7L
MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
  /*
    written in 2020-11-11:
    `Document` currently does not support Next.js Data Fetching methods
    like `getStaticProps` or `getServerSideProps`.
    cf. https://nextjs.org/docs/advanced-features/custom-document#caveats
  */

  const styledComponentsSheet = new ServerStyleSheet()
  const materialUiSheets = new MaterialServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  try {
    ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
      originalRenderPage({
        enhanceApp: (App) => (
          props
        ): React.ReactElement<{
          sheet: ServerStyleSheet
        }> => styledComponentsSheet.collectStyles(materialUiSheets.collect(<App {...props} />))
      })

    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: [
        <React.Fragment key="styles">
          {initialProps.styles}
          {styledComponentsSheet.getStyleElement()}
          {materialUiSheets.getStyleElement()}
        </React.Fragment>
      ]
    }
  } finally {
    styledComponentsSheet.seal()
  }
}
