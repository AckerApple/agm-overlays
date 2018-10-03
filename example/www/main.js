(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../package.json":
/*!***********************!*\
  !*** ../package.json ***!
  \***********************/
/*! exports provided: name, version, description, main, scripts, repository, keywords, author, license, bugs, homepage, devDependencies, default */
/***/ (function(module) {

module.exports = {"name":"agm-overlays","version":"1.3.0","description":"Custom marker overlay for the @agm/core package","main":"dist/index","scripts":{"build":"npm-run-all build:dist compile:dist:package build:js","build:dist":"ngc --declaration --project src","test":"echo \"Error: no test specified\" && exit 1","compile:dist:package":"node scripts/update-dist-package.js","start":"npm run watch","watch":"ng serve example --port 4202 --open","build:js":"ng build example"},"repository":{"type":"git","url":"git+https://github.com/ackerapple/agm-overlays.git"},"keywords":["agm","overlay","custom","markers","google","maps"],"author":"Acker Apple","license":"MIT","bugs":{"url":"https://github.com/ackerapple/agm-overlays/issues"},"homepage":"https://github.com/ackerapple/agm-overlays#readme","devDependencies":{"@agm/core":"^1.0.0-beta.5","@agm/js-marker-clusterer":"^1.0.0-beta.5","@angular-devkit/build-angular":"^0.9.0-rc.1","@angular/cli":"^7.0.0-rc.1","@angular/common":"^6.1.9","@angular/compiler":"^6.1.9","@angular/compiler-cli":"^6.1.9","@angular/core":"^6.1.9","@angular/platform-browser":"^6.1.9","@angular/platform-browser-dynamic":"^6.1.9","js-marker-clusterer":"^1.0.0","npm-run-all":"^4.1.3","reflect-metadata":"^0.1.12","rxjs":"^6.3.3","typescript":"^2.9.2","zone.js":"^0.8.26"}};

/***/ }),

/***/ "../src/AgmOverlay.component.ts":
/*!**************************************!*\
  !*** ../src/AgmOverlay.component.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
var core_2 = __webpack_require__(/*! @agm/core */ "../node_modules/@agm/core/index.js");
var AgmOverlay = /** @class */ (function () {
    function AgmOverlay(_mapsWrapper, _markerManager //rename to fight the private declaration of parent
    ) {
        this._mapsWrapper = _mapsWrapper;
        this._markerManager = _markerManager;
        this._observableSubscriptions = [];
        this.visible = true;
        this.zIndex = 1;
        //TIP: Do NOT use this... Just put (click) on your html overlay element
        this.markerClick = new core_1.EventEmitter();
        this.openInfoWindow = true;
        this.infoWindow = new core_1.QueryList();
        //TODO, implement this
        this.draggable = false;
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
            this._markerManager.deleteMarker(this.overlayView)
                .then(function () { return _this.load(); });
        }
    };
    AgmOverlay.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    AgmOverlay.prototype.destroy = function () {
        this._markerManager.deleteMarker(this.overlayView);
        if (this.overlayView) {
            this.overlayView.setMap(null);
        }
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
        /* make into foo marker that AGM likes */
        this.overlayView.iconUrl = " ";
        this.overlayView.latitude = this.latitude;
        this.overlayView.longitude = this.longitude;
        /* end */
        if (this.bounds) {
            this.overlayView.bounds_ = new google.maps.LatLngBounds(new google.maps.LatLng(this.latitude + this.bounds.x.latitude, this.longitude + this.bounds.x.longitude), new google.maps.LatLng(this.latitude + this.bounds.y.latitude, this.longitude + this.bounds.y.longitude));
        }
        // js-marker-clusterer does not support updating positions. We are forced to delete/add and compensate for .removeChild calls
        var elm = this.elmGuts || this.template.nativeElement.children[0];
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
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], AgmOverlay.prototype, "latitude", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], AgmOverlay.prototype, "longitude", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], AgmOverlay.prototype, "visible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], AgmOverlay.prototype, "zIndex", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], AgmOverlay.prototype, "bounds", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AgmOverlay.prototype, "markerClick", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], AgmOverlay.prototype, "openInfoWindow", void 0);
    __decorate([
        core_1.ContentChildren(core_2.AgmInfoWindow),
        __metadata("design:type", core_1.QueryList)
    ], AgmOverlay.prototype, "infoWindow", void 0);
    __decorate([
        core_1.Input('markerDraggable'),
        __metadata("design:type", Boolean)
    ], AgmOverlay.prototype, "draggable", void 0);
    __decorate([
        core_1.ViewChild('content', { read: core_1.ElementRef }),
        __metadata("design:type", core_1.ElementRef)
    ], AgmOverlay.prototype, "template", void 0);
    AgmOverlay = __decorate([
        core_1.Component({
            selector: "agm-overlay",
            template: '<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
        }),
        __metadata("design:paramtypes", [core_2.GoogleMapsAPIWrapper,
            core_2.MarkerManager //rename to fight the private declaration of parent
        ])
    ], AgmOverlay);
    return AgmOverlay;
}());
exports.AgmOverlay = AgmOverlay;


