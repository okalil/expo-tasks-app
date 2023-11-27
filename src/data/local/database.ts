import { DataSource } from 'typeorm';
import { TaskEntity } from './task-entity';

export const source = new DataSource({
  database: 'tasks.db',
  type: 'expo',
  driver: require('expo-sqlite'),
  entities: [TaskEntity],
  synchronize: true,
});
