import {View} from "react-native";
import {Button, Text, useTheme} from 'react-native-paper';
import {useWindowDimensions } from "react-native";
import {useNavigation} from "@react-navigation/native";

const EndGameModal = (props: any) => {

    const theme = useTheme();
    const navigation: any = useNavigation();

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const formatTime = (seconds: number) => {
        // Get minutes and remaining seconds
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        // Pad with zeros if needed
        const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const paddedSeconds = secs < 10 ? "0" + secs : secs;
        // Return formatted string
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 30 }}>
            <Text style={{ fontSize: reSize/20, color: '#D9A05B', fontWeight: 'bold', marginBottom: 10 }}>Game Results</Text>
                <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Score:</Text>
                        <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatTime(props.score)}</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Time Spent Playing:</Text>
                        <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatTime(props.time)}</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Number of Hints Used:</Text>
                        <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.numHintsUsed}</Text>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Number of Wrong Cells Played:</Text>
                        <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.numWrongCellsPlayed}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Internal Game Difficulty Score:</Text>
                        <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.difficulty}</Text>
                    </View>
                </View>
            <Button mode="contained" onPress={navigation.navigate("Home")}>
                Go Home
            </Button>
        </View>
    );
};

export default EndGameModal;