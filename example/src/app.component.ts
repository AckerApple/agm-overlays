import { Component } from "@angular/core"
import { template } from "./app.template"
import * as packJson from "../../package.json"

export interface latLng{
  title: string
  latitude  : number
  longitude : number
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
    {title:'0',latitude:26.368755, longitude:-80.137413},
    {title:'1',latitude:26.368351, longitude:-80.128873},
    {title:'2',latitude:26.368092, longitude:-80.125011}
  ]

  setLatLngArrayString( string:string ){
    const json = JSON.parse(string)
    this.latLngArray = json
  }

  toNumber(value){
    return Number(value)
  }

}
