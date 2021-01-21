import Mustache from 'mustache'
import { Id } from '~/src/common/types'
import { pattern_comment, pattern_endpoint } from '~/src/common/util/pattern'
import { isExtractedAtMark } from '~/src/common/util/validation'
import { query } from '~/src/lib/d3sparql/util/query'
import { AppDispatch } from '~/src/store'
import { mergeResult, setResult } from '../../resultSolution/resultSolutionSlice'
import { extractMetadata } from './extractMeta'

interface asyncQueryProps {
  id: Id
  query: string
  dispatcher: AppDispatch
}

const getSingleVar = (elem: string): string => {
  try {
    const temp = JSON.parse(elem)
    if (Array.isArray(temp)) {
      return temp[0]
    } else {
      return temp
    }
  } catch (err) {
    console.error(err)
    return elem
  }
}

const getFormVar = (sparql: string): { [key: string]: string } => {
  const pattern = /^#+\s*@+param\s+(\w+)\s*=\s*([[{]*[^\]}]*[\]}]*)/i
  const m_list = sparql.split('\n').map((line) => pattern.exec(line.trim()))
  const res: { [key: string]: string } = {}
  for (const m of m_list) {
    if (m) {
      res[m[1]] = getSingleVar(m[2])
    }
  }
  return res
}

const replaceSparql = (sparql: string) => {
  const formVariable = getFormVar(sparql)
  return Mustache.render(sparql, formVariable)
}

const tryQueryingAsync = async (sparql: string, url: string) => {
  try {
    const data = await query(replaceSparql(sparql), url)
    return data
  } catch (err) {
    console.error(err)
    // throw new Error('Query is invalid. Please Pass correct SPARQL Query as `sparql`.')
  }
}

const parseEndpointVar = (elem: string, endpoints: string[]): void => {
  try {
    const temp = JSON.parse(elem)
    if (Array.isArray(temp)) {
      for (const url of temp) {
        endpoints.push(url)
      }
    }
  } catch (error) {
    console.warn(`failed JSONparse: value: ( ${elem} ) is string, but NOT JSON format.`)
    endpoints.push(elem)
  }
}

const getEndpointList = (query: string, id: Id): Array<string> => {
  // query をパースして endpoint を得る
  const commentsWithAtmark = query
    .split('\n')
    .map((line) => {
      const stripLine = line.trim()
      return stripLine.match(pattern_comment) ? stripLine : ''
    })
    .filter(Boolean)
    .map((stripLine) => {
      // ここで `# @param hoge=qwerty` が適切に処理できていない
      const res = extractMetadata({ at: 'endpoint', line: stripLine, parent_id: id, pattern: pattern_endpoint })
      return res ? res : null // chain させるために，もとの文字列を返す
    })
  const endpoints: Array<string> = []
  // なぜか Array.fliter() は使えない（型ガードがよくわからない）
  for (const atmark of commentsWithAtmark) {
    if (isExtractedAtMark(atmark)) {
      parseEndpointVar(atmark.var_elem, endpoints)
    }
  }
  return endpoints
}

export const makeAsyncQueryList = (props: asyncQueryProps) => {
  const [editorId, queryValue, dispatch] = [props.id, props.query, props.dispatcher]

  const endpoints = getEndpointList(queryValue, editorId)
  dispatch(setResult({ id: editorId, data: undefined })) // reset

  const asyncFunctions = endpoints.map((url) => {
    // setresult だと，結果が上書きされてしまう
    // マージするように変更
    return async () => dispatch(mergeResult({ id: editorId, data: await tryQueryingAsync(queryValue, url) }))
  })

  return asyncFunctions.map((f) => f())
}
