import { AntDesign } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import React from "react";
import {useNavigation} from "@react-navigation/native";

const StatisticsButton = () => {

    const navigation = useNavigation();

    return (
        <Button mode="contained" onPress={() => navigation.navigate('Statistics')}>
             <AntDesign name="calculator" size={24} color="black" />
        </Button>
    );
};

export default StatisticsButton;