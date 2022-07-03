import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class LoginScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
          fontsLoaded: false
        };
      }
    
      async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
      }
    
      componentDidMount() {
        this._loadFontsAsync();
      }

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
              firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      };

      onSignIn = googleUser => {
        var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
          unsubscribe();
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
    
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(function (result) {
                if (result.additionalUserInfo.isNewUser) {
                  firebase
                    .database()
                    .ref("/users/" + result.user.uid)
                    .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: "dark"
                    })
                    .then(function (snapshot) { });
                }
              })
              .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
              });
          } else {
            console.log("User already signed-in Firebase.");
          }
        });
      };
    
    signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            behaviour: "web",
            androidClientId:
              "653615458989-33jf8mmd52ettoun3up0in8dr46kr7jj.apps.googleusercontent.com",
            iosClientId:
              "653615458989-7cdb4et6saf7nq7ff7s976h0u46bfl2r.apps.googleusercontent.com",
            scopes: ["profile", "email"]
          });

        if (result.type === "success") {
            this.onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } 
        catch (e) {
          console.log(e.message);
          return { error: true };
        }}

        render() {
            if (!this.state.fontsLoaded) {
              return <AppLoading />;
            } else {
              return (
                <View style={styles.container}>
                  <SafeAreaView style={styles.droidSafeArea} />
                  <View style={styles.appTitle}>
                    <Image
                      source={require("../assetss/logo.png")}
                      style={styles.appIcon}
                    ></Image>
                    <Text style={styles.appTitleText}>{`Spectagram`}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.signInWithGoogleAsync()}
                    >
                      <Text style={styles.googleText}>Sign in with Google</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cloudContainer}>
                    <Image
                      source={require("../assets/cloud.png")}
                      style={styles.cloudImage}
                    ></Image>
                  </View>
                </View>
              );
            }
          }
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  });
  