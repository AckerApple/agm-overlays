import { Component } from "@angular/core"
import { template } from "./app.template"
import * as packJson from "../../package.json"
import { LatLngBounds } from "@agm/core";

export interface latLng{
  title: string
  latitude  : number
  longitude : number
  bounds: any
}

@Component({
  selector:"app",
  template:template,
  styles:['.block {justify-content:center;align-items:center;display:flex;width:50px;height:50px;background-color:blue;}']
}) export class AppComponent{
  markerEdit:latLng
  view:"data"
  destroyMap:boolean
  version:string = packJson['version']
  latLngArray:latLng[] = [
    {title:'0',latitude:26.368755, longitude:-80.137413, bounds:{
      x: {lat:26.368755 - 0.0011, lng:-80.137413 - 0.0013 }, 
      y: {lat:26.368755 + 0.001, lng:-80.137413 + 0.0013 }
      }
    },
    {title:'1',latitude:26.368351, longitude:-80.128873, bounds:{
      x: {lat:26.368351- 0.001, lng:-80.128873 - 0.0013 }, 
      y: {lat:26.368351 + 0.001, lng:-80.128873 + 0.0013 }
      }
    },
    {title:'2',latitude:26.368092, longitude:-80.125011, bounds:{
      x: {lat:26.368092 - 0.001, lng:-80.125011 - 0.0013 }, 
      y: {lat:26.368092 + 0.001, lng:-80.125011 + 0.0013 }
      }
    }
  ]

  setLatLngArrayString( string:string ){
    const json = JSON.parse(string)
    this.latLngArray = json
  }

  toNumber(value){
    return Number(value)
  }

}
