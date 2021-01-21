import { useEffect } from 'react'

import { extractAtMarks } from '~/src/features/editor/common/extractProcess'
import { Editor } from '~/src/features/editor/editorSlice'
import { removeForm, setForm } from '~/src/features/form/formSlice'
import { useAppDispatch } from '~/src/store'

interface extractAtMarkProps {
  parent_id: string | number
  editorState: Editor | undefined
}

export const useExtractAtMarks = (props: extractAtMarkProps): void => {
  const { parent_id, editorState } = props

  const dispatch = useAppDispatch()

  useEffect(() => {
    // atMarks が 空配列だった場合，Form を削除する ----------------------
    const atMarks = extractAtMarks(parent_id, editorState ? editorState.query : '')
    if (!atMarks.length) {
      dispatch(removeForm(parent_id)) // FormVariable, FormOption もろとも formState を削除
    } else {
      dispatch(setForm({ parent_id: parent_id, atMarks: atMarks }))
    }

    // for debug
    console.log(`[@editor] current query is :\n${editorState?.query}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState])
}
