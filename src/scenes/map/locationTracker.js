import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

TaskManager.defineTask('LOCATION_TRACKING', async ({ data, error }) => {
    console.log('Зашли в defineTask')
  if (error) {
    console.error(error, 'Errrroorr');
    return;
  }
  if (data) {
    const { locations } = data;
    console.log('Полученные координаты:', locations);
    // Сохраните в базу данных тут
  }
});

export const startLocationTracking = async () => {
    console.log('Локация отслеживается')
  await Location.startLocationUpdatesAsync('LOCATION_TRACKING', {
    accuracy: Location.Accuracy.High,
    timeInterval: 1000, // интервал в миллисекундах между обновлениями
    distanceInterval: 1, // обновлять каждые 1 метров
    foregroundService: {
      notificationTitle: 'Geo Tracking',
      notificationBody: 'Geo tracking in progress',
    },
  });
};
