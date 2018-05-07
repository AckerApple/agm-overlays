import { Subscription } from "rxjs"

import {
  Input, Component, EventEmitter,
  TemplateRef, ViewChild, ElementRef, QueryList
} from "@angular/core"

import {
  AgmInfoWindow, LatLngBounds, LatLng, MarkerManager,
  GoogleMapsAPIWrapper, AgmMarker
} from "@agm/core"

import { GoogleMap } from "@agm/core/services/google-maps-types"
declare var google: any

@Component({
  selector:"agm-overlay",
  template:'<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
}) export class AgmOverlay{
  overlayView:any
  @Input() latitude:number
  @Input() longitude:number
  @Input() visible: boolean = true
  
  @ViewChild('content', { read: ElementRef }) template: ElementRef

  constructor(
    protected _mapsWrapper: GoogleMapsAPIWrapper,
    private _markerManager: MarkerManager//rename to fight the private declaration of parent
  ){
  }

  ngOnChanges( changes ){
    if( (changes.latitude || changes.longitude) ){
      //this.destroy()
      if( this.overlayView && this.overlayView.draw ){
        this.overlayView.draw()
      }else{
        this.load()
      }
    }
  }

  ngOnDestroy(){
    this.destroy()
  }

  destroy(){
    this.overlayView.setMap(null)
    delete this.overlayView
  }

  load(){
    this._mapsWrapper.getNativeMap()
    .then(map=>{
      this.drawOnMap( map )

      this._markerManager.addMarker( <any>this.overlayView )
      
      return this._markerManager.getNativeMarker( this.overlayView )

      /* bounds */
      /*
      const latlng = new google.maps.LatLng(this.latitude, this.longitude)

      // configures the bounds of the map to fit the markers
      this.addBounds( latlng, map )
      */
      /* end:bounds */
    })
    .then(nativeMarker=>{
      const setMap = nativeMarker.setMap
      
      nativeMarker.setMap = (map)=>{
        setMap.call(nativeMarker,map)
        this.overlayView.setMap(map)
      }
    })
  }

  drawOnMap( map:GoogleMap ){
    this.overlayView = this.overlayView || new google.maps.OverlayView()
    
    /* make into foo marker that AGM likes */
      this.overlayView.iconUrl = " "//" "
      this.overlayView.latitude = this.latitude
      this.overlayView.longitude = this.longitude
    /* end */

    const latlng = new google.maps.LatLng(this.latitude,this.longitude)
    const elm = this.template.nativeElement.children[0]

    this.overlayView.remove = function(){
      this.div.parentNode.removeChild(this.div);
      delete this.div
    }

    this.overlayView.draw = function(){
      if ( !this.div ) {
        this.div = elm
        this.getPanes().overlayImage.appendChild( elm )
      }

      const point = this.getProjection().fromLatLngToDivPixel( latlng )

      if (point) {
        elm.style.left = (point.x - 10) + 'px'
        elm.style.top = (point.y - 20) + 'px'
      }
    }

    this.overlayView.setMap(map)
  }

  /*promiseBounds():Promise<LatLngBounds>{
    return this._mapsWrapper.getNativeMap()
    .then(map=>{
      let bounds = map.getBounds() || map['bounds']
      if( !bounds ){
        bounds = new google.maps.LatLngBounds()
        map['bounds'] = bounds
      }
      return bounds
    })
  }

  addBounds( latlng:LatLng, map:GoogleMap ){
    this.promiseBounds()
    .then(bounds=>{
      const zero = bounds.isEmpty()
      bounds.extend( latlng )
      if( !zero ){
        const zoom = map.getZoom()
        map.fitBounds( bounds )//center map on all overlays
        setTimeout(()=>map.setZoom(zoom), 60)//reset the zoom the bounds steals
      }
    })
  }*/
}