#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AppleDirections, NSObject)

RCT_EXTERN_METHOD(getRoute:(NSDictionary *)origin
                  destination:(NSDictionary *)destination
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
