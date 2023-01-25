import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import React from "react";

const ProfileButton = () => {

    const navigation = useNavigation();

    return (
        <Button mode="contained" testID={"ViewProfilePageButton"} onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
        </Button>
    );
};

export default ProfileButton;