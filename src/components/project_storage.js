import { DataStorage } from "./data_storage";
import uniqid from 'uniqid';

export const ProjectStorage = (Tasks) => {
  let projects = {};
  const object         = { storageKey: 'projects', size: 0 },
        projectMethods = {},
        properties     = ['title', 'description', 'id'],
        LocalStore     = DataStorage(object.storageKey);

  if (LocalStore) {
    object.import = () => {
      const arr = LocalStore.retrieve();
      if (arr) {
        projects = {};
        let obj;
        arr.forEach(project => {
          obj = {};
          project.forEach((value, index) => obj[properties[index]] = value);
          object.add(obj);
        });
      }
    }
  }

  object.add = (attributes = {}) => {
    const newProject = Object.create(projectMethods);
    Object.assign(newProject, attributes);

    newProject.id = attributes.id || uniqid('project-');
    projects[newProject.id] = newProject;
    object.size++;
    object.store();
    return newProject;
  }

  object.getProject = (id) => {
    return projects[id];
  }

  object.all = () => {
    return Object.keys(projects).map(id => projects[id]);
  }

  object.clear = () => {
    projects = {};
    object.size = 0;
    object.store();
  }

  object.store = () => {
    const arr = object.all().map(project => properties.map(prop => project[prop]));
    LocalStore.store(arr);
  }

  if (Tasks) {
    projectMethods.tasks = function() {
      return Tasks.findByParent(this.id) || [];
    }
  }

  projectMethods.update = function(attributes = {}) {
    Object.keys(attributes).forEach(attr => this[attr] = attributes[attr]);
    object.store();
  }

  projectMethods.delete = function() {
    if (Tasks) this.tasks().forEach(task => task.delete());
    delete projects[this.id];
    object.size--;
    object.store();
  }

  return object;
};
