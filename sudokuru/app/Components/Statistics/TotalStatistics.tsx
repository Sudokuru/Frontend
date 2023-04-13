import {View} from "react-native";
import {Text, useTheme} from 'react-native-paper';
import {useWindowDimensions } from "react-native";
import {useNavigation} from "@react-navigation/native";

const TotalStatistics = (props: any) => {

    const size = useWindowDimensions();
    const reSize = Math.min(size.width, size.height);

    const theme = useTheme();
    const navigation: any = useNavigation();

    // https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
    const formatTime = (inputSeconds: number) => {
        // Get minutes and remaining seconds
        const days = Math.floor(inputSeconds / (3600*24));
        const hours = Math.floor(inputSeconds % (3600*24) / 3600);
        const minutes = Math.floor(inputSeconds % 3600 / 60);
        const seconds = Math.floor(inputSeconds % 60);
        // Pad with zeros if needed
        const paddedDays = days > 0 ? (days < 10 ? "0" : "") + days + ":" : "";
        const paddedHours = hours > 0 ? (hours < 10 ? "0" : "") + hours + ":" : (hours == 0 && days != 0) ? "00" : "";
        const paddedMinutes = minutes > 0 ? (minutes < 10 ? "0" : "") + minutes + ":" : (minutes == 0 && hours != 0) ? "00" : "";
        const paddedSeconds = seconds > 0 ? (seconds < 10 ? "0" : "") + seconds : (seconds == 0 && minutes != 0) ? "00" : "0";

        // Return formatted string
        return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
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