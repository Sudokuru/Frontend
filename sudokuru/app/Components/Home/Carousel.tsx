import React from 'react';
import { Button, View, StyleSheet, Dimensions, Pressable, Text, Image, LogBox, TouchableNativeFeedback, Platform, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const Ccarousel = () =>{
    const width = Dimensions.get('window').width;

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

export default Ccarousel;