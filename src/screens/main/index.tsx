import {View} from 'react-native';
import React from 'react';
import {useTheme} from '@tsejerome/ui-kitten-components';
import {scale} from 'react-native-size-matters';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Accounts from './partials/AccountTab';
import NFTs from './partials/NFTTab';
import Tokens from './partials/TokensTab';

const TabNavigator = createMaterialTopTabNavigator();

const MainScreenTab = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme['color-basic-700'],
        flex: 1,
        marginLeft: scale(16),
        marginRight: scale(16),
      }}>
      <TabNavigator.Navigator
        // initialRouteName="Tokens"
        tabBarPosition={'top'}
        screenOptions={{
          tabBarLabelStyle: {fontSize: 12},
          tabBarStyle: {backgroundColor: theme['background-basic-color-700']},
          tabBarIndicatorStyle: {
            backgroundColor: theme['color-primary-100'],
          },
        }}>
        <TabNavigator.Screen
          name="Accounts"
          component={Accounts}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
        <TabNavigator.Screen
          name="Tokens"
          component={Tokens}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
        <TabNavigator.Screen
          name="NFTs"
          component={NFTs}
          listeners={({navigation}) => ({
            blur: () => navigation.setParams({screen: undefined}),
          })}
        />
      </TabNavigator.Navigator>
    </View>
  );
};

export default MainScreenTab;
