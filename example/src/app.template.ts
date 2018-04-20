export const template =
`
<table cellPadding="0" cellSpacing="0" border="0" style="width:100%;height:100%">
  <tr>
    <td>
      <div style="float:right;font-size:.8em;">v{{version}}</div>
      <h2 style="margin:0;">💥 agm-overlay</h2>
      <div style="text-align:center;font-size:.8em;">
        <a href="https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.component.ts">view component</a>
        &nbsp;
        <a href="https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.template.ts">view template</a>
        &nbsp;
        <a href="javascript:" (click)="view=view==='data'?null:'data'">{{!view?'play':'done'}} with data <sup>({{latLngArray.length}})</sup></a>
      </div>
    </td>
  </tr>
  <tr *ngIf="!view">
    <td style="height:100%">
      <agm-map
        [zoom] = "14"
        style  = "height:100%;width:100%;display:block;"
        [latitude]  = "latLngArray.length ? latLngArray[0].latitude : null"
        [longitude] = "latLngArray.length ? latLngArray[0].longitude : null"
      >
        <agm-overlay
          *ngFor      = "let item of latLngArray;let i=index"
          [latitude]  = "item.latitude"
          [longitude] = "item.longitude"
        >
          <!-- blue html square -->
          <div style="justify-content:center;align-items:center;display:flex;width:50px;height:50px;background-color:blue;">
            <strong style="color:white;">{{i}}</strong>
          </div>
        </agm-overlay>
      </agm-map>
    </td>
  </tr>
  <tr *ngIf="view==='data'">
    <td style="height:100%">
      <textarea (change)="setLatLngArrayString($event.target.value)" style="width:100%;height:100%" wrap="on">{{ latLngArray | json }}</textArea>
    </td>
  </tr>
</table>
`