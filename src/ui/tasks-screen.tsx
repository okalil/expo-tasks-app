import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

import { Task } from '~/data/task';
import { TasksRepository } from '~/data/tasks-repository';
import { ScreenProps } from './navigation';
import { Fab } from './shared/fab';

const tasksRepository = new TasksRepository();

export function TasksScreen({ route, navigation }: ScreenProps<'Home'>) {
  const filterType = route.params?.filterType;

  const query = useQuery({
    queryKey: ['tasks'],
    async queryFn() {
      return tasksRepository.getTasks();
    },
    select(data) {
      if (filterType === 'all') return data;
      return data.filter(it =>
        filterType === 'completed' ? it.completed : !it.completed
      );
    },
  });

  const tasks = query.data;

  const isManualRefetch = React.useRef(false);
  const refreshing = query.isFetching && isManualRefetch.current;
  const onRefresh = async () => {
    isManualRefetch.current = true;
    await query.refetch();
    isManualRefetch.current = false;
  };

  const renderListTitle = () => {
    switch (filterType) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      default:
        return 'All';
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        className="flex-1 px-4 py-4"
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={tasks}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={it => String(it.id)}
        ListHeaderComponent={
          <Text className="font-medium text-base mb-2">
            {renderListTitle()} Tasks
          </Text>
        }
      />

      <Fab
        onPress={() => navigation.navigate('AddEditTask')}
        icon={<Icon name="plus" size={24} color="white" />}
      />
    </View>
  );
}

function TaskItem({ task }: { task: Task }) {
  const client = useQueryClient();

  const onToggleTaskCompleted = async () => {
    await tasksRepository.updateTask(task.id, { completed: !task.completed });
    client.invalidateQueries({ queryKey: ['tasks'] });
  };

  const navigation = useNavigation<ScreenProps<'Home'>['navigation']>();

  return (
    <Pressable
      className="flex-row items-center py-2"
      onPress={() => {
        navigation.navigate('TaskDetails', { taskId: task.id });
      }}
    >
      <Pressable
        className="px-2 py-2"
        onPress={() => {
          onToggleTaskCompleted();
        }}
      >
        <View className="w-6 h-6 items-center justify-center rounded border">
          {task.completed ? <Icon name="check" size={20} /> : null}
        </View>
      </Pressable>

      <Text className="ml-3">{task.title}</Text>
    </Pressable>
  );
}

TasksScreen.HeaderRight = function () {
  const navigation = useNavigation<ScreenProps<'Home'>['navigation']>();

  const onFilterChange = (type: string) =>
    navigation.setParams({ filterType: type });

  return (
    <Menu>
      <MenuTrigger style={{ padding: 12 }}>
        <Icon name="filter" size={20} color="rgb(21 128 61)" />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption
          style={{ padding: 12 }}
          onSelect={() => onFilterChange('all')}
          text="All"
        />
        <MenuOption
          style={{ padding: 12 }}
          onSelect={() => onFilterChange('active')}
          text="Active"
        />
        <MenuOption
          style={{ padding: 12 }}
          onSelect={() => onFilterChange('completed')}
          text="Completed"
        />
      </MenuOptions>
    </Menu>
  );
};
