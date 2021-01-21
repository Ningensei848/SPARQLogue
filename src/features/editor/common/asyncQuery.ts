import { Id } from '~/src/common/types'
import { pattern_comment, pattern_endpoint } from '~/src/common/util/pattern'
import { isExtractedAtMark } from '~/src/common/util/validation'
import { query } from '~/src/lib/d3sparql/util/query'
import { QueryResponse } from '~/src/lib/d3sparql/util/types'
import { AppDispatch } from '~/src/store'
import { mergeResult, setResult } from '../../resultSolution/resultSolutionSlice'
import { extractMetadata } from './extractMeta'

interface asyncQueryProps {
  id: Id
  query: string
  dispatcher: AppDispatch
}

const tryQueryingAsync = async (sparql: string, url: string) => {
  try {
    const data = await query(sparql, url)
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
  console.log(`endpoints is ${endpoints}, isArray is ${Array.isArray(endpoints)}`)

  const asyncFunctions = endpoints.map((url) => {
    // setresult だと，結果が上書きされてしまう
    // マージするように変更
    return async () => dispatch(mergeResult({ id: editorId, data: await tryQueryingAsync(queryValue, url) }))
  })

  console.log(`asyncfunc is ${asyncFunctions}`)

  return asyncFunctions.map((f) => f())
}
