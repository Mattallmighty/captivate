import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './GlobalStyle'
import App from './App'
import * as themes from './theme'
import { Provider } from 'react-redux'
import { store, getCleanReduxState } from './redux/store'
import { setDmx, setMidi, setSaving, setLoading } from './redux/guiSlice'
import {
  realtimeStore,
  realtimeContext,
  initRealtimeState,
  update as updateRealtimeStore,
} from './redux/realtimeStore'
import { ipc_setup, send_control_state } from './ipcHandler'
import { ThemeProvider as MuiThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material/styles'
import { autoSave } from './autosave'
import { getUndoGroup, undoAction, redoAction } from './controls/UndoRedo'
import './react_error_logging'

const theme = themes.dark()
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})
let _frequentlyUpdatedRealtimeState = initRealtimeState()

autoSave(store)

ipc_setup({
  on_dmx_connection_update: (payload) => {
    store.dispatch(setDmx(payload))
  },
  on_midi_connection_update: (payload) => {
    store.dispatch(setMidi(payload))
  },
  on_time_state: (newRealtimeState) => {
    _frequentlyUpdatedRealtimeState = newRealtimeState
  },
  on_dispatch: (action) => {
    store.dispatch(action)
  },
  on_main_command: (command) => {
    if (command.type === 'undo') {
      const group = getUndoGroup(store.getState())
      if (group !== null) {
        store.dispatch(undoAction(group))
      }
    } else if (command.type === 'redo') {
      const group = getUndoGroup(store.getState())
      if (group !== null) {
        store.dispatch(redoAction(group))
      }
    } else if (command.type === 'load') {
      store.dispatch(setLoading(null))
    } else if (command.type === 'save') {
      store.dispatch(setSaving(true))
    }
  },
})

function animateRealtimeState() {
  realtimeStore.dispatch(updateRealtimeStore(_frequentlyUpdatedRealtimeState))
  requestAnimationFrame(animateRealtimeState)
}

animateRealtimeState()

send_control_state(getCleanReduxState(store.getState()))

store.subscribe(() => send_control_state(getCleanReduxState(store.getState())))

render(
  <Provider store={store}>
    <Provider store={realtimeStore} context={realtimeContext}>
      <ThemeProvider theme={theme}>
        <MuiThemeProvider theme={muiTheme}>
          <GlobalStyle />
          <App />
        </MuiThemeProvider>
      </ThemeProvider>
    </Provider>
  </Provider>,
  document.getElementById('root')
)
