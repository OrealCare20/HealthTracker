import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import DashboardContent from './components/DashboardContent';
import Recomandations from '../../../components/Recomandations';
import {useIsFocused} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
const {width, height} = Dimensions.get('screen');
import {lang} from '../../../../global';

const Dashboard = (props: any) => {
  const isFocused = useIsFocused();

  const [selectedmenu, setselectedmenu] = useState('home');
  const [language, setlanguage] = useState({main: {homeTitle: ''}});
  const [langstr, setlangstr] = useState({main: {homeTitle: ''}});

  useEffect(() => {
    (async () => {
      try {
        await analytics().logEvent('home_tab');
        let lan = await lang();
        setlanguage(lan);
        setselectedmenu('home');
      } catch (e) {
        console.log(e);
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      setlangstr(language);
    })();
  }, [language]);

  return (
    <ScrollView
      style={styles.mainContainer}
      decelerationRate={'fast'}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.heading}>{langstr?.main.homeTitle}</Text>
      </View>
      <DashboardContent navigate={props.navigateScreen} />
      <Recomandations setselectedmenu={props.setselectedmenu} putScreen={''} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  header: {
    width: width,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  heading: {
    color: '#141417',
    fontSize: 20,
    left: '20%',
    fontFamily: 'Montserrat-Bold'
  },
  cloudImg: {
    width: 30.51,
    height: 23,
    bottom: '10%',
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    maxHeight: height * 0.81,
    marginTop: 0,
    paddingTop: 0,
  },
});
export default Dashboard;
