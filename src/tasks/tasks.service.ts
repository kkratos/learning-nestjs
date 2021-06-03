import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {

    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) { }

    getTasks(filterDto:GetTaskFilterDto):Promise<Task[]>{
        return this.taskRepository.getTask(filterDto)
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ${id} not found`);
        }
        return found;
    }

    async createTask(CreateTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(CreateTaskDto)
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id)

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ${id} not found`)
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus):Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status
        await task.save()
        return task
    }

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
    //     const { status, search } = filterDto

    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status)
    //     }
    //     if (search) {
    //         tasks = tasks.filter(task => task.title.includes(search) ||
    //             task.description.includes(search))
    //     }

    //     return tasks
    // }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(task => task.id === id);
    //     if (!found) {
    //         throw new NotFoundException(`Task with ${id} not found`);
    //     }
    //     return found
    // }

    // createTask(CreateTaskDto: CreateTaskDto): Task {
    //     const { title, description } = CreateTaskDto

    //     const task: Task = {
    //         id: uuid.v1(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     }
    //     this.tasks.push(task)
    //     return task
    // }

    // DeleteTask(id: string): void {
    //     const found = this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    // }

    // UpdateTaskStatus(id: string, status: TaskStatus) {
    //     const task = this.getTaskById(id);
    //     task.status = status
    //     return task;
    // }

}

