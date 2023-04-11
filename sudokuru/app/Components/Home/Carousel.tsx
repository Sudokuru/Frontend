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

const Ccarousel = () => {

    const size = useWindowDimensions();
    const width = Math.min(size.width, size.height);

    const navigation: any = useNavigation();

    const ref = React.useRef<ICarouselInstance>(null);
    let [index, setIndex] = useState(0);

    const isWeb = (Platform.OS === 'web');

    // set carousel settings depending on platform
    const carouselWidth = width;
    const carouselHeight = isWeb ? width / 4 : width / 1.5;
    const arraySize = 5;
    const scrollingScale = isWeb ? 0.5 : 0.8;
    const scrollingOffset = isWeb ? 1250 : 120;
    const scrollingInverted = isWeb;
    const scrollAnimationDuration = isWeb ? 100 : 200;
    const carouselButtonContentStyle: any = isWeb ? null : {height: '100%'};
    const carouselButtonStyle: any = isWeb ? {alignItems: 'center'} : null;
    const carouselTextSize: any = isWeb ? { fontSize: 30 } : { fontSize: 20 };

    function navigate(index: number):any {
        index == 0 ? navigation.navigate('Lesson',{params:'SUDOKU_101'}) :
            index == 1 ? navigation.navigate('Lesson',{params:'AMEND_NOTES'}) :
                    index == 2 ? navigation.navigate('Lesson',{params:'NAKED_SINGLE'}) :
                        index == 3 ? navigation.navigate('Lesson',{params:'SIMPLIFY_NOTES'}) :
                            index == 4 ? navigation.navigate('Lesson',{params:'HIDDEN_SINGLE'}) : navigation.navigate('Home');
    }

    function getLessonName(index: number):string {
        let lessonName: string;
        index == 0 ? lessonName = 'Sudoku 101' :
            index == 1 ? lessonName = 'Amend Notes' :
                index == 2 ? lessonName = 'Naked Single' :
                    index == 3 ? lessonName = 'Simplify Notes' :
                        index == 4 ? lessonName = 'Hidden Single' : lessonName = 'Null';
        return lessonName;
    }

    function decIndex(index: number) {
        ref.current?.scrollTo({count: -1});

        if(index == 0)
            setIndex(4);
        else setIndex((index-1)%5);

       // console.log((index%5))
    }

    function addIndex(index: number) {
        ref.current?.scrollTo({count: 1});

        setIndex((index+1)%5);

      //  console.log((index%5));
    }

    return(
        <View>
            <Carousel
                loop
                width={carouselWidth}
                height={carouselHeight}
                ref={ref}
                autoPlay={false}
                data={[...new Array(arraySize).keys()]}
                mode='parallax'
                modeConfig={{
                  parallaxScrollingScale: scrollingScale,
                  parallaxScrollingOffset: scrollingOffset,
                  parallaxScrollingInverted: scrollingInverted
                }}
                scrollAnimationDuration={scrollAnimationDuration}
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
                            <Button contentStyle={carouselButtonContentStyle} style={carouselButtonStyle} onPress={() => navigate(index)}>
                                <Text style={carouselTextSize}>{getLessonName(index)}</Text>
                            </Button>
                        </View>
                )}
            />
            <View style={{ justifyContent: 'center', flexDirection: 'row'}}>
                <Button onPress={() => decIndex(index) }>
                    <AntDesign name="leftcircleo" size={18}/>
                </Button>
                <Button mode="contained" onPress={() => navigate(index)}>
                    Start Lesson
                </Button>
                <Button onPress={ () => addIndex(index) }>
                    <AntDesign name="rightcircleo" size={18}/>
                </Button>
            </View>
        </View>
    );
};

export default Ccarousel;