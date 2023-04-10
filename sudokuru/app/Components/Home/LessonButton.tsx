import React from 'react';
import {
    View,
    useWindowDimensions,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";

const LessonButton = (props: any) => {

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

  return(
    <View>
      <Button onPress={() => navigation.navigate('Lesson',{params:props.navigation})}
        style={{margin: reSize/50, backgroundColor: props.backgroundColor}}
        disabled={props.disabled}
      >
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text>{props.firstName}</Text>
          <Text>{props.lastName}</Text>
        </View>
      </Button>
    </View>
  );
};

export default LessonButton;