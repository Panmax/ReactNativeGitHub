'use strict';

const Icon = require('react-native-vector-icons/Ionicons');

import React, {
    Component,
    NavigatorIOS,
    TabBarIOS,
    Text
} from 'react-native';

const TABBABIDS = ['feed', 'watching', 'trend', 'personal'];

class RootTabBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: TABBABIDS[0]
        }
    }

    render() {
        return (
            <TabBarIOS>
                <Icon.TabBarItem
                    title="Home"
                    iconName="ios-home-outline"
                    selectedIconName="ios-home"
                    title={'Feed'}
                    selected={this.state.selectedTab === TABBABIDS[0]}
                    onPress={() => {
                        this.setState({
                          selectedTab: TABBABIDS[0],
                        });
                    }}
                  >
                    <Text>aaa</Text>
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Explore"
                    iconName="ios-flame-outline"
                    selectedIconName="ios-flame"
                    selected={this.state.selectedTab === TABBABIDS[1]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[1],
            });
          }}>
                    <Text>bbbb</Text>
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Famous"
                    iconName="ios-people-outline"
                    selectedIconName="ios-people"
                    selected={this.state.selectedTab === TABBABIDS[2]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[2],
            });
          }}>
                    <Text>cccc</Text>
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    title="Me"
                    iconName="ios-person-outline"
                    selectedIconName="ios-person"
                    selected={this.state.selectedTab === TABBABIDS[3]}
                    onPress={() => {
            this.setState({
              selectedTab: TABBABIDS[3],
            });
          }}>
                    <Text>dddd</Text>
                </Icon.TabBarItem>
            </TabBarIOS>
        );
    }
}

module.exports = RootTabBar;