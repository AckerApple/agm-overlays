(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@agm/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('agm-overlays', ['exports', '@angular/core', '@agm/core', '@angular/common'], factory) :
    (global = global || self, factory(global['agm-overlays'] = {}, global.ng.core, global.core$1, global.ng.common));
}(this, (function (exports, core, core$1, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var AgmOverlay = /** @class */ (function () {
        function AgmOverlay(_mapsWrapper, _markerManager //rename to fight the private declaration of parent
        ) {
            this._mapsWrapper = _mapsWrapper;
            this._markerManager = _markerManager;
            this.visible = true; //possibly doesn't work and just left over from agm-core marker replication
            this.zIndex = 1;
            //TIP: Do NOT use this... Just put (click) on your html overlay element
            this.markerClick = new core.EventEmitter();
            this.openInfoWindow = true;
            this.infoWindow = new core.QueryList();
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
            { type: core$1.GoogleMapsAPIWrapper },
            { type: core$1.MarkerManager //rename to fight the private declaration of parent
             }
        ]; };
        __decorate([
            core.Input()
        ], AgmOverlay.prototype, "latitude", void 0);
        __decorate([
            core.Input()
        ], AgmOverlay.prototype, "longitude", void 0);
        __decorate([
            core.Input()
        ], AgmOverlay.prototype, "visible", void 0);
        __decorate([
            core.Input()
        ], AgmOverlay.prototype, "zIndex", void 0);
        __decorate([
            core.Input()
        ], AgmOverlay.prototype, "bounds", void 0);
        __decorate([
            core.Output()
        ], AgmOverlay.prototype, "markerClick", void 0);
        __decorate([
            core.Input()
        ], AgmOverlay.prototype, "openInfoWindow", void 0);
        __decorate([
            core.ContentChildren(core$1.AgmInfoWindow)
        ], AgmOverlay.prototype, "infoWindow", void 0);
        __decorate([
            core.Input('markerDraggable')
        ], AgmOverlay.prototype, "draggable", void 0);
        __decorate([
            core.ViewChild('content', { read: core.ElementRef })
        ], AgmOverlay.prototype, "template", void 0);
        AgmOverlay = __decorate([
            core.Component({
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
            core.NgModule({
                imports: [
                    common.CommonModule
                ],
                declarations: [AgmOverlay],
                exports: [AgmOverlay],
            })
        ], AgmOverlays);
        return AgmOverlays;
    }());

    exports.AgmOverlay = AgmOverlay;
    exports.AgmOverlays = AgmOverlays;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=agm-overlays.umd.js.map
