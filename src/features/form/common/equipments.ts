/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const jsonParse = (value: any): Record<string, unknown> => {
  try {
    return JSON.parse(value)
  } catch (error) {
    // TODO: Error 処理をどうする
    if (typeof value === 'string') {
      console.warn(`failed JSONparse: value: ( ${value} ) is string, but NOT JSON format.`)
      return { value: value }
    }
    console.error('JSON parse error is occuerd! Please input valid string.', error)
    return {}
  }
}

export const expectArrayNorString = (value: string) => {
  const elem = jsonParse(value)
  return Array.isArray(elem) ? elem : elem.value
}
