import React from 'react';
import { Button, View, StyleSheet, Dimensions, Pressable, Text, Image, LogBox, TouchableNativeFeedback, Platform, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const Ccarousel = () =>{
    const width = Dimensions.get('window').width;
 if(Platform.OS === 'web'){
    return(
        <View>
            <Carousel
                loop
                width={width}
                height={width / 4}
                autoPlay={false}
                data={[...new Array(6).keys()]}
                mode='parallax'
                modeConfig={{
                  parallaxScrollingScale: 0.5,
                  parallaxScrollingOffset: 1250,
                }}
                scrollAnimationDuration={100}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                            backgroundColor: '#F2F2F2'
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>

                    </View>
                )}
            />
        </View>    );
        }
 else{
    return(
    <Carousel
                    loop
                    width={width}
                    height={width / 1.5}
                    autoPlay={false}
                    data={[...new Array(6).keys()]}
                    mode='parallax'
                    modeConfig={{
                      parallaxScrollingScale: 0.8,
                      parallaxScrollingOffset: 120,
                    }}
                    scrollAnimationDuration={1000}
                    onSnapToItem={(index) => console.log('current index:', index)}
                    renderItem={({ index }) => (
                        <View
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                justifyContent: 'center',width:360, right: -25,
                                backgroundColor: '#F2F2F2'
                            }}
                        >
                            <Text style={{ textAlign: 'center', fontSize: 30 }}>
                                {index}
                            </Text>

                        </View>
                    )}
                />);

 }
}

export default Ccarousel;