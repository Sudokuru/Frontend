import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Button} from "react-native-paper";
import React from "react";
import {useNavigation} from "@react-navigation/native";

const StatisticsButton = () => {

    const navigation: any = useNavigation();

    return (
        <Button mode="contained" testID={"ViewStatisticsPageButton"} style={{ marginLeft: 5, marginRight: 5, paddingTop: 5  }}  onPress={() => navigation.navigate('Statistics')}>
             <MaterialCommunityIcons name="chart-line" size={26} color="#F2F2F2" />
        </Button>
    );
};

export default StatisticsButton;