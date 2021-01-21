import { AtTypes, Id } from '~/src/common/types'
import { pattern_comment } from '~/src/common/util/pattern'
import { isAtMark } from '~/src/common/util/validation'
import { editorAdaptor, EditorState } from '~/src/features/editor/editorSlice'
import { FormVariable, FormOption } from '~/src/features/form/formSlice'

interface makeLineProps {
  formVariable: FormVariable | undefined
  formOption?: FormOption
}

interface infuseFormProps extends makeLineProps {
  id: Id
  state: EditorState
}

interface replaceLineProps extends makeLineProps {
  at: AtTypes
  line: string
}

interface replaceQueryProps extends makeLineProps {
  query: string
}

const makeLine = (props: makeLineProps): string => {
  const { formVariable, formOption } = props
  if (formVariable && isAtMark(formVariable.at)) {
    const atType = formVariable.at
    if (formVariable && formOption) {
      // formVariable と formOption が両方とも存在する場合
      return `# @${atType} ${formVariable.name}=${formVariable.elem} #[${formOption.name}]=${formOption.elem}`
    } else if (formVariable && !formOption) {
      // formVariable だけが存在し， formOption は存在しない場合
      return `# @${atType} ${formVariable.name}=${formVariable.elem}`
    }
  }
  // 上記以外
  return ''
}

const replaceLine = (props: replaceLineProps): string => {
  const { at, line, formVariable, formOption } = props
  const stripLine = line.trim() // 行ごとに処理する

  if (!pattern_comment.test(stripLine) || !formVariable) {
    // コメントが無い行，あるいは formVariable が無い場合は，そのまま帰す
    return line
  }

  const firstChar = at[0]
  const insertedAtType = `[${firstChar}${firstChar.toUpperCase()}]${at.slice(1)}`
  if (!formOption) {
    // formVariable だけが存在し， formOption は存在しない場合
    const pattern_def = new RegExp(`^#+\\s*@+${insertedAtType}\\s+${formVariable.name}\\s*=\\s*(.*)`)
    return pattern_def.test(stripLine) ? stripLine.replace(pattern_def, makeLine({ formVariable })) : line
  } else {
    // formVariable と formOption が両方とも存在する場合
    const pattern_opt = new RegExp(
      // `^#+\\s*@+${insertedAtType}\\s+${formVariable.name}\\s*=\\s*(.*)#+\\[${formOption.name}\\]\\s*=\\s*([\\[{]*[^\\]}]+[\\]}]*)`
      `^#+\\s*@+${insertedAtType}\\s+${formVariable.name}\\s*=\\s*.*`
    )
    const output_opt = `# @param ${formVariable.name}=${formVariable.elem} #[${formOption.name}]=${formOption.elem}`

    return pattern_opt.test(stripLine) ? stripLine.replace(pattern_opt, output_opt) : line
  }
}

const replaceQuery = (props: replaceQueryProps): string => {
  const { query, formVariable, formOption } = props
  if (formVariable && isAtMark(formVariable.at)) {
    const at = formVariable.at
    return query
      .split('\n')
      .map((line) => replaceLine({ at, line, formVariable, formOption }))
      .join('\n')
  } else {
    return query
  }
}

export const infuseFormStates = (props: infuseFormProps): void => {
  const { id, state, formVariable, formOption } = props
  const editorState = state.editors.entities[id]
  if (!editorState) {
    const args = {
      id: id,
      query: makeLine({ formVariable, formOption }),
      display: true,
      editable: true
    }
    editorAdaptor.upsertOne(state.editors, args)
  } else {
    const { query, display, editable } = editorState
    // query の有無で分岐
    const args = {
      id: id,
      query: query ? replaceQuery({ query, formVariable, formOption }) : makeLine({ formVariable, formOption }),
      display: display,
      editable: editable
    }
    editorAdaptor.upsertOne(state.editors, args)
  }
}
