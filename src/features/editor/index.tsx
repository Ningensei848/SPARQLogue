import CodeMirror from 'codemirror'
import debounce from 'lodash.debounce'
import React from 'react'
import { Controlled as ReactCodeMirror } from 'react-codemirror2'
import { useSelector, shallowEqual } from 'react-redux'
import d3sparql from 'src/lib/d3sparql'
import defineSparqlMode from 'src/lib/defineSparqlMode'
import styled from 'styled-components'

import { useExtractAtMarks } from '~/src/features/editor/common/extractAtMarks'
import { selectEditorById, setEditor } from '~/src/features/editor/editorSlice'
import { setResult } from '~/src/features/resultSolution/resultSolutionSlice'
import { useAppDispatch } from '~/src/store'
import { RootState } from '~/src/store/rootReducer'
import { makeAsyncQueryList } from './common/asyncQuery'

const globalEditorConfig: CodeMirror.EditorConfiguration = {}

const tryQueryingAsync = async (sparql: string): Promise<any> => {
  try {
    const data = await d3sparql.query(sparql, 'https://dbpedia.org/sparql')
    return data
  } catch (err) {
    console.error(err)
    return err
  }
}

interface EditorProps {
  id?: string
  query?: string
  endpoint?: string
  className?: string
  config?: CodeMirror.EditorConfiguration // 後でextendして設定内容を追加
}

const RawEditor: React.FC<EditorProps> = (props) => {
  // TODO: globalEditorConfig, endpoint, queryConfig を活用して，tryQueryingAsyncにクエリの設定を流し込めるようにする．
  const { id, query, endpoint, className, config } = props

  const dispatch = useAppDispatch()

  const inheritedValue = query ? query : '' // props.query OR blank
  // editorId is inherited from props.id OR set generated random ID
  // TODO: ユーザがすきなID を入力できるようにする -------------------------------------------------------------------
  // updateFormId みたいな reducer を editorState で定義する => form とかから実行させる ------------------------------
  const editorId = id ? id : Date.now().toString() + Math.floor(Math.random() * 100)
  const editorState = useSelector((state: RootState) => selectEditorById(state.editor, editorId), shallowEqual)
  // ---------------------------------------------------------------------------------------------------------------
  // `value` はエディタのローカルな state , `currentEditorValue` は エディタのグローバルな 疑似state ------------------
  const [currentEditorValue, setCurrentValue] = React.useState(inheritedValue) // Editor.LocalState として保持しておく
  // ---------------------------------------------------------------------------------------------------------------
  // 1. formState をdispatch (editor.localState の変化は無視する) ---------------------------------------------------
  const atMarkProps = {
    parent_id: editorId,
    editorState: editorState,
    setLocal: setCurrentValue
  } // editorStateの状態に依存して，formStateを変化させる
  useExtractAtMarks(atMarkProps)
  // ---------------------------------------------------------------------------------------------------------------
  // 2. editor.LocalStateをdispatch (editor.localState の変化は無視する) --------------------------------------------
  // editorStateの状態に依存して，editor.localStateを変化させる
  React.useEffect(() => {
    setCurrentValue(editorState ? editorState.query : inheritedValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState?.query])

  // ---------------------------------------------------------------------------------------------------------------
  // 3. editorState を debounceDispatch (editor.LocalStateに依存) --------------------------------------------------
  const delayMillisecond = 800 // deley time
  const getResult = debounce(async (localCurrentValue) => {
    dispatch(setEditor({ id: editorId, query: localCurrentValue }))
    // １．endpointを掘る２．複数箇所ある場合，複数に分けてdispatchを更新
    // promise.all() をつかう
    const args = {
      id: editorId,
      query: localCurrentValue,
      dispatcher: dispatch
    }
    // dispatch(setResult({ id: editorId, data: await tryQueryingAsync(localCurrentValue) }))
    await Promise.all(makeAsyncQueryList(args))
  }, delayMillisecond)
  // getResultは描画ごとに変更されてしまうため第二引数から除外する（？）
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceQuery = React.useCallback(getResult, [])
  // ---------------------------------------------------------------------------------------------------------------

  // form initialization -------------------------------------------------------------------------------------------
  if (!editorState) {
    console.log(`[@editor.initialize] Initial query:\n${query}`)
    dispatch(setEditor({ id: editorId, query: inheritedValue }))
    return null
  }
  // ---------------------------------------------------------------------------------------------------------------
  // Render --------------------------------------------------------------------------------------------------------
  return (
    <ReactCodeMirror
      value={currentEditorValue}
      options={{
        mode: 'application/sparql-query',
        lineNumbers: true,
        viewportMargin: Infinity
      }}
      className={className}
      defineMode={{
        name: 'application/sparql-query',
        fn: () => defineSparqlMode(globalEditorConfig)
      }}
      onBeforeChange={(_e, _d, value) => {
        setCurrentValue(value)
      }}
      onChange={(_e, _d, value) => {
        debounceQuery(value)
      }}
    />
  )
} // ---------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------

// caution! : React.FC内部でstyled-component は使えない -------------------------------------------------------------
const Editor = styled(RawEditor)`
  font-size: 0.9rem;
`
// -----------------------------------------------------------------------------------------------------------------
// finally, Export Component. --------------------------------------------------------------------------------------
export default Editor
