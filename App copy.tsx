import React, { useEffect, useRef, useState } from 'react';
import MainRoute from './src/route/MainRoute';
import Route from './src/route/Route';
import { NavigationContainer } from '@react-navigation/native';
import { get_async_data, set_async_data } from './src/Helper/AppHelper';
// import crashlytics from '@react-native-firebase/crashlytics';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import SplashScreen from 'react-native-splash-screen';
import { useAppOpenAd } from 'react-native-google-mobile-ads';
import { APPOPEN_AD_ID } from './src/Helper/AdManager';
import { View } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';

const App = () => {
  const navigationRef = useRef();
  const [firstTime, setfirstTime] = useState(true);
  const [splashClosed, setsplashClosed] = useState(false);
  const { isLoaded, isClosed, load, show, error } = useAppOpenAd(APPOPEN_AD_ID, {
    requestNonPersonalizedAdsOnly: true,
  });
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    if (!isLoaded && loadAttempts < 2) {
      load();
      console.log('loadAttempts', loadAttempts);
      setLoadAttempts(loadAttempts + 1);
      console.log(error)
    }
  }, [load, isLoaded, loadAttempts]);

  useEffect(() => {
    (async () => {
      if (isClosed) {
        await set_async_data('hide_ad', 'hide');
        setsplashClosed(true);
        SplashScreen.hide();
      }
    })();
  }, [isClosed]);

  useEffect(() => {
    (async () => {
      if (isLoaded) {
        // console.log('Ad Loaded inside App.js');
        show();
        setsplashClosed(true);
      } else {
        console.log('Ad not Loaded inside App.js', error);
        if (error != undefined || loadAttempts >= 2) {
          setsplashClosed(true);
          SplashScreen.hide();
        }
      }
    })();
  }, [isLoaded]);

  useEffect(() => {
    if (error != undefined && loadAttempts >= 2) {
      console.log('app opn error', error);
      SplashScreen.hide();
      setsplashClosed(true);
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      SystemNavigationBar.stickyImmersive();
      // crashlytics().log('App crashes');
      let onboard = await get_async_data('on_board');
      let rate = await get_async_data('alreadyrate');
      if (rate && rate == 'rated') {
        await set_async_data('alreadyrate', 'rated');
      } else {
        await set_async_data('alreadyrate', '');
      }
      if (onboard != null) {
        setfirstTime(false);
      }
    })();
  }, []);

  useEffect(() => {
    displayContent();
  }, [splashClosed]);

  const displayContent = () => {
    if (splashClosed == true) {
      if (firstTime == false) {
        return <MainRoute></MainRoute>;
      } else {
        return <Route></Route>;
      }
    } else {
      return <View style={{ flex: 1, backgroundColor: '#fff' }}></View>;
    }
  };


  notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        setTimeout(() => {
          if (detail.notification.data && detail.notification.data.screenName) {
            navigationRef.current?.navigate(data.screenName);
          }
        }, 1000);
        break;
    }
  });

  notifee.onBackgroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification.data);
        break;
      case EventType.PRESS:
        console.log('User pressed notification background', detail.notification);
        setTimeout(() => {
          if (detail.notification.data && detail.notification.data.screenName) {
            navigationRef.current?.navigate(data.screenName);
          }
        }, 1000);
        break;
    }
  });

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {displayContent()}
      </NavigationContainer>
    </>
  );
};

export default App;