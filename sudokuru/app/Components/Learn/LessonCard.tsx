import * as React from 'react';
import {Button, Card, Text } from 'react-native-paper';
import {StyleSheet} from "react-native";

const LessonCard = ({title}: {title: string}) => (
    <Card style={styles.lessonCard}>
        <Card.Title title={title} titleStyle={styles.lessonTitle} />
    </Card>
);

const styles = StyleSheet.create({
    lessonCard: {
        width: 150,
        height: 50,
        margin: 5,
    },
    lessonTitle: {
        textAlign: "center",
        fontSize: 12
    }
});

export default LessonCard;