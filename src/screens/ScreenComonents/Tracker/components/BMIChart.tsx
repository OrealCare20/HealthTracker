import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Text,
  Image,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import React, {useEffect, useState} from 'react';
import {
  get_async_data,
  get_chart_data,
  set_async_data,
} from '../../../../Helper/AppHelper';
import moment from 'moment';
import {BarChart, yAxisSides} from 'react-native-gifted-charts';

import {useIsFocused} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const adImgWidth = width - 50;
const adImgRatio = adImgWidth / 1260;

const btnWidth = width - 100;
const btnRatio = btnWidth / 1256;

const BMIChart = (props: any) => {
  const isFocused = useIsFocused();
  const [adSeen, setadSeen] = useState('');
  const [btnType, setbtnType] = useState('Add');
  const [stackData, setstackData] = useState([
    {
      value: 21,
      frontColor: '#13CC5D',
      label: moment().format('DD-MM'),
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        let adSeen = await get_async_data('line_chart_bmi_ad');
        setadSeen(adSeen);
        // if (adSeen == 'unseen') {
        //   load();
        // } else {
        let chartData = await get_chart_data('bmi');
        let dataArr = [];
        let limit = chartData.data.length > 5 ? 5 : chartData.data.length;
        for (let index = 0; index < limit; index++) {
          let barcolor = '#F13F07';
          if (chartData.result[index] == 'Severely underweight') {
            barcolor = '#0CB3FE'; // Serversly Underweight
          } else if (chartData.result[index] == 'Underweight') {
            barcolor = '#0CB3FE'; //Underweight
          } else if (chartData.result[index] == 'Normal') {
            barcolor = '#13CC5D'; // Normal
          } else if (chartData.result[index] == 'OverWeight') {
            barcolor = '#FFC35C'; // OverWeight
          } else if (chartData.result[index] == 'Obese class 1') {
            barcolor = '#FF9046'; // Obese class 1
          } else {
            barcolor = '#F13F07'; // Obese class 2
          }

          // {value: 15, frontbarcolor: '#f00'}
          let obj = {
            value: parseFloat(chartData.data[index]),
            frontColor: barcolor,
            label: moment(chartData.label[index]).format('MM-DD'),
          };
          dataArr.push(obj);
        }
        setstackData(dataArr.reverse());
        // }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [isFocused, adSeen]);

  useEffect(() => {
    (async () => {
      // change button according to record (added or not)
      let bpAdded = await get_async_data('record_bmi');
      if (bpAdded == null) {
        setbtnType('Add');
      } else {
        // record added already
        setbtnType('Unlock');
      }
    })();
  }, [isFocused]);

  return (
    <>
      {adSeen == 'seen' ? (
        <>
          <View style={styles.chartContainer}>
            <BarChart
              width={width - 125}
              barWidth={20}
              capColor={'red'}
              spacing={30}
              noOfSections={4}
              barBorderRadius={15}
              data={stackData}
              showXAxisIndices
              xAxisThickness={1}
              xAxisIndicesColor={'#000'}
              xAxisColor={'#DCDCDC'}
              xAxisIndicesHeight={6}
              xAxisIndicesWidth={1}
              yAxisThickness={0}
              stepHeight={38}
              horizontalRulesStyle={styles.horizontialTextStyle}
              initialSpacing={15}
              yAxisTextStyle={styles.labeltext}
              xAxisLabelTextStyle={styles.labeltext}
              dashGap={2}
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                props.navigation.navigate('BmiRecordScreen');
              }}>
              <Text style={styles.addbtnText}>{props.langstr.main.add}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ImageBackground
          style={styles.adImage}
          source={require('../../../../assets/icons/line_chart_ad.png')}>
          <View style={styles.descriptionContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.btnText}>
              {btnType == 'Add'
                ? props.langstr.tracker.bmiChartAddText
                : props.langstr.tracker.bmiChartText}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {btnType == 'Add' ? (
              <Image
                style={styles.Img}
                source={require('../../../../assets/icons/img.png')}
              />
            ) : (
              <Image
                style={styles.lockImg}
                source={require('../../../../assets/icons/lock.png')}
              />
            )}
          </View>
          {btnType == 'Add' ? (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => props.navigation.navigate('BmiRecordScreen')}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.btnText}>
                {props.langstr.main.add}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btn} onPress={props.showAd}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.btnText}>
                {props.langstr.main.unlock}
              </Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  btnContainer: {
    marginBottom: 15,
  },
  adImage: {
    width: adImgWidth,
    height: 896 * adImgRatio,
    alignSelf: 'center',
    marginVertical: 20,
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  NativeAd: {
    width: 323,
    height: 245,
    backgroundColor: `rgba(0,0,0,0.3)`,
    alignSelf: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
  },
  descriptionContainer: {
    maxWidth: '80%',
    alignSelf: 'center',
  },
  btn: {
    width: btnWidth,
    height: 176 * btnRatio,
    alignSelf: 'center',
    backgroundColor: `rgba(0, 159,139, 0.7)`,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  addbtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  chartContainer: {
    width: width * 0.86,
    alignSelf: 'center',
    overflow: 'scroll',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f4f5f6',
    borderRadius: 10,
  },
  horizontialTextStyle: {
    fontSize: 12,
  },
  labeltext: {
    fontSize: 9,
    color: '#363636',
  },
  xBorder: {
    borderWidth: 1,
  },
  lockImg: {
    width: 49,
    height: 70.02,
    alignSelf: 'center',
  },
  Img: {
    width: 78.7,
    height: 73.15,
    alignSelf: 'center',
  },
});
export default BMIChart;
