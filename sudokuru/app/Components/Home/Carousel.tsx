import React, {useState} from 'react';
import {
    View,
    Text,
    Platform,
    useWindowDimensions
} from 'react-native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import { Button } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";

const Ccarousel = () =>{

    const size = useWindowDimensions();
    const width = Math.min(size.width, size.height);

    const navigation: any = useNavigation();

    const ref = React.useRef<ICarouselInstance>(null);
    const [index, setIndex] = useState(0);

    function navigate(index: number):any {
        index == 0 ? navigation.navigate('Lesson',{params:'AMEND_NOTES'}) :
            index == 1 ? navigation.navigate('Lesson',{params:'SIMPLIFY_NOTES'}) :
                index == 2 ? navigation.navigate('Lesson',{params:'NAKED_SINGLE'}) :
                    index == 3 ? navigation.navigate('Lesson',{params:'NAKED_SET'}) :
                        index == 4 ? navigation.navigate('Lesson',{params:'HIDDEN_SINGLE'}) :
                            index == 5 ? navigation.navigate('Lesson',{params:'HIDDEN_SET'}) :
                                index == 6 ? navigation.navigate('Lesson',{params:'POINTING_PAIR'}) :
                                    index == 7 ? navigation.navigate('Lesson',{params:'BOX_LINE_REDUCTION'}) :
                                        index == 8 ? navigation.navigate('Lesson',{params:'SWORDFISH'}) :
                                            index == 9 ? navigation.navigate('Lesson',{params:'X_WING'}) :
                                                index == 10 ? navigation.navigate('Lesson',{params:'SINGLES_CHAINING'}) : navigation.navigate('Home');
    };

    function getLessonName(index: number):string {
        let lessonName: string;
        index == 0 ? lessonName = 'Amend Notes' :
            index == 1 ? lessonName = 'Simplify Notes' :
                index == 2 ? lessonName = 'Naked Single' :
                    index == 3 ? lessonName = 'Naked Set' :
                        index == 4 ? lessonName = 'Hidden Single' :
                            index == 5 ? lessonName = 'Hidden Set' :
                                index == 6 ? lessonName = 'Pointing Pair' :
                                    index == 7 ? lessonName = 'Box Line Reduction' :
                                        index == 8 ? lessonName = 'X Wing' :
                                            index == 9 ? lessonName = 'Swordfish' :
                                                index == 10 ? lessonName = 'Singles Chaining' : lessonName = 'Null';
        return lessonName;
    }

    if(Platform.OS === 'web'){
        return(
            <View>
                <Carousel
                    loop
                    width={width}
                    height={width / 4}
                    ref={ref}
                    autoPlay={false}
                    data={[...new Array(11).keys()]}
                    mode='parallax'
                    modeConfig={{
                      parallaxScrollingScale: 0.5,
                      parallaxScrollingOffset: 1250,
                      parallaxScrollingInverted: true
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
                                {/*When user touches Lesson Icon text they will be navigated to the given lesson*/}
                                <Button style={{alignItems: 'center'}} onPress={() => navigate(index)}>
                                    <Text style={{ fontSize: 30 }}>{getLessonName(index)}</Text>
                                </Button>
                            </View>
                    )}
                />
                <View style={{ justifyContent: 'center', flexDirection: 'row'}}>
                    <Button onPress={() => ref.current?.scrollTo({count: -1})}>
                        <AntDesign name="leftcircleo" size={18}/>
                    </Button>
                    <Button onPress={() => navigate(index)}>
                        Start Lesson
                    </Button>
                    <Button onPress={() => ref.current?.scrollTo({count: 1})}>
                        <AntDesign name="rightcircleo" size={18}/>
                    </Button>
                </View>
            </View>
        );
    }
     else{
        return(
            <View>
                <Carousel
                        loop
                        width={width}
                        height={width / 1.5}
                        ref={ref}
                        autoPlay={false}
                        data={[...new Array(11).keys()]}
                        mode='parallax'
                        modeConfig={{
                          parallaxScrollingScale: 0.8,
                          parallaxScrollingOffset: 120,
                        }}
                        scrollAnimationDuration={200}
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
                                {/*When user touches Lesson Icon they will be navigated to the given lesson*/}
                                <Button contentStyle={{height: '100%'}} onPress={() => navigate(index)}>
                                    {getLessonName(index)}
                                </Button>
                            </View>
                        )}
                    />
                    <View style={{ justifyContent: 'center', flexDirection: 'row'}}>
                        <Button onPress={() => ref.current?.scrollTo({count: -1})}>
                            <AntDesign name="leftcircleo" size={18}/>
                        </Button>
                        <Button onPress={() => navigate(index)}>
                            Start Lesson
                        </Button>
                        <Button onPress={() => ref.current?.scrollTo({count: 1})}>
                            <AntDesign name="rightcircleo" size={18}/>
                        </Button>
                    </View>
            </View>
        );
     }
};



export default Ccarousel;