import React from 'react';
import {
    View,
    useWindowDimensions,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";

const LessonButton = (props: any) => {

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

  return(
    <View>
      <Button onPress={() => navigation.navigate('Lesson',{params:props.navigation})}
        style={(props.disabled) ? {margin: reSize/50, backgroundColor: props.backgroundColor, height: 50, width: 70, paddingTop: 5} :
            {margin: reSize/50, backgroundColor: props.backgroundColor, height: 50, width: 70 }}
        disabled={props.disabled}
      >
        {
          (!props.disabled) ?
            <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Text>{props.firstName}</Text>
              <Text>{props.lastName}</Text>
            </View> : <AntDesign color="white" name="lock" size={25}/>
        }
      </Button>
    </View>
  );
};

export default LessonButton;