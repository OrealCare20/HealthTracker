import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, AppState } from 'react-native';
import React, { useState, useEffect } from 'react';
import analytics from '@react-native-firebase/analytics';
import PageHeader from './components/PageHeader';
import { Banner } from '../../../Helper/AdManager';
import { add_diet_report_to_local_storage, calculate_calories, get_async_data, sumNutrientValues } from '../../../Helper/AppHelper';
import { useIsFocused, useRoute } from '@react-navigation/native';
import CalorieResult from './components/CalorieResult';
import moment from 'moment';
import { lang } from '../../../../global';
const { width, height } = Dimensions.get('window');

const btnWidth = width - 45;
const btnRatio = btnWidth / 1256;

const CalorieDescriptionScreen = ({ navigation }: { navigation: any }, { params }: { params: any }) => {
    const route = useRoute();
    const isFocused = useIsFocused();
    const [click, setclick] = useState(false);
    const [resultview, setresultview] = useState(false);
    const [description, setdescription] = useState('');
    const [appopenloader, setappopenloader] = useState(false);
    const [data, setdata] = useState({});
    const [apires, setapires] = useState({});
    const [language, setlanguage] = useState({
        calDesc: {
            title: '',
            subTitle: '',
            submit: '',
            placeholder: ''
        }
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

    useEffect(() => {
        (async () => {
            AppState.addEventListener('change', handleAppStateChange);
            await analytics().logEvent('calorie_description_screen');
            let lan = await lang();
            setlanguage(lan);
        })();
    }, [language, isFocused]);

    const getCalorie = async () => {
        if (description.length > 3) {
            setclick(true);
            let res = await calculate_calories(description.replace(/(\r\n|\n|\r)/gm, " "));
            if (res && res.length > 0) {
                setapires(res);
                let obj = sumNutrientValues(res);
                setdata(obj);
                let newObj = { ...obj, datetime: moment().format('YYYY-MM-D HH:mm:s'), intake: route.params?.type };
                await add_diet_report_to_local_storage(newObj);
                setclick(false);
                setresultview(true);
            } else {
                setclick(false);
                Alert.alert('Enter correct description');
            }
        } else {
            Alert.alert('Enter correct description');
        }
    }

    return (
        <>
            <View style={styles.container}>
                {
                    resultview ? (<CalorieResult title={route.params?.type} setresultview={setresultview} dataset={data} apires={apires} />) : (
                        <>
                            <PageHeader screenTitle={language.calDesc.title} navigation={navigation} />
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.mainContainer}>
                                    <Text style={styles.title}>{language.calDesc.title}</Text>
                                    {/* language.calDesc.placeholder */}
                                    <TextInput style={styles.inputContainer} placeholder={`Enter your ${route.params?.type.toLowerCase()}`} placeholderTextColor={'#989898'} textAlignVertical='top' multiline onChangeText={setdescription} />
                                </View>
                                {
                                    click ? (<ActivityIndicator size={'large'} color={'#C6C6C6'} />) : (<TouchableOpacity
                                        onPress={getCalorie}
                                        style={styles.button}>
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            style={{ color: '#fff', fontSize: 16, fontFamily: 'Raleway-ExtraBold' }}>
                                            {language.calDesc.submit}
                                        </Text>
                                    </TouchableOpacity>)
                                }

                            </ScrollView>
                        </>
                    )
                }

                {/* BANNER AD */}
                <View
                    style={{
                        height: 'auto',
                        width: width,
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: '#F4F4FE'
                    }}>

                    <Banner />
                </View>
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
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0
    },
    mainContainer: {
        width: width * 0.95,
        alignSelf: 'center',
        marginBottom: 35
    },
    title: {
        color: '#2E2E2E',
        fontSize: 20,
        fontFamily: 'Roboto',
        marginLeft: 10,
        marginVertical: 15,
    },
    inputContainer: {
        width: '93%',
        paddingHorizontal: 15,
        borderColor: '#069C8B',
        borderWidth: 2,
        alignSelf: 'center',
        borderRadius: 15,
        height: height * 0.32,
    },
    button: {
        alignSelf: 'center',
        width: btnWidth,
        height: 176 * btnRatio,
        backgroundColor: '#009f8b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    }
});
export default CalorieDescriptionScreen;