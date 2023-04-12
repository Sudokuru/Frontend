import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import React from "react";

const ProfileButton = () => {

    const navigation: any = useNavigation();

    return (
        <Button mode="contained" testID={"ViewProfilePageButton"} style={{ marginRight: 5, }} onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="account-details" size={26} color="#F2F2F2" />
        </Button>
    );
};

export default ProfileButton;