export function NamePrompt({ handleSubmit, placeholder }) {
  const namePromptElm = document.createElement('form');
  namePromptElm.id = 'name-prompt';
  const containerElm = document.createElement('div');
  containerElm.classList.add('name-prompt__container');

  const titleElm = document.createElement('div');
  titleElm.classList.add('name-prompt__title');
  titleElm.textContent = 'Enter your name';

  const inputElm = document.createElement('input');
  inputElm.type = 'text';
  inputElm.classList.add('name-prompt__input');
  inputElm.placeholder = placeholder;
  inputElm.maxLength = 10;

  const submitBtn = document.createElement('button');
  submitBtn.classList.add('name-prompt__submit-btn');
  submitBtn.textContent = 'Submit';
  submitBtn.addEventListener('click', () => {
    handleSubmit(inputElm.value);
  });

  containerElm.append(titleElm, inputElm, submitBtn);
  namePromptElm.append(containerElm);
  return namePromptElm;
}