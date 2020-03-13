import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import io from 'socket.io-client';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.socket = io('https://app-chat-huy.herokuapp.com', {jsonp: false});
        this.state = {
            message: [],
            text: '',
            userName: '',
        };
        this.socket.on('server-send-message', (data) => {
            let messages = this.state.message;
            messages.push(`${data.user}: ${data.message}`);
            this.setState({message: messages});
        });
    }

    send = () => {
        if (!this.state.userName || !this.state.text) {
            return Alert.alert('Lỗi', "Bạn chưa nhập user name hoặc tin nhắn")
        }
        this.socket.emit('send-message', {user: this.state.userName, message: this.state.text});
        this.setState({text: ''});
    };

    render() {
        return (
            <View>
                <ScrollView>
                    <View>
                        {this.state.message.map(message => {
                            return (
                                <Text>{message}</Text>
                            );
                        })}
                    </View>
                    <View>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(text) => this.setState({userName: text})}
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                            value={this.state.userName}
                            placeholder={'user name'}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(text) => this.setState({text})}
                            autoCapitalize={'none'}
                            underlineColorAndroid={'transparent'}
                            value={this.state.text}
                            placeholder={'message'}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => this.send()} style={{justifyContent: 'center', alignItems: 'center', height: 50, width: 100, backgroundColor: 'green', borderRadius: 10}}>
                            <View>
                                <Text>send</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
