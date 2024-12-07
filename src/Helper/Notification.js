import notifee, { AndroidImportance, AndroidVisibility, RepeatFrequency, TriggerType } from '@notifee/react-native';

// export const onDisplayNotification = async () => {
//     // Request permissions (required for iOS)
//     await notifee.requestPermission();

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//         id: 'test',
//         name: 'Test Channel',
//         vibration: true,
//         badge: true,
//         importance: AndroidImportance.HIGH,
//         visibility: AndroidVisibility.PUBLIC
//     });

//     // Display a notification
//     await notifee.displayNotification({
//         title: `<p style="color: #f44336;">Pulse Tracker</p>`,
//         body: `<p style="color: #f44336;">Record your Blood Pressure</p>`,
//         android: {
//             channelId,
//             color: '#4caf50',
//             largeIcon: require('../assets/images/aboutusimage.png'),
//             // smallIcon: 'android/app/src/main/res/drawable/ic_notification.png',
//             timestamp: Date.now(),
//             showTimestamp: true,
//             importance: AndroidImportance.HIGH,
//             visibility: AndroidVisibility.PUBLIC,
//             // pressAction is needed if you want the notification to open the app when pressed
//             pressAction: {
//                 id: 'default',
//             },
//             data: {
//                 screenName: 'BloodPressure'
//             }
//         },
//     });

// }

export const onDisplayNotification = async () => {
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        vibration: true,
        badge: true,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC
    });

    // Required for iOS
    // See https://notifee.app/react-native/docs/ios/permissions
    await notifee.requestPermission();

    // const notificationId = await notifee.displayNotification({
    //     id: '123',
    //     title: `<p style="color: #f44336;">Pulse Tracker</p>`,
    //     body: `<p style="color: #f44336;">Record your Blood Pressure</p>`,
    //     android: {
    //         channelId,
    //         color: '#4caf50',
    //         largeIcon: require('../assets/images/aboutusimage.png'),
    //         // smallIcon: 'android/app/src/main/res/drawable/ic_notification.png',
    //         timestamp: Date.now(),
    //         showTimestamp: true,
    //         importance: AndroidImportance.HIGH,
    //         visibility: AndroidVisibility.PUBLIC,
    //     },
    // });

    // Sometime later...
    await notifee.displayNotification({
        id: '123',
        title: `<p style="color: #f44336;">Pulse Tracker</p>`,
        body: `<p style="color: #f44336;">Record your Blood Pressure</p>`,
        android: {
            channelId,
            color: '#4caf50',
            largeIcon: require('../assets/images/aboutusimage.png'),
            // smallIcon: 'android/app/src/main/res/drawable/ic_notification.png',
            timestamp: Date.now(),
            showTimestamp: true,
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            pressAction: {
                id: '123', // Default action
                launchActivity: 'default', // Ensure the app launches
              },
        },
        data: {
            screenName: 'BloodPressure'
        }
    });
}

export const onCreateTriggerNotification = async () => {
    // Get current time
    const now = new Date();

    // Set the time for 1:00 PM
    const date = new Date(now);
    date.setHours(15); // 1:00 PM in 24-hour format
    date.setMinutes(7);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // If the time has already passed for today, set it for tomorrow
    if (date.getTime() <= now.getTime()) {
        date.setDate(date.getDate() + 1);
    }

    // Create a time-based trigger
    const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),  // fire at 11:00 AM
        repeatFrequency: RepeatFrequency.DAILY,
    };
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        vibration: true,
        badge: true,
        importance: AndroidImportance.HIGH,
    });

    // Create a trigger notification
    await notifee.createTriggerNotification(
        {
            title: 'Blood Pressure',
            body: 'Record your Blood Pressure',
            android: {
                channelId,
                color: '#4caf50',
                largeIcon: require('../assets/images/aboutusimage.png'),
                // smallIcon: 'android/app/src/main/res/drawable/ic_notification.png',
                timestamp: Date.now(),
                showTimestamp: true,
                importance: AndroidImportance.HIGH,
                visibility: AndroidVisibility.HIGH,
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'BloodPressure',
                    launchActivity: 'default', // Ensure the app opens
                },
            },
            data: {
                screenName: 'BloodPressure'
            }
        },
        trigger,
    );
}