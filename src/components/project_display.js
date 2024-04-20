import { FormController } from "./form_controller";

export const ProjectDisplayController = (container, TaskDisplay, ModalDisplay, Alert) => {
  const object = { container };

  if (!container || container.nodeName !== 'UL') object.container = document.createElement('ul');

  function deleteProject(projects, callbacks) {
    if (confirm('Are you sure that you would like to delete this project?')) {
      const idx = projects.findIndex(project => project === this);
      if (idx) projects.splice(idx, 1);
      this.delete();
      callbacks.forEach(callback => callback.call());
    }
  }

  const triggerProjectClick = (projectId) => {
    document.querySelector(`.project-trigger[data-bs-target="#project-${projectId}"]`).click();
  }

  const updateCaretOrientation = (caret, collapseElement) => {
    collapseElement.addEventListener('show.bs.collapse', () => {
      caret.classList.value = `project-caret bi bi-caret-down-fill`;
    })

    collapseElement.addEventListener('hide.bs.collapse', () => {
      caret.classList.value = `project-caret bi bi-caret-up-fill`;
    })
  }

  object.list = (projects, templateId, taskConstruktor, updateCallbacks = []) => {
    container.innerHTML = '';

    const template = document.getElementById(templateId);

    let clonedTemplate, projectTrigger, projectTitle, caret, projectContent, taskList, editBtn,
        deleteBtn, addTaskBtn, projectDescription, callbacks;

    projects.forEach(project => {
      clonedTemplate     = template.content.cloneNode(true),
      projectTrigger     = clonedTemplate.querySelector('.project-trigger'),
      projectTitle       = projectTrigger.querySelector('.project-title'),
      caret              = projectTrigger.querySelector('.project-caret'),
      projectContent     = clonedTemplate.querySelector('.project-content'),
      editBtn            = clonedTemplate.querySelector('.edit-project'),
      deleteBtn          = clonedTemplate.querySelector('.delete-project'),
      addTaskBtn         = clonedTemplate.querySelector('.add-task'),
      projectDescription = clonedTemplate.querySelector('.project-description'),
      callbacks          = updateCallbacks.concat([ triggerProjectClick.bind(this, project.id) ]);

      projectContent.id = `project-${project.id}`;
      taskList = TaskDisplay.listTasks(project.tasks(), 'task-item-template', callbacks);
      projectContent.appendChild(taskList);

      projectTrigger.dataset['bsTarget'] = `#${projectContent.id}`;
      projectTitle.textContent = project.title;

      updateCaretOrientation(caret, projectContent);

      editBtn.addEventListener('click', object.renderForm.bind(this, 'new-project-template', project, callbacks));
      deleteBtn.addEventListener('click', deleteProject.bind(project, projects, updateCallbacks));
      addTaskBtn.addEventListener('click', TaskDisplay.renderTaskForm.bind(this, project.id, taskConstruktor, callbacks.concat(Alert.displaySuccess.bind(this, 'Task has been successfully saved'))));

      projectDescription.textContent = project.description;

      container.appendChild(clonedTemplate);
    })
  }

  object.renderForm = (templateId, project, callbacks, construktor) => {
    const template = document.getElementById(templateId).content.cloneNode(true),
              form = template.querySelector('form');

    if (project) {
      ['title', 'description'].forEach(prop => template.getElementById(`project-${prop}`).value = project[prop]);

      form.querySelector('button[type="submit"]').textContent = 'Update';

      FormController(form, project.update.bind(project), callbacks.concat([ModalDisplay.hide.bind(this)]), { validations: ['project-title'] });
      ModalDisplay.render('Update Project', template);
    } else {
      FormController(form, construktor, callbacks, { validations: ['project-title'] });
      ModalDisplay.render('Create Project', template);
    }
  }

  object.renderImportForm = (templateId, construktor, callbacks) => {
    const template = document.getElementById(templateId).content.cloneNode(true),
              form = template.querySelector('form');
    
    FormController(form, construktor, callbacks, { fileForm: true, validations: ['file-input'] });
    ModalDisplay.render('Import Projects', template);
  }

  return object;
};
