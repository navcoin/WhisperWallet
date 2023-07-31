import { View } from 'react-native';
import React from 'react';
import { useStyleSheet } from '@tsejerome/ui-kitten-components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Accounts from './partials/AccountTab';
import NFTs from './partials/NFTTab';
import Tokens from './partials/TokensTab';
import { mainScreenTabStyles } from './styles';

const TabNavigator = createMaterialTopTabNavigator();

const MainScreenTab = () => {
  const styles = useStyleSheet(mainScreenTabStyles);

  return (
    <View style={styles.container}>
      <TabNavigator.Navigator
        // initialRouteName="Tokens"
        tabBarPosition={'top'}
        screenOptions={{
          tabBarLabelStyle: { ...styles.fontSize12 },
          tabBarStyle: { ...styles.tabBarStyle },
          tabBarIndicatorStyle: { ...styles.tabBarIndicatorStyle },
        }}>
        <TabNavigator.Screen
          name="Accounts"
          component={Accounts}
          listeners={({ navigation }) => ({
            blur: () => navigation.setParams({ screen: undefined }),
          })}
        />
        <TabNavigator.Screen
          name="Tokens"
          component={Tokens}
          listeners={({ navigation }) => ({
            blur: () => navigation.setParams({ screen: undefined }),
          })}
        />
        <TabNavigator.Screen
          name="NFTs"
          component={NFTs}
          listeners={({ navigation }) => ({
            blur: () => navigation.setParams({ screen: undefined }),
          })}
        />
      </TabNavigator.Navigator>
    </View>
  );
};

export default MainScreenTab;
