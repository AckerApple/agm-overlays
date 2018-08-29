"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var core_2 = require("@agm/core");
var AgmOverlay = (function () {
    function AgmOverlay(_mapsWrapper, _markerManager) {
        this._mapsWrapper = _mapsWrapper;
        this._markerManager = _markerManager;
        this._observableSubscriptions = [];
        this.visible = true;
        this.zIndex = 1;
        this.markerClick = new core_1.EventEmitter();
        this.openInfoWindow = true;
        this.infoWindow = new core_1.QueryList();
        this.draggable = false;
    }
    AgmOverlay.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.elmGuts = this.template.nativeElement.children[0];
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
            this._markerManager.deleteMarker(this.overlayView)
                .then(function () { return _this.load(); });
        }
    };
    AgmOverlay.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    AgmOverlay.prototype.destroy = function () {
        this._markerManager.deleteMarker(this.overlayView);
        this.overlayView.setMap(null);
        this._observableSubscriptions.forEach(function (s) { return s.unsubscribe(); });
        delete this.overlayView;
        delete this.elmGuts;
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
        this.overlayView.iconUrl = " ";
        this.overlayView.latitude = this.latitude;
        this.overlayView.longitude = this.longitude;
        var elm = this.elmGuts;
        this.overlayView.remove = function () {
            if (!this.div)
                return;
            this.div.parentNode.removeChild(this.div);
            delete this.div;
        };
        this.overlayView.getDiv = function () {
            return this.div;
        };
        this.overlayView.draw = function () {
            if (!this.div) {
                this.div = elm;
                var panes = this.getPanes();
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
        };
        elm.addEventListener("click", function (event) { return _this.handleTap(); });
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
    AgmOverlay.decorators = [
        { type: core_1.Component, args: [{
                    selector: "agm-overlay",
                    template: '<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
                },] },
    ];
    AgmOverlay.ctorParameters = function () { return [
        { type: core_2.GoogleMapsAPIWrapper },
        { type: core_2.MarkerManager }
    ]; };
    AgmOverlay.propDecorators = {
        latitude: [{ type: core_1.Input }],
        longitude: [{ type: core_1.Input }],
        visible: [{ type: core_1.Input }],
        zIndex: [{ type: core_1.Input }],
        markerClick: [{ type: core_1.Output }],
        openInfoWindow: [{ type: core_1.Input }],
        infoWindow: [{ type: core_1.ContentChildren, args: [core_2.AgmInfoWindow,] }],
        draggable: [{ type: core_1.Input, args: ['markerDraggable',] }],
        template: [{ type: core_1.ViewChild, args: ['content', { read: core_1.ElementRef },] }]
    };
    return AgmOverlay;
}());
exports.AgmOverlay = AgmOverlay;
