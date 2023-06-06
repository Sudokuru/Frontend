import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {PreferencesContext} from "../../Contexts/PreferencesContext";
import {useTheme} from "react-native-paper";

function CustomDrawerContent(props: any) {
  const [mainDrawer, setMainDrawer] = useState(true);
  const [filteredItems, setFilteredItems] = useState<any>([]);

  const toggleMainDrawer = () => {
    setMainDrawer(true);
    setFilteredItems([]);
  };

  const onItemParentPress = (key: any) => {
    const filteredMainDrawerRoutes = props.drawerItems.find((e: any) => {
      return e.key === key;
    });
    if (filteredMainDrawerRoutes.routes.length === 1) {
      const selectedRoute = filteredMainDrawerRoutes.routes[0];
      props.navigation.toggleDrawer();
      props.navigation.navigate(selectedRoute.nav, {
        screen: selectedRoute.routeName,
      });
    } else {
      setMainDrawer(false);
      setFilteredItems(filteredMainDrawerRoutes);
    }
  };

  function renderMainDrawer() {

    const { learnedLessons } = React.useContext(PreferencesContext);

    return (
      <View>
        {props.drawerItems.map((parent: any) => (
          <View key={parent.key}>
            <TouchableOpacity
              key={parent.key}
              testID={parent.key}
              onPress={() => {
                onItemParentPress(parent.key);
              }}>
              {
                // Conditionally render Drill navigation depending on lessons the user has completed.
                ((learnedLessons.includes("NAKED_SINGLE") && parent.title == "Naked Sets") || (learnedLessons.includes("HIDDEN_SINGLE") && parent.title == "Hidden Sets")
                 || (learnedLessons.includes("POINTING_SET") && parent.title == "Pointing Sets"))
                  ? <View style={[styles.parentItem, {borderBottomColor: theme.colors.onBackground}]}>
                      <Text style={[styles.title, {color: theme.colors.onBackground}]}>{parent.title}</Text>
                    </View> : <></>
              }
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  function renderFilteredItemsDrawer() {

    const { learnedLessons } = React.useContext(PreferencesContext);

    return (
      <View>
        <TouchableOpacity
          onPress={() => toggleMainDrawer()}
          style={styles.backButtonRow}>
          <Text style={[styles.backButtonText, styles.title, {color: theme.colors.onBackground}]}>{'BACK'}</Text>
        </TouchableOpacity>
        {filteredItems.routes.map((route: any) => {
          return (
            <TouchableOpacity
              key={route.routeName}
              testID={route.routeName}
              onPress={() =>
                props.navigation.navigate(route.nav, {
                  screen: route.routeName,
                })
              }
            >

              {
                // Conditionally render Drill navigation depending on lessons the user has completed.
                ((learnedLessons.includes("NAKED_SINGLE") && route.title == "Naked Single") ||
                    (learnedLessons.includes("HIDDEN_SINGLE") && route.title == "Hidden Single") ||
                    (learnedLessons.includes("HIDDEN_SET") && (route.title == "Hidden Pair" || route.title == "Hidden Triplet" || route.title == "Hidden Quadruplet")) ||
                        (learnedLessons.includes("NAKED_SET") && (route.title == "Naked Pair" || route.title == "Naked Triplet" || route.title == "Naked Quadruplet")) ||
                            (learnedLessons.includes("POINTING_SET") && (route.title == "Pointing Pair" || route.title == "Pointing Triplet")))
                            ? <Text style={[styles.title, {color: theme.colors.onBackground}]}>{route.title}</Text> : <></>
              }
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const theme = useTheme();

  return (
    <ScrollView style={{backgroundColor: theme.colors.background}}>
      <SafeAreaView
        style={styles.statisticsTitle}
      >
        {mainDrawer ? renderMainDrawer() : renderFilteredItemsDrawer()}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  statisticsTitle: {
    flex: 1,
    zIndex: 1000,
    paddingTop: 15
  },
  parentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    margin: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 17,
    paddingLeft: 3,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
  },
  backButtonText: {
    marginLeft: 10,
  },
});

export default CustomDrawerContent;
