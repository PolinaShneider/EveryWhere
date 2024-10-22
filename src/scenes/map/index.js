import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let locationSubscription = null;

  useEffect(() => {
    let subscription;

    (async () => {
      // Запрос разрешений на использование геолокации
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Error', 'Permission to access location was denied');
        return;
      }

      // Получение текущего местоположения
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Отслеживание местоположения в реальном времени
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Обновление каждые 5 секунд
          distanceInterval: 10, // Обновление при изменении позиции на 10 метров
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      );
    })();

    // Очистка подписки на изменения местоположения при размонтировании компонента
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Предопределенные метки на карте
  const markers = [
    { id: 1, latitude: 37.78825, longitude: -122.4324, title: 'Location 1' },
    { id: 2, latitude: 37.75825, longitude: -122.4524, title: 'Location 2' },
  ];

  const polygonCoords = [
    { latitude: 53.349805, longitude: -6.26031 }, // Центральная часть Дублина
    { latitude: 53.355, longitude: -6.245 }, // Северо-восточная часть
    { latitude: 53.345, longitude: -6.270 }, // Южная часть
    { latitude: 53.350, longitude: -6.280 }, // Западная часть
    { latitude: 53.355, longitude: -6.265 }, // Северо-западная часть
  ];

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Маркер текущего местоположения пользователя */}
          <Marker coordinate={location} title="You are here" />

          {/* Дополнительные маркеры */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
            />
          ))}

          {/* Полигон для закрашивания области */}
          <Polygon
            coordinates={polygonCoords}
            fillColor="rgba(0, 200, 0, 0.3)" // Заливка региона с прозрачностью
            strokeColor="rgba(0, 0, 0, 0.5)" // Цвет границы полигона
            strokeWidth={2} // Ширина границы
          />
        </MapView>
      ) : null}
    </View>
  );
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
});