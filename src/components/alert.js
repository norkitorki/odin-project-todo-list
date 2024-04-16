export const Alert = (parent = document.body, displayTime = 10) => {
  const object = {};

  const alertMessage = (type, message) => {
    const alert = document.createElement('div');
    
    alert.classList.value = `alert alert-${type}`;
    alert.textContent = message;
    alert.role = 'alert';

    return alert;
  }

  const displayAlert = (type, message, multiple = false) => {
    if (!multiple) {
      const alerts = parent.querySelectorAll('.alert');
      alerts.forEach(el => { if (el.textContent === message) el.parentElement.removeChild(el); });
    }

    const alert = alertMessage(type, message);
    parent.prepend(alert);

    if (displayTime !== 0) setTimeout(() => parent.removeChild(alert), displayTime * 1000);
  }

  object.displaySuccess = (message) => {
    displayAlert('success', message);
  }

  object.displayWarning = (message) => {
    displayAlert('danger', message);
  }

  return object;
};
