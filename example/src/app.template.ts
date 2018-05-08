export const template =
`
<table cellPadding="0" cellSpacing="0" border="0" style="width:100%;height:100%">
  <tr>
    <td valign="top" colspan="2">
      <div style="float:right;font-size:.8em;">v{{version}}</div>
      <h2 style="margin:0;">💥 agm-overlay</h2>
      <div style="text-align:center;font-size:.8em;">
        <a href="https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.component.ts">view component</a>
        &nbsp;
        <a href="https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.template.ts">view template</a>
        &nbsp;
        <a href="javascript:" (click)="view=view==='data'?null:'data'">{{!view?'play':'done'}} with data <sup>({{latLngArray.length}})</sup></a>
        &nbsp;
        <a href="javascript:" (click)="destroyMap=!destroyMap">{{destroyMap?'restore':'destroy'}} map</a>
      </div>
    </td>
  </tr>
  <tr *ngIf="!destroyMap">
    <td [style.height]="view ? '50%' : '100%'" colspan="2">
      <agm-map
        [zoom] = "14"
        style  = "height:100%;width:100%;display:block;"
        [latitude]  = "latLngArray.length ? latLngArray[0].latitude : null"
        [longitude] = "latLngArray.length ? latLngArray[0].longitude : null"
      >
        <agm-marker-cluster imagePath="https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m">
          <agm-overlay
            *ngFor      = "let item of latLngArray;let i=index"
            [latitude]  = "item.latitude"
            [longitude] = "item.longitude"
          >
            <!-- blue html square -->
            <div class="block">
              <strong style="color:white;">{{item.title}}</strong>
            </div>
          </agm-overlay>
        </agm-marker-cluster>
      </agm-map>
    </td>
  </tr>
  <tr *ngIf="view==='data'">
    <td style="height:50%">
      <textarea (change)="setLatLngArrayString($event.target.value)" style="width:100%;height:100%" wrap="on">{{ latLngArray | json }}</textArea>
    </td>
    <td valign="top">
      <div><strong>Edit Marker</strong></div>
      <select (change)="markerEdit=latLngArray[$event.target.value]" style="width:100%">
        <option></option>
        <option *ngFor="let item of latLngArray;let i = index" [value]="i">
          Marker {{i}}
        </option>
      </select>
      <ng-container *ngIf="markerEdit">
        <div><strong>Latitude</strong></div>
        <input type="number" [value]="markerEdit.latitude" (change)="markerEdit.latitude=toNumber($event.target.value)" style="width:100%"/>
        <div><strong>Longitude</strong></div>
        <input type="number" [value]="markerEdit.longitude" (change)="markerEdit.longitude=toNumber($event.target.value)" style="width:100%"/>
        <div><strong>Title</strong></div>
        <input type="text" [value]="markerEdit.title" (change)="markerEdit.title=$event.target.value" style="width:100%"/>
      </ng-container>
    </td>
  </tr>
</table>
`
