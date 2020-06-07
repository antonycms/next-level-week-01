import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import React, { ReactElement } from 'react';
import Points from './pages/Points';
import Detail from './pages/Detail';

const AppStack = createStackNavigator();

const Routes = (): ReactElement => {
  return (
    <NavigationContainer>
      <AppStack.Navigator headerMode="none">
        <AppStack.Screen component={Home} name="Home" />
        <AppStack.Screen component={Points} name="Points" />
        <AppStack.Screen component={Detail} name="Detail" />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
