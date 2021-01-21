/* eslint-disable @typescript-eslint/no-explicit-any */
import { Id, AtTypes } from '~/src/common/types'
import { formModeList, formNameList } from '~/src/common/util/nameList'

export interface FormKeyValue {
  name: string
  elem: string | string[]
}

// cf. TypeScript array to string literal type https://stackoverflow.com/questions/45251664/typescript-derive-union-type-from-tuple-array-values
export type FormMode = typeof formModeList[number]
export type FormNameList = typeof formNameList[number]

export interface SearchUpdateResult {
  var_update: {
    id: Id
    changes: FormKeyValue // { name: string; elem: string | string[] }
  } | null
  opt_update: {
    id: Id
    changes: FormKeyValue // { name: string; elem: string | string[] }
  } | null
}

export interface FormChildIds {
  varIdList: Array<string | number>
  optIdList: Array<string | number>
}

export type FormElement = React.ReactElement<any, any> | null

interface StylingTextInput {
  [key: string]: any
}
interface StylingTextArea {
  [key: string]: any
}
interface StylingToggleSwitch {
  [key: string]: any
}
interface StylingRangeSlider {
  [key: string]: any
}
interface StylingSelectBox {
  [key: string]: any
}
interface StylingRadioButton {
  [key: string]: any
}
interface StylingTimePicker {
  [key: string]: any
}
interface StylingDatePicker {
  [key: string]: any
}
interface StylingCheckBox {
  [key: string]: any
}

export interface StylingProps {
  checkBox?: StylingCheckBox
  textArea?: StylingTextArea
  selectBox?: StylingSelectBox
  textInput?: StylingTextInput | string
  datePicker?: StylingDatePicker
  timePicker?: StylingTimePicker
  radioButton?: StylingRadioButton
  rangeSlider?: StylingRangeSlider
  toggleSwitch?: StylingToggleSwitch
}

export interface GeneratedHTMLProps {
  id: Id
  at: AtTypes // 'param' | 'endpoint' | 'proxy' | 'author' | 'title'
  formVariable: FormKeyValue
  formOption?: FormKeyValue
  parent_id: Id
  styleProps?: StylingProps
}
