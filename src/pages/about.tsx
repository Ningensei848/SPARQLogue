import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import React, { ReactElement } from 'react'
import Copyright from '~/src/common/Copyright'
import ProTip from '~/src/common/ProTip'

export default function About(): ReactElement {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js with TypeScript example
        </Typography>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}
