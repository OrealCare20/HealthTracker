import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
export const APPID = 3; // TEST APPID=3, LIVE APPID=4
export const AWS_S3_URL = 'https://cvmakeruserimages.s3.amazonaws.com/blogs/';
export const API_KEY = '98b51cbe28734a39b7e104101241005';
export const BASE_URL = 'https://mrlapps.care20.com/api/sugar_app/'; // live server
// export const BASE_URL = 'http://192.168.10.43/MRL-Apps/MRL-Apps/public/api/sugar_app/'; // local server

export const IMG_BASE_URL = 'https://mrlapps.care20.com/uploads/'; // live server
export const MEAL_IMG_URL = 'https://mrlapps.care20.com/uploads/'; // local server
export const ADD_USER = BASE_URL + 'add-user';
export const DASHBOARD = BASE_URL + 'dashboard';
export const GET_REPORT = BASE_URL + 'get-reports';
export const CHART_DATA = BASE_URL + 'chart-data';
export const ADD_REPORT = BASE_URL + 'add-new-report';
export const DELETE_REPORT = BASE_URL + 'delete-report';
export const GET_MEAL_PLAN = BASE_URL + 'get-meal-plan';
export const GET_BLOGS = BASE_URL + 'get-blogs';
export const FILTER_REPORT = BASE_URL + 'get-filter-report';

export const duration = [
  'Before meal',
  'After meal',
  'Fasting',
  'After sleep',
  'Other',
];

export const REPORT_TYPES = {
  temperature: 'temperature',
  weight: 'weight',
  medicine: 'medicine',
  aic: 'aic',
  sugar: 'sugar',
  bp: 'bp',
  bmi: 'bmi',
  heartRate: 'heart_rate',
};

export const set_async_data = async (name: any, value: any) => {
  try {
    await AsyncStorage.setItem(name, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

export const get_async_data = async (name: any) => {
  try {
    const data = await AsyncStorage.getItem(name);
    return data != null ? JSON.parse(data) : null;
  } catch (error) {
    return false;
  }
};

export const generateFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  await set_async_data('fcm_token', token);
  await set_async_data('on_board', 'onboard');
};
// add Data into DB

export const dashboard = async () => {
  let userID = await get_async_data('user_id');
  const resposne = await fetch(DASHBOARD, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ user_id: userID }),
  });
  let res = await resposne.json();
  return res;
};
export const get_report = async (reportType: string) => {
  let userID = await get_async_data('user_id');
  console.log(userID);
  const resposne = await fetch(GET_REPORT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ user_id: userID, report_type: reportType }),
  });
  let res = await resposne.json();
  return res.data;
};
export const filter_report = async () => {
  let userID = await get_async_data('user_id');
  const resposne = await fetch(FILTER_REPORT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ user_id: userID, report_type: 'bp' }),
  });
  let res = await resposne.json();
  return res.data;
};
export const get_pdf_report = async (data: any) => {
  const resposne = await fetch(GET_REPORT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify(data),
  });
  let res = await resposne.json();
  return res.data;
};
export const add_report = async (postData: any) => {
  try {
    const storedData = await AsyncStorage.getItem('report');
    let dataArray = [];

    // Check if storedData is not null and is valid JSON
    if (storedData) {
      dataArray = JSON.parse(storedData);
    }
    dataArray.push(postData);
    await AsyncStorage.setItem('report', JSON.stringify(dataArray));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const get_chart_data = async (reportType: string) => {
  let record = await get_async_data('report');
  let data = [];
  if (record) {
    try {
      record.forEach((entry: any) => {
        if(entry.report_type == 'bp') {
          data.push(entry);
        }
      })
    } catch(e) { 
      console.log('error while mapping over the object', e);
    }
  }
  // let userID = await get_async_data('user_id');
  // const resposne = await fetch(CHART_DATA, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Requested-With': 'XMLHttpRequest',
  //   },
  //   body: JSON.stringify({ user_id: userID, report_type: reportType }),
  // });
  // let res = await resposne.json();
  // return res;
};

export const arrange_data_for_graph = (data: any) => {

}

export const getMonthName = (dateString: any) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const parts = dateString.split('-');
  const monthNumber = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (monthNumber >= 1 && monthNumber <= 12 && day >= 1 && day <= 31) {
    const monthName = months[monthNumber - 1];
    let name = monthName + ', ' + day;
    return name.toString();
  } else {
    return 'Invalid Date';
  }
};
export const errorMessage = () => {
  return (
    <View style={{ width: '80%', alignSelf: 'center', zIndex: 1 }}>
      <Text style={{ color: '#f00', textAlign: 'center' }}>
        Fill out the form correctly
      </Text>
    </View>
  );
};

export const remarks = (systolicpressure: any, diastolicpressure: any) => {
  if (systolicpressure != '' && diastolicpressure != '') {
    return;
  }

  if (systolicpressure < 120 && diastolicpressure < 80) {
    return 'Normal';
  }
  if (
    systolicpressure >= 120 ||
    (systolicpressure <= 129 && diastolicpressure < 80)
  ) {
    return 'Elevated';
  }

  if (
    systolicpressure >= 130 ||
    (systolicpressure <= 139 && diastolicpressure >= 80) ||
    diastolicpressure <= 89
  ) {
    return 'Hypertension';
  }

  if (systolicpressure >= 140 && diastolicpressure >= 90) {
    return 'Hypertensive';
  }
};

export const systolicValues = () => {
  let arr = [];
  for (let i = 60; i <= 300; i++) {
    arr.push(i.toString());
  }
  return arr;
};
export const diastolicValues = () => {
  let arr = [];
  for (let i = 20; i <= 200; i++) {
    arr.push(i.toString());
  }
  return arr;
};
export const pulseValues = () => {
  let arr = [];
  for (let i = 60; i <= 200; i++) {
    arr.push(i.toString());
  }
  return arr;
};

export const ageList = () => {
  let arr = [];
  for (let i = 7; i <= 110; i++) {
    arr.push(i.toString());
  }
  return arr;
};

export const pulse_rate_measurement = async (start: any, end: any) => {
  let pulse_rate = await get_async_data('pulse_rate');
  // if (pulse_rate != null) {
  //     let pulse_rate_start = pulse_rate - 5;
  //     let pulse_rate_end = pulse_rate + 5;
  //     let new_pulse_rate = randomIntFromInterval(pulse_rate_start, pulse_rate_end);
  //     return new_pulse_rate;
  // }
  // else {
  let pulse = randomIntFromInterval(start, end);
  await set_async_data('pulse_rate', pulse);
  return pulse_rate;
  // }
};

const randomIntFromInterval = (min: any, max: any) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const roundNearestAfterDecimal = (num: any) => {
  // Convert the number to a string
  const numStr = num.toString();

  // Split the string by the decimal point
  const parts = numStr.split('.');

  // If there is no decimal point or no digits after the decimal point, return the original number
  if (parts.length < 2 || parts[1].length === 0) {
    return num;
  }

  // Get the digit immediately after the decimal point
  const nextDigit = parseInt(parts[1][0], 10);

  // Check if the next digit is greater than or equal to 5
  if (nextDigit >= 5) {
    // If it is, round the number up
    return Math.ceil(num);
  } else {
    // If it's not, round the number down
    return Math.floor(num);
  }
};

export const weather_api_request = async (location: any) => {
  const resposne = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
  let res = await resposne.json();
  return res;
};

// CUCTOM DATE PICKER HELPER FUNCTIONS
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const globalDate = new Date();

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const addMonth = (month: any) => {
  if (month == 11) {
  }
};
export const subMonth = (month: any) => {
  if (month == 1) {
  }
};
