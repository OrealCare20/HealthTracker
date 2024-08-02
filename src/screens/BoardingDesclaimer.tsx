import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {generateFCM, set_async_data} from '../Helper/AppHelper';
import {INTERSITIAL_AD_ID} from '../Helper/AdManager';
import DisplayAd from '../components/DisplayAd';
import analytics from '@react-native-firebase/analytics';

const {width, height} = Dimensions.get('screen');
const btnWidth = width - 60;
const btnRatio = btnWidth / 1016;

const IMG_WIDTH = width;
const IMG_RATIO = IMG_WIDTH / 1440;

const BoardingDesclaimer = ({navigation}: {navigation: any}) => {
  const route = useRoute();
  const [loader, setloader] = useState(false);

  useEffect(() => {
    (async () => {
      await analytics().logEvent('boarding_disclaimer_screen');
    })();
  }, []);
  const createUser = async () => {
   await generateFCM();
  };

  const _continue = async () => {
    await createUser();
    setloader(false);
    await set_async_data('report', []);
    navigation.navigate('MainRoute');
  };

  return (
    <SafeAreaView>
      <ImageBackground
        style={styles.img}
        source={require('../assets/icons/disclaimers.png')}>
        <View style={styles.desclaimerContainer}>
          <Text
            style={[styles.heading, {marginBottom: 10, paddingVertical: 0}]}>
            {route.params?.lang.setting.disclaimer}
          </Text>
          <Text style={styles.disclaimerText}>
            {route.params?.lang.boarding.boarding2subtitle}
          </Text>
          {loader == true ? (
            <ActivityIndicator
              size={'large'}
              color={'#f4e1e1'}
              style={{alignSelf: 'center', top: 15}}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setloader(true);
              }}
              style={styles.btn}>
              <Text style={styles.text}>
                {route.params?.lang.boarding.letsgo}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>

      {loader && <DisplayAd _continue={_continue} adId={INTERSITIAL_AD_ID} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#2E2E2E',
    fontSize: 26,
    fontFamily: 'Montserrat-Bold',
    fontStyle: 'normal',
  },
  img: {
    width: IMG_WIDTH,
    height: 3200 * IMG_RATIO,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  desclaimerContainer: {
    width: width,
    height: height * 0.32,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // backgroundColor: 'yellow',
    position: 'absolute',
    bottom: '13%',
  },
  disclaimerText: {
    fontSize: 13,
    fontFamily: 'Raleway-Medium',
    lineHeight: 18,
    color: '#868686',
    textAlign: 'center',
    maxWidth: '90%',
  },
  btn: {
    width: btnWidth,
    height: 191 * btnRatio,
    backgroundColor: '#6300C7',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
    top: '12%',
    borderRadius: 40,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
    textAlign: 'center',
  },
});
export default BoardingDesclaimer;
