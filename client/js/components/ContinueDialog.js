export function ContinueDialog({ timeLeft, handleExit, handleContinue }) {
  const continueDialogElm = document.createElement('div');
  continueDialogElm.id = 'continue-dialog';
  continueDialogElm.classList.add('dialog')
  const containerElm = document.createElement('div');
  containerElm.classList.add('continue-dialog__container', 'dialog__container');

  const barContainerElm = document.createElement('div');
  barContainerElm.classList.add('continue-dialog__bar-container');
  const barElm = document.createElement('div');
  barContainerElm.append(barElm);
  setTimeout(() => {
    const animation = barElm.animate({
      transform: ['scaleX(1)', 'scaleX(0)']
    }, {
      duration: timeLeft < 0 ? 0 : timeLeft,
      iterations: 1,
      fill: 'forwards'
    });
  }, 0);

  const contentElm = document.createElement('div');
  contentElm.classList.add('continue-dialog__content')
  contentElm.textContent = 'Continue to play?'

  const actionsElm = document.createElement('div');
  actionsElm.classList.add('continue-dialog__actions');
  const exitBtn = document.createElement('button');
  exitBtn.classList.add('continue-dialog__exit-btn')
  exitBtn.textContent = 'exit'
  const continueBtn = document.createElement('button');
  continueBtn.classList.add('continue-dialog__continue-btn')
  continueBtn.textContent = 'continue'
  actionsElm.append(exitBtn, continueBtn);
  exitBtn.addEventListener('click', () => {
    handleExit();
  });
  continueBtn.addEventListener('click', () => {
    handleContinue();
  });

  containerElm.append(barContainerElm, contentElm, actionsElm);
  continueDialogElm.append(containerElm);

  return continueDialogElm;
}