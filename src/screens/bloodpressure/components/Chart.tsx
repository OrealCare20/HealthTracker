import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {BarChart, yAxisSides} from 'react-native-gifted-charts';
import {get_chart_data} from '../../../Helper/AppHelper';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

function Chart(props: any) {
  const isFocus = useIsFocused();
  const [stackData, setstackData] = useState([
    {
      stacks: [
        {value: 80, color: 'transparent'},
        {value: 120, color: '#38D73F', marginBottom: 2},
      ],
      label: '9am',
    },
  ]);
  const render = false;
  useEffect(() => {
    (async () => {
      let chartData = await get_chart_data('bp');
      let dataArr = [];
      let limit =
        chartData.data.diastolic_pressure.length > 5
          ? 5
          : chartData.data.diastolic_pressure.length;
      for (let index = 0; index < limit; index++) {
        let color = '#F13F07';
        if (
          (chartData.data.systolic_pressure[index] >= 140 &&
            chartData.data.systolic_pressure[index] <= 180) ||
          (chartData.data.diastolic_pressure[index] >= 90 &&
            chartData.data.diastolic_pressure[index] <= 120)
        ) {
          color = '#EC7F00'; // Hyper. Stage-2
        } else if (
          (chartData.data.systolic_pressure[index] >= 130 &&
            chartData.data.systolic_pressure[index] <= 139) ||
          (chartData.data.diastolic_pressure[index] >= 80 &&
            chartData.data.diastolic_pressure[index] <= 89)
        ) {
          color = '#FF9A24'; // Hyper. Stage-1
        } else if (
          chartData.data.systolic_pressure[index] >= 120 &&
          chartData.data.systolic_pressure[index] <= 129 &&
          chartData.data.diastolic_pressure[index] >= 60 &&
          chartData.data.diastolic_pressure[index] <= 79
        ) {
          color = '#FEB056'; // Elevated
        } else if (
          (chartData.data.systolic_pressure[index] >= 90 &&
          chartData.data.systolic_pressure[index] <= 119 )&&
          (chartData.data.diastolic_pressure[index] >= 60 &&
          chartData.data.diastolic_pressure[index] <= 79)
        ) {
          color = '#2EB100'; // Normal
        } else if (
          chartData.data.systolic_pressure[index] > 80 ||
          chartData.data.diastolic_pressure[index] > 120
        ) {
          color = '#3980FF'; //Hypertension
        } else {
          // color = '#F13F07'
          color = '#3980FF'; //Hypotension
        }

        let stack = {
          stacks: [
            {
              value: chartData.data.diastolic_pressure[index],
              color: 'transparent',
            },
            {
              value:
                chartData.data.systolic_pressure[index] -
                chartData.data.diastolic_pressure[index],
              color: color,
              marginBottom: 2,
            },
          ],
          label: moment(chartData.label[index]).format('MM-DD'),
        };
        dataArr.push(stack);
      }
      setstackData(dataArr.reverse());
    })();
  }, [isFocus]);

  return (
    <>
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
        animationDuration={2000}
        isAnimated
      />
    </>
  );
}

const styles = StyleSheet.create({
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
});

export default Chart;
