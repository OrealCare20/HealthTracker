import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  BackHandler,
  AppState
} from 'react-native';
import React, { useState, useEffect } from 'react';
import analytics from '@react-native-firebase/analytics';
import { lang } from '../../global';
import { useIsFocused } from '@react-navigation/native';
import { get_async_data } from '../Helper/AppHelper';
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 150;
const RATIO = ITEM_WIDTH / 192;

const AboutUsScreen = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [feedback, setfeedback] = useState('');
  const [appopenloader, setappopenloader] = useState(false);
  const [language, setlanguage] = useState({
    setting: { about: '', suggestion: '', privacy: '', terms: '' },
  });
  const [title, settitle] = useState('');
  const [term, setterm] = useState('');
  const [priv, setpriv] = useState('');

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
        let lan = await lang();
        await analytics().logEvent('about_screen');
        setlanguage(lan);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    settitle(language?.setting.about);
    setterm(language?.setting.terms);
    setpriv(language?.setting.privacy);
  }, [language]);

  const backAction = () => {
    navigation.navigate('Settings');
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.col}>
            <TouchableOpacity
              style={{ paddingHorizontal: 8, paddingVertical: 5 }}
              onPress={() => navigation.navigate('HomeScreen', { tab: 'profile' })}
              accessibilityLabel="Back">
              <Image
                style={{ width: 14, height: 14 }}
                source={require('../assets/images/dashboard_icons/navigate_back_new.png')}
              />
            </TouchableOpacity>
            <Text style={styles.heading}>{title}</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Image
            style={styles.image}
            source={require('../assets/images/aboutusimage.png')}
          />
        </View>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://plancare.pk/care/drinking-water-privacy-policy/',
            )
          }
          style={styles.btn}>
          <Text style={styles.pp}>{priv}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://plancare.pk/care/drinking-water-privacy-policy/',
            )
          }
          style={[styles.btn, { bottom: 50 }]}>
          <Text style={styles.ts}>{term}</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign: 'middle',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  heading: {
    color: '#2E2E2E',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 15,
  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    width: width * 0.8,
    height: width * 1.22,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  image: {
    width: ITEM_WIDTH,
    height: 192 * RATIO,
    alignSelf: 'center',
  },
  pp: {
    color: '#5F45FE',
    textDecorationLine: 'underline',
    fontFamily: 'Raleway-Medium',
  },
  ts: {
    color: '#5F45FE',
    textDecorationLine: 'underline',
    fontFamily: 'Raleway-Medium',
  },
  btn: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
});
export default AboutUsScreen;
