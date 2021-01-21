import { combineReducers } from '@reduxjs/toolkit'

import EditorReducer from '~/src/features/editor/editorSlice'
import FormReducer from '~/src/features/form/formSlice'
import ResultReducer from '~/src/features/resultSolution/resultSolutionSlice'

const rootReducer = combineReducers({
  editor: EditorReducer,
  results: ResultReducer,
  forms: FormReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
