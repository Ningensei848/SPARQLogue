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
