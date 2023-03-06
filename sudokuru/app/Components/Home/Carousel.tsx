import React, {useState} from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, Image, LogBox, TouchableNativeFeedback, Platform, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Button } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";

const Ccarousel = () =>{

        //const size = useWindowDimensions();
        //const width = Math.min(size.width, size.height);
        //console.log(width);
    const width = Dimensions.get('window').width;

    const navigation: any = useNavigation();

    const [index, setIndex] = useState(0);

    function navigate(index: number):any {
        index == 0 ? navigation.navigate('AdjustNotesLesson') :
            index == 1 ? navigation.navigate('SimplifyNotesLesson') :
                index == 2 ? navigation.navigate('NakedSingleLesson') :
                    index == 3 ? navigation.navigate('HiddenSingleLesson') :
                        index == 4 ? navigation.navigate('NakedSetLesson') :
                            index == 5 ? navigation.navigate('HiddenSetLesson') :
                                index == 6 ? navigation.navigate('PointingPairLesson') :
                                    index == 7 ? navigation.navigate('PointingTripletLesson') :
                                        index == 8 ? navigation.navigate('BoxLineReductionLesson') :
                                            index == 9 ? navigation.navigate('XWingLesson') :
                                                index == 10 ? navigation.navigate('SwordfishLesson') :
                                                    index == 11 ? navigation.navigate('SinglesChainingLesson') : navigation.navigate('Home');
    };

    function getLessonName(index: number):string {
        let lessonName: string;
        index == 0 ? lessonName = 'AdjustNotesLesson' :
            index == 1 ? lessonName = 'SimplifyNotesLesson' :
                index == 2 ? lessonName = 'NakedSingleLesson' :
                    index == 3 ? lessonName = 'HiddenSingleLesson' :
                        index == 4 ? lessonName = 'NakedSetLesson' :
                            index == 5 ? lessonName = 'HiddenSetLesson' :
                                index == 6 ? lessonName = 'PointingPairLesson' :
                                    index == 7 ? lessonName = 'PointingTripletLesson' :
                                        index == 8 ? lessonName = 'BoxLineReductionLesson' :
                                            index == 9 ? lessonName = 'XWingLesson' :
                                                index == 10 ? lessonName = 'SwordfishLesson' :
                                                    index == 11 ? lessonName = 'SinglesChainingLesson' : lessonName = 'Null';
        return lessonName;
    }

    if(Platform.OS === 'web'){
    return(
        <View>
            <Carousel
                loop
                width={width}
                height={width / 4}
                autoPlay={false}
                data={[...new Array(12).keys()]}
                mode='parallax'
                modeConfig={{
                  parallaxScrollingScale: 0.5,
                  parallaxScrollingOffset: 1250,
                }}
                scrollAnimationDuration={100}
                onSnapToItem={(index) => setIndex(index)}
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
                                {getLessonName(index)}
                            </Text>
                        </View>
                )}
            />
            <Button onPress={() => navigate(index)}>
                Start Lesson
            </Button>
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
};

export default Ccarousel;