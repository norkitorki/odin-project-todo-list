import { Modal } from 'bootstrap';

export const ModalDisplayController = (modal) => {
  const object     = { modal },
        modalTitle = modal.querySelector('.modal-title'),
        modalBody  = modal.querySelector('.modal-body'),
        mainModal  = new Modal(`#${modal.id}`, {});

  object.register = (triggerElement, title, template) => {
    triggerElement.addEventListener('click', object.render.bind(this, title, template));
  }

  object.render = (title = '', content) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = '';
    modalBody.appendChild(content);
  }

  object.hide = () => {
    mainModal.hide();
  }

  return object;
};
