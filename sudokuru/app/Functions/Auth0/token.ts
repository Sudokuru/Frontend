import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import {Auth0JwtPayload} from "../../../app.config";

/*
 * Removes item from AsyncStorage
 * Takes in the key of the item to be removed from AsyncStorage
 */
export const removeValue = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch(e) {
        console.log(e);
    }
}

/*
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
}

/*
 * Returns the JSON value of an item in AsyncStorage
 * Takes in the key of the item to be returned
 */
export const getKeyJSON = async (key: string) => {
    try {
        let jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue != null){
            return jwtDecode<Auth0JwtPayload>(jsonValue);
        }
    } catch(e) {
        console.log(e);
    }
}

/*
 * Returns the String value of an item in AsyncStorage
 * Takes in the key of the item to be returned
 */
export const getKeyString = async (key: string) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value != null){
            return value;
        }
    } catch(e) {
        console.log(e);
    }
}

/*
 * Below are functions to retrieve values from the token
 * after the getKey function has been used to retrieve the JSON
 */

/*
 * Returns the name value of a token
 */
export async function getTokenName(){
    let value: any = await getKeyJSON("token");
    if (value != null){
        let { name } = value;
        return name;
    }
    return "";
}

/*
 * Returns the expiration value of a token
 */
export async function getTokenExp(){
    let value: any = await getKeyJSON("token");
    if (value != null){
        let { exp } = value;
        return exp;
    }
    return "";
}