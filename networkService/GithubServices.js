/**
 * Created by pan on 16/3/10.
 */
const config = require('../config');
const EventEmitter = require('events');

import React, {
    AsyncStorage,
    Navigator,
} from 'react-native';

const API_PATH = 'https://api.github.com';
const AUTH_URL_PATH = API_PATH + '/authorizations';
const GH_USER_KEY = 'GH_USER_KEY';
const EMPTY_TOKEN = {
    id: '',
    token: ''
};
const EMPTY_USER = {
    login: '',
    password: '',
    avatar: '',
    userId: '',
    url: '',
    tokenInfo: EMPTY_TOKEN,
};
let GLOBAL_USER = EMPTY_USER;

class GithubService extends EventEmitter {
    constructor() {
        super();
    }

    queryLoginState() {
        return (
            AsyncStorage.getItem(GH_USER_KEY)
                .then(result => {
                    if (result) {
                        console.log('GHService start user is:' + result);
                        GLOBAL_USER = JSON.parse(result);
                    }
                    return GLOBAL_USER;
                })
                .catch(err => {
                    console.log('loginErr is: ' + err);
                })
        );
    }

    onboard(username) {
        const path = API_PATH + '/users/' + username.trim();
        const validPromise = this.fetchPromise(path);
        return validPromise.then(value => {
            const status = value.status;
            const isValid = status < 400;
            const json = JSON.parse(value._bodyInit);
            if (isValid) {
                GLOBAL_USER.login = json.login;
                GLOBAL_USER.avatar = json.avatar_url;
                GLOBAL_USER.userId = json.id;
                GLOBAL_USER.url = json.url;
                Object.assign(GLOBAL_USER, json);
                SingleGHService._setNeedSaveGlobalUser();

                return GLOBAL_USER;
            } else {
                GLOBAL_USER.login = username;
                const bodyMessage = json.message;

                throw new Error(bodyMessage);
            }
        });
    }

    isOnboard() {
        return GLOBAL_USER.login.length > 0;
    }

    isLogined() {
        return this.isOnboard() && GLOBAL_USER.tokenInfo.token.length > 0;
    }

    tokenHeader() {
        let tHeader = {
            'User-Agent': config.userAgent,
            'Accept': 'application/vnd.github.v3+json'
        }
        if (this.isLogined()) {
            tHeader.Authorization = 'token ' + GLOBAL_USER.tokenInfo.token;
        }
        console.log('token header is: ' + JSON.stringify(tHeader));

        return tHeader;
    }

    _setNeedSaveGlobalUser() {
        return AsyncStorage.setItem(GH_USER_KEY, JSON.stringify(GLOBAL_USER));
    }

    fetchPromise(url) {
        return fetch(url, {
            headers: this.tokenHeader(),
        });
    }

}

const SingleGHService = new GithubService();

module.exports = SingleGHService;