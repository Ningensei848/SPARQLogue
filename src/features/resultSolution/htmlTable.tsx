import { QueryResponse, RDFTerm } from './resultSolutionSlice'
import styled from 'styled-components'

const createTableHeader: React.FC<{ vars: string[] }> = (props) => {
  const { vars } = props
  return (
    <thead>
      <tr>
        {vars.map((v, i) => {
          return <th key={i}>{v}</th>
        })}
      </tr>
    </thead>
  )
}
const TableHeader = styled(createTableHeader)`
  border: dashed 1px orange; /**/
`

const createTableBody: React.FC<{ bindings: Array<{ [key: string]: RDFTerm }>; vars: string[] }> = (props) => {
  const { bindings, vars } = props
  return (
    <tbody>
      {bindings.map((binding, i) => {
        return (
          <tr key={i}>
            {vars.map((name, j) => {
              return <td key={`${i}-${j}`}>{binding[name].value}</td>
            })}
          </tr>
        )
      })}
    </tbody>
  )
}

const TableBody = styled(createTableBody)`
  border: dashed 1px orange; /**/
`
const createTable: React.FC<QueryResponse> = (props) => {
  const { head, results } = props
  const { link, vars } = head

  if (props.boolean || typeof vars == 'undefined') {
    // json response is invalid
    return <></>
  }

  const bindings = results ? results.bindings : []

  return (
    <table>
      <TableHeader vars={vars}></TableHeader>
      <TableBody vars={vars} bindings={bindings}></TableBody>
    </table>
  )
}

export const HTMLTable = styled(createTable)`
  border-collapse: collapse;
  border: solid 2px orange; /*表全体を線で囲う*/
`
