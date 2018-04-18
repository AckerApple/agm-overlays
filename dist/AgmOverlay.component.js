"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@agm/core");
var AgmOverlay = (function () {
    function AgmOverlay(_mapsWrapper) {
        this._mapsWrapper = _mapsWrapper;
    }
    AgmOverlay.prototype.ngOnChanges = function (changes) {
        if ((changes.latitude || changes.longitude) && this.overlayView) {
            this.destroy();
            this.load();
        }
    };
    AgmOverlay.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    AgmOverlay.prototype.destroy = function () {
        var div = this.overlayView.div;
        div.parentNode.removeChild(div);
        delete this.overlayView.div;
        this.overlayView.setMap(null);
        delete this.overlayView;
    };
    AgmOverlay.prototype.ngAfterViewInit = function () {
        this.load();
    };
    AgmOverlay.prototype.load = function () {
        var _this = this;
        return this._mapsWrapper.getNativeMap()
            .then(function (map) { return _this.loadByMap(map); });
    };
    AgmOverlay.prototype.loadByMap = function (map) {
        this.drawOnMap(map);
        var latlng = new google.maps.LatLng(this.latitude, this.longitude);
        this.addBounds(latlng, map);
    };
    AgmOverlay.prototype.addBounds = function (latlng, map) {
        var bounds = map.getBounds() || map['bounds'];
        if (!bounds) {
            bounds = new google.maps.LatLngBounds();
            map['bounds'] = bounds;
        }
        bounds.extend(latlng);
        this._mapsWrapper.fitBounds(bounds);
    };
    AgmOverlay.prototype.drawOnMap = function (map) {
        this.overlayView = this.overlayView || new google.maps.OverlayView();
        var latlng = new google.maps.LatLng(this.latitude, this.longitude);
        var elm = this.template.nativeElement.children[0];
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
        this.overlayView.setMap(map);
    };
    AgmOverlay.decorators = [
        { type: core_1.Component, args: [{
                    selector: "agm-overlay",
                    template: '<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
                },] },
    ];
    AgmOverlay.ctorParameters = function () { return [
        { type: core_2.GoogleMapsAPIWrapper, },
    ]; };
    AgmOverlay.propDecorators = {
        "latitude": [{ type: core_1.Input },],
        "longitude": [{ type: core_1.Input },],
        "template": [{ type: core_1.ViewChild, args: ['content', { read: core_1.ElementRef },] },],
    };
    return AgmOverlay;
}());
exports.AgmOverlay = AgmOverlay;
