import { useSelector } from 'react-redux'

import { selectFormById, selectFormVarById } from '~/src/features/form/formSlice'
import { RootState } from '~/src/store/rootReducer'

interface generatedFormProps {
  id: string
  className?: string
}

const GenerateForm: React.FC<generatedFormProps> = (props) => {
  const formVarState = useSelector((state: RootState) => selectFormVarById(state.forms, props.id))
  // どの＠変数であっても，共通してformVariable状態に収める方針
  // formVariable.atでどのフォーム型にするか決定
  if (!formVarState) {
    // Form.vars にはidがあるのに，FormVariable.idがないのは不整合
    // 何らかのエラーを返すべき
    return null
  }

  const type = formVarState.at

  if (type == 'param') {
    // param
    return <></>
  } else if (type == 'endpoint') {
    // endpoint
    return <></>
  } else if (type == 'proxy') {
    // proxy
    return <></>
  } else if (type == 'author') {
    // author
    return <></>
  } else {
    // title
    return <></>
  }
}

export interface SearchFormProps {
  id: string
  className?: string
}
export const SearchForm: React.FC<SearchFormProps> = (props) => {
  const formState = useSelector((state: RootState) => selectFormById(state.forms, props.id))

  const FormVariableIdList = formState ? formState.vars : []

  const forms = FormVariableIdList.map((var_id) => GenerateForm({ id: var_id, className: props.className }))
  // forms が空ならnullを，そうでなければ生成したフォーム群を返す
  return forms.length ? <>{forms}</> : null
}
