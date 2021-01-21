// Creating the Initial State Slices cf. https://redux-toolkit.js.org/tutorials/advanced-tutorial#creating-the-initial-state-slices
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit'

import { FormOption, FormVariable } from '../form/formSlice'

import { infuseFormStates } from './common/reduceFunctions'

import { Id } from '~/src/common/types'

// Editor -------------------------------------
export interface Editor {
  id: Id
  // instance: CodeMirror.Editor // instance は持たせてはいけない `serializable`な値である必要がある
  query: string // Caution!! => editorState で持つのは Query, editor.localState で持つのは Value
  display: boolean
  editable: boolean
}

export const editorAdaptor = createEntityAdapter<Editor>({
  // Keep the "all IDs" array sorted based on id characters
  sortComparer: (alpha, beta) => {
    const [idAlpha, idBeta] = [alpha.id.toString(), beta.id.toString()]
    return idAlpha.localeCompare(idBeta)
  }
})

// Entities table ------------------------------
export interface EditorState {
  editors: EntityState<Editor>
}

// --------------------------------------------
const initialState: EditorState = {
  editors: editorAdaptor.getInitialState()
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Editor を登録する関数
    setEditor(state, action: PayloadAction<{ id: string | number; query: string }>) {
      const { id, query } = action.payload
      const editorState = state.editors.entities[id]
      const [display, editable] = editorState ? [editorState.display, editorState.editable] : [true, true]
      editorAdaptor.upsertOne(state.editors, { id: id, query: query, display: display, editable: editable })
    },
    // FormVariable / FormOption を引数にとって， AtMark 部分を置換する関数 FormOption, FormVariabl
    replaceEditor(
      state,
      action: PayloadAction<{ id: Id; formVariable: FormVariable | undefined; formOption?: FormOption }>
    ) {
      infuseFormStates({ state: state, ...action.payload })
    },
    // Editor を削除する関数
    removeEditor(state, action: PayloadAction<string>) {
      editorAdaptor.removeOne(state.editors, action.payload)
    }
  }
})

export const { setEditor, replaceEditor, removeEditor } = editorSlice.actions

// cf. https://redux-toolkit.js.org/usage/usage-guide#using-selectors-with-createentityadapter
// Rename the exports for readability in component usage
export const {
  selectById: selectEditorById,
  selectIds: selectEditorIds,
  selectEntities: selectEditorEntities,
  selectAll: selectAllEditors,
  selectTotal: selectTotalEditors
} = editorAdaptor.getSelectors<EditorState>((state: EditorState) => state.editors)

export default editorSlice.reducer
