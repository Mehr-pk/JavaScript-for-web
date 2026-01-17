"use strict";

import User from './models/User.js';
import { taskService } from './services/taskService.js';

const users = [
    new User(101, "Ali", "admin"),
    new User(102, "Sara", "manager"),
    new User(103, "Zain", "user")
];


const fakeDOM = {
    logs: [],
    render(message) {
        this.logs.push(message);
        console.log(`[UI Render]: ${message}`);
    }
};


async function startApp() {
    try {
        console.log("System initializing...");
        
       
        await taskService.processTasksForUsers(users);

        users.forEach(user => {
            fakeDOM.render(user.getSummary());
        });

    } catch (error) {
        fakeDOM.render(`System error: ${error.message}`);
    } finally {
        console.log("System ready");
    }
}

startApp();