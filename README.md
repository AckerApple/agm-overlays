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
import { AgmOverlays } from "@agm-overlays"
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
```typescript
<agm-map
  [zoom] = "5"
  style  = "height:300px;display:block;"
>
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
