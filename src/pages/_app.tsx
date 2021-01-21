// Next.jsでの_documment.js(tsx)・App.js(tsx)について爆速で理解しよう - Qiita cf. https://bit.ly/2JHQNwN
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider as MaterialUIThemeProvider, StylesProvider } from '@material-ui/core/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { Provider as StateProvider } from 'react-redux'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'

import theme from '~/src/common/_theme'
import store from '~/src/store'

// for codemirror
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css' // TODO: extend syntax highlight for sparql json

import 'styles/globals.css'

export default function MyApp(props: AppProps): React.ReactElement {
  const { Component, pageProps } = props

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <StateProvider store={store}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <StylesProvider injectFirst>
        <MaterialUIThemeProvider theme={theme}>
          <StyledComponentsThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </StyledComponentsThemeProvider>
        </MaterialUIThemeProvider>
      </StylesProvider>
    </StateProvider>
  )
}
