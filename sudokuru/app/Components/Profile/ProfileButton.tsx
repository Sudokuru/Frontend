import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import React from "react";

const ProfileButton = () => {

    const navigation: any = useNavigation();

    return (
        <Button mode="contained" testID={"ViewProfilePageButton"} onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="face-man-profile" size={24} color="#F2F2F2" />
        </Button>
    );
};

export default ProfileButton;