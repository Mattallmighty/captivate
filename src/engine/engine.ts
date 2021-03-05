import * as graphicsEngine from "./graphicsEngine"
import * as dmxEngine from './dmxEngine'
import * as keyboardManager from './keyboardManager'
import { autoSave } from '../util/saveload_renderer'
import { setActiveSceneIndex } from '../redux/scenesSlice'
import { ReduxStore } from '../redux/store'
import { RealtimeStore, update, TimeState } from '../redux/realtimeStore'
const NodeLink = window.require('node-link')
import { modulateParams } from './modulationEngine'

let _lastFrameTime = 0
let _engineTime = 0
let _initTime = 0
let _store: ReduxStore
let _realtimeStore: RealtimeStore
let _nodeLink: typeof NodeLink

export function init(store: ReduxStore, realtimeStore: RealtimeStore) {
  _store = store
  _realtimeStore = realtimeStore
  _nodeLink = new NodeLink()
  _initTime = Date.now()
  autoSave(_store)
  graphicsEngine.init()
  dmxEngine.init(store, realtimeStore)
  keyboardManager.init(store)

  requestAnimationFrame(engineUpdate)
}

export function incrementTempo(amount: number) {
  if (_nodeLink) _nodeLink.setTempo(_realtimeStore.getState().time.bpm + amount)
}

export function setLinkEnabled(isEnabled: boolean) {
  if (_nodeLink) _nodeLink.enable(isEnabled)
}

export function visualizerResize() {
  graphicsEngine.resize()
}

export function visualizerSetElement(domRef: any) {
  graphicsEngine.setDomElement(domRef)
}

function engineUpdate(currentTime: number) {
  requestAnimationFrame(engineUpdate)

  const dt = currentTime - _lastFrameTime

  if (dt < 10) return

  _lastFrameTime = currentTime
  _engineTime += dt

  const timeState: TimeState = _nodeLink.getSessionInfoCurrent()

  timeState.dt = dt
  timeState.quantum = 4.0

  const state = _store.getState()
  
  if (state.scenes.active && state.scenes.byId[state.scenes.active]) {
    const scene = state.scenes.byId[state.scenes.active]
    
    const outputParams = modulateParams(timeState.beats, scene)
  
    const newRealtimeState = {
      time: timeState,
      outputParams: outputParams
    }
  
    _realtimeStore.dispatch(update(newRealtimeState))

    handleAutoScene()
  
    graphicsEngine.update(newRealtimeState);
  }
}

function handleAutoScene() {
  const state = _store.getState().scenes.auto

  if (state.enabled && isNewScene(_realtimeStore.getState().time, state.period)) {
    setRandomScene(state.bombacity)
  }
}

function isNewScene(ts: TimeState, autoScenePeriod: number): boolean {
  const beatsPerScene = ts.quantum * autoScenePeriod
  const dtMinutes = ts.dt / 60000
  const dtBeats = dtMinutes * ts.bpm
  return (ts.beats % beatsPerScene) < dtBeats
}

function setRandomScene(bombacity: number) {
  const sceneIDs = _store.getState().scenes.ids
  const randomIndex = Math.floor(Math.random() * sceneIDs.length)
  _store.dispatch(setActiveSceneIndex(randomIndex))
}
