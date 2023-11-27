import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Pressable, ToastAndroid } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

import { ScreenProps } from './navigation';
import { TasksRepository } from '~/data/tasks-repository';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Fab } from './shared/fab';

const tasksRepository = new TasksRepository();

export function TaskDetailsScreen({
  navigation,
  route,
}: ScreenProps<'TaskDetails'>) {
  const taskId = route.params.taskId;

  const query = useQuery({
    queryKey: ['tasks', taskId],
    queryFn() {
      return tasksRepository.getTask(taskId);
    },
  });
  const task = query.data;

  const client = useQueryClient();
  const onToggleTaskCompleted = async () => {
    ToastAndroid.show(
      `Task marked as ${task?.completed ? 'completed' : 'active'}`,
      ToastAndroid.SHORT
    );
    await tasksRepository.updateTask(taskId, { completed: !task?.completed });
    client.invalidateQueries({ queryKey: ['tasks'] });
  };

  return (
    <View className="flex-1 px-6 py-6">
      <View className="flex-row items-start">
        <Pressable
          className="px-2 py-2"
          onPress={() => {
            onToggleTaskCompleted();
          }}
        >
          <View className="w-6 h-6 items-center justify-center rounded border">
            {task?.completed ? <Icon name="check" size={20} /> : null}
          </View>
        </Pressable>

        <View className="ml-2">
          <Text className="text-xl">{task?.title}</Text>
          <Text className="text-lg text-gray-600">{task?.description}</Text>
        </View>
      </View>

      <Fab
        icon={<Icon name="edit" size={24} color="white" />}
        onPress={() => navigation.navigate('AddEditTask', { taskId })}
      />
    </View>
  );
}

TaskDetailsScreen.HeaderRight = function HeaderRight() {
  const navigation = useNavigation<ScreenProps<'TaskDetails'>['navigation']>();
  const route = useRoute<ScreenProps<'TaskDetails'>['route']>();

  const client = useQueryClient();

  const onDeleteTask = () => {
    tasksRepository
      .deleteTask(route.params?.taskId)
      .then(() => client.invalidateQueries({ queryKey: ['tasks'] }));
    ToastAndroid.show('Task deleted', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <Pressable
      className="rounded-full"
      onPress={() => {
        onDeleteTask();
      }}
    >
      <Icon name="delete-outline" size={24} color="rgb(21 128 61)" />
    </Pressable>
  );
};
