import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  AppState
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { lang } from '../../global';
import { useIsFocused } from '@react-navigation/native';
import { get_async_data } from '../Helper/AppHelper';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 80;
const RATIO = ITEM_WIDTH / 1256;

const DisclaimerScreen = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  const [appopenloader, setappopenloader] = useState(false);
  const [language, setLanguage] = useState({
    setting: { discText: '', disclaimer: '' },
    main: { okay: '' },
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

  // Fetch language data and log analytics when screen is focused
  useEffect(() => {
    const fetchLanguageData = async () => {
      try {
        AppState.addEventListener('change', handleAppStateChange);
        await analytics().logEvent('disclaimer_screen');
        const lan = await lang();
        setLanguage(lan);
      } catch (e) {
        console.error('Error fetching language data:', e);
      }
    };

    if (isFocused) fetchLanguageData();
  }, [isFocused]);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.col}>
          <TouchableOpacity
            style={{ paddingHorizontal: 10, paddingVertical: 5 }}
            onPress={() => navigation.navigate('HomeScreen')}
            accessibilityLabel="Back"
          >
            <Image
              style={{ width: 14, height: 14 }}
              source={require('../assets/images/dashboard_icons/navigate_back_new.png')}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>{language.setting.disclaimer}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.content}>{language.setting.discText}</Text>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.btntxt}>{language.main.okay}</Text>
      </TouchableOpacity>

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
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  col: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    color: '#2E2E2E',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 10,
  },
  contentContainer: {
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
  },
  content: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Raleway-Medium',
    lineHeight: 22,
    marginBottom: 20,
  },
  btn: {
    width: ITEM_WIDTH,
    height: 200 * RATIO,
    alignSelf: 'center',
    top: 20,
    backgroundColor: `rgba(0, 159,139, 0.7)`,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntxt: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
});

export default DisclaimerScreen;