/***/ }),

/***/ "../src/AgmOverlays.module.ts":
/*!************************************!*\
  !*** ../src/AgmOverlays.module.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
var common_1 = __webpack_require__(/*! @angular/common */ "../node_modules/@angular/common/fesm5/common.js");
var AgmOverlay_component_1 = __webpack_require__(/*! ./AgmOverlay.component */ "../src/AgmOverlay.component.ts");
var AgmOverlays = /** @class */ (function () {
    function AgmOverlays() {
    }
    AgmOverlays = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [AgmOverlay_component_1.AgmOverlay],
            exports: [AgmOverlay_component_1.AgmOverlay],
        })
    ], AgmOverlays);
    return AgmOverlays;
}());
exports.AgmOverlays = AgmOverlays;


/***/ }),

/***/ "../src/index.ts":
/*!***********************!*\
  !*** ../src/index.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./AgmOverlay.component */ "../src/AgmOverlay.component.ts"));
__export(__webpack_require__(/*! ./AgmOverlays.module */ "../src/AgmOverlays.module.ts"));


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app.component.ts":
/*!******************************!*\
  !*** ./src/app.component.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
var app_template_1 = __webpack_require__(/*! ./app.template */ "./src/app.template.ts");
var packJson = __webpack_require__(/*! ../../package.json */ "../package.json");
var points_1 = __webpack_require__(/*! ./points */ "./src/points.ts");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.version = packJson['version'];
        this.latLngArray = points_1.points;
    }
    AppComponent.prototype.setLatLngArrayString = function (string) {
        var json = JSON.parse(string);
        this.latLngArray = json;
    };
    AppComponent.prototype.toNumber = function (value) {
        return Number(value);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "app",
            template: app_template_1.template,
            styles: ['.block {justify-content:center;align-items:center;display:flex;width:50px;height:50px;background-color:blue;}']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
var platform_browser_1 = __webpack_require__(/*! @angular/platform-browser */ "../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var core_2 = __webpack_require__(/*! @agm/core */ "../node_modules/@agm/core/index.js");
var app_component_1 = __webpack_require__(/*! ./app.component */ "./src/app.component.ts");
var js_marker_clusterer_1 = __webpack_require__(/*! @agm/js-marker-clusterer */ "../node_modules/@agm/js-marker-clusterer/index.js");
//DO NOT USE BELOW
//YOU NEED USE: import { AgmOverlays } from "agm-overlays"
var src_1 = __webpack_require__(/*! ../../src */ "../src/index.ts");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                src_1.AgmOverlays,
                core_2.AgmCoreModule.forRoot({
                    apiKey: 'AIzaSyD2Z0LzbjZXiqRAsVYTl4OP7cK7hdgR89U'
                }),
                js_marker_clusterer_1.AgmJsMarkerClustererModule
            ],
            bootstrap: [app_component_1.AppComponent],
            declarations: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ }),

