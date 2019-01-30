import { Subscription } from "rxjs"

import {
  Input, Component, Output, EventEmitter,
  TemplateRef, ViewChild, ElementRef, QueryList,
  ContentChildren
} from "@angular/core"

import {
  AgmInfoWindow, LatLngBounds, LatLng, MarkerManager,
  GoogleMapsAPIWrapper, AgmMarker
} from "@agm/core"

import { GoogleMap } from "@agm/core/services/google-maps-types"
declare var google: any

export interface latLng{
  latitude  : number
  longitude : number
}

export interface bounds{
  x: latLng//relative adjustment mathematics
  y: latLng//relative adjustment mathematics
} 

export interface latLngPlus{
  latitude  : number
  longitude : number
  bounds?   : bounds
}

@Component({
  selector:"agm-overlay",
  template:'<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
}) export class AgmOverlay{
  @Input() latitude:number
  @Input() longitude:number
  
  @Input() visible: boolean = true
  @Input() zIndex: number = 1
  @Input() bounds:bounds
  
  //TIP: Do NOT use this... Just put (click) on your html overlay element
  @Output() markerClick: EventEmitter<void> = new EventEmitter<void>()
  
  @Input() openInfoWindow: boolean = true
  @ContentChildren(AgmInfoWindow) infoWindow: QueryList<AgmInfoWindow> = new QueryList<AgmInfoWindow>()

  //TODO, implement this
  @Input('markerDraggable') draggable: boolean = false

  @ViewChild('content', { read: ElementRef }) template: ElementRef

  destroyed:boolean
  overlayView:any
  //elmGuts:any
  private _observableSubscriptions: Subscription[] = []

  constructor(
    protected _mapsWrapper: GoogleMapsAPIWrapper,
    private _markerManager: MarkerManager//rename to fight the private declaration of parent
  ){}

  ngAfterViewInit(){
    //remove reference of info windows
    const iWins = this.template.nativeElement.getElementsByTagName('agm-info-window')
    for(let x=iWins.length-1; x >= 0; --x){
      iWins[x].parentNode.removeChild(iWins[x])
    }

    this.load().then(()=>{
      this.onChanges = this.onChangesOverride
    })
  }
  
  ngAfterContentInit() {
    this.infoWindow.changes.subscribe(() => this.handleInfoWindowUpdate());
  }

  ngOnChanges( changes ){
    this.onChanges(changes)
  }

  onChanges( changes ){}

  onChangesOverride( changes ){
    if( changes.latitude || changes.longitude || changes.zIndex ){
      this.overlayView.latitude = this.latitude
      this.overlayView.longitude = this.longitude
      this.overlayView.zIndex = this.zIndex
      this.destroy().then(()=>this.load())
    }
  }

  ngOnDestroy(){
    this.destroy()
  }

  destroy():Promise<any>{
    this.destroyed = true

    const promise = this._markerManager.deleteMarker( this.overlayView )
    
    if( this.overlayView ){
      if( this.overlayView.div ){
        this.overlayView.remove()
      }
      this.overlayView.setMap(null)
    }
    
    this._observableSubscriptions.forEach((s) => s.unsubscribe())
    
    delete this.overlayView
    //delete this.elmGuts

    return promise
  }
  
  private handleInfoWindowUpdate() {
    if (this.infoWindow.length > 1) {
      throw new Error('Expected no more than one info window.');
    }
    
    this.infoWindow.forEach(iWin => {
      iWin.hostMarker = <any>this.overlayView
    });
  }

  load():Promise<void>{
    return this._mapsWrapper.getNativeMap()
    .then(map=>{
      const overlay = this.getOverlay( map )

      this._markerManager.addMarker( <any>overlay )
      this._addEventListeners()

      return this._markerManager.getNativeMarker( overlay )
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
      this.overlayView.iconUrl = " "
      this.overlayView.latitude = this.latitude
      this.overlayView.longitude = this.longitude
    /* end */

    if( this.bounds ){
      this.overlayView.bounds_ = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          this.latitude + this.bounds.x.latitude,
          this.longitude + this.bounds.x.longitude
        ),
        new google.maps.LatLng(
          this.latitude + this.bounds.y.latitude,
          this.longitude + this.bounds.y.longitude
        )
      )
    }

    // js-marker-clusterer does not support updating positions. We are forced to delete/add and compensate for .removeChild calls
    const elm = this.template.nativeElement.children[0]
    //const elm =  this.elmGuts || this.template.nativeElement.children[0]

    //we must always be sure to steal our stolen element back incase we are just in middle of changes and will redraw
    const restore = (div)=>{
      this.template.nativeElement.appendChild( div )
    }

    this.overlayView.remove = function(){
      if(!this.div)return
      this.div.parentNode.removeChild(this.div);
      restore( this.div )
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
        if(!panes || !panes.overlayLayer)return

        panes.overlayLayer.appendChild( elm )
      }

      const latlng = new google.maps.LatLng(this.latitude,this.longitude)

      const proj = this.getProjection()
      if(!proj)return

      const point = proj.fromLatLngToDivPixel( latlng )

      if (point) {
        elm.style.left = (point.x - 10) + 'px'
        elm.style.top = (point.y - 20) + 'px'
      }        

      if( this.bounds_ ){
        // stretch content between two points leftbottom and righttop and resize
        const proj = this.getProjection()
        const sw = proj.fromLatLngToDivPixel(this.bounds_.getSouthWest())
        const ne = proj.fromLatLngToDivPixel(this.bounds_.getNorthEast())
  
        this.div.style.left = sw.x + 'px'
        this.div.style.top = ne.y + 'px'
        this.div.children[0].style.width = ne.x - sw.x + 'px'
        this.div.children[0].style.height = sw.y - ne.y + 'px'
      }
    }

    elm.addEventListener("click", event=>this.handleTap())

    this.handleInfoWindowUpdate()

    return this.overlayView
  }

  handleTap(){
    if (this.openInfoWindow) {
      this.infoWindow.forEach(infoWindow=>{
        infoWindow.open()
      })
    }
    this.markerClick.emit(null);
  }

  _addEventListeners(){
    const eo = this._markerManager.createEventObservable('click', <any>this.overlayView)
    const cs = eo.subscribe(() => this.handleTap())
    this._observableSubscriptions.push(cs)
  }
}
