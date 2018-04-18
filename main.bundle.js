webpackJsonp(["main"],{

/***/ "./example/src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./example/src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./example/src/app.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var app_template_1 = __webpack_require__("./example/src/app.template.ts");
var packJson = __webpack_require__("./package.json");
var AppComponent = (function () {
    function AppComponent() {
        this.version = packJson['version'];
        this.latLngArray = [
            { latitude: 26.368755, longitude: -80.137413 },
            { latitude: 26.368351, longitude: -80.128873 },
            { latitude: 26.368092, longitude: -80.125011 }
        ];
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "app",
            template: app_template_1.template
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ }),

/***/ "./example/src/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
var core_2 = __webpack_require__("./node_modules/@agm/core/index.js");
var src_1 = __webpack_require__("./src/index.ts");
var app_component_1 = __webpack_require__("./example/src/app.component.ts");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                src_1.AgmOverlays,
                core_2.AgmCoreModule.forRoot({
                    apiKey: 'AIzaSyD2Z0LzbjZXiqRAsVYTl4OP7cK7hdgR89U'
                })
            ],
            bootstrap: [app_component_1.AppComponent],
            declarations: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ }),

/***/ "./example/src/app.template.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.template = "\n<table cellPadding=\"0\" cellSpacing=\"0\" border=\"0\" style=\"width:100%;height:100%\">\n  <tr>\n    <td>\n      <div style=\"float:right;font-size:.8em;\">v{{version}}</div>\n      <h2 style=\"margin:0;\">\uD83D\uDCA5 agm-overlay</h2>\n      <div style=\"text-align:center;font-size:.8em;\">\n        <a href=\"https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.component.ts\">view component</a>\n        &nbsp;\n        <a href=\"https://github.com/AckerApple/agm-overlays/blob/master/example/src/app.template.ts\">view template</a>\n      </div>\n    </td>\n  </tr>\n  <tr>\n    <td style=\"height:100%\">\n      <agm-map\n        [zoom] = \"5\"\n        style  = \"height:100%;width:100%;display:block;\"\n      >\n        <agm-overlay\n          *ngFor      = \"let item of latLngArray;let i=index\"\n          [latitude]  = \"item.latitude\"\n          [longitude] = \"item.longitude\"\n        >\n          <!-- blue html square -->\n          <div style=\"justify-content:center;align-items:center;display:flex;width:50px;height:50px;background-color:blue;\">\n            <strong style=\"color:white;\">{{i}}</strong>\n          </div>\n        </agm-overlay>\n      </agm-map>\n    </td>\n  </tr>\n</table>\n";


/***/ }),

/***/ "./example/src/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./node_modules/zone.js/dist/zone.js");
__webpack_require__("./node_modules/reflect-metadata/Reflect.js");
var platform_browser_dynamic_1 = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var app_module_1 = __webpack_require__("./example/src/app.module.ts");
core_1.enableProdMode();
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),

/***/ "./package.json":
/***/ (function(module, exports) {

module.exports = {"name":"agm-overlays","version":"1.0.2","description":"Custom marker overlay for the @agm/core package","main":"dist/index","scripts":{"build":"npm-run-all build:dist compile:dist:package build:js","build:dist":"ngc --declaration --project src","test":"echo \"Error: no test specified\" && exit 1","compile:dist:package":"node scripts/update-dist-package.js","start":"npm run watch","watch":"ng serve --port 4202 --output-hashing=none --sourcemaps=true --app=example --open","build:js":"ng build --output-hashing=none --sourcemaps=true --app=example"},"repository":{"type":"git","url":"git+https://github.com/ackerapple/agm-overlays.git"},"keywords":["agm","overlay","custom","markers","google","maps"],"author":"Acker Apple","license":"MIT","bugs":{"url":"https://github.com/ackerapple/agm-overlays/issues"},"homepage":"https://github.com/ackerapple/agm-overlays#readme","devDependencies":{"@agm/core":"^1.0.0-beta.2","@angular/cli":"^1.7.4","@angular/common":"^5.2.10","@angular/compiler":"^5.2.10","@angular/compiler-cli":"^5.2.10","@angular/core":"^5.2.10","@angular/platform-browser":"^5.2.10","@angular/platform-browser-dynamic":"^5.2.10","npm-run-all":"^4.1.2","reflect-metadata":"^0.1.12","rxjs":"^5.5.10","typescript":"^2.4.2","zone.js":"^0.8.26"}}

/***/ }),

/***/ "./src/AgmOverlay.component.ts":
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
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var core_2 = __webpack_require__("./node_modules/@agm/core/index.js");
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
        // appends to map as overlays (markers)
        this.drawOnMap(map);
        var latlng = new google.maps.LatLng(this.latitude, this.longitude);
        // configures the bounds of the map to fit the markers
        this.addBounds(latlng, map);
    };
    AgmOverlay.prototype.addBounds = function (latlng, map) {
        var bounds = map.getBounds() || map['bounds'];
        if (!bounds) {
            bounds = new google.maps.LatLngBounds();
            map['bounds'] = bounds;
        }
        bounds.extend(latlng);
        this._mapsWrapper.fitBounds(bounds); //center map on all overlays
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
        this.overlayView.setMap(map); //igniter to append to element
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
        core_1.ViewChild('content', { read: core_1.ElementRef }),
        __metadata("design:type", core_1.ElementRef)
    ], AgmOverlay.prototype, "template", void 0);
    AgmOverlay = __decorate([
        core_1.Component({
            selector: "agm-overlay",
            template: '<div #content><div style="position:absolute"><ng-content></ng-content></div></div>'
        }),
        __metadata("design:paramtypes", [core_2.GoogleMapsAPIWrapper])
    ], AgmOverlay);
    return AgmOverlay;
}());
exports.AgmOverlay = AgmOverlay;


/***/ }),

/***/ "./src/AgmOverlays.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var AgmOverlay_component_1 = __webpack_require__("./src/AgmOverlay.component.ts");
var AgmOverlays = (function () {
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

/***/ "./src/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/AgmOverlay.component.ts"));
__export(__webpack_require__("./src/AgmOverlays.module.ts"));


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./example/src/index.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map