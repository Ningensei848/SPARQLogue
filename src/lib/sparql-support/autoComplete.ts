import CodeMirror from 'codemirror'

// CodeMirror.defineOption('sparqlSupportAutoComp', false, function (cm: CodeMirror.Editor, id: string) {
//   let data = cm.state.selectionPointer

//   if (id) {
//     data = cm.state.selectionPointer = {
//       value: typeof id == 'string' ? id : 'default',
//       keydown: (e) => {
//         keyDown(cm, e, id)
//       },
//       keyup: (e) => {
//         keyUp(cm, e, id)
//       }
//     }
//     CodeMirror.on(cm.getWrapperElement(), 'keydown', data.keydown)
//     CodeMirror.on(cm.getWrapperElement(), 'keyup', data.keyup)

//     initDiv(cm, id)
//   }
// })
