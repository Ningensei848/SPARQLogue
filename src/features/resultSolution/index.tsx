import { EditorConfiguration } from 'codemirror'
import React from 'react'
import { Controlled as ReactCodeMirror } from 'react-codemirror2'
import { useSelector } from 'react-redux'
import { selectResultById, setResult } from 'src/features/resultSolution/resultSolutionSlice'
import styled from 'styled-components'

import { useAppDispatch } from '~/src/store'
import { RootState } from '~/src/store/rootReducer'
import { HTMLTable } from './htmlTable'

const Button = styled.button`
  width: 100%;
  color: #00662d;
  font-size: 1.5rem;
  padding: 0.25rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.7rem;
  border: 0.2rem solid #00662d;
  border-radius: 0.3rem;
  text-align: center;
`

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
  const [viewMode, setViewMode] = React.useState('json')
  onBrowserLoadOnce(modeLoaded, setModeLoaded)

  const result = useSelector((state: RootState) => selectResultById(state.results, props.id))

  const options: EditorConfiguration = {
    readOnly: true, // <--------- Do not Edit
    theme: 'material',
    mode: 'application/ld+json',
    lineNumbers: true,
    viewportMargin: Infinity
  }
  if (viewMode == 'json' && result?.data) {
    return (
      <>
        <Button onClick={() => setViewMode('table')}>Switch View</Button>
        <ReactCodeMirror
          value={JSON.stringify(result, null, 2)}
          className={props.className}
          options={options}
          onBeforeChange={(_e, _d, value) => {
            // setCurrentValue(value)
            dispatch(setResult(JSON.parse(value)))
          }}
        />
      </>
    )
  } else if (viewMode == 'table' && result?.data) {
    return (
      <>
        <Button onClick={() => setViewMode('json')}>Switch View</Button>
        <HTMLTable {...result.data} />
      </>
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
