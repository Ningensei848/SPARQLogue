import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import React from 'react'
import ResultSolution from 'src/features/resultSolution'
import BaseLayout from 'src/layouts/base'

import Copyright from '~/src/common/Copyright'
import Editor from '~/src/features/editor'
import GeneratedForm from '~/src/features/form'

import styled from 'styled-components'

const Button = styled.button`
  color: palevioletred;
  font-size: 1.5rem;
  margin: 1.2rem;
  padding: 0.25rem 1rem;
  border: 0.2rem solid palevioletred;
  border-radius: 0.3rem;
`
const Index: React.FC = () => {
  // クエリ編集画面でIDを変更できる（IDは一番最初にランダム数値列で初期化）
  // 他の画面においても，クエリや結果等はすべてここのIDで管理する（一番外側にある親コンポネントにID情報を管理させる）
  const defaultValue =
    '# @endpoint urls=["https://dbpedia.org/sparql", "https://query.wikidata.org/bigdata/namespace/wdq/sparql"]\n' +
    '# @param limit=5\n' +
    '\n' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n' +
    'SELECT * WHERE {\n' +
    '  ?sub ?pred ?obj .\n' +
    '} LIMIT {{limit}}\n'

  // if user want to change ID, do `setCurrentId(newID)`
  // const [editorId, setCurrentId] = React.useState(Date.now().toString() + Math.floor(Math.random() * 100)) // props.id OR generate random ID
  const editorId = 'hogehoge-test'

  const mode = 'edit'

  const styleProps = {
    textInput: `
    @import url(https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css);
    display: flex; /*アイコン、テキストボックスを調整する*/
    align-items: center; /*アイコン、テキストボックスを縦方向の中心に*/
    justify-content: center; /*アイコン、テキストボックスを横方向の中心に*/
    height: 50px;
    width: 100%;
    /* background-color: #ddd; */
    `
  }

  return (
    <BaseLayout>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Next.js with TypeScript example
          </Typography>
          <Link href="/" passHref>
            <Button as="a">or Go to Search Page</Button>
          </Link>
        </Box>
        <GeneratedForm parent_id={editorId} mode={mode} styleProps={styleProps} />
        <Editor id={editorId} query={defaultValue} mode={mode} />
        <ResultSolution id={editorId} />
        <Copyright />
      </Container>
    </BaseLayout>
  )
}

export default Index
