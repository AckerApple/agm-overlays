# agm-overlays
Custom marker overlay for the @agm/core package

[demo page](https://ackerapple.github.io/agm-overlays/)

[![hire me](https://ackerapple.github.io/resume/assets/images/hire-me-badge.svg)](https://ackerapple.github.io/resume/)
[![npm version](https://badge.fury.io/js/agm-overlays.svg)](http://badge.fury.io/js/agm-overlays)
[![npm downloads](https://img.shields.io/npm/dm/agm-overlays.svg)](https://npmjs.org/agm-overlays)
[![Dependency Status](https://david-dm.org/ackerapple/agm-overlays.svg)](https://david-dm.org/ackerapple/agm-overlays)

> Source Repository : [master branch here](https://github.com/AckerApple/agm-overlays/tree/master)

<details>
  <summary>Table of Contents</summary>

- [Dependencies](#dependencies)
- [Install](#install)
- [Import](#import)
- [Usage](#usage)
  - [Zoom Sizing](#zoom-sizing)
- [Clustering Demo](#clustering-demo)
- [Resources](#resources)
- [Credits and Collaborators](#credits-and-collaborators)
- [Also Try](#also-try)

</details>

# Dependencies

Please be sure you have installed:
- [@agm/core](https://www.npmjs.com/package/@agm/core)
- [@angular/core](https://www.npmjs.com/package/@angular/core)
- [@angular/platform-browser](https://www.npmjs.com/package/@angular/platform-browser)

# Install
Open a command terminal and type the following
```bash
npm install agm-overlays --save-dev
```

# Import
```typescript
import { AgmOverlays } from "agm-overlays"
import { NgModule } from "@angular/core"
import { BrowserModule } from '@angular/platform-browser'

@NgModule({
  imports:[
    BrowserModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: '...your-key-here...'
    })
  ]
}) export class AppModule {}
```

# Usage
**Multiple Custom Overlays**
```html
<agm-map style="height:300px;display:block;">
  <agm-overlay
    *ngFor      = "let item of latLngArray"
    [latitude]  = "item.latitude"
    [longitude] = "item.longitude"
  >
    <!-- blue html square -->
    <div style="width:15px;height:15px;background-color:blue;"></div>
  </agm-overlay>
</agm-map>
```
> With multiple custom overlays, the zoom is auto set by the bounds calculated amongst all custom overlays

**Single Custom Overlay**
```html
<agm-map
  [zoom] = "12"
  style  = "height:300px;display:block;"
  [latitude]  = "item.latitude"
  [longitude] = "item.longitude"
>
  <agm-overlay
    [latitude]  = "item.latitude"
    [longitude] = "item.longitude"
  >
    <!-- blue html square -->
    <div style="width:15px;height:15px;background-color:blue;"></div>
  </agm-overlay>
</agm-map>
```

### Zoom Sizing
By default, markers are always the same size regardless of zoom. Change that!

> The following example expands the latitude(0.003) and the longitude(0.0052) in both directions

```html
<agm-map
  [zoom] = "12"
  style  = "height:300px;display:block;"
  [latitude]  = "item.latitude"
  [longitude] = "item.longitude"
>
  <agm-overlay
    [latitude]  = "item.latitude"
    [longitude] = "item.longitude"
    [bounds] = "{x:{latitude:-0.003,longitude:-0.0052},y:{latitude:0.003,longitude:0.0052}}"
  >
    <!-- blue html square -->
    <div style="width:15px;height:15px;background-color:blue;"></div>
  </agm-overlay>
</agm-map>
```


# Clustering Demo
Clustering is NOT a responsibility of this package, however it can be done

[demo page](https://ackerapple.github.io/agm-overlays/)
This demo uses [@agm/js-marker-clusterer](https://www.npmjs.com/package/@agm/js-marker-clusterer) to demonstrate how to do clustering

```html
<agm-map
  [latitude]  = "latLngArray[0].latitude"
  [longitude] = "latLngArray[1].latitude"
>
  <agm-marker-cluster imagePath="https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m">
    <agm-overlay
      *ngFor      = "let item of latLngArray;let i=index"
      [latitude]  = "item.latitude"
      [longitude] = "item.longitude"
    >
      <!-- blue html square -->
      <div class="block">
        <strong style="color:white;">{{i}}</strong>
      </div>
    </agm-overlay>
  </agm-marker-cluster>
</agm-map>
```


# Resources
- [@agm/core](https://www.npmjs.com/package/@agm/core) installed

# Credits and Collaborators
- [Acker Apple](https://github.com/AckerApple)
- [Todd Greenberg](https://github.com/tsgreenberg1217)

# Also Try
- [ack-angular-webcam](https://www.npmjs.com/package/ack-angular-webcam)
- [ack-angular-fx](https://www.npmjs.com/package/ack-angular-fx)
- [angular-file](https://www.npmjs.com/package/angular-file)
- [ack-angular](https://www.npmjs.com/package/ack-angular)
