export function DisconnectDialog({reason, handleExit}) {
  const disconnectDialogElm = document.createElement('div');
  disconnectDialogElm.id = 'disconnect-dialog';
  disconnectDialogElm.classList.add('dialog');
  const containerElm = document.createElement('div');
  containerElm.classList.add('disconnect-dialog__container', 'dialog__container');

  const contentElm = document.createElement('div');
  contentElm.classList.add('disconnect-dialog__content')
  contentElm.textContent = `You were disconnected. Reason: ${reason}`;

  const actionsElm = document.createElement('div');
  actionsElm.classList.add('disconnect-dialog__actions');
  const exitBtn = document.createElement('button');
  exitBtn.classList.add('continue-dialog__exit-btn')
  exitBtn.textContent = 'exit'
  actionsElm.append(exitBtn);
  exitBtn.addEventListener('click', () => {
    handleExit();
  });

  containerElm.append(contentElm, actionsElm);
  disconnectDialogElm.append(containerElm);
  return disconnectDialogElm;
}