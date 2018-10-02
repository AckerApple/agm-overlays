import { Component } from "@angular/core"
import { template } from "./app.template"
import * as packJson from "../../package.json"
import { exampleLatLng, points } from "./points"

@Component({
  selector:"app",
  template:template,
  styles:['.block {justify-content:center;align-items:center;display:flex;width:50px;height:50px;background-color:blue;}']
}) export class AppComponent{
  markerEdit:exampleLatLng
  view:"data"
  destroyMap:boolean
  version:string = packJson['version']
  latLngArray:exampleLatLng[] = points

  setLatLngArrayString( string:string ){
    const json = JSON.parse(string)
    this.latLngArray = json
  }

  toNumber(value){
    return Number(value)
  }
}