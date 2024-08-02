import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import analytics from '@react-native-firebase/analytics';
import {lang} from '../../global';
import { useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width - 80;
const RATIO = ITEM_WIDTH / 1256;

const DisclaimerScreen = ({navigation}: {navigation: any}) => {
  const isFocused = useIsFocused();
  const [language, setlanguage] = useState({
    setting: {discText: '', disclaimer: ''},
    main: {okay: ''},
  });
  const [desc, setdesc] = useState('');
  const [title, settitle] = useState('');
  const [btntxt, setbtntxt] = useState('');
  useEffect(() => {
    (async () => {
      try {
        await analytics().logEvent('disclaimer_screen');
        let lan = await lang();
        setlanguage(lan);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [isFocused]);
  useEffect(() => {
    setdesc(language?.setting.discText);
    settitle(language?.setting.disclaimer);
    setbtntxt(language?.main.okay);
  }, [language]);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.col}>
          <TouchableOpacity
            style={{paddingHorizontal: 10, paddingVertical: 5}}
            onPress={() => navigation.navigate('HomeScreen')}
            accessibilityLabel="Back">
            <Image
              style={{width: 14, height: 14}}
              source={require('../assets/images/dashboard_icons/navigate_back_new.png')}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>{title}</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.content}>{desc}</Text>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.btntxt}>{btntxt}</Text>
        </TouchableOpacity>
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
    alignItems: 'center'
  },
  btntxt: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  }
});
export default DisclaimerScreen;
