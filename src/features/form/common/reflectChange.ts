import debounce from 'lodash.debounce'
import { batch as batchDispatch } from 'react-redux'

import { AtTypes, Id } from '~/src/common/types'
import { setFormVariable, setFormOption } from '~/src/features/form/formSlice'
import { FormKeyValue } from '~/src/features/form/types'
import { AppDispatch } from '~/src/store'

interface reflectChangeProps {
  id: Id
  at: AtTypes
  variable: FormKeyValue
  option?: FormKeyValue
  dispatch: AppDispatch
  parent_id: Id
}

// form.LocalState の変更を受け取って， global な FormVariable / FormOption を更新する． ----------------------------------
const dispatchLocalFormChanges = (props: reflectChangeProps): void => {
  const { id, at, variable, option, dispatch, parent_id } = props

  batchDispatch(() => {
    dispatch(setFormVariable({ id: id, at: at, name: variable.name, elem: variable.elem, parent_id: parent_id }))
    if (option) {
      dispatch(setFormOption({ id: id, at: at, name: option.name, elem: option.elem, parent_id: parent_id }))
    }
  })
}
// ---------------------------------------------------------------------------------------------------------------------

// form.LocalState の変更を受け取って， dispatchLocalFormChanges に引き渡す． ---------------------------------------------
const delayMillisecond = 700 // delay time
export const reflectChanges = debounce(
  async (props: reflectChangeProps) => dispatchLocalFormChanges(props),
  delayMillisecond
)
// ---------------------------------------------------------------------------------------------------------------------
