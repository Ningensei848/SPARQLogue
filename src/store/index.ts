// cf. https://redux-toolkit.js.org/tutorials/advanced-tutorial#setting-up-the-redux-store
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer
})

// Next.jsなので不要？ cf. https://nextjs.org/docs/basic-features/fast-refresh
// if (process.env.NODE_ENV === 'development' && module.hot) {
//   module.hot.accept('./rootReducer', () => {
//     const newRootReducer = require('./rootReducer').default
//     store.replaceReducer(newRootReducer)
//   })
// }

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store
