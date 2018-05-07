import { Component } from "@angular/core"
import { template } from "./app.template"
import * as packJson from "../../package.json"

export interface latLng{
  latitude  : number
  longitude : number
}

@Component({
  selector:"app",
  template:template,
  styles:['.block {justify-content:center;align-items:center;display:flex;width:50px;height:50px;background-color:blue;}']
}) export class AppComponent{
  view:"data"
  destroyMap:boolean
  version:string = packJson['version']
  latLngArray:latLng[] = [
    {latitude:26.368755, longitude:-80.137413},
    {latitude:26.368351, longitude:-80.128873},
    {latitude:26.368092, longitude:-80.125011}
  ]

  setLatLngArrayString( string:string ){
    const json = JSON.parse(string)
    this.latLngArray = json
  }
}