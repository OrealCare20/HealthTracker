import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  BackHandler,
  TouchableOpacity,
  AppState
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Recomandations from '../../components/Recomandations';
import { REPORT_TYPES, get_async_data, get_report, set_async_data } from '../../Helper/AppHelper';
import LineChartAdComponent from './components/LineChartAdComponent';
import PieChartAdComponent from './components/PieChartAdComponent';
import analytics from '@react-native-firebase/analytics';
import { lang } from '../../../global';
import PageHeader from './components/PageHeader';
import { NativeAd150 } from '../../Helper/NativeAd150';
import DisplayRewardedAd from '../../components/DisplayRewardedAd';
import { INTERSITIAL_AD_ID, NATIVE_AD_ID, NATIVE_AD_ID_ONE, NATIVE_AD_ID_TWO, REWARED_AD_ID } from '../../Helper/AdManager';
import DisplayAd from '../../components/DisplayAd';

const { width } = Dimensions.get('window');
const itemWidth = width - 80;
const ratio = itemWidth / 1140;

const TemperatureResultScreen = ({ navigation }: { navigation: any }) => {
  const [loader, setloader] = useState(false);
  const [appopenloader, setappopenloader] = useState(false);
  const [language, setlanguage] = useState({
    dashobard: { temperature: '', bsrestitle: '', recommended: '' },
    main: { add: '', unlock: '' },
    tracker: {
      bsChartText: '',
      bsCharAddtText: '',
    },
    article: { articledata: {} },
  });
  const [langstr, setlangstr] = useState({
    dashobard: { temperature: '', bsrestitle: '', recommended: '' },
    main: { add: '', unlock: '' },
    tracker: {
      bsChartText: '',
      bsCharAddtText: '',
    },
    article: { articledata: {} },
  });
  const [data, setdata] = useState(['', '']);

  const handleAppStateChange = async (nextAppState: any) => {
    let adStatus = await get_async_data('hide_ad');
    if (nextAppState === 'active') {
      if (adStatus == 'hide') {
        // await set_async_data('hide_ad', 'unhide');
        // settrayad(false);
        console.log('not show app open at this time');
      }
      if (adStatus == 'unhide') {
        setappopenloader(true);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        AppState.addEventListener('change', handleAppStateChange);
        await analytics().logEvent('temperature_result_screen');
        let lan = await lang();
        setlanguage(lan);
        let response = await get_report(REPORT_TYPES.temperature);
        if (response) {
          if (response.length > 0) {
            let latest = response[0].temperature;
            let unit = response[0].note;
            setdata([latest, unit]);
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    setlangstr(language);
  }, [language]);

  const backAction = () => {
    return navigation.navigate('HomeScreen', { tab: 'tracker' });
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  const navigateScreen = (screenName: any) => {
    navigation.navigate(screenName, {
      tab: 'insight',
    });
  };

  const _continue = async () => {
    setloader(false);
    navigation.navigate('TemperatureResultScreen');
  };
  const showAd = async (type: any) => {
    setloader(true);
    if (type == 'line') {
      await set_async_data('line_chart_temp_ad', 'seen');
    } else {
      await set_async_data('pie_chart_temp_ad', 'seen');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={{ paddingHorizontal: 5 }}
            accessibilityLabel="Back"
            onPress={() => navigation.navigate('HomeScreen', { tab: 'tracker' })}>
            <Image
              style={{ width: 14, height: 14 }}
              source={require('../../assets/images/dashboard_icons/navigate_back_new.png')}
            />
          </TouchableOpacity>

          <Text style={styles.heading}>{langstr.dashobard.temperature}</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <LineChartAdComponent
            navigation={navigation}
            langstr={langstr}
            showAd={showAd}
            loader={loader}
          />
          <View style={styles.NativeAd}>
            <NativeAd150 adId={NATIVE_AD_ID} />
          </View>
          <PieChartAdComponent
            navigation={navigation}
            langstr={langstr}
            showAd={showAd}
            loader={loader}
          />
          <View style={[styles.NativeAd, { marginTop: 20 }]}>
            <NativeAd150 adId={NATIVE_AD_ID} />
          </View>
          <View style={styles.recomandation}>
            <Recomandations
              putScreen={'HomeScreen'}
              navigateScreen={navigateScreen}
            />
          </View>
        </ScrollView>
      </View>
      {loader && (
        <DisplayAd _continue={_continue} adId={INTERSITIAL_AD_ID} />
      )}
      {appopenloader && (<View
        style={{
          width: width,
          height: '100%',
          backgroundColor: '#fff',
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'Montserrat-Bold', fontStyle: 'normal' }}>Loading Ad ...</Text>
      </View>)}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  heading: {
    color: '#2E2E2E',
    fontSize: 20,
    fontStyle: 'normal',
    fontFamily: 'Montserrat-Bold',
    marginLeft: 15,
  },
  colouredBg: {
    width: width * 0.87,
    alignSelf: 'center',
    backgroundColor: '#F4F5F6',
    borderRadius: 12,
    paddingTop: 10,
    marginBottom: 15,
  },
  title: {
    alignSelf: 'center',
    color: '#2E2E2E',
    fontSize: 14,
  },
  NativeAd: {
    width: width * 0.85,
    alignSelf: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 12,
    elevation: 3,
  },
  recomandation: {
    width: width,
    marginBottom: 15,
  },
});
export default TemperatureResultScreen;
