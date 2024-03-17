import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Stores item in AsyncStorage
 * Takes in the key of the item to be stored
 * Takes in the value of the item to be stored
 */
export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Returns the String value of an item in AsyncStorage
 * Takes in the key of the item to be returned
 */
export const getKeyString = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * Returns the json value of an item in AsyncStorage
 * Takes in the key of the item to be returned
 */
export const getKeyJSON = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * Removes item from AsyncStorage
 * Takes in the key of the item to be removed from AsyncStorage
 */
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
