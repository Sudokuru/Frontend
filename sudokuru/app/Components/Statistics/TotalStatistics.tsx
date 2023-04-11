import {View} from "react-native";
import {Text, useTheme} from 'react-native-paper';
import {useWindowDimensions } from "react-native";
import {useNavigation} from "@react-navigation/native";

const TotalStatistics = (props: any) => {

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const theme = useTheme();
    const navigation: any = useNavigation();

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
            <Text style={{ fontSize: reSize/20, color: theme.colors.onPrimary, fontWeight: 'bold', marginBottom: 10 }}>Total Game Statistics</Text>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Total Score: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.totalScore}</Text>
                </View>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Games Played: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.numGamesPlayed}</Text>
                </View>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Fastest Solve Time: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatTime(props.fastestSolveTime)}</Text>
                </View>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73'}}>Average Solve Time: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatTime(props.averageSolveTime)}</Text>
                </View>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Total Solve Time: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{formatTime(props.totalSolveTime)}</Text>
                </View>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Total Hints Used: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.numHintsUsed}</Text>
                </View>
                <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                    <Text style={{ fontSize: reSize/22, color: '#025E73' }}>Total Wrong Cells Played: </Text>
                    <Text style={{ fontSize: reSize/20, fontWeight: 'bold', color: '#D9A05B' }}>{props.numWrongCellsPlayed}</Text>
                </View>
            </View>
        </View>
    );
};

export default TotalStatistics;