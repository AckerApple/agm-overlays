import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser'
import { AgmCoreModule } from "@agm/core"
import { AgmOverlays } from "../../src"
import { AppComponent } from "./app.component"
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

@NgModule({
  imports:[
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2Z0LzbjZXiqRAsVYTl4OP7cK7hdgR89U'
    }),
    AgmJsMarkerClustererModule
  ],
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ]
}) export class AppModule{}