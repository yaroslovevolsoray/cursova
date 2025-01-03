let changedSettings = {};

export function SettingsDialog(handleSettingsChange, settingsItems) {
  const settingsDialogElm = document.createElement('div');
  settingsDialogElm.id = 'settings-dialog';
  settingsDialogElm.classList.add('dialog', 'settings-dialog--hidden');
  const containerElm = document.createElement('div');
  containerElm.classList.add('settings-dialog__container', 'dialog__container');
  //title
  const titleElm = document.createElement('div');
  titleElm.classList.add('settings-dialog__title');
  titleElm.textContent = 'Settings';
  //settings
  const settingsListElm = document.createElement('ul');
  settingsListElm.classList.add('settings-dialog__settings-list');
  settingsItems.forEach((item) => {
    const settingsItemElm = document.createElement('li');
    settingsItemElm.classList.add('settings-dialog__settings-item');
    const inputElm = document.createElement('input');
    inputElm.type = 'checkbox';
    inputElm.id = item.id;
    inputElm.name = item.name;
    const labelElm = document.createElement('label');
    labelElm.htmlFor = item.id;
    labelElm.textContent = item.text;

    settingsItemElm.append(inputElm, labelElm);
    settingsListElm.append(settingsItemElm);
  });
  settingsListElm.addEventListener('change', ({target}) => {
    if(target.tagName === 'INPUT') {
      changedSettings[target.name] = target.checked;
    }
  });
  //actions
  const actionsElm = document.createElement('div');
  actionsElm.classList.add('settings-dialog__actions');
  const saveBtn = document.createElement('button');
  saveBtn.classList.add('settings-dialog__save-btn');
  saveBtn.textContent = 'save';
  const cancelBtn = document.createElement('button');
  cancelBtn.classList.add('settings-dialog__cancel-btn');
  cancelBtn.textContent = 'cancel';
  actionsElm.append(saveBtn, cancelBtn);
  saveBtn.addEventListener('click', () => {
    settingsDialogElm.classList.add('settings-dialog--hidden');
    handleSettingsChange(changedSettings);
    changedSettings = [];
  });
  cancelBtn.addEventListener('click', () => {
    settingsDialogElm.classList.add('settings-dialog--hidden');
    changedSettings = [];
  });

  containerElm.append(titleElm, settingsListElm, actionsElm);
  settingsDialogElm.append(containerElm);
  return settingsDialogElm;
}