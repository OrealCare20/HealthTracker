import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  BackHandler,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NativeAd150} from '../Helper/NativeAd150';
import {set_async_data} from '../Helper/AppHelper';
import {lang} from '../../global';
import {LANGUAGE_NATIVE_AD_ID} from '../Helper/AdManager';
const {width} = Dimensions.get('screen');

const ChangeLanguageScreen = ({navigation}: {navigation: any}) => {
  const [selectedLang, setselectedLang] = useState('en');
  const [title, settitle] = useState('Language');
  const [language, setlanguage] = useState({setting: {language: ''}});
  const langArr = [
    {key: 'en', name: 'English'},
    {key: 'es', name: 'Española'},
    {key: 'tr', name: 'Türkiye'},
    // {key: 'ar', name: 'عربي'},
    {key: 'gr', name: 'German'},
    {key: 'fr', name: 'French'},
    {key: 'it', name: 'Italian'},
    {key: 'ru', name: 'Russian'},
    {key: 'jp', name: 'Japanese'},
    // {key: 'ind', name: 'Indonesian'},
    {key: 'ko', name: 'Korean'},
    // {key: 'fl', name: 'Filipino'},
    {key: 'vt', name: 'Vietnamese'},
    {key: 'tml', name: 'Tamil'},
    {key: 'khmr', name: 'Khmer'},
    {key: 'thi', name: 'Thai'},
    // {key: 'port', name: 'Portuguese'},
  ];

  useEffect(() => {
    (async () => {
      let lan = await lang();
      setlanguage(lan);
    })();
  }, []);
  useEffect(() => {
    settitle(language?.setting.language);
  }, [language]);

  const displayLanguages = () => {
    let a = langArr.map((item, index) => {
      return (
        <TouchableOpacity
          style={[
            styles.languageBox,
            selectedLang == item.key
              ? {backgroundColor: `rgba(0, 159,139, 0.7)`,}
              : {backgroundColor: '#EBEBEC'},
          ]}
          key={index}
          onPress={() => setselectedLang(item.key)}>
          <Text
            style={[
              styles.language,
              selectedLang == item.key ? {color: '#fff'} : {color: '#2E2E2E'},
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    });
    return a;
  };

  const backAction = () => {
    navigation.navigate('HomeScreen');
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  const navigate = async () => {
    await set_async_data('selected_lang', selectedLang);
    navigation.navigate('HomeScreen', {tab: 'setting'});
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.col}>
          <TouchableOpacity
            style={{paddingHorizontal: 10, paddingVertical: 5}}
            onPress={() => navigation.navigate('HomeScreen', {tab: 'setting'})}
            accessibilityLabel="Back">
            <Image
              style={{width: 14, height: 14}}
              source={require('../assets/images/dashboard_icons/navigate_back_new.png')}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>{title}</Text>
        </View>
        <TouchableOpacity onPress={navigate}>
          <Image
            style={{width: 38, height: 34}}
            source={require('../assets/icons/tickbtn.png')}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{width: width, height: width, overflow: 'scroll'}}>
        <View style={styles.languageContainer}>{displayLanguages()}</View>
      </ScrollView>
      <View style={styles.nativeAd}>
        {/* <NativeAd150 adId={LANGUAGE_NATIVE_AD_ID} /> */}
      </View>
    </SafeAreaView>
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
  languageContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 20,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
  },
  languageBox: {
    width: (width - 40) / 2,
    padding: 15,
    marginBottom: 20,
    borderRadius: 6,
  },
  language: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
    textAlign: 'center',
  },
  nativeAd: {
    width: width * 0.895,
    alignSelf: 'center',
    backgroundColor: '#fff',
    top: '8%',
    elevation: 2,
    borderRadius: 12,
  },
});
export default ChangeLanguageScreen;
