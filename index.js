/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';

// Global variable to store the screen intent
// global.notificationIntent = null;

// Background event handler
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//     console.log('Background Event TYPE:', type);
//     console.log('Background Event DETAILS:', detail);

//     if (type === EventType.ACTION_PRESS) {
//         console.log('Notification was pressed when app is in BACKGROUND:', detail);
//         if (detail.pressAction?.id === 'BloodPressure') {
//             console.log('CHECKING INTENT', global.notificationIntent);
//             global.notificationIntent = 'BloodPressure'; // Set the target screen
//         }
//     }
// });

notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      if (detail.notification?.data?.screenName) {
        // global.notificationIntent = detail.notification.data.screenName;
        console.log('notification clicked');
      }
    }
});

AppRegistry.registerComponent(appName, () => App);