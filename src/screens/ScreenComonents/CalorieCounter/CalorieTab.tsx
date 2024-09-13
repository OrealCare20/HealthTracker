import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CalorieButton from '../../../components/CalorieButton';
import { get_async_data } from '../../../Helper/AppHelper';
import ProgressIndicator from './components/ProgressIndicator';
import { lang } from '../../../../global';
const { width } = Dimensions.get('screen');

const CalorieTab = (props: any) => {
    const [language, setlanguage] = useState({
        calDesc: {
            title: '',
            subTitle: '',
            submit: ''
        },
        main: {
            calorieTitle: '',
            calorieTabTitle: '',
            total: ''
        }
    });
    const [data, setdata] = useState([{ type: 'Breakfast', calorie: 0 }, { type: 'Dinner', calorie: 0 }, { type: 'Lunch', calorie: 0 }, { type: 'Snacks', calorie: 0 }]);
    const [calorieCount, setcalorieCount] = useState(0);

    useEffect(() => {
        (async () => {
            let lan = await lang();
            setlanguage(lan);
            let record = await get_async_data('diet_report');
            let newCalories = total_calorie_data(record);
            update_calorie_count(newCalories.totalCalories);
            setcalorieCount(newCalories.calorieCount);
        })();
    }, [language]);

    const navigate = (type: any) => {
        props.navigation.navigate('CalorieDescriptionScreen', { type: type })
    }

    const total_calorie_data = (record: any) => {
        const totalCalories = {
            Breakfast: 0,
            Dinner: 0,
            Lunch: 0,
            Snacks: 0
        };

        if (record.length > 1) {
            record.map((item: any, index: any) => {
                try {
                    if (item.hasOwnProperty('intake') && item.hasOwnProperty('calories')) {
                        switch (item.intake) {
                            case 'Breakfast':
                                totalCalories.Breakfast += item.calories;
                                break;
                            case 'Dinner':
                                totalCalories.Dinner += item.calories;
                                break;
                            case 'Lunch':
                                totalCalories.Lunch += item.calories;
                                break;
                            case 'Snacks':
                                totalCalories.Snacks += item.calories;
                                break;
                            default:
                                console.log('-------------------------------------')
                                break;
                        }
                    }
                } catch (error) {
                    console.error('Error processing item:', item, error);
                }
            });
        }
        // TOTAL CALORIE COUNT (SUM)
        let calorieCount = Object.values(totalCalories).reduce((acc, value) => acc + value, 0);
        return { totalCalories: totalCalories, calorieCount: calorieCount };
    }

    const update_calorie_count = (newCalories: any) => {
        const updatedData = data.map(item => ({
            ...item,
            calorie: newCalories[item.type].toFixed(1) || item.calorie.toFixed(1)
        }));
        setdata(updatedData);
    }

    return (
        <View style={{ flex: 1, padding: 0 }}>
            {/* HEADER */}
            <View style={styles.headerContainer}>
                <Text style={styles.heading}>{language.main.calorieTitle}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.pageTitle}>{language.main.calorieTabTitle}{`\n`} <Text style={{ color: '#069C8B' }}>{calorieCount} cal</Text> {language.main.total}</Text>
                </View>

                <View style={styles.ProgressIndicatorContainer}>
                    <ProgressIndicator calorieCount={calorieCount} />
                </View>

                <View style={styles.container}>
                    <CalorieButton data={data} navigate={navigate} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.7,
        alignSelf: 'center',
        marginVertical: 15,
    },
    headerContainer: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    heading: {
        color: '#2E2E2E',
        fontSize: 20,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Bold'
    },
    pageTitle: {
        color: '#2E2E2E',
        fontSize: 22,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center'
    },
    ProgressIndicatorContainer: {
        width: width * 0.88,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }
});
export default CalorieTab;