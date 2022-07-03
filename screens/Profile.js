import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Switch } from 'react-native';
import { firebaseConfig } from '../config';

export default class Profile extends Component {
    constructor(props){
        super(props);

        this.state= {
            isEnabled:false,
            light_theme:[]
        }
    }
    render() {

        toggleSwitch() {
            const previous_state = this.state.isEnabled;
            const theme = !this.state.isEnabled ? "dark" : "light";
            var updates = {};
            updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"]= theme;
            firebase.database().ref().update(updates);
            this.setState({ isEnabled: !previous_state, light_theme: previous_state });
        }

        if (!this.state.fontsLoaded){
            return <AppLoading/>;
        } else {

            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                
                <TouchableOpacity 
                title="Sign in with Google"
                onPress={() => this.signInWithGoogleAsync()}></TouchableOpacity>

                <Switch onPress={this.toggleSwitch()}
                ></Switch>

                </View>

            )
        }

    }
}