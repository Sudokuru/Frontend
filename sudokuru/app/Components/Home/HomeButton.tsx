import { AntDesign } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import React from "react";

const ProfileButton = () => {

    const navigation = useNavigation();

    return (
        <Button mode="contained" testID={"ViewHomePageButton"} onPress={() => navigation.navigate('Home')}>
            <AntDesign name="home" size={24} color="black" />
        </Button>
    );
};

export default ProfileButton;