import { __decorate } from "tslib";
import { Input, Component, Output, EventEmitter, ViewChild, ElementRef, QueryList, ContentChildren } from "@angular/core";
import { AgmInfoWindow, LatLngBounds, LatLng, MarkerManager, GoogleMapsAPIWrapper, AgmMarker } from "@agm/core";
let AgmOverlay = class AgmOverlay {
    constructor(_mapsWrapper, _markerManager //rename to fight the private declaration of parent
    ) {
        this._mapsWrapper = _mapsWrapper;
        this._markerManager = _markerManager;
        this.visible = true; //possibly doesn't work and just left over from agm-core marker replication
        this.zIndex = 1;
        //TIP: Do NOT use this... Just put (click) on your html overlay element
        this.markerClick = new EventEmitter();
        this.openInfoWindow = true;
        this.infoWindow = new QueryList();
        //TODO, implement this
        this.draggable = false;
        //elmGuts:any
        this._observableSubscriptions = [];
    }
    ngAfterViewInit() {
        //remove reference of info windows
        const iWins = this.template.nativeElement.getElementsByTagName('agm-info-window');
        for (let x = iWins.length - 1; x >= 0; --x) {
            iWins[x].parentNode.removeChild(iWins[x]);
        }
        this.load().then(() => {
            this.onChanges = this.onChangesOverride;
        });
    }
    ngAfterContentInit() {
        this.infoWindow.changes.subscribe(() => this.handleInfoWindowUpdate());
    }
    ngOnChanges(changes) {
        this.onChanges(changes);
    }
    onChanges(changes) { }
    onChangesOverride(changes) {
        if (changes.latitude || changes.longitude || changes.zIndex) {
            this.overlayView.latitude = this.latitude;
            this.overlayView.longitude = this.longitude;
            this.overlayView.zIndex = this.zIndex;
            this.destroy().then(() => this.load());
        }
    }
    ngOnDestroy() {
        this.destroy();
    }
    destroy() {
        this.destroyed = true;
        const promise = this._markerManager.deleteMarker(this.overlayView);
        if (this.overlayView) {
            if (this.overlayView.div) {
                this.overlayView.remove();
            }
            this.overlayView.setMap(null);
        }
        this._observableSubscriptions.forEach((s) => s.unsubscribe());
        delete this.overlayView;
        //delete this.elmGuts
        return promise;
    }
    handleInfoWindowUpdate() {
        if (this.infoWindow.length > 1) {
            throw new Error('Expected no more than one info window.');
        }
        this.infoWindow.forEach(iWin => {
            iWin.hostMarker = this.overlayView;
        });
    }
    load() {
        return this._mapsWrapper.getNativeMap()
            .then(map => {
            const overlay = this.getOverlay(map);
            this._markerManager.addMarker(overlay);
            this._addEventListeners();
            return this._markerManager.getNativeMarker(overlay);
        })
            .then(nativeMarker => {
            const setMap = nativeMarker.setMap;
            if (nativeMarker['map']) {
                this.overlayView.setMap(nativeMarker['map']);
            }
            nativeMarker.setMap = (map) => {
                setMap.call(nativeMarker, map);
                if (this.overlayView) {
                    this.overlayView.setMap(map);
                }
            };
        });
    }
    getOverlay(map) {
        this.overlayView = this.overlayView || new google.maps.OverlayView();
        /* make into foo marker that AGM likes */
        this.overlayView.iconUrl = " ";
        this.overlayView.latitude = this.latitude;
        this.overlayView.longitude = this.longitude;
        this.overlayView.visible = false; //hide 40x40 transparent placeholder that prevents hover events
        /* end */
        if (this.bounds) {
            this.overlayView.bounds_ = new google.maps.LatLngBounds(new google.maps.LatLng(this.latitude + this.bounds.x.latitude, this.longitude + this.bounds.x.longitude), new google.maps.LatLng(this.latitude + this.bounds.y.latitude, this.longitude + this.bounds.y.longitude));
        }
        // js-marker-clusterer does not support updating positions. We are forced to delete/add and compensate for .removeChild calls
        const elm = this.template.nativeElement.children[0];
        //const elm =  this.elmGuts || this.template.nativeElement.children[0]
        //we must always be sure to steal our stolen element back incase we are just in middle of changes and will redraw
        const restore = (div) => {
            this.template.nativeElement.appendChild(div);
        };
        this.overlayView.remove = function () {
            if (!this.div)
                return;
            this.div.parentNode.removeChild(this.div);
            restore(this.div);
            delete this.div;
        };
        this.overlayView.getDiv = function () {
            return this.div;
        };
        this.overlayView.draw = function () {
            if (!this.div) {
                this.div = elm;
                const panes = this.getPanes();
                // if no panes then assumed not on map
                if (!panes || !panes.overlayImage)
                    return;
                panes.overlayImage.appendChild(elm);
            }
            const latlng = new google.maps.LatLng(this.latitude, this.longitude);
            const proj = this.getProjection();
            if (!proj)
                return;
            const point = proj.fromLatLngToDivPixel(latlng);
            if (point) {
                elm.style.left = (point.x - 10) + 'px';
                elm.style.top = (point.y - 20) + 'px';
            }
            if (this.bounds_) {
                // stretch content between two points leftbottom and righttop and resize
                const proj = this.getProjection();
                const sw = proj.fromLatLngToDivPixel(this.bounds_.getSouthWest());
                const ne = proj.fromLatLngToDivPixel(this.bounds_.getNorthEast());
                this.div.style.left = sw.x + 'px';
                this.div.style.top = ne.y + 'px';
                this.div.children[0].style.width = ne.x - sw.x + 'px';
                this.div.children[0].style.height = sw.y - ne.y + 'px';
            }
        };
        elm.addEventListener("click", event => {
            this.handleTap();
            event.stopPropagation();
        });
        this.handleInfoWindowUpdate();
        return this.overlayView;
    }
    handleTap() {
        if (this.openInfoWindow) {
            this.infoWindow.forEach(infoWindow => {
                infoWindow.open();
            });
        }
        this.markerClick.emit(null);
    }
    _addEventListeners() {
        const eo = this._markerManager.createEventObservable('click', this.overlayView);
        const cs = eo.subscribe(() => this.handleTap());
        this._observableSubscriptions.push(cs);
    }
};
AgmOverlay.ctorParameters = () => [
    { type: GoogleMapsAPIWrapper },
    { type: MarkerManager //rename to fight the private declaration of parent
     }
];
__decorate([
    Input()
], AgmOverlay.prototype, "latitude", void 0);
__decorate([
    Input()
], AgmOverlay.prototype, "longitude", void 0);
__decorate([
    Input()
], AgmOverlay.prototype, "visible", void 0);
__decorate([
    Input()
], AgmOverlay.prototype, "zIndex", void 0);
__decorate([
    Input()
], AgmOverlay.prototype, "bounds", void 0);
__decorate([
    Output()
], AgmOverlay.prototype, "markerClick", void 0);
__decorate([
    Input()
], AgmOverlay.prototype, "openInfoWindow", void 0);
__decorate([
    ContentChildren(AgmInfoWindow)
], AgmOverlay.prototype, "infoWindow", void 0);
__decorate([
    Input('markerDraggable')
], AgmOverlay.prototype, "draggable", void 0);
__decorate([
    ViewChild('content', { read: ElementRef })
], AgmOverlay.prototype, "template", void 0);
AgmOverlay = __decorate([
    Component({
        selector: "agm-overlay",
        template: '<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
    })
], AgmOverlay);
export { AgmOverlay };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdtT3ZlcmxheS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hZ20tb3ZlcmxheXMvIiwic291cmNlcyI6WyJBZ21PdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFDekIsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQzdDLGVBQWUsRUFDaEIsTUFBTSxlQUFlLENBQUE7QUFFdEIsT0FBTyxFQUNMLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFDbEQsb0JBQW9CLEVBQUUsU0FBUyxFQUNoQyxNQUFNLFdBQVcsQ0FBQTtBQXdCZixJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFVO0lBd0J4QixZQUNZLFlBQWtDLEVBQ3BDLGNBQTZCLENBQUEsbURBQW1EOztRQUQ5RSxpQkFBWSxHQUFaLFlBQVksQ0FBc0I7UUFDcEMsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUF0QjlCLFlBQU8sR0FBWSxJQUFJLENBQUEsQ0FBQSwyRUFBMkU7UUFDbEcsV0FBTSxHQUFXLENBQUMsQ0FBQTtRQUczQix1RUFBdUU7UUFDN0QsZ0JBQVcsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQTtRQUUzRCxtQkFBYyxHQUFZLElBQUksQ0FBQTtRQUNQLGVBQVUsR0FBNkIsSUFBSSxTQUFTLEVBQWlCLENBQUE7UUFFckcsc0JBQXNCO1FBQ0ksY0FBUyxHQUFZLEtBQUssQ0FBQTtRQU1wRCxhQUFhO1FBQ0wsNkJBQXdCLEdBQW1CLEVBQUUsQ0FBQTtJQUtuRCxDQUFDO0lBRUgsZUFBZTtRQUNiLGtDQUFrQztRQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQ2pGLEtBQUksSUFBSSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFD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V0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNwRixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQy9DLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDeEMsQ0FBQztDQUNGLENBQUE7O1lBck0yQixvQkFBb0I7WUFDcEIsYUFBYSxDQUFBLG1EQUFtRDs7O0FBekJqRjtJQUFSLEtBQUssRUFBRTs0Q0FBZ0I7QUFDZjtJQUFSLEtBQUssRUFBRTs2Q0FBaUI7QUFFaEI7SUFBUixLQUFLLEVBQUU7MkNBQXdCO0FBQ3ZCO0lBQVIsS0FBSyxFQUFFOzBDQUFtQjtBQUNsQjtJQUFSLEtBQUssRUFBRTswQ0FBYztBQUdaO0lBQVQsTUFBTSxFQUFFOytDQUEyRDtBQUUzRDtJQUFSLEtBQUssRUFBRTtrREFBK0I7QUFDUDtJQUEvQixlQUFlLENBQUMsYUFBYSxDQUFDOzhDQUFzRTtBQUczRTtJQUF6QixLQUFLLENBQUMsaUJBQWlCLENBQUM7NkNBQTJCO0FBRVI7SUFBM0MsU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs0Q0FBcUI7QUFqQmxELFVBQVU7SUFIekIsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFDLGFBQWE7UUFDdEIsUUFBUSxFQUFDLG9GQUFvRjtLQUM5RixDQUFDO0dBQWMsVUFBVSxDQThOekI7U0E5TmUsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJyeGpzXCJcblxuaW1wb3J0IHtcbiAgSW5wdXQsIENvbXBvbmVudCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsXG4gIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIFF1ZXJ5TGlzdCxcbiAgQ29udGVudENoaWxkcmVuXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCJcblxuaW1wb3J0IHtcbiAgQWdtSW5mb1dpbmRvdywgTGF0TG5nQm91bmRzLCBMYXRMbmcsIE1hcmtlck1hbmFnZXIsXG4gIEdvb2dsZU1hcHNBUElXcmFwcGVyLCBBZ21NYXJrZXJcbn0gZnJvbSBcIkBhZ20vY29yZVwiXG5cbmltcG9ydCB7IEdvb2dsZU1hcCB9IGZyb20gXCJAYWdtL2NvcmUvc2VydmljZXMvZ29vZ2xlLW1hcHMtdHlwZXNcIlxuZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnlcblxuZXhwb3J0IGludGVyZmFjZSBsYXRMbmd7XG4gIGxhdGl0dWRlICA6IG51bWJlclxuICBsb25naXR1ZGUgOiBudW1iZXJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBib3VuZHN7XG4gIHg6IGxhdExuZy8vcmVsYXRpdmUgYWRqdXN0bWVudCBtYXRoZW1hdGljc1xuICB5OiBsYXRMbmcvL3JlbGF0aXZlIGFkanVzdG1lbnQgbWF0aGVtYXRpY3Ncbn0gXG5cbmV4cG9ydCBpbnRlcmZhY2UgbGF0TG5nUGx1c3tcbiAgbGF0aXR1ZGUgIDogbnVtYmVyXG4gIGxvbmdpdHVkZSA6IG51bWJlclxuICBib3VuZHM/ICAgOiBib3VuZHNcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOlwiYWdtLW92ZXJsYXlcIixcbiAgdGVtcGxhdGU6JzxkaXYgI2NvbnRlbnQ+PGRpdiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PjwvZGl2Pidcbn0pIGV4cG9ydCBjbGFzcyBBZ21PdmVybGF5e1xuICBASW5wdXQoKSBsYXRpdHVkZTpudW1iZXJcbiAgQElucHV0KCkgbG9uZ2l0dWRlOm51bWJlclxuICBcbiAgQElucHV0KCkgdmlzaWJsZTogYm9vbGVhbiA9IHRydWUvL3Bvc3NpYmx5IGRvZXNuJ3Qgd29yayBhbmQganVzdCBsZWZ0IG92ZXIgZnJvbSBhZ20tY29yZSBtYXJrZXIgcmVwbGljYXRpb25cbiAgQElucHV0KCkgekluZGV4OiBudW1iZXIgPSAxXG4gIEBJbnB1dCgpIGJvdW5kczpib3VuZHNcbiAgXG4gIC8vVElQOiBEbyBOT1QgdXNlIHRoaXMuLi4gSnVzdCBwdXQgKGNsaWNrKSBvbiB5b3VyIGh0bWwgb3ZlcmxheSBlbGVtZW50XG4gIEBPdXRwdXQoKSBtYXJrZXJDbGljazogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpXG4gIFxuICBASW5wdXQoKSBvcGVuSW5mb1dpbmRvdzogYm9vbGVhbiA9IHRydWVcbiAgQENvbnRlbnRDaGlsZHJlbihBZ21JbmZvV2luZG93KSBpbmZvV2luZG93OiBRdWVyeUxpc3Q8QWdtSW5mb1dpbmRvdz4gPSBuZXcgUXVlcnlMaXN0PEFnbUluZm9XaW5kb3c+KClcblxuICAvL1RPRE8sIGltcGxlbWVudCB0aGlzXG4gIEBJbnB1dCgnbWFya2VyRHJhZ2dhYmxlJykgZHJhZ2dhYmxlOiBib29sZWFuID0gZmFsc2VcblxuICBAVmlld0NoaWxkKCdjb250ZW50JywgeyByZWFkOiBFbGVtZW50UmVmIH0pIHRlbXBsYXRlOiBFbGVtZW50UmVmXG5cbiAgZGVzdHJveWVkOmJvb2xlYW5cbiAgb3ZlcmxheVZpZXc6YW55XG4gIC8vZWxtR3V0czphbnlcbiAgcHJpdmF0ZSBfb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW11cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX21hcHNXcmFwcGVyOiBHb29nbGVNYXBzQVBJV3JhcHBlcixcbiAgICBwcml2YXRlIF9tYXJrZXJNYW5hZ2VyOiBNYXJrZXJNYW5hZ2VyLy9yZW5hbWUgdG8gZmlnaHQgdGhlIHByaXZhdGUgZGVjbGFyYXRpb24gb2YgcGFyZW50XG4gICl7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpe1xuICAgIC8vcmVtb3ZlIHJlZmVyZW5jZSBvZiBpbmZvIHdpbmRvd3NcbiAgICBjb25zdCBpV2lucyA9IHRoaXMudGVtcGxhdGUubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYWdtLWluZm8td2luZG93JylcbiAgICBmb3IobGV0IHg9aVdpbnMubGVuZ3RoLTE7IHggPj0gMDsgLS14KXtcbiAgICAgIGlXaW5zW3hdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaVdpbnNbeF0pXG4gICAgfVxuXG4gICAgdGhpcy5sb2FkKCkudGhlbigoKT0+e1xuICAgICAgdGhpcy5vbkNoYW5nZXMgPSB0aGlzLm9uQ2hhbmdlc092ZXJyaWRlXG4gICAgfSlcbiAgfVxuICBcbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuaW5mb1dpbmRvdy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLmhhbmRsZUluZm9XaW5kb3dVcGRhdGUoKSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyggY2hhbmdlcyApe1xuICAgIHRoaXMub25DaGFuZ2VzKGNoYW5nZXMpXG4gIH1cblxuICBvbkNoYW5nZXMoIGNoYW5nZXMgKXt9XG5cbiAgb25DaGFuZ2VzT3ZlcnJpZGUoIGNoYW5nZXMgKXtcbiAgICBpZiggY2hhbmdlcy5sYXRpdHVkZSB8fCBjaGFuZ2VzLmxvbmdpdHVkZSB8fCBjaGFuZ2VzLnpJbmRleCApe1xuICAgICAgdGhpcy5vdmVybGF5Vmlldy5sYXRpdHVkZSA9IHRoaXMubGF0aXR1ZGVcbiAgICAgIHRoaXMub3ZlcmxheVZpZXcubG9uZ2l0dWRlID0gdGhpcy5sb25naXR1ZGVcbiAgICAgIHRoaXMub3ZlcmxheVZpZXcuekluZGV4ID0gdGhpcy56SW5kZXhcbiAgICAgIHRoaXMuZGVzdHJveSgpLnRoZW4oKCk9PnRoaXMubG9hZCgpKVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCl7XG4gICAgdGhpcy5kZXN0cm95KClcbiAgfVxuXG4gIGRlc3Ryb3koKTpQcm9taXNlPGFueT57XG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG5cbiAgICBjb25zdCBwcm9taXNlID0gdGhpcy5fbWFya2VyTWFuYWdlci5kZWxldGVNYXJrZXIoIHRoaXMub3ZlcmxheVZpZXcgKVxuICAgIFxuICAgIGlmKCB0aGlzLm92ZXJsYXlWaWV3ICl7XG4gICAgICBpZiggdGhpcy5vdmVybGF5Vmlldy5kaXYgKXtcbiAgICAgICAgdGhpcy5vdmVybGF5Vmlldy5yZW1vdmUoKVxuICAgICAgfVxuICAgICAgdGhpcy5vdmVybGF5Vmlldy5zZXRNYXAobnVsbClcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fb2JzZXJ2YWJsZVN1YnNjcmlwdGlvbnMuZm9yRWFjaCgocykgPT4gcy51bnN1YnNjcmliZSgpKVxuICAgIFxuICAgIGRlbGV0ZSB0aGlzLm92ZXJsYXlWaWV3XG4gICAgLy9kZWxldGUgdGhpcy5lbG1HdXRzXG5cbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG4gIFxuICBwcml2YXRlIGhhbmRsZUluZm9XaW5kb3dVcGRhdGUoKSB7XG4gICAgaWYgKHRoaXMuaW5mb1dpbmRvdy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG5vIG1vcmUgdGhhbiBvbmUgaW5mbyB3aW5kb3cuJyk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuaW5mb1dpbmRvdy5mb3JFYWNoKGlXaW4gPT4ge1xuICAgICAgaVdpbi5ob3N0TWFya2VyID0gPGFueT50aGlzLm92ZXJsYXlWaWV3XG4gICAgfSk7XG4gIH1cblxuICBsb2FkKCk6UHJvbWlzZTx2b2lkPntcbiAgICByZXR1cm4gdGhpcy5fbWFwc1dyYXBwZXIuZ2V0TmF0aXZlTWFwKClcbiAgICAudGhlbihtYXA9PntcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSB0aGlzLmdldE92ZXJsYXkoIG1hcCApXG5cbiAgICAgIHRoaXMuX21hcmtlck1hbmFnZXIuYWRkTWFya2VyKCA8YW55Pm92ZXJsYXkgKVxuICAgICAgdGhpcy5fYWRkRXZlbnRMaXN0ZW5lcnMoKVxuXG4gICAgICByZXR1cm4gdGhpcy5fbWFya2VyTWFuYWdlci5nZXROYXRpdmVNYXJrZXIoIG92ZXJsYXkgKVxuICAgIH0pXG4gICAgLnRoZW4obmF0aXZlTWFya2VyPT57XG4gICAgICBjb25zdCBzZXRNYXAgPSBuYXRpdmVNYXJrZXIuc2V0TWFwXG4gICAgICBpZiggbmF0aXZlTWFya2VyWydtYXAnXSApe1xuICAgICAgICB0aGlzLm92ZXJsYXlWaWV3LnNldE1hcCggbmF0aXZlTWFya2VyWydtYXAnXSApXG4gICAgICB9XG5cbiAgICAgIG5hdGl2ZU1hcmtlci5zZXRNYXAgPSAobWFwKT0+e1xuICAgICAgICBzZXRNYXAuY2FsbChuYXRpdmVNYXJrZXIsbWFwKVxuXG4gICAgICAgIGlmKCB0aGlzLm92ZXJsYXlWaWV3ICl7XG4gICAgICAgICAgdGhpcy5vdmVybGF5Vmlldy5zZXRNYXAobWFwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldE92ZXJsYXkoIG1hcCApe1xuICAgIHRoaXMub3ZlcmxheVZpZXcgPSB0aGlzLm92ZXJsYXlWaWV3IHx8IG5ldyBnb29nbGUubWFwcy5PdmVybGF5VmlldygpXG5cbiAgICAvKiBtYWtlIGludG8gZm9vIG1hcmtlciB0aGF0IEFHTSBsaWtlcyAqL1xuICAgICAgdGhpcy5vdmVybGF5Vmlldy5pY29uVXJsID0gXCIgXCJcbiAgICAgIHRoaXMub3ZlcmxheVZpZXcubGF0aXR1ZGUgPSB0aGlzLmxhdGl0dWRlXG4gICAgICB0aGlzLm92ZXJsYXlWaWV3LmxvbmdpdHVkZSA9IHRoaXMubG9uZ2l0dWRlXG4gICAgICB0aGlzLm92ZXJsYXlWaWV3LnZpc2libGUgPSBmYWxzZS8vaGlkZSA0MHg0MCB0cmFuc3BhcmVudCBwbGFjZWhvbGRlciB0aGF0IHByZXZlbnRzIGhvdmVyIGV2ZW50c1xuICAgIC8qIGVuZCAqL1xuXG4gICAgaWYoIHRoaXMuYm91bmRzICl7XG4gICAgICB0aGlzLm92ZXJsYXlWaWV3LmJvdW5kc18gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKFxuICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxuICAgICAgICAgIHRoaXMubGF0aXR1ZGUgKyB0aGlzLmJvdW5kcy54LmxhdGl0dWRlLFxuICAgICAgICAgIHRoaXMubG9uZ2l0dWRlICsgdGhpcy5ib3VuZHMueC5sb25naXR1ZGVcbiAgICAgICAgKSxcbiAgICAgICAgbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhcbiAgICAgICAgICB0aGlzLmxhdGl0dWRlICsgdGhpcy5ib3VuZHMueS5sYXRpdHVkZSxcbiAgICAgICAgICB0aGlzLmxvbmdpdHVkZSArIHRoaXMuYm91bmRzLnkubG9uZ2l0dWRlXG4gICAgICAgIClcbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBqcy1tYXJrZXItY2x1c3RlcmVyIGRvZXMgbm90IHN1cHBvcnQgdXBkYXRpbmcgcG9zaXRpb25zLiBXZSBhcmUgZm9yY2VkIHRvIGRlbGV0ZS9hZGQgYW5kIGNvbXBlbnNhdGUgZm9yIC5yZW1vdmVDaGlsZCBjYWxsc1xuICAgIGNvbnN0IGVsbSA9IHRoaXMudGVtcGxhdGUubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXVxuICAgIC8vY29uc3QgZWxtID0gIHRoaXMuZWxtR3V0cyB8fCB0aGlzLnRlbXBsYXRlLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF1cblxuICAgIC8vd2UgbXVzdCBhbHdheXMgYmUgc3VyZSB0byBzdGVhbCBvdXIgc3RvbGVuIGVsZW1lbnQgYmFjayBpbmNhc2Ugd2UgYXJlIGp1c3QgaW4gbWlkZGxlIG9mIGNoYW5nZXMgYW5kIHdpbGwgcmVkcmF3XG4gICAgY29uc3QgcmVzdG9yZSA9IChkaXYpPT57XG4gICAgICB0aGlzLnRlbXBsYXRlLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoIGRpdiApXG4gICAgfVxuXG4gICAgdGhpcy5vdmVybGF5Vmlldy5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgICAgaWYoIXRoaXMuZGl2KXJldHVyblxuICAgICAgdGhpcy5kaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmRpdik7XG4gICAgICByZXN0b3JlKCB0aGlzLmRpdiApXG4gICAgICBkZWxldGUgdGhpcy5kaXZcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlWaWV3LmdldERpdiA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5kaXZcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlWaWV3LmRyYXcgPSBmdW5jdGlvbigpe1xuICAgICAgaWYgKCAhdGhpcy5kaXYgKSB7XG4gICAgICAgIHRoaXMuZGl2ID0gZWxtXG4gICAgICAgIGNvbnN0IHBhbmVzID0gdGhpcy5nZXRQYW5lcygpXG4gICAgICAgIC8vIGlmIG5vIHBhbmVzIHRoZW4gYXNzdW1lZCBub3Qgb24gbWFwXG4gICAgICAgIGlmKCFwYW5lcyB8fCAhcGFuZXMub3ZlcmxheUltYWdlKXJldHVyblxuXG4gICAgICAgIHBhbmVzLm92ZXJsYXlJbWFnZS5hcHBlbmRDaGlsZCggZWxtIClcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyh0aGlzLmxhdGl0dWRlLHRoaXMubG9uZ2l0dWRlKVxuXG4gICAgICBjb25zdCBwcm9qID0gdGhpcy5nZXRQcm9qZWN0aW9uKClcbiAgICAgIGlmKCFwcm9qKXJldHVyblxuXG4gICAgICBjb25zdCBwb2ludCA9IHByb2ouZnJvbUxhdExuZ1RvRGl2UGl4ZWwoIGxhdGxuZyApXG5cbiAgICAgIGlmIChwb2ludCkge1xuICAgICAgICBlbG0uc3R5bGUubGVmdCA9IChwb2ludC54IC0gMTApICsgJ3B4J1xuICAgICAgICBlbG0uc3R5bGUudG9wID0gKHBvaW50LnkgLSAyMCkgKyAncHgnXG4gICAgICB9ICAgICAgICBcblxuICAgICAgaWYoIHRoaXMuYm91bmRzXyApe1xuICAgICAgICAvLyBzdHJldGNoIGNvbnRlbnQgYmV0d2VlbiB0d28gcG9pbnRzIGxlZnRib3R0b20gYW5kIHJpZ2h0dG9wIGFuZCByZXNpemVcbiAgICAgICAgY29uc3QgcHJvaiA9IHRoaXMuZ2V0UHJvamVjdGlvbigpXG4gICAgICAgIGNvbnN0IHN3ID0gcHJvai5mcm9tTGF0TG5nVG9EaXZQaXhlbCh0aGlzLmJvdW5kc18uZ2V0U291dGhXZXN0KCkpXG4gICAgICAgIGNvbnN0IG5lID0gcHJvai5mcm9tTGF0TG5nVG9EaXZQaXhlbCh0aGlzLmJvdW5kc18uZ2V0Tm9ydGhFYXN0KCkpXG4gIFxuICAgICAgICB0aGlzLmRpdi5zdHlsZS5sZWZ0ID0gc3cueCArICdweCdcbiAgICAgICAgdGhpcy5kaXYuc3R5bGUudG9wID0gbmUueSArICdweCdcbiAgICAgICAgdGhpcy5kaXYuY2hpbGRyZW5bMF0uc3R5bGUud2lkdGggPSBuZS54IC0gc3cueCArICdweCdcbiAgICAgICAgdGhpcy5kaXYuY2hpbGRyZW5bMF0uc3R5bGUuaGVpZ2h0ID0gc3cueSAtIG5lLnkgKyAncHgnXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudD0+e1xuICAgICAgdGhpcy5oYW5kbGVUYXAoKVxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9KVxuXG4gICAgdGhpcy5oYW5kbGVJbmZvV2luZG93VXBkYXRlKClcblxuICAgIHJldHVybiB0aGlzLm92ZXJsYXlWaWV3XG4gIH1cblxuICBoYW5kbGVUYXAoKXtcbiAgICBpZiAodGhpcy5vcGVuSW5mb1dpbmRvdykge1xuICAgICAgdGhpcy5pbmZvV2luZG93LmZvckVhY2goaW5mb1dpbmRvdz0+e1xuICAgICAgICBpbmZvV2luZG93Lm9wZW4oKVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5tYXJrZXJDbGljay5lbWl0KG51bGwpO1xuICB9XG5cbiAgX2FkZEV2ZW50TGlzdGVuZXJzKCl7XG4gICAgY29uc3QgZW8gPSB0aGlzLl9tYXJrZXJNYW5hZ2VyLmNyZWF0ZUV2ZW50T2JzZXJ2YWJsZSgnY2xpY2snLCA8YW55PnRoaXMub3ZlcmxheVZpZXcpXG4gICAgY29uc3QgY3MgPSBlby5zdWJzY3JpYmUoKCkgPT4gdGhpcy5oYW5kbGVUYXAoKSlcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5wdXNoKGNzKVxuICB9XG59XG4iXX0=