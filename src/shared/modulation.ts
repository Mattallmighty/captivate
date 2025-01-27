import { initModulation, paramsList, Param, Modulation } from './params'
import { Lfo, GetValue, GetRamp } from './oscillator'
import { LightScene_t } from './Scenes'
import { clampNormalized } from '../math/util'
import { mapUndefinedParamsToDefault, defaultOutputParams } from './params'

export interface Modulator {
  lfo: Lfo
  modulation: Modulation
  splitModulations: Modulation[]
}

export function initModulator(splitCount: number): Modulator {
  return {
    lfo: GetRamp(),
    modulation: initModulation(),
    splitModulations: Array(splitCount)
      .fill(0)
      .map(() => ({})),
  }
}

interface ModSnapshot {
  modulation: Modulation
  lfoVal: number
}

export function getOutputParams(
  beats: number,
  scene: LightScene_t,
  splitIndex: number | null
) {
  const outputParams = defaultOutputParams()
  const baseParams =
    splitIndex === null
      ? scene.baseParams
      : scene.splitScenes[splitIndex].baseParams
  // const baseParams = defaultOutputParams()
  const mappedParams = mapUndefinedParamsToDefault(baseParams)
  const snapshots: ModSnapshot[] =
    splitIndex === null
      ? scene.modulators.map((modulator) => ({
          modulation: modulator.modulation,
          lfoVal: GetValue(modulator.lfo, beats),
        }))
      : scene.modulators.map((modulator) => ({
          modulation: modulator.splitModulations[splitIndex],
          lfoVal: GetValue(modulator.lfo, beats),
        }))

  paramsList.forEach((param) => {
    outputParams[param] = getOutputParam(mappedParams[param], param, snapshots)
  })

  return outputParams
}

function getOutputParam(
  baseParam: number,
  param: Param,
  snapshots: ModSnapshot[]
) {
  return clampNormalized(
    snapshots.reduce((sum, { modulation, lfoVal }) => {
      const modAmount = modulation[param]
      if (modAmount === undefined) {
        return sum
      } else {
        const modAmountMapped = modAmount * 2 - 1 // from -1 to 1
        const lfoValMapped = lfoVal * 2 - 1 // from -1 to 1
        const addedModulation = (modAmountMapped * lfoValMapped) / 2 // from -0.5 to -0.5
        return sum + addedModulation
      }
    }, baseParam)
  )
}
