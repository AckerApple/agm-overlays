"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var AgmOverlay_component_1 = require("./AgmOverlay.component");
var AgmOverlays = (function () {
    function AgmOverlays() {
    }
    AgmOverlays.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [AgmOverlay_component_1.AgmOverlay],
                    exports: [AgmOverlay_component_1.AgmOverlay],
                },] },
    ];
    return AgmOverlays;
}());
exports.AgmOverlays = AgmOverlays;
