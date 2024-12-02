import { View, Text, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppOpenAd } from 'react-native-google-mobile-ads';
import { APPOPEN_AD_ID } from './AdManager';
// import ZoomAnimation from '../components/ZoomAnimation';

const { width } = Dimensions.get('window');

export const AppOpenAd = (props: any) => {
    const [loader, setloader] = useState(true);
    const { isClosed, isLoaded, error, load, show } = useAppOpenAd(APPOPEN_AD_ID, {
        requestNonPersonalizedAdsOnly: true,
    });

    useEffect(() => {
        if (!isLoaded) {
            load();
            console.log(error);
        }
    }, [load, isLoaded]);

    useEffect(() => {
        if (error != undefined) {
            props.settrayad(false);
        }
    }, [error]);

    useEffect(() => {
        if (isClosed) {
            props.settrayad(false);
            props._continue();
        }
    }, [isClosed]);

    useEffect(() => {
        if (isLoaded) {
            setloader(false);
        }
    }, [isLoaded]);

    const display = () => {
        if (loader) {
            return (
                // <ActivityIndicator size={'large'} color={'#a6a6a6'} />
                <Text style={{fontWeight: '600', fontSize: 16, fontFamily: 'Montserrat-Bold',fontStyle: 'normal'}}>Loading Ad ...</Text>
            )
        } else {
            if (isLoaded && !error) {
                show();
            }
        }
    }

    return (
        <View
            style={{
                width: width,
                height: '100%',
                backgroundColor: '#fff',
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {display()}
        </View>
    );
};