## CHANGE LOG
- All notable changes to this project will be documented here.

## [1.4.0] - 2019-05-15
- trusting issue #29 about click marker problem
  - https://github.com/AckerApple/agm-overlays/issues/29
  - Fix Bug: Stop Propagation of event 'markerClick' in Overlay with on event 'mapClick' in Map

## [1.3.2] - 2019-02-05
- Remove invisible marker that's blocking hover styles
- https://github.com/AckerApple/agm-overlays/pull/25

## [1.3.1] - 2018-10-25
- Fix updating marker positions

## [1.3.0] - 2018-10-02
- Added bounds for resizing overlays
- Upgraded all dependencies

## [1.2.2] - 2018-09-20
- destory checks for var existense for errorless destory
- better establishing of targets

## [1.2.0] - 2018-08-29
- zIndex is watched for changes
- All depencencies updated

## [1.1.3] - 2018-05-16
- Added in agm-info-window compatibility

## [1.1.2] - 2018-05-07
- Fixed github issue for updating a lat long of existing marker
- Made overlays communicate with AGM's MarkerManager
- Now custom overlays can work with agm's cluster manager
- Created example of clustering

## [1.0.5] - 2018-04-19
- Adjust fitBounds to play nice with zoom

## [1.0.4] - 2018-04-19
- Fixed when only one custom marker on map
- Added example "play with data"

## [1.0.3] - 2018-04-18
- Fixed destroy process