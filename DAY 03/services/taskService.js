"use strict";

export class TaskService {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getAllTasks() {
        return this.tasks;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    loadTasksFromServer() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = [
                    { id: 1, title: "Prepare report", assignedTo: 101 },
                    { id: 2, title: "Fix bugs", assignedTo: 102 },
                    { id: 3, title: "Deploy app", assignedTo: 101 }
                ];
                resolve(data);
            }, 2000);
        });
    }

    assignTaskToUser(taskId, user) {
        const task = this.getTaskById(taskId);
        if (task && user) {
            user.assignTask.call(user, task);
        }
        return user;
    }

    async processTasksForUsers(users) {
        try {
            const remoteTasks = await this.loadTasksFromServer();
            
            remoteTasks.forEach(task => this.addTask(task));

            this.tasks.forEach(task => {
                const user = users.find(u => u.id === task.assignedTo);
                if (user) {
                    this.assignTaskToUser(task.id, user);
                }
            });

            return users;
        } catch (error) {
            throw new Error("Task Processing Failed: " + error.message);
        }
    }
}

export const taskService = new TaskService();







