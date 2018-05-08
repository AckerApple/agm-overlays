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
    AgmOverlay.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.load().then(function () {
            _this.onChanges = _this.onChangesOverride;
        });
    };
    AgmOverlay.prototype.ngOnChanges = function (changes) {
        this.onChanges(changes);
    };
    AgmOverlay.prototype.onChanges = function (changes) { };
    AgmOverlay.prototype.onChangesOverride = function (changes) {
        if ((changes.latitude || changes.longitude)) {
            this.overlayView.draw();
        }
    };
    AgmOverlay.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    AgmOverlay.prototype.destroy = function () {
        this._markerManager.deleteMarker(this.overlayView);
        this.overlayView.setMap(null);
        delete this.overlayView;
    };
    AgmOverlay.prototype.load = function () {
        var _this = this;
        return this._mapsWrapper.getNativeMap()
            .then(function (map) {
            var overlay = _this.getOverlay(map);
            _this._markerManager.addMarker(overlay);
            return _this._markerManager.getNativeMarker(overlay);
        })
            .then(function (nativeMarker) {
            var setMap = nativeMarker.setMap;
            console.log(1);
            if (nativeMarker['map']) {
                console.log(2);
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
        return this.overlayView;
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
