import { __decorate } from 'tslib';
import { EventEmitter, QueryList, Input, Output, ContentChildren, ViewChild, ElementRef, Component, NgModule } from '@angular/core';
import { GoogleMapsAPIWrapper, MarkerManager, AgmInfoWindow } from '@agm/core';
import { CommonModule } from '@angular/common';

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

var AgmOverlays = /** @class */ (function () {
    function AgmOverlays() {
    }
    AgmOverlays = __decorate([
        NgModule({
            imports: [
                CommonModule
            ],
            declarations: [AgmOverlay],
            exports: [AgmOverlay],
        })
    ], AgmOverlays);
    return AgmOverlays;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { AgmOverlay, AgmOverlays };
//# sourceMappingURL=agm-overlays.js.map
