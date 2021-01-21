// Creating the Initial State Slices cf. https://redux-toolkit.js.org/tutorials/advanced-tutorial#creating-the-initial-state-slices
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'

// -------------------------------------------
// cf. ja-JP: http://www.asahi-net.or.jp/~ax2s-kmtn/internet/rdf/REC-sparql11-results-json-20130321.html
// cf. org: https://www.w3.org/TR/2013/REC-sparql11-results-json-20130321/

export interface IRI {
  type: 'uri'
  value: string
}
export interface Literal {
  type: 'literal'
  value: string
}
export interface LiteralWithLanguageTag {
  type: 'literal'
  value: string
  'xml:lang': string
}
export interface LiteralWithDatatypeIRI {
  type: 'literal'
  value: string
  datatype: string
}
export interface Blank {
  type: 'bnode'
  value: string
}

export type RDFTerm = IRI | Literal | LiteralWithLanguageTag | LiteralWithDatatypeIRI | Blank

export interface Results {
  bindings: { [key: string]: RDFTerm }
}
export interface Head {
  vars?: string[]
  link?: string[]
}
export interface ResultsMemberJSONResponse {
  head: Head
  results: Results
}
export interface BooleanMemberJSONResponse {
  head: Head
  boolean: boolean
}

export type JSONResponse = ResultsMemberJSONResponse | BooleanMemberJSONResponse

// JSONResponse // ToDo: add other formats support: 1. CSV&TSV 2. XML

export interface ResultSolution {
  id: string
  data: JSONResponse
  // data: string // this format is JSON(, CSV&TSV or XML)
}

export const resultAdaptor = createEntityAdapter<ResultSolution>({
  // Keep the "all IDs" array sorted based on id characters
  sortComparer: (alpha, beta) => alpha.id.localeCompare(beta.id)
})

// Entities table ------------------------------
export interface ResultSolutionState {
  result: EntityState<ResultSolution>
}

// --------------------------------------------
const initialState: ResultSolutionState = {
  result: resultAdaptor.getInitialState()
}

const resultSolutionSlice = createSlice({
  name: 'resultSolution',
  initialState,
  reducers: {
    setResult(state, action: PayloadAction<ResultSolution>) {
      resultAdaptor.upsertOne(state.result, action.payload) // non-serializable なオブジェクトには使えない
    }
  }
})

export const { setResult } = resultSolutionSlice.actions

// cf. https://redux-toolkit.js.org/usage/usage-guide#using-selectors-with-createentityadapter
// Rename the exports for readability in component usage
export const {
  selectById: selectResultById,
  selectIds: selectResultIds,
  selectEntities: selectResultEntities,
  selectAll: selectAllResults,
  selectTotal: selectTotalResults
} = resultAdaptor.getSelectors<ResultSolutionState>((state: ResultSolutionState) => state.result)

export default resultSolutionSlice.reducer
