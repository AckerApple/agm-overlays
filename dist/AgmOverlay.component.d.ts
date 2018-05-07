import { ElementRef } from "@angular/core";
import { MarkerManager, GoogleMapsAPIWrapper } from "@agm/core";
import { GoogleMap } from "@agm/core/services/google-maps-types";
export declare class AgmOverlay {
    protected _mapsWrapper: GoogleMapsAPIWrapper;
    private _markerManager;
    overlayView: any;
    latitude: number;
    longitude: number;
    visible: boolean;
    template: ElementRef;
    constructor(_mapsWrapper: GoogleMapsAPIWrapper, _markerManager: MarkerManager);
    ngOnChanges(changes: any): void;
    ngOnDestroy(): void;
    destroy(): void;
    load(): void;
    drawOnMap(map: GoogleMap): void;
}
