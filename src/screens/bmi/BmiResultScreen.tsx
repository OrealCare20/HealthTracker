import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  BackHandler,
  Linking,
  TouchableOpacity,
  AppState
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import React, { useState, useEffect } from 'react';
import { REPORT_TYPES, get_async_data, get_report, set_async_data } from '../../Helper/AppHelper';
import PageHeader from './components/PageHeader';
import { NativeAd150 } from '../../Helper/NativeAd150';
import LineChartAdComponent from './components/LineChartAdComponent';
import PieChartAdComponent from './components/PieChartAdComponent';
import Recomandations from '../../components/Recomandations';
import { useIsFocused } from '@react-navigation/native';
import { lang } from '../../../global';
import {
  INTERSITIAL_AD_ID,
  NATIVE_AD_ID
} from '../../Helper/AdManager';
import DisplayRewardedAd from '../../components/DisplayRewardedAd';
import DisplayAd from '../../components/DisplayAd';

const { width } = Dimensions.get('window');
const itemWidth = width - 80;
const ratio = itemWidth / 1140;

const BmiResultScreen = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [appopenloader, setappopenloader] = useState(false);
  const [chartPercentage, setchartPercentage] = useState(72);
  const [pressurelevel, setpressurelevel] = useState('Normal');
  const [data, setdata] = useState(77.9);
  const [loader, setloader] = useState(false);
  const [language, setlanguage] = useState({
    dashobard: { bmi: '', bmirestitle: '' },
    main: { add: '', unlock: '' },
    tracker: {
      bmiChartText: '',
      bmiCharAddtText: '',
    },
  });
  const [langstr, setlangstr] = useState({
    dashobard: { bmi: '', bmirestitle: '' },
    main: { add: '', unlock: '' },
    tracker: {
      bmiChartText: '',
      bmiCharAddtText: '',
    },
  });
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

  const adjustBar = (number: any) => { //66.098
    if (number <= 16.4) {
      setchartPercentage(5);
    }
    if (number >= 16.5 && number <= 18.4) {
      setchartPercentage(19);
    }
    if (number >= 18.5 && number <= 24.9) {
      setchartPercentage(35);
    }
    if (number >= 25.0 && number <= 29.9) {
      setchartPercentage(48);
    }
    if (number >= 30.0 && number <= 34.9) {
      setchartPercentage(61);
    }
    if (number >= 35.0 && number <= 39.9) {
      setchartPercentage(77);
    }
    if (number >= 39) {
      setchartPercentage(78);
    }
  };

  useEffect(() => {
    adjustBar(parseInt(data));
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        AppState.addEventListener('change', handleAppStateChange);
        await analytics().logEvent('bmi_result_screen');
        let lan = await lang();
        setlanguage(lan);
        let response = await get_report(REPORT_TYPES.bmi);
        if (response) {
          if (response.length > 0) {
            let status = response[0].status;
            setpressurelevel(status);
            let bmi = response[0].bmi;
            setdata(bmi);
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [isFocused]);

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
    navigation.navigate(screenName, { tab: 'insight' });
  };
  const _continue = async () => {
    setloader(false);
    navigation.navigate('BmiResultScreen');
  };
  const showAd = async (type: any) => {
    await set_async_data('hide_ad', 'hide'); // purposly to hide tary ad
    setloader(true);
    if (type == 'line') {
      await set_async_data('line_chart_bmi_ad', 'seen');
    } else {
      await set_async_data('pie_chart_bmi_ad', 'seen');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <PageHeader
          return={navigation}
          screenname={'HomeScreen'}
          screenTitle={langstr.dashobard.bmi}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.colouredBg}>
            <TouchableOpacity
              style={styles.ibutton}
              onPress={() =>
                Linking.openURL('https://medlineplus.gov/vitalsigns.html')
              }>
              <Image
                style={{ width: 25, height: 20 }}
                source={require('../../assets/images/ibutton.png')}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{langstr.dashobard.bmirestitle}</Text>
            <View style={{ marginVertical: 25 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 18,
                  color: '#5F5F5F',
                  marginBottom: 15,
                }}>
                {pressurelevel}
              </Text>
              <Image
                style={{
                  alignSelf: 'center',
                  width: itemWidth,
                  height: 68 * ratio,
                }}
                source={require('../../assets/images/bmichart.png')}
              />
              <Image
                style={{
                  width: 17,
                  height: 14,
                  marginLeft: 23,
                  position: 'relative',
                  top: 7,
                  left: `${chartPercentage}%`,
                }}
                source={require('../../assets/icons/pointer.png')}
              />
            </View>
          </View>

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

          <View style={[styles.NativeAd]}>
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
    fontFamily: 'Raleway-Medium',
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
  ibutton: {
    alignSelf: 'flex-end',
    top: -9,
  },
});
export default BmiResultScreen;