import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {BarChart, yAxisSides} from 'react-native-gifted-charts';
import {
  get_async_data,
  get_chart_data,
  set_async_data,
} from '../../../../Helper/AppHelper';
import {useIsFocused} from '@react-navigation/native';
const {width} = Dimensions.get('window');

const adImgWidth = width - 50;
const adImgRatio = adImgWidth / 1260;

const btnWidth = width - 100;
const btnRatio = btnWidth / 1256;

const LineChartAdComponent = (props: any) => {
  const isFocused = useIsFocused();
  const [adSeen, setadSeen] = useState('');
  const [btnType, setbtnType] = useState('Add');
  const [stackData, setstackData] = useState([
    {
      stacks: [
        {value: 80, color: 'transparent'},
        {value: 120, color: '#38D73F', marginBottom: 2},
      ],
      label: '9am',
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        let bpAdded = await get_async_data('record_bp');

        if (bpAdded == null) {
          setbtnType('Add');
        } else {
          // record added already
          setbtnType('Unlock');
        }
        let adSeen = await get_async_data('line_chart_bp_ad');
        let chartData = await get_chart_data('bp');
        let dataArr = [];
        let limit =
          chartData.diastolic_pressure.length > 5
            ? 5
            : chartData.diastolic_pressure.length;
        for (let index = 0; index < limit; index++) {
          let color = '#F13F07';
          if (
            (chartData.systolic_pressure[index] >= 140 &&
              chartData.systolic_pressure[index] <= 180) ||
            (chartData.diastolic_pressure[index] >= 90 &&
              chartData.diastolic_pressure[index] <= 120)
          ) {
            color = '#EC7F00'; // Hyper. Stage-2
          } else if (
            (chartData.systolic_pressure[index] >= 130 &&
              chartData.systolic_pressure[index] <= 139) ||
            (chartData.diastolic_pressure[index] >= 80 &&
              chartData.diastolic_pressure[index] <= 89)
          ) {
            color = '#FF9A24'; // Hyper. Stage-1
          } else if (
            chartData.systolic_pressure[index] >= 120 &&
            chartData.systolic_pressure[index] <= 129 &&
            chartData.diastolic_pressure[index] >= 60 &&
            chartData.diastolic_pressure[index] <= 79
          ) {
            color = '#FEB056'; // Elevated
          } else if (
            chartData.systolic_pressure[index] >= 90 &&
            chartData.systolic_pressure[index] <= 119 &&
            chartData.diastolic_pressure[index] >= 60 &&
            chartData.diastolic_pressure[index] <= 79
          ) {
            color = '#2EB100'; // Normal
          } else if (
            chartData.systolic_pressure[index] > 80 ||
            chartData.diastolic_pressure[index] > 120
          ) {
            color = '#3980FF'; //Hypertension
          } else {
            // color = '#F13F07'
            color = '#3980FF'; //Hypotension
          }

          let stack = {
            stacks: [
              {
                value: parseInt(chartData.diastolic_pressure[index]),
                color: 'transparent',
              },
              {
                value:
                parseInt(chartData.systolic_pressure[index]) -
                parseInt(chartData.diastolic_pressure[index]),
                color: color,
                marginBottom: 2,
              },
            ],
            label: moment(chartData.label[index]).format('MM-DD'),
          };
          dataArr.push(stack);
        }
        setstackData(dataArr.reverse());
        setadSeen(adSeen);
      } catch (e) {
        console.log('error', e);
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
              stackData={stackData}
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
                props.navigation.navigate('AddNewBloodPressureScreen'); //AddBloodPressure
              }}>
              <Text style={styles.addbtnText}>{props.langstr.main.add}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ImageBackground
          style={styles.adImage}
          source={require('../../../../assets/icons/bp_line_chart.png')}>
          <View style={styles.descriptionContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.btnText}>
              {btnType == 'Add'
                ? props.langstr.tracker.bpCharAddtText
                : props.langstr.tracker.bpChartText}
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
              onPress={() => props.navigation.navigate('BloodPressure')}>
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
  btnContainer: {
    marginBottom: 15,
  },
  descriptionContainer: {
    maxWidth: '80%',
    alignSelf: 'center',
  },
  btn: {
    width: btnWidth,
    height: 176 * btnRatio,
    alignSelf: 'center',
    backgroundColor: `rgba(0, 159,139, 1)`,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'bottom',
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
    backgroundColor: '#F4F5F6',
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
export default LineChartAdComponent;
