'use strict';

const OnboardComponent = require('./AppComponents/OnboardComponent');
const CommonComponents = require('./commonComponents/CommonComponents');
const GHService = require('./networkService/GithubServices');
const RootTab = require('./AppComponents/RootTabComponent');

import React, {
    Component,
    AppRegistry
} from 'react-native';

const LoginState = {
    pending: 0,
    onboard: 1,
    unOnboard: 2,
    needLogin: 3,
}

class HelloWorld extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userState: LoginState.pending
        }
    }

    componentWillMount() {
        GHService.queryLoginState()
            .then(value => {
                let lst = LoginState.pending;
                if (value.login.length > 0) {
                    lst = LoginState.onboard;
                } else {
                    lst = LoginState.unOnboard;
                }

                console.log('login userstate is: ' + JSON.stringify(lst));

                this.setState({
                    userState: lst,
                });
            })
    }

    didOnboard(user, needLogin) {
        let lst = user == null ? LoginState.unOnboard : LoginState.onboard;
        if (needLogin) lst = LoginState.needLogin;

        this.setState({
            userState: lst,
        });
    }

    render() {
        let cp;

        switch (this.state.userState) {
            case LoginState.pending: {
                cp = CommonComponents.renderLoadingView();
            }
                break;

            case LoginState.onboard: {
                cp = <RootTab />;
            }
                break;

            case LoginState.unOnboard: {
                cp = <OnboardComponent didOnboard={(user, needLogin) => this.didOnboard(user, needLogin)}/>;
            }
                break;
        }
        return cp;
    }
}


AppRegistry.registerComponent('HelloWorld', () => HelloWorld);
