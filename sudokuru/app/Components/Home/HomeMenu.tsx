import * as React from 'react';
import {Drawer} from 'react-native-paper';
import {StyleSheet} from "react-native";
import {getTheme} from "react-native-paper/lib/typescript/core/theming";
import {useNavigation} from "@react-navigation/native";

const HomeMenu = () => {
    const [active, setActive] = React.useState('');
    const [collapsed, setCollapsed] = React.useState(false);

    const navigation = useNavigation();

    return (
            collapsed ? (
                <Drawer.Section style={menuStyle.collapsedMenu} showDivider={false}>
                    <Drawer.CollapsedItem
                        focusedIcon="arrow-right"
                        unfocusedIcon="arrow-right"
                        active={active === 'first'}
                        onPress={() => setCollapsed(prevState => !prevState)}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="home-variant-outline"
                        unfocusedIcon="home-variant-outline"
                        active={active === 'second'}
                        onPress={() => setActive('second')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="book-open-page-variant"
                        unfocusedIcon="book-open-page-variant"
                        active={active === 'third'}
                        onPress={() => navigation.navigate('Learn')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="traffic-cone"
                        unfocusedIcon="traffic-cone"
                        active={active === 'forth'}
                        onPress={() => setActive('forth')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="play-box"
                        unfocusedIcon="play-box"
                        active={active === 'fifth'}
                        onPress={() => setActive('fifth')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="calendar-question"
                        unfocusedIcon="calendar-question"
                        active={active === 'sixth'}
                        onPress={() => setActive('sixth')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="semantic-web"
                        unfocusedIcon="semantic-web"
                        active={active === 'seventh'}
                        onPress={() => setActive('seventh')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="code-braces-box"
                        unfocusedIcon="code-braces-box"
                        active={active === 'eighth'}
                        onPress={() => setActive('eighth')}
                    />
                </Drawer.Section>
            ) : (
                <Drawer.Section style={menuStyle.menu} showDivider={false}>
                    <Drawer.Item
                        label="Menu"
                        icon="arrow-left"
                        active={active === 'first'}
                        onPress={() => setCollapsed(prevState => !prevState)}
                    />
                    <Drawer.Item
                        label="Home"
                        icon="home-variant-outline"
                        active={active === 'second'}
                        onPress={() => setActive('second')}
                    />
                    <Drawer.Item
                        label="Learn"

                        icon="book-open-page-variant"
                        active={active === 'third'}
                        onPress={() => navigation.navigate('Learn')}
                    />
                    <Drawer.Item
                        label="Drills"
                        icon="traffic-cone"
                        active={active === 'forth'}
                        onPress={() => setActive('forth')}
                    />
                    <Drawer.Item
                        label="Play"
                        icon="play-box"
                        active={active === 'fifth'}
                        onPress={() => setActive('fifth')}
                    />
                    <Drawer.Item
                        label="Daily Puzzle"
                        icon="calendar-question"
                        active={active === 'sixth'}
                        onPress={() => setActive('sixth')}
                    />
                    <Drawer.Item
                        label="Resources"
                        icon="semantic-web"
                        active={active === 'seventh'}
                        onPress={() => setActive('seventh')}
                    />
                    <Drawer.Item
                        label="Open Source"
                        icon="code-braces-box"
                        active={active === 'eighth'}
                        onPress={() => setActive('eighth')}
                    />
                </Drawer.Section>
            )
    );
};

const menuStyle = StyleSheet.create({
    menu: {
        width: "15%",
        height: "100%",
        // outlineStyle: "solid",
        // outlineWidth: 4,
        minWidth: 100 //todo set min width
    },
    collapsedMenu: {
        width: "5%",
        height: "100%",
        // outlineStyle: "solid",
        // outlineWidth: 4,
        minWidth: 100 //todo set min width
    }
});

export default HomeMenu;