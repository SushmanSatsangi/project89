import React, { Component } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { View, Image, Text, TouchableOpacity } from 'react-native';

export default class PostCard extends Component {
    constructor(props){
        super(props);

        this.state = {
            light_theme: true,
            post_id: this.props.post.key,
            post_data: this.props.post.value
        };
    }
    render(){
        return(
            <TouchableOpacity 
            style={styles.container}
            onPress={()=>this.props.navigation.navigate("PostScreen", {post:this.props.post})}>
                <View style={styles.cardContainer}>
                    <View style={styles.authorContainer}>
                        <View style={styles.authorImageContainer}>
                            <Image
                                source={require("../assetss/profile_img.png")}
                                style={styles.profileImage}
                            ></Image>
                        </View>
                        <View style={styles.authorNameContainer}>
                            <Text style={styles.authorNameText}>{this.props.post.author}</Text>
                        </View>
                    </View>
                    <Image source={require("../assetss/post.jpeg")} style={styles.postImage}></Image>
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionText}>{this.props.post.caption}
                        </Text>
                    </View>
                    <View style={styles.actionContainer}>
                        <View style={styles.likeButton}>
                            <Ionicons name={"heart"} size={RFValue(30)} color={"white"}/>
                            <Text style={styles.likeText}>12k</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}