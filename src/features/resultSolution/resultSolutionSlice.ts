// Creating the Initial State Slices cf. https://redux-toolkit.js.org/tutorials/advanced-tutorial#creating-the-initial-state-slices
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'
import { Id } from '~/src/common/types'
const merge = require('deepmerge')

// -------------------------------------------
// cf. ja-JP: http://www.asahi-net.or.jp/~ax2s-kmtn/internet/rdf/REC-sparql11-results-json-20130321.html
// cf. org: https://www.w3.org/TR/2013/REC-sparql11-results-json-20130321/

export type IRI = {
  type: 'uri'
  value: string
}
export type Literal = {
  type: 'literal'
  value: string
}
export type LiteralWithLanguageTag = {
  type: 'literal'
  value: string
  'xml:lang': string
}
export type LiteralWithDatatypeIRI = {
  type: 'literal'
  value: string
  datatype: string
}
export type Blank = {
  type: 'bnode'
  value: string
}

export type RDFTerm = IRI | Literal | LiteralWithLanguageTag | LiteralWithDatatypeIRI | Blank

export interface Results {
  bindings: Array<{ [key: string]: RDFTerm }>
}
export type Head = {
  vars?: string[]
  link?: string[]
}
export interface ResultsResponse {
  head: Head
  results: Results
}
export interface BooleanResponse {
  head: Head
  boolean: boolean
}

type Without<FirstType, SecondType> = { [KeyType in Exclude<keyof FirstType, keyof SecondType>]?: never }

// eslint-disable-next-line @typescript-eslint/ban-types
export type MergeExclusive<FirstType, SecondType> = FirstType | SecondType extends object
  ? (Without<FirstType, SecondType> & SecondType) | (Without<SecondType, FirstType> & FirstType)
  : FirstType | SecondType

export type QueryResponse = MergeExclusive<ResultsResponse, BooleanResponse>
// JSONResponse // ToDo: add other formats support: 1. CSV&TSV 2. XML

type QueryPromise =
  | (Without<ResultsResponse, BooleanResponse> & BooleanResponse)
  | (Without<BooleanResponse, ResultsResponse> & ResultsResponse)
  | undefined

export interface ResultSolution {
  id: string | number
  data: QueryResponse
  // data: string // this format is JSON(, CSV&TSV or XML)
}

export const resultAdaptor = createEntityAdapter<ResultSolution>({
  // Keep the "all IDs" array sorted based on id characters
  sortComparer: (alpha, beta) => {
    const [idAlpha, idBeta] = [alpha.id.toString(), beta.id.toString()]
    return idAlpha.localeCompare(idBeta)
  }
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
    },
    mergeResult(state, action: PayloadAction<{ id: Id; data: QueryPromise }>) {
      const { id, data } = action.payload
      const pre = state.result.entities[id]?.data
      if (data) {
        console.log(`post is ${JSON.stringify(data, null, 2)}`)
        const mergedResult = merge(pre ? pre : {}, data, {
          arrayMerge: (d: any[], s: any[], _o: never) => [...new Set(merge(d, s))]
        })
        resultAdaptor.upsertOne(state.result, { id: id, data: mergedResult })
      }
    }
  }
})

export const { setResult, mergeResult } = resultSolutionSlice.actions

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
