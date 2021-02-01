import { configureStore } from '@reduxjs/toolkit'
import paramsReducer from './paramsSlice'
import connectionsReducer from './connectionsSlice'
import modulatorsReducer from './modulatorsSlice'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import dmxSlice from './dmxSlice'

export const store = configureStore({
  reducer: {
    baseParams: paramsReducer,
    connections: connectionsReducer,
    dmx: dmxSlice,
    modulators: modulatorsReducer
    // fixtures: 
    // universe: 
  }
})

export type ReduxStore = typeof store
export type ReduxState = ReturnType<typeof store.getState>
export type ReduxDispatch = typeof store.dispatch
export const useTypedSelector: TypedUseSelectorHook<ReduxState> = useSelector