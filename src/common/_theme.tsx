/*  Server Rendering - Material-UI */
// cf. https://material-ui.com/guides/server-rendering/
// cf. https://github.com/mui-org/material-ui/blob/master/examples/nextjs-with-typescript/src/theme.tsx
import red from '@material-ui/core/colors/red'
import { createMuiTheme } from '@material-ui/core/styles'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  }
})

export default theme
