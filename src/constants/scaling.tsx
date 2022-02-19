import { Dimensions } from 'react-native'

export const width = Dimensions.get('window').width
export const height = Dimensions.get('screen').height

const guidelineBaseWidth = 375
const guidelineBaseHeight = 667

export const scale = (size: number) =>
  Math.round((width / guidelineBaseWidth) * size)
export const verticalScale = (size: number) =>
  Math.round((height / guidelineBaseHeight) * size)
export const moderateScale = (size: number, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor)
