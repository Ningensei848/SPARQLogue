import { atMarkList } from '~/src/common/util/nameList'
import { FormNameList } from '~/src/features/form/types'

export type Id = string | number

export type AtTypes = typeof atMarkList[number]

export interface AtMark {
  at: AtTypes //'param' | 'endpoint' | 'proxy' | 'author' | 'title'
  var_name: string
  var_elem: string
  opt_name?: FormNameList
  opt_elem?: string
  parent_id: Id
}