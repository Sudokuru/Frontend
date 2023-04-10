import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import {PreferencesContext} from "../../Contexts/PreferencesContext";

function CustomDrawerContent(props) {
  const [mainDrawer, setMainDrawer] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);

  const toggleMainDrawer = () => {
    setMainDrawer(true);
    setFilteredItems([]);
  };

  const onItemParentPress = (key) => {
    const filteredMainDrawerRoutes = props.drawerItems.find((e) => {
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

    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

    return (
      <View>
        {props.drawerItems.map((parent) => (
          <View key={parent.key}>
            <TouchableOpacity
              key={parent.key}
              testID={parent.key}
              onPress={() => {
                onItemParentPress(parent.key);
              }}>
              {
                // Conditionally render Drill navigation depending on lessons the user has completed.
                ((learnedLessons.includes("NAKED_SINGLE") && parent.title == "Naked Sets") || (learnedLessons.includes("HIDDEN_SINGLE") && parent.title == "Hidden Sets"))
                  ? <View style={styles.parentItem}>
                      <Text style={[styles.icon, styles.title]}>{parent.title}</Text>
                    </View> : <></>
              }
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }

  function renderFilteredItemsDrawer() {

    const { updateLearnedLessons, learnedLessons } = React.useContext(PreferencesContext);

    return (
      <View>
        <TouchableOpacity
          onPress={() => toggleMainDrawer()}
          style={styles.backButtonRow}>
          <Text style={[styles.backButtonText, styles.title]}>{'BACK'}</Text>
        </TouchableOpacity>
        {filteredItems.routes.map((route) => {
          return (
            <TouchableOpacity
              key={route.routeName}
              testID={route.routeName}
              onPress={() =>
                props.navigation.navigate(route.nav, {
                  screen: route.routeName,
                })
              }
              style={styles.item}>

              {
                // Conditionally render Drill navigation depending on lessons the user has completed.
                ((learnedLessons.includes("NAKED_SINGLE") && route.title == "Naked Single") ||
                    (learnedLessons.includes("HIDDEN_SINGLE") && route.title == "Hidden Single") ||
                    (learnedLessons.includes("HIDDEN_SET") && (route.title == "Hidden Pair" || route.title == "Hidden Triplet" || route.title == "Hidden Quadruplet")) ||
                        (learnedLessons.includes("NAKED_SET") && (route.title == "Naked Pair" || route.title == "Naked Triplet" || route.title == "Naked Quadruplet")))
                            ? <Text style={styles.title}>{route.title}</Text> : <></>
              }
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <ScrollView style={styles.drawerContainer}>
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={styles.centered}>
          <Image
            source={{uri: 'https://reactjs.org/logo-og.png'}}
            style={styles.logo}
          />
        </View>
        {mainDrawer ? renderMainDrawer() : renderFilteredItemsDrawer()}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 100,
    flexDirection: 'row',
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 75,
  },
  drawerContainer: {
    backgroundColor: '#025E73',
  },
  container: {
    flex: 1,
    zIndex: 1000,
  },
  centered: {
    alignItems: 'center',
  },
  parentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingTop: 4,
    paddingBottom: 4,
  },
  title: {
    margin: 16,
    fontWeight: 'bold',
    color: '#F2F2F2',
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
    color: '#F2F2F2',
  },
});

export default CustomDrawerContent;
