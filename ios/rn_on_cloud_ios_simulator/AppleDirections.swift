import MapKit
import React

@objc(AppleDirections)
class AppleDirections: NSObject {
  @objc(getRoute:destination:resolver:rejecter:)
  func getRoute(
    _ origin: NSDictionary,
    destination: NSDictionary,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard
      let originLatitude = origin["latitude"] as? CLLocationDegrees,
      let originLongitude = origin["longitude"] as? CLLocationDegrees,
      let destinationLatitude = destination["latitude"] as? CLLocationDegrees,
      let destinationLongitude = destination["longitude"] as? CLLocationDegrees
    else {
      reject("invalid_coordinates", "Origin and destination coordinates are required", nil)
      return
    }

    let request = MKDirections.Request()
    request.source = MKMapItem(
      placemark: MKPlacemark(
        coordinate: CLLocationCoordinate2D(
          latitude: originLatitude,
          longitude: originLongitude
        )
      )
    )
    request.destination = MKMapItem(
      placemark: MKPlacemark(
        coordinate: CLLocationCoordinate2D(
          latitude: destinationLatitude,
          longitude: destinationLongitude
        )
      )
    )
    request.transportType = .automobile

    MKDirections(request: request).calculate { response, error in
      if let error {
        reject("directions_failed", error.localizedDescription, error)
        return
      }

      guard let route = response?.routes.first else {
        reject("route_not_found", "Apple Maps returned no route", nil)
        return
      }

      let polyline = route.polyline
      var coordinates = Array(
        repeating: CLLocationCoordinate2D(),
        count: polyline.pointCount
      )
      polyline.getCoordinates(
        &coordinates,
        range: NSRange(location: 0, length: polyline.pointCount)
      )

      resolve([
        "coordinates": coordinates.map {
          ["latitude": $0.latitude, "longitude": $0.longitude]
        },
        "distance": route.distance,
        "expectedTravelTime": route.expectedTravelTime,
      ])
    }
  }
}
