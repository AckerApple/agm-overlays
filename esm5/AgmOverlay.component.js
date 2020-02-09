import { __decorate } from "tslib";
import { Input, Component, Output, EventEmitter, ViewChild, ElementRef, QueryList, ContentChildren } from "@angular/core";
import { AgmInfoWindow, LatLngBounds, LatLng, MarkerManager, GoogleMapsAPIWrapper, AgmMarker } from "@agm/core";
var AgmOverlay = /** @class */ (function () {
    function AgmOverlay(_mapsWrapper, _markerManager //rename to fight the private declaration of parent
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
    AgmOverlay.prototype.ngAfterViewInit = function () {
        var _this = this;
        //remove reference of info windows
        var iWins = this.template.nativeElement.getElementsByTagName('agm-info-window');
        for (var x = iWins.length - 1; x >= 0; --x) {
            iWins[x].parentNode.removeChild(iWins[x]);
        }
        this.load().then(function () {
            _this.onChanges = _this.onChangesOverride;
        });
    };
    AgmOverlay.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.infoWindow.changes.subscribe(function () { return _this.handleInfoWindowUpdate(); });
    };
    AgmOverlay.prototype.ngOnChanges = function (changes) {
        this.onChanges(changes);
    };
    AgmOverlay.prototype.onChanges = function (changes) { };
    AgmOverlay.prototype.onChangesOverride = function (changes) {
        var _this = this;
        if (changes.latitude || changes.longitude || changes.zIndex) {
            this.overlayView.latitude = this.latitude;
            this.overlayView.longitude = this.longitude;
            this.overlayView.zIndex = this.zIndex;
            this.destroy().then(function () { return _this.load(); });
        }
    };
    AgmOverlay.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    AgmOverlay.prototype.destroy = function () {
        this.destroyed = true;
        var promise = this._markerManager.deleteMarker(this.overlayView);
        if (this.overlayView) {
            if (this.overlayView.div) {
                this.overlayView.remove();
            }
            this.overlayView.setMap(null);
        }
        this._observableSubscriptions.forEach(function (s) { return s.unsubscribe(); });
        delete this.overlayView;
        //delete this.elmGuts
        return promise;
    };
    AgmOverlay.prototype.handleInfoWindowUpdate = function () {
        var _this = this;
        if (this.infoWindow.length > 1) {
            throw new Error('Expected no more than one info window.');
        }
        this.infoWindow.forEach(function (iWin) {
            iWin.hostMarker = _this.overlayView;
        });
    };
    AgmOverlay.prototype.load = function () {
        var _this = this;
        return this._mapsWrapper.getNativeMap()
            .then(function (map) {
            var overlay = _this.getOverlay(map);
            _this._markerManager.addMarker(overlay);
            _this._addEventListeners();
            return _this._markerManager.getNativeMarker(overlay);
        })
            .then(function (nativeMarker) {
            var setMap = nativeMarker.setMap;
            if (nativeMarker['map']) {
                _this.overlayView.setMap(nativeMarker['map']);
            }
            nativeMarker.setMap = function (map) {
                setMap.call(nativeMarker, map);
                if (_this.overlayView) {
                    _this.overlayView.setMap(map);
                }
            };
        });
    };
    AgmOverlay.prototype.getOverlay = function (map) {
        var _this = this;
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
        var elm = this.template.nativeElement.children[0];
        //const elm =  this.elmGuts || this.template.nativeElement.children[0]
        //we must always be sure to steal our stolen element back incase we are just in middle of changes and will redraw
        var restore = function (div) {
            _this.template.nativeElement.appendChild(div);
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
                var panes = this.getPanes();
                // if no panes then assumed not on map
                if (!panes || !panes.overlayImage)
                    return;
                panes.overlayImage.appendChild(elm);
            }
            var latlng = new google.maps.LatLng(this.latitude, this.longitude);
            var proj = this.getProjection();
            if (!proj)
                return;
            var point = proj.fromLatLngToDivPixel(latlng);
            if (point) {
                elm.style.left = (point.x - 10) + 'px';
                elm.style.top = (point.y - 20) + 'px';
            }
            if (this.bounds_) {
                // stretch content between two points leftbottom and righttop and resize
                var proj_1 = this.getProjection();
                var sw = proj_1.fromLatLngToDivPixel(this.bounds_.getSouthWest());
                var ne = proj_1.fromLatLngToDivPixel(this.bounds_.getNorthEast());
                this.div.style.left = sw.x + 'px';
                this.div.style.top = ne.y + 'px';
                this.div.children[0].style.width = ne.x - sw.x + 'px';
                this.div.children[0].style.height = sw.y - ne.y + 'px';
            }
        };
        elm.addEventListener("click", function (event) {
            _this.handleTap();
            event.stopPropagation();
        });
        this.handleInfoWindowUpdate();
        return this.overlayView;
    };
    AgmOverlay.prototype.handleTap = function () {
        if (this.openInfoWindow) {
            this.infoWindow.forEach(function (infoWindow) {
                infoWindow.open();
            });
        }
        this.markerClick.emit(null);
    };
    AgmOverlay.prototype._addEventListeners = function () {
        var _this = this;
        var eo = this._markerManager.createEventObservable('click', this.overlayView);
        var cs = eo.subscribe(function () { return _this.handleTap(); });
        this._observableSubscriptions.push(cs);
    };
    AgmOverlay.ctorParameters = function () { return [
        { type: GoogleMapsAPIWrapper },
        { type: MarkerManager //rename to fight the private declaration of parent
         }
    ]; };
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
    return AgmOverlay;
}());
export { AgmOverlay };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdtT3ZlcmxheS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hZ20tb3ZlcmxheXMvIiwic291cmNlcyI6WyJBZ21PdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFDekIsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQzdDLGVBQWUsRUFDaEIsTUFBTSxlQUFlLENBQUE7QUFFdEIsT0FBTyxFQUNMLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFDbEQsb0JBQW9CLEVBQUUsU0FBUyxFQUNoQyxNQUFNLFdBQVcsQ0FBQTtBQXdCZjtJQXdCRCxvQkFDWSxZQUFrQyxFQUNwQyxjQUE2QixDQUFBLG1EQUFtRDs7UUFEOUUsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBQ3BDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBdEI5QixZQUFPLEdBQVksSUFBSSxDQUFBLENBQUEsMkVBQTJFO1FBQ2xHLFdBQU0sR0FBVyxDQUFDLENBQUE7UUFHM0IsdUVBQXVFO1FBQzdELGdCQUFXLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUE7UUFFM0QsbUJBQWMsR0FBWSxJQUFJLENBQUE7UUFDUCxlQUFVLEdBQTZCLElBQUksU0FBUyxFQUFpQixDQUFBO1FBRXJHLHNCQUFzQjtRQUNJLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFNcEQsYUFBYTtRQUNMLDZCQUF3QixHQUFtQixFQUFFLENBQUE7SUFLbkQsQ0FBQztJQUVILG9DQUFlLEdBQWY7UUFBQSxpQkFVQztRQVRDLGtDQUFrQztRQUNsQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1FBQ2pGLEtBQUksSUFBSSxDQUFDLEdBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxDQUFDLEVBQUUsQ0FB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QTlOZSxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcInJ4anNcIlxuXG5pbXBvcnQge1xuICBJbnB1dCwgQ29tcG9uZW50LCBPdXRwdXQsIEV2ZW50RW1pdHRlcixcbiAgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgUXVlcnlMaXN0LFxuICBDb250ZW50Q2hpbGRyZW5cbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIlxuXG5pbXBvcnQge1xuICBBZ21JbmZvV2luZG93LCBMYXRMbmdCb3VuZHMsIExhdExuZywgTWFya2VyTWFuYWdlcixcbiAgR29vZ2xlTWFwc0FQSVdyYXBwZXIsIEFnbU1hcmtlclxufSBmcm9tIFwiQGFnbS9jb3JlXCJcblxuaW1wb3J0IHsgR29vZ2xlTWFwIH0gZnJvbSBcIkBhZ20vY29yZS9zZXJ2aWNlcy9nb29nbGUtbWFwcy10eXBlc1wiXG5kZWNsYXJlIHZhciBnb29nbGU6IGFueVxuXG5leHBvcnQgaW50ZXJmYWNlIGxhdExuZ3tcbiAgbGF0aXR1ZGUgIDogbnVtYmVyXG4gIGxvbmdpdHVkZSA6IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIGJvdW5kc3tcbiAgeDogbGF0TG5nLy9yZWxhdGl2ZSBhZGp1c3RtZW50IG1hdGhlbWF0aWNzXG4gIHk6IGxhdExuZy8vcmVsYXRpdmUgYWRqdXN0bWVudCBtYXRoZW1hdGljc1xufSBcblxuZXhwb3J0IGludGVyZmFjZSBsYXRMbmdQbHVze1xuICBsYXRpdHVkZSAgOiBudW1iZXJcbiAgbG9uZ2l0dWRlIDogbnVtYmVyXG4gIGJvdW5kcz8gICA6IGJvdW5kc1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6XCJhZ20tb3ZlcmxheVwiLFxuICB0ZW1wbGF0ZTonPGRpdiAjY29udGVudD48ZGl2IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGVcIj48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9kaXY+PC9kaXY+J1xufSkgZXhwb3J0IGNsYXNzIEFnbU92ZXJsYXl7XG4gIEBJbnB1dCgpIGxhdGl0dWRlOm51bWJlclxuICBASW5wdXQoKSBsb25naXR1ZGU6bnVtYmVyXG4gIFxuICBASW5wdXQoKSB2aXNpYmxlOiBib29sZWFuID0gdHJ1ZS8vcG9zc2libHkgZG9lc24ndCB3b3JrIGFuZCBqdXN0IGxlZnQgb3ZlciBmcm9tIGFnbS1jb3JlIG1hcmtlciByZXBsaWNhdGlvblxuICBASW5wdXQoKSB6SW5kZXg6IG51bWJlciA9IDFcbiAgQElucHV0KCkgYm91bmRzOmJvdW5kc1xuICBcbiAgLy9USVA6IERvIE5PVCB1c2UgdGhpcy4uLiBKdXN0IHB1dCAoY2xpY2spIG9uIHlvdXIgaHRtbCBvdmVybGF5IGVsZW1lbnRcbiAgQE91dHB1dCgpIG1hcmtlckNsaWNrOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KClcbiAgXG4gIEBJbnB1dCgpIG9wZW5JbmZvV2luZG93OiBib29sZWFuID0gdHJ1ZVxuICBAQ29udGVudENoaWxkcmVuKEFnbUluZm9XaW5kb3cpIGluZm9XaW5kb3c6IFF1ZXJ5TGlzdDxBZ21JbmZvV2luZG93PiA9IG5ldyBRdWVyeUxpc3Q8QWdtSW5mb1dpbmRvdz4oKVxuXG4gIC8vVE9ETywgaW1wbGVtZW50IHRoaXNcbiAgQElucHV0KCdtYXJrZXJEcmFnZ2FibGUnKSBkcmFnZ2FibGU6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgdGVtcGxhdGU6IEVsZW1lbnRSZWZcblxuICBkZXN0cm95ZWQ6Ym9vbGVhblxuICBvdmVybGF5VmlldzphbnlcbiAgLy9lbG1HdXRzOmFueVxuICBwcml2YXRlIF9vYnNlcnZhYmxlU3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfbWFwc1dyYXBwZXI6IEdvb2dsZU1hcHNBUElXcmFwcGVyLFxuICAgIHByaXZhdGUgX21hcmtlck1hbmFnZXI6IE1hcmtlck1hbmFnZXIvL3JlbmFtZSB0byBmaWdodCB0aGUgcHJpdmF0ZSBkZWNsYXJhdGlvbiBvZiBwYXJlbnRcbiAgKXt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCl7XG4gICAgLy9yZW1vdmUgcmVmZXJlbmNlIG9mIGluZm8gd2luZG93c1xuICAgIGNvbnN0IGlXaW5zID0gdGhpcy50ZW1wbGF0ZS5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhZ20taW5mby13aW5kb3cnKVxuICAgIGZvcihsZXQgeD1pV2lucy5sZW5ndGgtMTsgeCA+PSAwOyAtLXgpe1xuICAgICAgaVdpbnNbeF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpV2luc1t4XSlcbiAgICB9XG5cbiAgICB0aGlzLmxvYWQoKS50aGVuKCgpPT57XG4gICAgICB0aGlzLm9uQ2hhbmdlcyA9IHRoaXMub25DaGFuZ2VzT3ZlcnJpZGVcbiAgICB9KVxuICB9XG4gIFxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5pbmZvV2luZG93LmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuaGFuZGxlSW5mb1dpbmRvd1VwZGF0ZSgpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCBjaGFuZ2VzICl7XG4gICAgdGhpcy5vbkNoYW5nZXMoY2hhbmdlcylcbiAgfVxuXG4gIG9uQ2hhbmdlcyggY2hhbmdlcyApe31cblxuICBvbkNoYW5nZXNPdmVycmlkZSggY2hhbmdlcyApe1xuICAgIGlmKCBjaGFuZ2VzLmxhdGl0dWRlIHx8IGNoYW5nZXMubG9uZ2l0dWRlIHx8IGNoYW5nZXMuekluZGV4ICl7XG4gICAgICB0aGlzLm92ZXJsYXlWaWV3LmxhdGl0dWRlID0gdGhpcy5sYXRpdHVkZVxuICAgICAgdGhpcy5vdmVybGF5Vmlldy5sb25naXR1ZGUgPSB0aGlzLmxvbmdpdHVkZVxuICAgICAgdGhpcy5vdmVybGF5Vmlldy56SW5kZXggPSB0aGlzLnpJbmRleFxuICAgICAgdGhpcy5kZXN0cm95KCkudGhlbigoKT0+dGhpcy5sb2FkKCkpXG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKXtcbiAgICB0aGlzLmRlc3Ryb3koKVxuICB9XG5cbiAgZGVzdHJveSgpOlByb21pc2U8YW55PntcbiAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWVcblxuICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLl9tYXJrZXJNYW5hZ2VyLmRlbGV0ZU1hcmtlciggdGhpcy5vdmVybGF5VmlldyApXG4gICAgXG4gICAgaWYoIHRoaXMub3ZlcmxheVZpZXcgKXtcbiAgICAgIGlmKCB0aGlzLm92ZXJsYXlWaWV3LmRpdiApe1xuICAgICAgICB0aGlzLm92ZXJsYXlWaWV3LnJlbW92ZSgpXG4gICAgICB9XG4gICAgICB0aGlzLm92ZXJsYXlWaWV3LnNldE1hcChudWxsKVxuICAgIH1cbiAgICBcbiAgICB0aGlzLl9vYnNlcnZhYmxlU3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzKSA9PiBzLnVuc3Vic2NyaWJlKCkpXG4gICAgXG4gICAgZGVsZXRlIHRoaXMub3ZlcmxheVZpZXdcbiAgICAvL2RlbGV0ZSB0aGlzLmVsbUd1dHNcblxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cbiAgXG4gIHByaXZhdGUgaGFuZGxlSW5mb1dpbmRvd1VwZGF0ZSgpIHtcbiAgICBpZiAodGhpcy5pbmZvV2luZG93Lmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgbm8gbW9yZSB0aGFuIG9uZSBpbmZvIHdpbmRvdy4nKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pbmZvV2luZG93LmZvckVhY2goaVdpbiA9PiB7XG4gICAgICBpV2luLmhvc3RNYXJrZXIgPSA8YW55PnRoaXMub3ZlcmxheVZpZXdcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWQoKTpQcm9taXNlPHZvaWQ+e1xuICAgIHJldHVybiB0aGlzLl9tYXBzV3JhcHBlci5nZXROYXRpdmVNYXAoKVxuICAgIC50aGVuKG1hcD0+e1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IHRoaXMuZ2V0T3ZlcmxheSggbWFwIClcblxuICAgICAgdGhpcy5fbWFya2VyTWFuYWdlci5hZGRNYXJrZXIoIDxhbnk+b3ZlcmxheSApXG4gICAgICB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpXG5cbiAgICAgIHJldHVybiB0aGlzLl9tYXJrZXJNYW5hZ2VyLmdldE5hdGl2ZU1hcmtlciggb3ZlcmxheSApXG4gICAgfSlcbiAgICAudGhlbihuYXRpdmVNYXJrZXI9PntcbiAgICAgIGNvbnN0IHNldE1hcCA9IG5hdGl2ZU1hcmtlci5zZXRNYXBcbiAgICAgIGlmKCBuYXRpdmVNYXJrZXJbJ21hcCddICl7XG4gICAgICAgIHRoaXMub3ZlcmxheVZpZXcuc2V0TWFwKCBuYXRpdmVNYXJrZXJbJ21hcCddIClcbiAgICAgIH1cblxuICAgICAgbmF0aXZlTWFya2VyLnNldE1hcCA9IChtYXApPT57XG4gICAgICAgIHNldE1hcC5jYWxsKG5hdGl2ZU1hcmtlcixtYXApXG5cbiAgICAgICAgaWYoIHRoaXMub3ZlcmxheVZpZXcgKXtcbiAgICAgICAgICB0aGlzLm92ZXJsYXlWaWV3LnNldE1hcChtYXApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0T3ZlcmxheSggbWFwICl7XG4gICAgdGhpcy5vdmVybGF5VmlldyA9IHRoaXMub3ZlcmxheVZpZXcgfHwgbmV3IGdvb2dsZS5tYXBzLk92ZXJsYXlWaWV3KClcblxuICAgIC8qIG1ha2UgaW50byBmb28gbWFya2VyIHRoYXQgQUdNIGxpa2VzICovXG4gICAgICB0aGlzLm92ZXJsYXlWaWV3Lmljb25VcmwgPSBcIiBcIlxuICAgICAgdGhpcy5vdmVybGF5Vmlldy5sYXRpdHVkZSA9IHRoaXMubGF0aXR1ZGVcbiAgICAgIHRoaXMub3ZlcmxheVZpZXcubG9uZ2l0dWRlID0gdGhpcy5sb25naXR1ZGVcbiAgICAgIHRoaXMub3ZlcmxheVZpZXcudmlzaWJsZSA9IGZhbHNlLy9oaWRlIDQweDQwIHRyYW5zcGFyZW50IHBsYWNlaG9sZGVyIHRoYXQgcHJldmVudHMgaG92ZXIgZXZlbnRzXG4gICAgLyogZW5kICovXG5cbiAgICBpZiggdGhpcy5ib3VuZHMgKXtcbiAgICAgIHRoaXMub3ZlcmxheVZpZXcuYm91bmRzXyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoXG4gICAgICAgIG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXG4gICAgICAgICAgdGhpcy5sYXRpdHVkZSArIHRoaXMuYm91bmRzLngubGF0aXR1ZGUsXG4gICAgICAgICAgdGhpcy5sb25naXR1ZGUgKyB0aGlzLmJvdW5kcy54LmxvbmdpdHVkZVxuICAgICAgICApLFxuICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFxuICAgICAgICAgIHRoaXMubGF0aXR1ZGUgKyB0aGlzLmJvdW5kcy55LmxhdGl0dWRlLFxuICAgICAgICAgIHRoaXMubG9uZ2l0dWRlICsgdGhpcy5ib3VuZHMueS5sb25naXR1ZGVcbiAgICAgICAgKVxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIGpzLW1hcmtlci1jbHVzdGVyZXIgZG9lcyBub3Qgc3VwcG9ydCB1cGRhdGluZyBwb3NpdGlvbnMuIFdlIGFyZSBmb3JjZWQgdG8gZGVsZXRlL2FkZCBhbmQgY29tcGVuc2F0ZSBmb3IgLnJlbW92ZUNoaWxkIGNhbGxzXG4gICAgY29uc3QgZWxtID0gdGhpcy50ZW1wbGF0ZS5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdXG4gICAgLy9jb25zdCBlbG0gPSAgdGhpcy5lbG1HdXRzIHx8IHRoaXMudGVtcGxhdGUubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXVxuXG4gICAgLy93ZSBtdXN0IGFsd2F5cyBiZSBzdXJlIHRvIHN0ZWFsIG91ciBzdG9sZW4gZWxlbWVudCBiYWNrIGluY2FzZSB3ZSBhcmUganVzdCBpbiBtaWRkbGUgb2YgY2hhbmdlcyBhbmQgd2lsbCByZWRyYXdcbiAgICBjb25zdCByZXN0b3JlID0gKGRpdik9PntcbiAgICAgIHRoaXMudGVtcGxhdGUubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCggZGl2IClcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlWaWV3LnJlbW92ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpZighdGhpcy5kaXYpcmV0dXJuXG4gICAgICB0aGlzLmRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZGl2KTtcbiAgICAgIHJlc3RvcmUoIHRoaXMuZGl2IClcbiAgICAgIGRlbGV0ZSB0aGlzLmRpdlxuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheVZpZXcuZ2V0RGl2ID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLmRpdlxuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheVZpZXcuZHJhdyA9IGZ1bmN0aW9uKCl7XG4gICAgICBpZiAoICF0aGlzLmRpdiApIHtcbiAgICAgICAgdGhpcy5kaXYgPSBlbG1cbiAgICAgICAgY29uc3QgcGFuZXMgPSB0aGlzLmdldFBhbmVzKClcbiAgICAgICAgLy8gaWYgbm8gcGFuZXMgdGhlbiBhc3N1bWVkIG5vdCBvbiBtYXBcbiAgICAgICAgaWYoIXBhbmVzIHx8ICFwYW5lcy5vdmVybGF5SW1hZ2UpcmV0dXJuXG5cbiAgICAgICAgcGFuZXMub3ZlcmxheUltYWdlLmFwcGVuZENoaWxkKCBlbG0gKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHRoaXMubGF0aXR1ZGUsdGhpcy5sb25naXR1ZGUpXG5cbiAgICAgIGNvbnN0IHByb2ogPSB0aGlzLmdldFByb2plY3Rpb24oKVxuICAgICAgaWYoIXByb2opcmV0dXJuXG5cbiAgICAgIGNvbnN0IHBvaW50ID0gcHJvai5mcm9tTGF0TG5nVG9EaXZQaXhlbCggbGF0bG5nIClcblxuICAgICAgaWYgKHBvaW50KSB7XG4gICAgICAgIGVsbS5zdHlsZS5sZWZ0ID0gKHBvaW50LnggLSAxMCkgKyAncHgnXG4gICAgICAgIGVsbS5zdHlsZS50b3AgPSAocG9pbnQueSAtIDIwKSArICdweCdcbiAgICAgIH0gICAgICAgIFxuXG4gICAgICBpZiggdGhpcy5ib3VuZHNfICl7XG4gICAgICAgIC8vIHN0cmV0Y2ggY29udGVudCBiZXR3ZWVuIHR3byBwb2ludHMgbGVmdGJvdHRvbSBhbmQgcmlnaHR0b3AgYW5kIHJlc2l6ZVxuICAgICAgICBjb25zdCBwcm9qID0gdGhpcy5nZXRQcm9qZWN0aW9uKClcbiAgICAgICAgY29uc3Qgc3cgPSBwcm9qLmZyb21MYXRMbmdUb0RpdlBpeGVsKHRoaXMuYm91bmRzXy5nZXRTb3V0aFdlc3QoKSlcbiAgICAgICAgY29uc3QgbmUgPSBwcm9qLmZyb21MYXRMbmdUb0RpdlBpeGVsKHRoaXMuYm91bmRzXy5nZXROb3J0aEVhc3QoKSlcbiAgXG4gICAgICAgIHRoaXMuZGl2LnN0eWxlLmxlZnQgPSBzdy54ICsgJ3B4J1xuICAgICAgICB0aGlzLmRpdi5zdHlsZS50b3AgPSBuZS55ICsgJ3B4J1xuICAgICAgICB0aGlzLmRpdi5jaGlsZHJlblswXS5zdHlsZS53aWR0aCA9IG5lLnggLSBzdy54ICsgJ3B4J1xuICAgICAgICB0aGlzLmRpdi5jaGlsZHJlblswXS5zdHlsZS5oZWlnaHQgPSBzdy55IC0gbmUueSArICdweCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbG0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50PT57XG4gICAgICB0aGlzLmhhbmRsZVRhcCgpXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH0pXG5cbiAgICB0aGlzLmhhbmRsZUluZm9XaW5kb3dVcGRhdGUoKVxuXG4gICAgcmV0dXJuIHRoaXMub3ZlcmxheVZpZXdcbiAgfVxuXG4gIGhhbmRsZVRhcCgpe1xuICAgIGlmICh0aGlzLm9wZW5JbmZvV2luZG93KSB7XG4gICAgICB0aGlzLmluZm9XaW5kb3cuZm9yRWFjaChpbmZvV2luZG93PT57XG4gICAgICAgIGluZm9XaW5kb3cub3BlbigpXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLm1hcmtlckNsaWNrLmVtaXQobnVsbCk7XG4gIH1cblxuICBfYWRkRXZlbnRMaXN0ZW5lcnMoKXtcbiAgICBjb25zdCBlbyA9IHRoaXMuX21hcmtlck1hbmFnZXIuY3JlYXRlRXZlbnRPYnNlcnZhYmxlKCdjbGljaycsIDxhbnk+dGhpcy5vdmVybGF5VmlldylcbiAgICBjb25zdCBjcyA9IGVvLnN1YnNjcmliZSgoKSA9PiB0aGlzLmhhbmRsZVRhcCgpKVxuICAgIHRoaXMuX29ic2VydmFibGVTdWJzY3JpcHRpb25zLnB1c2goY3MpXG4gIH1cbn1cbiJdfQ==