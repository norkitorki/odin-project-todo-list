import "./stylesheets/style.css";
import './stylesheets/styles.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { ModalDisplayController   } from './components/modal_display_controller';
import { ProjectStorage           } from './components/project_storage';
import { TaskStorage              } from './components/task_storage';
import { ProjectDisplayController } from './components/project_display';
import { TaskDisplayController    } from './components/task_display';
import { DataStorage              } from './components/data_storage';
import { Alert                    } from './components/alert';

/* DOM elements */
const modal                = document.getElementById('main-modal'),
      main                 = document.querySelector('main'),
      projectList          = document.querySelector('.projects'),
      backupProjectsButton = document.getElementById('backup'),
      importProjectsButton = document.getElementById('import'),
      clearProjectsButton  = document.getElementById('clear'),
      newProjectButton     = document.getElementById('new-project'),

/* Components */
      ModalDisplay   = ModalDisplayController(modal),
      Tasks          = TaskStorage(),
      Projects       = ProjectStorage(Tasks),
      Storage        = DataStorage(),
      Alerts         = Alert(main, 10),
      TaskDisplay    = TaskDisplayController(main, ModalDisplay, Alerts),
      ProjectDisplay = ProjectDisplayController(projectList, TaskDisplay, ModalDisplay, Alerts);

/* Functionality */

const initialize = () => {
  Projects.import();
  Tasks.import();
  ProjectDisplay.list(Projects.all(), 'project-template', Tasks.add, [ initialize, ModalDisplay.hide ]);

  if (Projects.size === 0) {
    Projects.add({ title: 'Default Project', description: 'This is the default project' });
  }
};

const staticCallbacks = (message) => {
  return [ initialize, Alerts.displaySuccess.bind(this, message), ModalDisplay.hide ];
};

const backupProjects = () => {
  if (Tasks.size === 0 && Projects.size === 0) return alert('Projects are empty');

  Storage.saveToFile({ fileName: `todos-${new Date().toLocaleDateString()}`, keys: ['projects', 'tasks'] });
};

const clearProjects = () => {
  if (confirm('Are you sure that you would like to delete all projects?')) {
    Projects.clear();
    Tasks.clear();
    initialize();
    Alerts.displayWarning('Projects have been cleared');
  }
};

const renderImportTemplate = () => {
  const callbacks = staticCallbacks('Projects have been successfully imported');
  ProjectDisplay.renderImportForm('import-template', Storage.importFromFile, callbacks);
};

const renderNewProjectTemplate = () => {
  const callbacks = staticCallbacks('Project has been successfully saved');
  ProjectDisplay.renderForm('new-project-template', null, callbacks, Projects.add);
};

/* Event listeners */

importProjectsButton.addEventListener('click', renderImportTemplate);
backupProjectsButton.addEventListener('click', backupProjects);
clearProjectsButton.addEventListener('click', clearProjects);
newProjectButton.addEventListener('click', renderNewProjectTemplate);

initialize();
