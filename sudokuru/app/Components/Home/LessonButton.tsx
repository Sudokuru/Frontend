import React from 'react';
import {
    View,
    useWindowDimensions, StyleSheet,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import {AntDesign} from "@expo/vector-icons";
import {PreferencesContext} from "../../Contexts/PreferencesContext";

const LessonButton = (props: any) => {

  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);

  const navigation: any = useNavigation();

  const theme = useTheme();

  const { isThemeDark } = React.useContext(PreferencesContext);

  const buttonRenderedObject = (!props.disabled) ? props.name : <AntDesign color={theme.colors.onBackground} name="lock" size={20}/>

  return(
    <View>
      <Button onPress={() => navigation.navigate('Lesson',{params:props.navigation})}
        style={styles(reSize).statisticsTitle}
        disabled={props.disabled}
        buttonColor={props.backgroundColor}
        dark={(props.backgroundColor == "grey" || (props.backgroundColor != "grey" && !isThemeDark))}
        mode="contained"
      >
          {buttonRenderedObject}
      </Button>
    </View>
  );
};

const styles = (reSize: number) => StyleSheet.create({
    statisticsTitle: {
        margin: reSize/50,
        height: 50,
        width: 150,
        justifyContent: "center"
    },
});

export default LessonButton;