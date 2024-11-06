import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import { startLocationTracking } from './locationTracker'

export default function Map() {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [trail, setTrail] = useState([])

  useEffect(() => {
    (async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync()
     // const { status: backgroundStatus } =
       // await Location.requestBackgroundPermissionsAsync()
      if (foregroundStatus !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        Alert.alert('Необходимо разрешение на доступ к местоположению')
        return false
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.001, // Сильный зум
        longitudeDelta: 0.001,
      })

      startLocationTracking()

      // Генерация мок-данных для маршрута
      const generatedTrail = generateMockTrail(
        { latitude: 53.35128152764529, longitude: -6.278811700551221 }, // Начальная точка
        100, // Интервал в метрах
        36, // Количество точек
      )
      setTrail(generatedTrail)
    })()
  }, [])

  // Функция для генерации точек маршрута
  const generateMockTrail = (startPoint, distanceMeters, pointsCount) => {
    const trail = [startPoint]
    let { latitude, longitude } = startPoint

    for (let i = 1; i < pointsCount; i++) {
      // Примерная конвертация метров в градусы
      const deltaLat = distanceMeters / 111320 // 1 градус широты ≈ 111.32 км
      const deltaLng =
        distanceMeters / (111320 * Math.cos(latitude * (Math.PI / 180))) // Учитываем широту для долготы

      latitude += deltaLat
      longitude += deltaLng

      trail.push({ latitude, longitude })
    }
    return trail
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
        >
          <Marker coordinate={location} title="You are here now" />

          {/* Линия для отображения маршрута */}
          <Polyline
            coordinates={trail}
            strokeColor="rgba(0, 200, 0, 0.5)"
            strokeWidth={3}
          />
        </MapView>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
})
