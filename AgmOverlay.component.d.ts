import { ElementRef } from "@angular/core";
import { LatLng, GoogleMapsAPIWrapper } from "@agm/core";
import { GoogleMap } from "@agm/core/services/google-maps-types";
export declare class AgmOverlay {
    protected _mapsWrapper: GoogleMapsAPIWrapper;
    overlayView: any;
    latitude: number;
    longitude: number;
    template: ElementRef;
    constructor(_mapsWrapper: GoogleMapsAPIWrapper);
    ngOnChanges(changes: any): void;
    ngOnDestroy(): void;
    destroy(): void;
    ngAfterViewInit(): void;
    load(): Promise<void>;
    loadByMap(map: GoogleMap): void;
    addBounds(latlng: LatLng, map: GoogleMap): void;
    drawOnMap(map: GoogleMap): void;
}
