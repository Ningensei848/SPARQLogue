import { EditorConfiguration } from 'codemirror'
import React from 'react'
import { Controlled as ReactCodeMirror } from 'react-codemirror2'
import { useSelector } from 'react-redux'
import { selectResultById, setResult } from 'src/features/resultSolution/resultSolutionSlice'
import styled from 'styled-components'

import { useAppDispatch } from '~/src/store'
import { RootState } from '~/src/store/rootReducer'

const onBrowserLoadOnce = (
  loaded: boolean,
  callback: { (value: React.SetStateAction<boolean>): void; (arg: boolean): void }
): void => {
  // cf. https://jaketrent.com/post/render-codemirror-on-server/
  // if 1. not loaded yet, 2. window is defined and 3. window.navigator is defined,
  // then we will load scripts
  if (!loaded && typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    require('codemirror/mode/javascript/javascript')
    callback(true)
  }
}

export interface ResultSolutionProps {
  id: string
  className?: string
}

const RawResultSolution: React.FC<ResultSolutionProps> = (props) => {
  const dispatch = useAppDispatch()
  const [modeLoaded, setModeLoaded] = React.useState(false)
  onBrowserLoadOnce(modeLoaded, setModeLoaded)

  const result = useSelector((state: RootState) => selectResultById(state.results, props.id))

  const options: EditorConfiguration = {
    readOnly: true, // <--------- Do not Edit
    theme: 'material',
    mode: 'application/ld+json',
    lineNumbers: true,
    viewportMargin: Infinity
  }

  if (result) {
    return (
      <ReactCodeMirror
        value={JSON.stringify(result, null, 2)}
        className={props.className}
        options={options}
        onBeforeChange={(_e, _d, value) => {
          // setCurrentValue(value)
          dispatch(setResult(JSON.parse(value)))
        }}
      />
    )
  } else {
    return null
  }
}

// caution! : React.FC内部でstyled-component は使えない
const ResultSolution = styled(RawResultSolution)`
  font-size: 0.8rem;
`

export default ResultSolution
