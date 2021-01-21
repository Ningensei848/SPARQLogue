import { FormVariable } from '../../formSlice'
import { StylingProps } from '../../types'

interface endpointEditableProps {
  formVarState: FormVariable
  styleProps?: StylingProps
}

export const EndpointOnEditableForm: React.FC<endpointEditableProps> = (props) => {
  const { at, elem, id, name, parent_id } = props.formVarState
  
  // const styles = props.styleProps

  return <></>
}
