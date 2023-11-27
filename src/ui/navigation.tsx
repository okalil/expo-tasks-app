import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { TasksScreen } from './tasks-screen';
import { TaskFormScreen } from './task-form-screen';
import { TaskDetailsScreen } from './task-details-screen';

const Stack = createNativeStackNavigator<ParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={TasksScreen}
          initialParams={{ filterType: 'all' }}
          options={() => ({
            title: 'Tasks',
            headerRight: TasksScreen.HeaderRight,
          })}
        />
        <Stack.Screen
          name="AddEditTask"
          component={TaskFormScreen}
          options={({ route }) => ({
            title: route.params?.taskId ? 'Edit Task' : 'Add Task',
          })}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{
            title: 'Task Details',
            headerRight: TaskDetailsScreen.HeaderRight,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

type ParamList = {
  Home: { filterType: string } | undefined;
  AddEditTask: { taskId: number } | undefined;
  TaskDetails: { taskId: number };
};

export type ScreenProps<RouteName extends keyof ParamList> =
  NativeStackScreenProps<ParamList, RouteName>;
