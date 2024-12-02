import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser'
import { AgmCoreModule } from "@agm/core"
import { AppComponent } from "./app.component"
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

//DO NOT USE BELOW
//YOU NEED USE: import { AgmOverlays } from "agm-overlays"
import { AgmOverlays } from "../../src"

@NgModule({
  imports:[
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: '...paste-your-key-here...'
    }),
    AgmJsMarkerClustererModule
  ],
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ]
}) export class AppModule{}