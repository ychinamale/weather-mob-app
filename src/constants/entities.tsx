export type tWeatherData = {
  current:tWeatherSummary
  forecast:tWeatherSummary[]
}

export type tWeatherSummary = {
  date:string
  day:string
  desc:string[]
  temp?:number
  min:number
  max:number
}