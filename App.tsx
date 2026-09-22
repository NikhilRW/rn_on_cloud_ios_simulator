import { View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapView />
    </View>
  )
}

export default App
