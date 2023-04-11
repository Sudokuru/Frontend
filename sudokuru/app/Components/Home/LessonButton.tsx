import React from 'react';
import {
    View,
    useWindowDimensions,
} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";

const LessonButton = (props: any) => {

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

  const theme = useTheme();

  return(
    <View>
      <Button onPress={() => navigation.navigate('Lesson',{params:props.navigation})}
        style={(props.disabled) ? {margin: reSize/50, backgroundColor: props.backgroundColor, height: 50, width: 150, paddingTop: 5} :
            {margin: reSize/50, backgroundColor: props.backgroundColor, height: 50, width: 150 }}
        disabled={props.disabled}
        mode="contained"
      >
          {(!props.disabled) ? <Text>{props.firstName} {props.lastName}</Text> : <AntDesign color="white" name="lock" size={20}/>}
      </Button>
    </View>
  );
};

export default LessonButton;