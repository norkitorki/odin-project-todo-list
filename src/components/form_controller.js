export const FormController = (form, construktor, submitCallbacks = [], options = { fileForm: false, validations: [] }) => {
  const inputs       = Array.from(form.elements);

  // remove value of submit button
  const idx = inputs.findIndex(el => el.type === 'submit');
  if (idx !== -1) inputs.splice(idx, 1);

  const getValues = () => {
    const obj = {};
    inputs.forEach(input => obj[input.name] = input.value);
    return obj;
  }

  const callCallbacks = (callbacks) => {
    callbacks.forEach(callback => callback.call(this));
  }

  const addClassToInput = (input, validity) => {
    input.classList.add(validity ? 'is-valid' : 'is-invalid');
    if (!validity) input.focus(); 
  }

  const inputPresence = () => {
    let validity = true, value;
    inputs.toReversed().forEach(input => {
      value = input.value;
      if (options.validations.includes(input.id) && (!value || !input.checkValidity() || String(value) === '')) {
        validity = false;
        addClassToInput(input, false);
      } else {
        addClassToInput(input, true);
      }
    })

    return validity;
  }

  const formSubmit = (event) => {
    event.preventDefault();

    if (options.validations && options.validations.length > 0 && !inputPresence()) return;

    if (options.fileForm) {
      const file = form.querySelector('input[type="file"]').files[0];
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener('load', () => {
          construktor.call(this, reader.result);
          callCallbacks(submitCallbacks);
        })
      }
    } else {
      construktor(getValues());
      callCallbacks(submitCallbacks);
    }
  }

  form.addEventListener('submit', formSubmit);
};
