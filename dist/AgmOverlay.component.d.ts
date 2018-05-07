import { ElementRef } from "@angular/core";
import { MarkerManager, GoogleMapsAPIWrapper } from "@agm/core";
export declare class AgmOverlay {
    protected _mapsWrapper: GoogleMapsAPIWrapper;
    private _markerManager;
    overlayView: any;
    latitude: number;
    longitude: number;
    visible: boolean;
    template: ElementRef;
    constructor(_mapsWrapper: GoogleMapsAPIWrapper, _markerManager: MarkerManager);
    ngAfterViewInit(): void;
    ngOnChanges(changes: any): void;
    onChanges(changes: any): void;
    onChangesOverride(changes: any): void;
    ngOnDestroy(): void;
    destroy(): void;
    load(): Promise<void>;
    getOverlay(map: any): any;
}
