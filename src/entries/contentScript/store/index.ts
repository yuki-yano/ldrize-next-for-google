import * as redux from '@reduxjs/toolkit'
import { ldrizeSlice } from './ldrize'

const { configureStore } = redux

export const store = configureStore({
  reducer: {
    ldrize: ldrizeSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

type TypedDispatch = redux.ThunkDispatch<ReturnType<typeof store.getState>, unknown, redux.AnyAction>

const dispatch = store.dispatch as TypedDispatch
export { dispatch }