/***/ "./src/app.template.ts":
/*!*****************************!*\
  !*** ./src/app.template.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.template = "\n<table cellPadding=\"0\" cellSpacing=\"0\" border=\"0\" style=\"width:100%;height:100%\">\n  <tr>\n    <td valign=\"top\" colspan=\"2\">\n      <div style=\"float:right;font-size:.8em;\">v{{version}}</div>\n      <h2 style=\"margin:0;\">\uD83D\uDCA5 agm-overlay</h2>\n      <div style=\"text-align:center;font-size:.8em;\">\n        <a href=\"https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.component.ts\">view component</a>\n        &nbsp;\n        <a href=\"https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.template.ts\">view template</a>\n        &nbsp;\n        <a href=\"javascript:\" (click)=\"view=view==='data'?null:'data'\">{{!view?'play':'done'}} with data <sup>({{latLngArray.length}})</sup></a>\n        &nbsp;\n        <a href=\"javascript:\" (click)=\"destroyMap=!destroyMap\">{{destroyMap?'restore':'destroy'}} map</a>\n      </div>\n    </td>\n  </tr>\n  <tr *ngIf=\"!destroyMap\">\n    <td [style.height]=\"view ? '50%' : '100%'\" colspan=\"2\">\n      <agm-map\n        [zoom] = \"14\"\n        style  = \"height:100%;width:100%;display:block;\"\n        [latitude]  = \"latLngArray.length ? latLngArray[0].latitude : null\"\n        [longitude] = \"latLngArray.length ? latLngArray[0].longitude : null\"\n      >\n        <agm-marker-cluster imagePath=\"https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m\">\n          <agm-overlay\n            *ngFor      = \"let item of latLngArray;let i=index\"\n            [latitude]  = \"item.latitude\"\n            [longitude] = \"item.longitude\"\n            [bounds]    = \"item.bounds\"\n          >\n            <!-- blue html square -->\n            <div class=\"block\" [style.opacity]=\"item.opacity\">\n              <strong style=\"color:white;\">{{item.title}}</strong>\n            </div>\n            <agm-info-window>Info Window {{i}}</agm-info-window>\n          </agm-overlay>\n          <agm-marker\n            *ngFor      = \"let item of latLngArray;let i=index\"\n            [latitude]  = \"item.latitude - 0.01\"\n            [longitude] = \"item.longitude - 0.01\"\n          >\n            <agm-info-window>Info Window {{i}}</agm-info-window>\n          </agm-marker>\n        </agm-marker-cluster>\n      </agm-map>\n    </td>\n  </tr>\n  <tr *ngIf=\"view==='data'\">\n    <td style=\"height:50%\">\n      <textarea (change)=\"setLatLngArrayString($event.target.value)\" style=\"width:100%;height:100%\" wrap=\"on\">{{ latLngArray | json }}</textArea>\n    </td>\n    <td valign=\"top\">\n      <div><strong>Edit Marker</strong></div>\n      <select (change)=\"markerEdit=latLngArray[$event.target.value]\" style=\"width:100%\">\n        <option></option>\n        <option *ngFor=\"let item of latLngArray;let i = index\" [value]=\"i\">\n          Marker {{i}}\n        </option>\n      </select>\n      <ng-container *ngIf=\"markerEdit\">\n        <div><strong>Latitude</strong></div>\n        <input type=\"number\" [value]=\"markerEdit.latitude\" (change)=\"markerEdit.latitude=toNumber($event.target.value)\" style=\"width:100%\"/>\n        <div><strong>Longitude</strong></div>\n        <input type=\"number\" [value]=\"markerEdit.longitude\" (change)=\"markerEdit.longitude=toNumber($event.target.value)\" style=\"width:100%\"/>\n        <div><strong>Title</strong></div>\n        <input type=\"text\" [value]=\"markerEdit.title\" (change)=\"markerEdit.title=$event.target.value\" style=\"width:100%\"/>\n      </ng-container>\n    </td>\n  </tr>\n</table>\n";


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! zone.js */ "../node_modules/zone.js/dist/zone.js");
__webpack_require__(/*! reflect-metadata */ "../node_modules/reflect-metadata/Reflect.js");
var platform_browser_dynamic_1 = __webpack_require__(/*! @angular/platform-browser-dynamic */ "../node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
var core_1 = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
var app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
core_1.enableProdMode();
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),

/***/ "./src/points.ts":
/*!***********************!*\
  !*** ./src/points.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.points = [
    {
        title: '0',
        latitude: 26.368755,
        longitude: -80.137413
    },
    {
        title: '1',
        latitude: 26.368351,
        longitude: -80.128873
    },
    {
        title: '2',
        latitude: 26.368092,
        longitude: -80.125011
    },
    {
        title: 'resizes',
        opacity: .7,
        latitude: 26.360000,
        longitude: -80.110000,
        bounds: {
            x: {
                latitude: -0.003,
                longitude: -0.0052
            },
            y: {
                latitude: 0.003,
                longitude: 0.0052
            }
        }
    }
];


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/adminapple/projects/Ack/browser/ Angular/agm-overlays/master/example/src/index.ts */"./src/index.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map