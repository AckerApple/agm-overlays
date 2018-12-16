import { latLngPlus } from "../../src/AgmOverlay.component"

export interface exampleLatLng extends latLngPlus{
  title?   : string
  opacity? : number
}

export const points:exampleLatLng[] = [
  {
    title:'0',
    latitude:26.368755,
    longitude:-80.137413
  },
  {
    title:'1',
    latitude:26.368351,
    longitude:-80.128873
  },
  {
    title:'2',
    latitude:26.368092,
    longitude:-80.125011
  }
]

export const resizesPoint = {
    title:'resizes',
    opacity:.7,
    latitude:26.360000,
    longitude:-80.110000,
    bounds:{
      x: {
        latitude:-0.003,
        longitude:-0.0052
      },
      y: {
        latitude:0.003,
        longitude:0.0052
      }
    }
  }
