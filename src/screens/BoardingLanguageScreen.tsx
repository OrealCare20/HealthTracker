import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {set_async_data} from '../Helper/AppHelper';
import {NativeAd150} from '../Helper/NativeAd150';
import analytics from '@react-native-firebase/analytics';
const {width} = Dimensions.get('screen');
import {lang as language} from '../../global';
import {translation} from '../../locales/translation';
import {LANGUAGE_NATIVE_AD_ID} from '../Helper/AdManager';

const BoardingLanguageScreen = ({navigation}: {navigation: any}) => {
  const [selectedLang, setselectedLang] = useState('');
  const [langobj, setlangobj] = useState({});

  useEffect(() => {
    (async () => {
      await analytics().logEvent('boarding_language_screen');
      let l = await language();
      setselectedLang(l);
      await set_async_data('line_chart_bp_ad', 'unseen');
      await set_async_data('pie_chart_bp_ad', 'unseen');

      await set_async_data('line_chart_bs_ad', 'unseen');
      await set_async_data('pie_chart_bs_ad', 'unseen');

      await set_async_data('line_chart_bmi_ad', 'unseen');
      await set_async_data('pie_chart_bmi_ad', 'unseen');

      await set_async_data('line_chart_temp_ad', 'unseen');
      await set_async_data('pie_chart_temp_ad', 'unseen');
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(translation).includes(selectedLang)) {
      const selectedTranslation = translation[selectedLang];
      setlangobj(selectedTranslation);
    }
  }, [selectedLang]);

  const navigate = async () => {
    if (selectedLang == '' || selectedLang == undefined) {
      ToastAndroid.showWithGravity(
        'Select a Language',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      await set_async_data('selected_lang', selectedLang);
      navigation.navigate('BoardingDesclaimer', {lang: langobj});
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <Text style={styles.heading}>Select Language</Text>
        <TouchableOpacity style={{padding: 8}} onPress={navigate}>
          <Image
            style={{width: 38, height: 34}}
            source={require('../assets/icons/tickbtn.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={{width: width, height: width + 10, marginTop: '5%'}}>
        <ScrollView
          style={{
            width: width,
          }}>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              onPress={() => setselectedLang('en')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'en'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'en' ? {color: '#fff'} : {color: '#000'},
                ]}>
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageBox,
                selectedLang == 'gr'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}
              onPress={() => setselectedLang('gr')}
              activeOpacity={0.9}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'gr' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Germen
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedLang('es')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'es'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'es' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Spanish
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedLang('fr')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'fr'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'fr' ? {color: '#fff'} : {color: '#000'},
                ]}>
                French
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedLang('tr')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'tr'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'tr' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Turkish
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setselectedLang('it')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'it'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'it' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Italy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setselectedLang('ru')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'ru'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'ru' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Russian
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setselectedLang('jp')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'jp'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'jp' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Japanese
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => setselectedLang('ind')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'ind'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'ind' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Indonesian
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => setselectedLang('ko')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'ko'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'ko' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Korean
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setselectedLang('fl')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'fl'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'fl' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Filipino
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => setselectedLang('vt')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'vt'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'vt' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Vietnamese
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedLang('tml')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'tml'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'tml' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Tamil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedLang('khmr')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'khmr'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'khmr' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Khmer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedLang('thi')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'thi'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'thi' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Thai
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => setselectedLang('port')}
              activeOpacity={0.9}
              style={[
                styles.languageBox,
                selectedLang == 'port'
                  ? {backgroundColor: '#009F8B'}
                  : {backgroundColor: '#EBEBEC'},
              ]}>
              <Text
                style={[
                  styles.language,
                  selectedLang == 'port' ? {color: '#fff'} : {color: '#000'},
                ]}>
                Portuguese
              </Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>

      <View style={styles.bannerAd}>
        {/* <NativeAd150 adId={LANGUAGE_NATIVE_AD_ID} /> */}
      </View>
    </View>
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
  heading: {
    color: '#2E2E2E',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
  languageContainer: {
    width: width,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageBox: {
    width: (width - 40) / 2,
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  language: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Raleway-Medium',
    textAlign: 'center',
  },
  bannerAd: {
    width: width * 0.88,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    borderColor: '#EBEBEC',
    borderWidth: 1,
    borderRadius: 10
  },
});
export default BoardingLanguageScreen;
