import { LayerConfig, initLayerConfig } from '../layers/LayerConfig'

export interface AdaptiveToneMappingConfig {
  type: 'AdaptiveToneMapping'
}
export function initAdaptiveToneMappingConfig(): AdaptiveToneMappingConfig {
  return { type: 'AdaptiveToneMapping' }
}
export interface AfterImageConfig {
  type: 'AfterImage'
}
export function initAfterImageConfig(): AfterImageConfig {
  return { type: 'AfterImage' }
}
export interface DotScreenConfig {
  type: 'DotScreen'
}
export function initDotScreenConfig(): DotScreenConfig {
  return { type: 'DotScreen' }
}
export interface FilmConfig {
  type: 'Film'
  noiseIntensity: number
  scanlinesIntensity: number
  scanlinesCount: number
  grayscale: number
}
export function initFilmConfig(): FilmConfig {
  return {
    type: 'Film',
    noiseIntensity: 0.5,
    scanlinesIntensity: 0.5,
    scanlinesCount: 100,
    grayscale: 1.0,
  }
}
export interface GlitchConfig {
  type: 'Glitch'
}
export function initGlitchConfig(): GlitchConfig {
  return { type: 'Glitch' }
}
export interface HalfToneConfig {
  type: 'HalfTone'
}
export function initHalfToneConfig(): HalfToneConfig {
  return { type: 'HalfTone' }
}
export interface LightSyncConfig {
  type: 'LightSync'
  obeyColor: number
  obeyBrightness: boolean
  obeyMaster: boolean
  obeyPosition: boolean
  obeyStrobe: boolean
  obeyEpicness: boolean
}
export function initLightSyncConfig(): LightSyncConfig {
  return {
    type: 'LightSync',
    obeyColor: 1.0,
    obeyBrightness: true,
    obeyMaster: true,
    obeyPosition: true,
    obeyStrobe: true,
    obeyEpicness: true,
  }
}
export interface RenderLayerConfig {
  type: 'RenderLayer'
  layerConfig: LayerConfig
}
export function initRenderLayerConfig(): RenderLayerConfig {
  return {
    type: 'RenderLayer',
    layerConfig: initLayerConfig('Cubes'),
  }
}
export interface UnrealBloomConfig {
  type: 'UnrealBloom'
}

export function initUnrealBloomConfig(): UnrealBloomConfig {
  return { type: 'UnrealBloom' }
}

export type EffectConfig =
  | AdaptiveToneMappingConfig
  | AfterImageConfig
  | DotScreenConfig
  | FilmConfig
  | GlitchConfig
  | HalfToneConfig
  | LightSyncConfig
  | RenderLayerConfig
  | UnrealBloomConfig

export type EffectType = EffectConfig['type']

export type EffectsConfig = EffectConfig[]

export function initEffectsConfig(): EffectsConfig {
  return []
}

export function initEffectConfig(type: EffectConfig['type']): EffectConfig {
  switch (type) {
    case 'AdaptiveToneMapping':
      return initAdaptiveToneMappingConfig()
    case 'AfterImage':
      return initAfterImageConfig()
    case 'DotScreen':
      return initDotScreenConfig()
    case 'Film':
      return initFilmConfig()
    case 'Glitch':
      return initGlitchConfig()
    case 'HalfTone':
      return initHalfToneConfig()
    case 'LightSync':
      return initLightSyncConfig()
    case 'UnrealBloom':
      return initUnrealBloomConfig()
    case 'RenderLayer':
      return initRenderLayerConfig()
  }
}

export const effectTypes: EffectType[] = [
  'AdaptiveToneMapping',
  'AfterImage',
  'DotScreen',
  'Film',
  'Glitch',
  'HalfTone',
  'LightSync',
  'UnrealBloom',
]
