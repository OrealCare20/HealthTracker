import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import BloodPressureChart from './components/BloodPressureChart';
import BloodSugarChart from './components/BloodSugarChart';
import BMIChart from './components/BMIChart';
import {NativeAd150} from '../../../Helper/NativeAd150';
import {lang} from '../../../../global';
import {set_async_data} from '../../../Helper/AppHelper';
import { NATIVE_AD_ID_ONE, NATIVE_AD_ID_TWO, REWARED_AD_ID } from '../../../Helper/AdManager';
import DisplayRewardedAd from '../../../components/DisplayRewardedAd';
import RateUs from '../../../components/RateUs';
const {width} = Dimensions.get('window');

const TrackerScreen = (props: any) => {
  const isFocused = useIsFocused();
  const [selectedmenu, setselectedmenu] = useState('tracker');
  const [rewardadseen, setrewardadseen] = useState(0);
  const [rate, showrate] = useState(false);
  const [language, setlanguage] = useState({
    main: {trackerTitle: '', add: '', unlock: ''},
    dashobard: {bp: '', bs: '', bmi: ''},
    tracker: {
      bpChartText: '',
      bpCharAddtText: '',
      bsChartText: '',
      bsCharAddtText: '',
      bmiChartText: '',
      bmiChartAddText: '',
    },
    menu: {home: '', tracker: '', health: '', profile: ''},
  });
  const [langstr, setlangstr] = useState({
    main: {trackerTitle: '', add: '', unlock: ''},
    dashobard: {bp: '', bs: '', bmi: ''},
    tracker: {
      bpChartText: '',
      bpCharAddtText: '',
      bsChartText: '',
      bsCharAddtText: '',
      bmiChartText: '',
      bmiChartAddText: '',
    },
  });

  useEffect(() => {
    (async () => {
      let lan = await lang();
      setlanguage(lan);
      setselectedmenu('tracker');
    })();
  }, [isFocused, rewardadseen]);

  useEffect(() => {
    setlangstr(language);
  }, [language]);

  const showAd = async (type: any) => {
    await set_async_data('hide_ad', 'hide'); // purposly to hide tary ad
    props.setloader(true);
    if (type == 'bp') {
      await set_async_data('line_chart_bp_ad', 'seen');
    }
    if (type == 'bs') {
      await set_async_data('line_chart_bs_ad', 'seen');
    }
    if (type == 'bmi') {
      await set_async_data('line_chart_bmi_ad', 'seen');
    }
  };

  const _continue = async () => {
    props.setloader(false);
    showrate(true);
    setrewardadseen(rewardadseen + 1);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.col}>
            <Text style={styles.heading}>{langstr.main.trackerTitle}</Text>
          </View>
        </View>
        <ScrollView style={styles.mainContainer}>
          {/* Blood Pressure */}
          <View style={styles.box}>
            <View style={styles.head}>
              <Image
                style={styles.icon}
                source={require('../../../assets/icons/bloodpressure.png')}
              />
              <Text style={styles.title}>{langstr.dashobard.bp}</Text>
            </View>
            <BloodPressureChart
              navigation={props.navigation}
              langstr={langstr}
              rewardadseen={rewardadseen}
              showAd={() => {
                showAd('bp');
              }}
            />
          </View>

          <View style={styles.nativeContainer}>
            {/* <NativeAd150 adId={NATIVE_AD_ID_ONE}/> */}
          </View>

          {/* Blood Sugar */}
          <View style={[styles.box, {marginBottom: 20}]}>
            <View style={styles.head}>
              <Image
                style={{width: 14, height: 17.95, marginRight: 8}}
                source={require('../../../assets/icons/bloodsugar.png')}
              />
              <Text style={styles.title}>{langstr.dashobard.bs}</Text>
            </View>
            <BloodSugarChart
              navigation={props.navigation}
              langstr={langstr}
              rewardadseen={rewardadseen}
              showAd={() => {
                showAd('bs');
              }}
            />
          </View>

          <View style={styles.nativeContainer}>
            {/* <NativeAd150 adId={NATIVE_AD_ID_TWO}/> */}
          </View>

          {/* BMI Chart */}
          <View style={[styles.box, {marginBottom: '12%'}]}>
            <View style={styles.head}>
              <Image
                style={{width: 14, height: 17.95, marginRight: 8}}
                source={require('../../../assets/icons/bloodsugar.png')}
              />
              <Text style={styles.title}>{langstr.dashobard.bmi}</Text>
            </View>
            <BMIChart
              navigation={props.navigation}
              langstr={langstr}
              rewardadseen={rewardadseen}
              showAd={() => {
                showAd('bmi');
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {props.loader &&  (<DisplayRewardedAd _continue={_continue} adId={REWARED_AD_ID}/>)}
      {rate && <RateUs showrate={showrate} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4FE',
  },
  nativeContainer: {
    width: width * 0.91,
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign: 'middle',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    color: '#2E2E2E',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },
  mainContainer: {
    width: width,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 16,
    maxHeight: 1.70 * width,
    backgroundColor: '#F4F4FE',
  },
  box: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  head: {
    width: '93%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  icon: {
    width: 17,
    height: 13.14,
    marginRight: 8,
  },
  title: {
    color: '#2E2E2E',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default TrackerScreen;
