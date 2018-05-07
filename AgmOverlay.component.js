"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@agm/core");
var AgmOverlay = (function () {
    function AgmOverlay(_mapsWrapper, _markerManager) {
        this._mapsWrapper = _mapsWrapper;
        this._markerManager = _markerManager;
        this.visible = true;
    }
    AgmOverlay.prototype.ngOnChanges = function (changes) {
        if ((changes.latitude || changes.longitude)) {
            if (this.overlayView && this.overlayView.draw) {
                this.overlayView.draw();
            }
            else {
                this.load();
            }
        }
    };
    AgmOverlay.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    AgmOverlay.prototype.destroy = function () {
        this.overlayView.setMap(null);
        delete this.overlayView;
    };
    AgmOverlay.prototype.load = function () {
        var _this = this;
        this._mapsWrapper.getNativeMap()
            .then(function (map) {
            _this.drawOnMap(map);
            _this._markerManager.addMarker(_this.overlayView);
            return _this._markerManager.getNativeMarker(_this.overlayView);
        })
            .then(function (nativeMarker) {
            var setMap = nativeMarker.setMap;
            nativeMarker.setMap = function (map) {
                setMap.call(nativeMarker, map);
                _this.overlayView.setMap(map);
            };
        });
    };
    AgmOverlay.prototype.drawOnMap = function (map) {
        this.overlayView = this.overlayView || new google.maps.OverlayView();
        this.overlayView.iconUrl = " ";
        this.overlayView.latitude = this.latitude;
        this.overlayView.longitude = this.longitude;
        var latlng = new google.maps.LatLng(this.latitude, this.longitude);
        var elm = this.template.nativeElement.children[0];
        this.overlayView.remove = function () {
            this.div.parentNode.removeChild(this.div);
            delete this.div;
        };
        this.overlayView.draw = function () {
            if (!this.div) {
                this.div = elm;
                this.getPanes().overlayImage.appendChild(elm);
            }
            var point = this.getProjection().fromLatLngToDivPixel(latlng);
            if (point) {
                elm.style.left = (point.x - 10) + 'px';
                elm.style.top = (point.y - 20) + 'px';
            }
        };
    };
    AgmOverlay.decorators = [
        { type: core_1.Component, args: [{
                    selector: "agm-overlay",
                    template: '<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
                },] },
    ];
    AgmOverlay.ctorParameters = function () { return [
        { type: core_2.GoogleMapsAPIWrapper, },
        { type: core_2.MarkerManager, },
    ]; };
    AgmOverlay.propDecorators = {
        "latitude": [{ type: core_1.Input },],
        "longitude": [{ type: core_1.Input },],
        "visible": [{ type: core_1.Input },],
        "template": [{ type: core_1.ViewChild, args: ['content', { read: core_1.ElementRef },] },],
    };
    return AgmOverlay;
}());
exports.AgmOverlay = AgmOverlay;
