import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

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
 * Returns the json value of an item in AsyncStorage
 * Takes in the key of the item to be returned
 */
export const getKeyJSON = async (key: string, schema: z.Schema) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // parse the json into javascript
      const newValue = JSON.parse(value);

      // validate that content matches the schema
      schema.parse(newValue);

      return newValue;
    }
  } catch (e) {
    // remove data since it could not be parsed
    console.log(e);
    await removeData(key);
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
