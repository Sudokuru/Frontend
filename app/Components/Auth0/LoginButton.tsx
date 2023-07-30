import * as React from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { Button } from "react-native-paper";
import { Auth0JwtPayload } from "../../../app.config";
import Constants, { AppOwnership } from "expo-constants";
import { AUDIENCE, CLIENT_ID, DOMAIN, SCOPE } from "@env";
import {
  getTokenName,
  removeValue,
  storeData,
} from "../../Functions/AsyncStorage/AsyncStorage";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/core";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import * as Linking from "expo-linking";

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
const revokeEndpoint =
  "https://" + DOMAIN + "/v2/logout?client_id=" + CLIENT_ID + "&returnTo=";
const audience = AUDIENCE;
const scope = SCOPE;

// we do not want to use the proxy in production
export const isAuthSessionUseProxy = () =>
  Constants.appOwnership === AppOwnership.Expo;

const useProxy = Platform.select({
  web: false,
  ios: false,
  android: isAuthSessionUseProxy(),
});
let redirectUri = AuthSession.makeRedirectUri({ useProxy: useProxy });

// Setting the redirect url for mobile for apk/iso builds
if ((Platform.OS == "ios" || Platform.OS == "android") && !useProxy) {
  redirectUri =
    "sudokuru.vercel.app://" +
    DOMAIN +
    "/" +
    Platform.OS +
    "/sudokuru.vercel.app/callback";
}

const LoginButton = () => {
  const [name, setName] = useState<string>();

  const navigation: any = useNavigation();

  // initialize name with value found in token (if exists).

  useFocusEffect(() => {
    getTokenName().then((data) => setName(data));
  });

  function handleRedirect() {
    WebBrowser.dismissBrowser();
  }

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri: redirectUri,
      clientId: auth0ClientId,
      // id_token will return a JWT token
      responseType: "id_token token",
      // retrieve the user's profile
      scopes: ["openid", "profile", scope],
      extraParams: {
        // ideally, this will be a random value
        nonce: "nonce",
        audience: audience,
      },
    },
    { authorizationEndpoint }
  );

  // todo figure out how to do silent auth when token expires after 10 hours
  // https://auth0.com/docs/authenticate/login/configure-silent-authentication
  // may need to retrieve refresh token and use that?
  const [silentRequest, silentResult, silentAsync] = AuthSession.useAuthRequest(
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
        prompt: "none",
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

        const accessToken = result.params.access_token;
        const idToken = result.params.id_token;

        storeData("access_token", accessToken);
        storeData("id_token", idToken);

        const decoded: Auth0JwtPayload = jwtDecode<Auth0JwtPayload>(idToken);

        const { name } = decoded;
        setName(name);
      }
    }
  }, [result]);

  const {
    toggleTheme,
    isThemeDark,
    toggleHighlightSet,
    isHighlightSet,
    isHighlightBox,
    toggleHighlightBox,
    toggleHighlightColumn,
    isHighlightColumn,
    toggleHighlightRow,
    isHighlightRow,
  } = React.useContext(PreferencesContext);

  // Reset user information on logout for the next user
  function resetUserInformation(): void {
    // remove tokens
    removeValue("access_token");
    removeValue("id_token");

    // reset preferences
    if (!isThemeDark) {
      toggleTheme();
    }
    if (!isHighlightSet) {
      toggleHighlightSet();
    }
    if (!isHighlightColumn) {
      toggleHighlightColumn();
    }
    if (!isHighlightRow) {
      toggleHighlightRow();
    }
    if (!isHighlightBox) {
      toggleHighlightBox();
    }

    navigation.navigate("Landing");
  }

  return name ? (
    <Button
      mode="contained"
      testID={"Logout Button"}
      onPress={() => {
        // redirectUri needs to be fixed on mobile. Then this if statement can be removed.
        // iOS auto-close https://github.com/expo/examples/issues/125
        if (Platform.OS == "ios") {
          Linking.addEventListener("url", handleRedirect);
        }
        const redirectUrl = Linking.createURL("/");
        WebBrowser.openAuthSessionAsync(revokeEndpoint + redirectUrl)
          .then((r) => setName(""))
          .then((r) => resetUserInformation());
      }}
    >
      Logout
    </Button>
  ) : (
    <Button
      mode="contained"
      testID={"Login Button"}
      onPress={() => {
        promptAsync({ useProxy: useProxy });
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
