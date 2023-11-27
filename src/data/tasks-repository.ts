import { source } from './local/database';
import { TaskEntity } from './local/task-entity';
import { Task } from './task';

export class TasksRepository {
  async getTasks(): Promise<Task[]> {
    if (!source.isInitialized) await source.initialize();

    const tasks = await TaskEntity.find({
      order: { completed: { direction: 'ASC' } },
    });

    return tasks;
  }

  async getTask(taskId: Task['id']): Promise<Task> {
    if (!source.isInitialized) await source.initialize();

    const task = await TaskEntity.findOneByOrFail({ id: taskId });
    return task;
  }

  async createTask(payload: Pick<TaskEntity, 'title' | 'description'>) {
    if (!source.isInitialized) await source.initialize();

    const task = new TaskEntity();
    task.title = payload.title;
    task.description = payload.description;
    await task.save();
  }

  async updateTask(
    taskId: Task['id'],
    payload: Partial<Pick<Task, 'title' | 'description' | 'completed'>>
  ) {
    if (!source.isInitialized) await source.initialize();

    const task = await TaskEntity.findOneByOrFail({ id: taskId });
    task.title = payload.title ?? task.title;
    task.description = payload.description ?? task.description;
    task.completed = payload.completed ?? task.completed;
    await task.save();
  }

  async deleteTask(taskId: Task['id']) {
    if (!source.isInitialized) await source.initialize();

    await TaskEntity.delete(taskId);
  }
}
