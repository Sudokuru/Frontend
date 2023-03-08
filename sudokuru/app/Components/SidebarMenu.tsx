import * as React from 'react';
import {Drawer} from 'react-native-paper';
import {StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";

const SidebarMenu = () => {
    const [active, setActive] = React.useState('');
    const [collapsed, setCollapsed] = React.useState(false);

    const navigation: any = useNavigation();

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
                        onPress={() => navigation.navigate('Home')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="book-open-page-variant"
                        unfocusedIcon="book-open-page-variant"
                        active={active === 'third'}
                        onPress={() => navigation.navigate('Sudoku')}
                    />
                    <Drawer.CollapsedItem
                        focusedIcon="code-braces-box"
                        unfocusedIcon="code-braces-box"
                        active={active === 'ninth'}
                        onPress={() => navigation.navigate('Landing')}
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
                        onPress={() => navigation.navigate('Home')}
                    />
                    <Drawer.Item
                        label="Learn"

                        icon="book-open-page-variant"
                        active={active === 'third'}
                        onPress={() => navigation.navigate('Sudoku')}
                    />
                    <Drawer.Item
                        label="Landing Page"
                        icon="code-braces-box"
                        active={active === 'ninth'}
                        onPress={() => navigation.navigate('Landing')}
                    />
                </Drawer.Section>
            )
    );
};

const menuStyle = StyleSheet.create({
    menu: {
        height: "100%",
        // outlineStyle: "solid",
        // outlineWidth: 4,
        //backgroundColor: "green"
    },
    collapsedMenu: {
        height: "100%",
        // outlineStyle: "solid",
        // outlineWidth: 4,
    }
});

export default SidebarMenu;