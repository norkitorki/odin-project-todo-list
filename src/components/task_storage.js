import { DataStorage } from "./data_storage";
import uniqid from 'uniqid';

export const TaskStorage = () => {
  let tasks = {};
  const object      = { storageKey: 'tasks', size: 0 },
        taskMethods = {},
        properties  = [ 'title', 'description', 'checklist', 'dueDate', 'time', 'priority', 'parentId', 'id' ],
        LocalStore  = DataStorage(object.storageKey);

  if (LocalStore) {
    object.import = () => {
      const arr = LocalStore.retrieve();
      if (arr) {
        tasks = {};
        let obj;
        arr.forEach(task => {
          obj = {};
          task.forEach((value, index) => obj[properties[index]] = value);
          object.add(obj);
        });
      }
    }
  }

  object.add = (attributes = {}) => {
    const newTask   = Object.create(taskMethods),
          checklist = attributes.checklist;
    Object.assign(newTask, attributes);
    newTask.id = attributes.id || uniqid('task-');

    if (typeof checklist === 'string') {
      newTask.checklist = checklist.length === 0 ? [] : checklist.split(',').map(item => [item, false]).filter(arr => arr[0] !== '');
    }

    tasks[newTask.id] = newTask;
    object.size++;
    object.store();
    return newTask;
  }

  object.getTask = (id) => {
    return tasks[id];
  }

  object.all = () => {
    return Object.keys(tasks).map(id => tasks[id]);
  }

  object.clear = () => {
    tasks = {};
    object.size = 0;
    object.store();
  }

  object.findByParent = (id) => {
    return object.all().filter(task => task.parentId === id);
  }

  object.store = () => {
    const arr = object.all().map(task => properties.map(prop => task[prop]));
    LocalStore.store(arr);
  }

  taskMethods.update = function(attributes = {}) {
    Object.keys(attributes).forEach(attr => this[attr] = attributes[attr]);
    object.store();
  }

  taskMethods.delete = function() {
    delete tasks[this.id];
    object.size--;
    object.store();
  }

  return object;
};
