import { FormController         } from './form_controller';
import { formatDistance, format } from "date-fns/fp";

export const TaskDisplayController = (container, ModalDisplay, Alert) => {
  const object          = { container },
        priorityClasses = { low: 'secondary', normal: 'info', high: 'danger' };

  object.clear = () => {
    object.container.innerHTML = '';
  }

  const createTaskCheckboxes = (template, task) => {
    const checkboxesContainer = template.querySelector('.task-checkboxes'),
          checkboxTemplate    = template.querySelector('#task-checkbox-template');
    
    let checkBoxTemplate, input, label;
    task.checklist.forEach((item, index) => {
      checkBoxTemplate = checkboxTemplate.content.cloneNode(true);
      
      input         = checkBoxTemplate.querySelector('input');
      label         = checkBoxTemplate.querySelector('label');
      input.id      = `task-${item[0]}-${index}`;
      input.checked = item[1];

      input.addEventListener('change', (e) => {
        task.checklist[index] = [item[0], e.target.checked];
        task.update({ checklist: task.checklist });
      })

      label.textContent = item[0];
      label.setAttribute('for', input.id);
      checkboxesContainer.appendChild(checkBoxTemplate);
    })
  }

  object.listTasks = (tasks, templateId, updateCallbacks = []) => {
    const taskList = document.createElement('div');

    let template, button, taskTitle, priorityBadge, timeBadge, taskDate, timeDistance;
    tasks.forEach(task => {
      template      = document.getElementById(templateId).content.cloneNode(true),
      button        = template.querySelector('.task-trigger'),
      taskTitle     = button.querySelector('.task-title'),
      priorityBadge = button.querySelector('.task-priority-badge'),
      timeBadge     = button.querySelector('.task-time-badge');
      
      taskTitle.textContent = task.title;

      if (task.priority === 'normal') {
        button.removeChild(priorityBadge);
      } else {
        priorityBadge.textContent = `${task.priority} priority`;
        priorityBadge.classList.add(`bg-${priorityClasses[task.priority]}`);
      }

      taskDate     = new Date(`${task.dueDate}T${task.time || '00:00'}`);
      timeDistance = formatDistance(taskDate, new Date());
      timeBadge.textContent = `${taskDate < new Date() ? `${timeDistance} ago` : `in ${timeDistance}`}`;

      if (taskDate < new Date()) {
        timeBadge.classList.remove('bg-dark');
        timeBadge.classList.add('bg-danger');
      }

      button.addEventListener('click', object.renderTask.bind(task, timeBadge.textContent, updateCallbacks));
      button.title = `${task.priority} priority: ${timeBadge.textContent}`;

      taskList.appendChild(template);
    })

    return taskList;
  }

  object.renderTask = function(timeDistance, updateCallbacks) {
    const template    = document.getElementById('task-template').content.cloneNode(true),
          editBtn     = template.querySelector('.edit-task'),
          deleteBtn   = template.querySelector('.delete-task'),
          description = template.querySelector('.task-description'),
          date        = template.querySelector('.task-date'),
          priority    = template.querySelector('.task-priority');

    editBtn.addEventListener('click', object.renderTaskForm.bind(this, null, null, updateCallbacks ));

    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure that you would like to delete this task?')) {
        this.delete();
        template.innerHTML = '';
        updateCallbacks.forEach(callback => callback.call());
        Alert.displayWarning('Task has been successfully deleted');
      }
    })

    date.textContent = `${this.dueDate} ${this.time} (${timeDistance})`;

    priority.textContent = this.priority;
    priority.classList.add(`bg-${priorityClasses[this.priority]}`);

    description.textContent = this.description;
    if (this.description === '') description.style.display = 'none';
    createTaskCheckboxes(template, this);

    ModalDisplay.render(this.title, template);
  }

  object.renderTaskForm = function(parentId, construktor, callbacks) {
    const template        = document.getElementById('new-task-template').content.cloneNode(true),
          form            = template.querySelector('form'),
          taskValidations = { validations: ['task-title', 'task-dueDate'] };

    if (this && this.title) {    
      let input;
      ['title', 'description', 'checklist', 'dueDate', 'time', 'priority', 'parentId'].forEach(col => {
        input = form.querySelector(`#task-${col}`);
        if (input.nodeName === 'SELECT') {
          input.selectedIndex = ['low', 'normal', 'high'].indexOf(this.priority);
        } else if (col === 'checklist') {
          input.value = this[col].map(item => item[0]).join(',');
        } else {
          input.value = this[col];
        }
      })
      
      form.querySelector('button[type="submit"]').textContent = 'Update';
  
      FormController(form, this.update.bind(this), callbacks, taskValidations);
      ModalDisplay.render('Update Task', template);
    } else {
      template.getElementById('task-parentId').value = parentId;
      
      FormController(form, construktor, callbacks, taskValidations);
      ModalDisplay.render('Create Task', template);
    }
  }

  return object;
};
