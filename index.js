/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import NavigationService from './src/route/NavigationService';

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
        const { url } = detail.notification.data; // Extract the deep link URL
        console.log('Notification Clicked in Background:', url);

        if (url) {
            console.log('ACTUAL URL', url);
            // setTimeout(()=>{
            //     NavigationService.navigate('BloodPressure');
            // }, 1200);
            // Navigate using the deep link
            // await notifee.openNotificationSettings(url);
        }
    }
});

AppRegistry.registerComponent(appName, () => App);
