import * as React from 'react'
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from 'expo-web-browser';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { DOMAIN, CLIENT_ID } from "../../../config"
import { Auth0JwtPayload } from "../../../app.config"

// You need to swap out the Auth0 client id and domain with the one from your Auth0 client.
// In your Auth0 client, you need to also add a url to your authorized redirect urls.
//
// For this application, I added https://auth.expo.io/@arielweinberger/with-auth0 because I am
// signed in as the 'arielweinberger' account on Expo and the name/slug for this app is 'with-auth0'.
//
// You can open this app in the Expo client and check your logs to find out your redirect URL.

WebBrowser.maybeCompleteAuthSession();

const auth0ClientId = CLIENT_ID;
const authorizationEndpoint = "https://" + DOMAIN + "/authorize";

const useProxy = Platform.select({ web: false, ios: true, android: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const LoginButton = () => {

    const [name, setName] = useState<string>("");

    const [request, result, promptAsync] = AuthSession.useAuthRequest(
        {
            redirectUri: redirectUri,
            clientId: auth0ClientId,
            // id_token will return a JWT token
            responseType: "id_token",
            // retrieve the user's profile
            scopes: ["openid", "profile"],
            extraParams: {
                // ideally, this will be a random value
                nonce: "nonce",
            },
        },
        { authorizationEndpoint }
    );

    useEffect(() => {
        if (result) {
            if (result.type === "error") {
                Alert.alert(
                    "Authentication error",
                    result.params.error_description || "something went wrong"
                );
                return;
            }
            if (result.type === "success") {
                // Retrieve the JWT token and decode it
                const jwtToken = result.params.id_token;
                console.log(jwtToken);
                const decoded = jwtDecode<Auth0JwtPayload>(jwtToken);

                const { name } = decoded;
                setName(name);
            }
        }
    }, [result]);

    return (
        <View style={styles.container}>
            {name ? (
                <>
                    <Text style={styles.title}>You are logged in, {name}!</Text>
                    <Button title="Log out" onPress={() => setName("")}/>
                </>
            ) : (
                <Button
                    disabled={!request}
                    title="Log in with Auth0"
                    onPress={() => promptAsync({useProxy})}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 40,
    },
});

export default LoginButton;