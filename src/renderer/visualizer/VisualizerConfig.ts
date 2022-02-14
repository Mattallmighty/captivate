import { SpheresConfig, initSpheresConfig } from './Spheres'
import { TextSpinConfig, initTextSpinConfig } from './TextSpinConfig'
import { CubesConfig, initCubesConfig } from './Cubes'
import { CubeSphereConfig, initCubeSphereConfig } from './CubeSphere'
import {
  TextParticlesConfig,
  initTextParticlesConfig,
} from './TextParticlesConfig'
import { LocalMediaConfig, initLocalMediaConfig } from './LocalMedia'

export type VisualizerConfig =
  | SpheresConfig
  | TextSpinConfig
  | CubesConfig
  | CubeSphereConfig
  | TextParticlesConfig
  | LocalMediaConfig

export type VisualizerType = VisualizerConfig['type']

export const visualizerTypeList: VisualizerType[] = [
  'CubeSphere',
  'Cubes',
  'Spheres',
  'TextParticles',
  'TextSpin',
  'LocalMedia',
]

export function initVisualizerConfig(type: VisualizerType): VisualizerConfig {
  if (type === 'CubeSphere') return initCubeSphereConfig()
  if (type === 'Cubes') return initCubesConfig()
  if (type === 'Spheres') return initSpheresConfig()
  if (type === 'TextParticles') return initTextParticlesConfig()
  if (type === 'TextSpin') return initTextSpinConfig()
  if (type === 'LocalMedia') return initLocalMediaConfig()
  return initCubesConfig()
}
