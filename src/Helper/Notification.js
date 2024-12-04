import notifee, { AndroidImportance, AndroidVisibility, RepeatFrequency, TriggerType } from '@notifee/react-native';

export const onDisplayNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'test',
        name: 'Test Channel',
        vibration: true,
        badge: true,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC
    });

    // Display a notification

    setTimeout(async () => {
        await notifee.displayNotification({
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
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }, 3000);
}

export const onCreateTriggerNotification = async () => {
    // Get current time
    const now = new Date();

    // Set the time for 1:00 PM
    const date = new Date(now);
    date.setHours(16); // 1:00 PM in 24-hour format
    date.setMinutes(2);
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
                url: 'BloodPressure', // Deep link URL
            },
        },
        trigger,
    );
}