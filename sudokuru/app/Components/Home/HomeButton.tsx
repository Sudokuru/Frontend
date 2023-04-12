import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import React from "react";

const HomeButton = () => {

    const navigation: any = useNavigation();

    return (
        <Button mode="contained" testID={"ViewHomePageButton"} style={{ marginRight: 5, }}  onPress={() => navigation.navigate('Main Page')}>
             <MaterialCommunityIcons name="home" size={26} color="#F2F2F2" />
        </Button>
    );
};

export default HomeButton;