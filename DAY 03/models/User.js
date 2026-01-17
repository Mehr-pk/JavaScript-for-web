"use strict";
export  default class User{
    constructor(id, name, role) {
        this.id = id;
        this.name = name;
        this.role = role; 
        this.tasks = [];
    }

assignTask(task) {
        this.tasks.push(task);
    }
getTaskCount() {
        return this.tasks.length;
    }
getSummary() {
        return `${this.name} ${this.role} has ${this.getTaskCount()} assigned tasks.`;
    }

}





