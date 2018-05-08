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
  elmGuts:any
  @Input() latitude:number
  @Input() longitude:number
  @Input() visible: boolean = true

  @ViewChild('content', { read: ElementRef }) template: ElementRef

  constructor(
    protected _mapsWrapper: GoogleMapsAPIWrapper,
    private _markerManager: MarkerManager//rename to fight the private declaration of parent
  ){}

  ngAfterViewInit(){
    // js-marker-clusterer does not support updating positions. We are forced to delete/add and compensate for .removeChild calls
    this.elmGuts = this.template.nativeElement.children[0]

    this.load().then(()=>{
      this.onChanges = this.onChangesOverride
    })
  }

  ngOnChanges( changes ){
    this.onChanges(changes)
  }

  onChanges( changes ){}

  onChangesOverride( changes ){
    if( (changes.latitude || changes.longitude) ){
      this.overlayView.latitude = this.latitude
      this.overlayView.longitude = this.longitude

      this._markerManager.deleteMarker(<any>this.overlayView)
      .then(()=>this.load())


    }
  }

  ngOnDestroy(){
    this.destroy()
  }

  destroy(){
    this._markerManager.deleteMarker( this.overlayView )
    this.overlayView.setMap(null)
    delete this.overlayView
    delete this.elmGuts
  }

  load():Promise<void>{
    return this._mapsWrapper.getNativeMap()
    .then(map=>{
      const overlay = this.getOverlay( map )

      this._markerManager.addMarker( <any>overlay )

      return this._markerManager.getNativeMarker( overlay )
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

      if( nativeMarker['map'] ){
        this.overlayView.setMap( nativeMarker['map'] )
      }

      nativeMarker.setMap = (map)=>{
        setMap.call(nativeMarker,map)

        if( this.overlayView ){
          this.overlayView.setMap(map)
        }
      }
    })
  }

  getOverlay( map ){
    this.overlayView = this.overlayView || new google.maps.OverlayView()

    /* make into foo marker that AGM likes */
      this.overlayView.iconUrl = " "//" "
      this.overlayView.latitude = this.latitude
      this.overlayView.longitude = this.longitude
    /* end */
    const elm = this.elmGuts

    this.overlayView.remove = function(){
      this.div.parentNode.removeChild(this.div);
      delete this.div
    }

    this.overlayView.getDiv = function(){
      return this.div
    }

    this.overlayView.draw = function(){
      if ( !this.div ) {
        this.div = elm
        const panes = this.getPanes()
        // if no panes then assumed not on map
        if(!panes || !panes.overlayImage)return

        panes.overlayImage.appendChild( elm )
      }

      const latlng = new google.maps.LatLng(this.latitude,this.longitude)

      const proj = this.getProjection()
      if(!proj)return

      const point = proj.fromLatLngToDivPixel( latlng )

      if (point) {
        elm.style.left = (point.x - 10) + 'px'
        elm.style.top = (point.y - 20) + 'px'
      }
    }

    return this.overlayView
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
