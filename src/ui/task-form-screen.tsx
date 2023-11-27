import React, { useState, useRef } from 'react';
import { View, TextInput, ToastAndroid } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ScreenProps } from './navigation';
import { Task } from '~/data/task';
import { TasksRepository } from '~/data/tasks-repository';
import { Fab } from './shared/fab';

const tasksRepository = new TasksRepository();

export function TaskFormScreen({
  navigation,
  route,
}: ScreenProps<'AddEditTask'>) {
  const taskId = route.params?.taskId;

  const query = useQuery({
    enabled: !!taskId,
    queryKey: ['tasks', taskId],
    queryFn() {
      return tasksRepository.getTask(taskId!);
    },
  });
  const task = query.data;

  const [formState, setFormState] = useState<Partial<Task>>({});
  const onValueChange = (name: keyof typeof formState) => {
    return (text: string) => setFormState(prev => ({ ...prev, [name]: text }));
  };
  React.useEffect(() => {
    if (task) setFormState(task);
  }, [task]);

  const client = useQueryClient();
  const saveTaskMutation = useMutation({
    async mutationFn(data: typeof formState) {
      return taskId
        ? tasksRepository.updateTask(taskId, data)
        : tasksRepository.createTask({
            title: data.title!,
            description: data.description,
          });
    },
    onSuccess() {
      return client.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const onSaveTask = () => {
    if (!formState.title || !formState.description) {
      return ToastAndroid.show('Preencha os campos', ToastAndroid.SHORT);
    }

    saveTaskMutation.mutate(formState, {
      onSuccess() {
        navigation.goBack();
      },
    });
  };

  const descriptionRef = useRef<TextInput>(null);

  return (
    <View className="flex-1 px-6 py-4">
      <TextInput
        className="border-b border-gray-400 mb-6 h-12"
        autoFocus
        placeholder="Título"
        value={formState?.title}
        onChangeText={onValueChange('title')}
        returnKeyType="next"
        onSubmitEditing={() => descriptionRef.current?.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        style={{ minHeight: 64 }}
        textAlignVertical="top"
        className="border-b border-gray-400"
        placeholder="Descrição"
        value={formState?.description ?? ''}
        onChangeText={onValueChange('description')}
        returnKeyType="done"
        ref={descriptionRef}
        onSubmitEditing={onSaveTask}
        multiline
      />

      <Fab
        onPress={onSaveTask}
        icon={<Icon name="check" color="white" size={24} />}
      />
    </View>
  );
}
