'use strict';
const Colors = require('../commonComponents/Colors');
const GHService = require('../networkService/GithubServices')
const Platform = require('Platform');

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableHighlight,
    TextInput,
    ActivityIndicatorIOS,
} from 'react-native';

class OnboardComponent extends Component {


    constructor(props) {
        super(props);
        this.state = {
            username: '',
            loadingError: null,
            loading: false
        }
    }

    onNameChange(text) {
        this.setState({
            username: text
        });
    }

    submitOnboard() {
        if (this.state.username.length == 0) return;

        this.setState({
            loadingError: null,
            loading: true,
        });

        GHService.onboard(this.state.username)
            .then(value => {
                this.setState({
                    loading: false,
                })
                this.props.didOnboard && this.props.didOnboard(value);
            })
            .catch(err => {
                this.setState({
                    loadingError: err,
                    loading: false,
                });

                const needLogin = err.message.indexOf('rate') != -1;
                if (needLogin) {
                    this.props.didOnboard && this.props.didOnboard(null, needLogin);
                }
            })
    }

    render() {
        let failedDesc;
        if (this.state.loadingError) {
            failedDesc = (
                <Text
                    style={{color: Colors.red}}>{this.state.loadingError.message}
                </Text>
            );
        }

        let loadingCp;
        if (this.state.loading) {
            loadingCp = <ActivityIndicatorIOS/>
        }

        return (
            <ScrollView style={{backgroundColor: 'white'}}>
                <View style={styles.container}>
                    <Image
                        style={styles.welcomeImage}
                        source={require('../AppIcons/ios/iTunesArtwork.png')}
                    />
                    <View style={styles.loginContainer}>
                        <TextInput
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            clearButtonMode={'while-editing'}
                            style={styles.textInput}
                            returnKeyType={'done'}
                            onChangeText={(text) => this.onNameChange(text)}
                            onSubmitEditing={() => this.submitOnboard()}
                            placeholder={'Github username (NOT EMAIL!)'}
                        />
                        <TouchableHighlight
                            style={styles.go}
                            onPress={() => this.submitOnboard()}
                            underlayColor={Colors.backGray}
                        >
                            <Text style={[styles.nameAndPwd, {'textAlign': 'center'}]}>Go!</Text>
                        </TouchableHighlight>
                    </View>
                    {loadingCp}
                    {failedDesc}
                </View>
            </ScrollView>
        );
    }
}

OnboardComponent.propTypes = {
    didOnboard: React.PropTypes.func,
};

OnboardComponent.defaultProps = {};

const styles = StyleSheet.create({
    container: {
        top: 40,
        flexDirection: 'column',
        alignItems: 'center',
        height: 300,
        backgroundColor: 'white',
    },

    welcomeImage: {
        width: 150,
        height: 150,
        backgroundColor: Colors.backGray,
    },

    loginContainer: {
        flexDirection: 'row',
        margin: 30,
        height: 44,
        alignSelf: 'stretch',
        marginTop: 20,
    },

    textInput: {
        margin: 5,
        fontSize: 15,
        borderWidth: 1,
        height: 30,
        alignSelf: 'stretch',
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 4,
        padding: 3,
        borderColor: Colors.borderColor,
        flex: 1
    },

    go: {
        margin: 5,
        marginBottom: 10,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        borderRadius: 4,
        borderColor: Colors.borderColor,
    },

    nameAndPwd: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
        width: 40,
    },
});

module.exports = OnboardComponent