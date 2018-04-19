import { Component } from "@angular/core"
import { template } from "./app.template"
import * as packJson from "../../package.json"

export interface latLng{
  latitude  : number
  longitude : number
}

@Component({
  selector:"app",
  template:template
}) export class AppComponent{
  view:"data"
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