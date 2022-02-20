import * as THREE from 'three'
import { RealtimeState } from '../../redux/realtimeStore'
import { CleanReduxState } from '../../redux/store'
import VisualizerBase, { UpdateResource } from './VisualizerBase'
import { VisualizerConfig, initVisualizerConfig } from './VisualizerConfig'
import equal from 'deep-equal'
import Spheres from './Spheres'
import TextSpin from './TextSpin'
import Cubes from './Cubes'
import CubeSphere from './CubeSphere'
import TextParticles from './TextParticles'
import LocalMedia from './LocalMedia'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import effectCache from './effectCache'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectsConfig, initEffectsConfig } from './EffectTypes'

export interface VisualizerResource {
  rt: RealtimeState
  state: CleanReduxState
}

export function constructVisualizer(config: VisualizerConfig): VisualizerBase {
  if (config.type === 'CubeSphere') return new CubeSphere()
  if (config.type === 'Cubes') return new Cubes()
  if (config.type === 'Spheres') return new Spheres()
  if (config.type === 'TextParticles') return new TextParticles(config)
  if (config.type === 'TextSpin') return new TextSpin()
  if (config.type === 'LocalMedia') return new LocalMedia(config)
  return new Spheres()
}

export default class VisualizerManager {
  private renderer: THREE.WebGLRenderer // The renderer is the only THREE class that actually takes a while to instantiate (>3ms)
  private active: VisualizerBase
  private config: VisualizerConfig
  private effectsConfig: EffectsConfig
  private width = 0
  private height = 0
  private updateResource: UpdateResource | null = null
  private effectComposer: EffectComposer

  constructor() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.effectComposer = new EffectComposer(this.renderer)
    this.config = initVisualizerConfig('LocalMedia')
    this.effectsConfig = initEffectsConfig()
    this.active = constructVisualizer(this.config)
  }

  getElement() {
    return this.renderer.domElement
  }

  update(dt: number, res: VisualizerResource) {
    this.renderer.clear()
    const control = res.state.control
    const visualScene = control.visual.byId[control.visual.active]
    const config = visualScene?.config || {
      type: 'Cubes',
    }
    const effectsConfig = visualScene?.effectsConfig || []
    const stuff = {
      params: res.rt.outputParams,
      time: res.rt.time,
      scene: control.light.byId[control.light.active],
      master: control.master,
    }
    if (this.updateResource === null) {
      this.updateResource = new UpdateResource(stuff)
    } else {
      this.updateResource.update(stuff)
    }
    if (
      !equal(config, this.config) ||
      !equal(effectsConfig, this.effectsConfig)
    ) {
      this.config = config
      this.active.release()
      this.active = constructVisualizer(this.config)
      this.active.resize(this.width, this.height)
      this.active.update(dt, this.updateResource)
      this.effectComposer.reset()
      this.effectComposer.addPass(
        new RenderPass(...this.active.getRenderInputs())
      )

      effectsConfig.forEach((effect) => {
        this.effectComposer.addPass(effectCache[effect.type])
      })
    } else {
      this.active.update(dt, this.updateResource)
    }
    this.effectComposer.render()
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.renderer.clear()
    this.active.resize(width, height)
    this.renderer.setSize(width, height)

    this.effectComposer.reset()
    this.effectComposer.addPass(
      new RenderPass(...this.active.getRenderInputs())
    )

    this.effectsConfig.forEach((effect) => {
      this.effectComposer.addPass(effectCache[effect.type])
    })
  }
}
