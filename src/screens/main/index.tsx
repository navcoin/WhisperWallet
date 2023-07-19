import { View } from 'react-native';
import React from 'react';
import { StyleService, useStyleSheet } from '@tsejerome/ui-kitten-components';
import { scale } from 'react-native-size-matters';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Accounts from './partials/AccountTab';
import NFTs from './partials/NFTTab';
import Tokens from './partials/TokensTab';

const TabNavigator = createMaterialTopTabNavigator();

const MainScreenTab = () => {
  const styles = useStyleSheet(themedStyles);

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

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'color-basic-700',
    flex: 1,
    marginLeft: scale(16),
    marginRight: scale(16),
  },
  fontSize12: {
    fontSize: 12,
  },
  tabBarStyle: { backgroundColor: 'background-basic-color-700' },
  tabBarIndicatorStyle: { backgroundColor: 'color-primary-100' },
});

export default MainScreenTab;
