export function ScreenControls() {
  const screenControlsElm = document.createElement('div');
  screenControlsElm.id = 'screen-controls';

  const arrowsContainerElm = document.createElement('div');
  arrowsContainerElm.classList.add('screen-controls__arrows-container');
  const upArrowElm = document.createElement('div');
  upArrowElm.dataset.controls = 'up';
  const rightArrowElm = document.createElement('div');
  rightArrowElm.dataset.controls = 'right';
  const downArrowElm = document.createElement('div');
  downArrowElm.dataset.controls = 'down';
  const leftArrowElm = document.createElement('div');
  leftArrowElm.dataset.controls = 'left';
  arrowsContainerElm.append(upArrowElm, rightArrowElm, downArrowElm, leftArrowElm);

  const actionContainerElm = document.createElement('div');
  actionContainerElm.classList.add('screen-controls__action-container');
  const actionElm = document.createElement('div');
  actionElm.dataset.controls = 'action';
  actionContainerElm.append(actionElm);


  screenControlsElm.addEventListener('pointerdown', (e) => {
    if (!(e.target instanceof HTMLElement && e.target.dataset.controls)) {
      return;
    }
    e.target.setPointerCapture(e.pointerId);
    e.target.classList.add('screen-controls__controls--pressed');
    let event;
    switch (e.target.dataset.controls) {
      case 'up':
        event = new KeyboardEvent('keydown', { code: 'KeyW', bubbles: true });
        break;
      case 'right':
        event = new KeyboardEvent('keydown', { code: 'KeyD', bubbles: true });
        break;
      case 'down':
        event = new KeyboardEvent('keydown', { code: 'KeyS', bubbles: true });
        break;
      case 'left':
        event = new KeyboardEvent('keydown', { code: 'KeyA', bubbles: true });
        break;
      case 'action': 
        event = new KeyboardEvent('keydown', { code: 'Space', bubbles: true });
        break;
    }
    screenControlsElm.dispatchEvent(event);
  });
  screenControlsElm.addEventListener('pointerup', (e) => {
    if (!(e.target instanceof HTMLElement && e.target.dataset.controls)) {
      return;
    }
    e.target.classList.remove('screen-controls__controls--pressed');
    let event;
    switch (e.target.dataset.controls) {
      case 'up':
        event = new KeyboardEvent('keyup', { code: 'KeyW', bubbles: true });
        break;
      case 'right':
        event = new KeyboardEvent('keyup', { code: 'KeyD', bubbles: true });
        break;
      case 'down':
        event = new KeyboardEvent('keyup', { code: 'KeyS', bubbles: true });
        break;
      case 'left':
        event = new KeyboardEvent('keyup', { code: 'KeyA', bubbles: true });
        break;
      case 'action':
        event = new KeyboardEvent('keyup', { code: 'Space', bubbles: true });
        break;
    }
    screenControlsElm.dispatchEvent(event);
  });

  screenControlsElm.append(arrowsContainerElm, actionContainerElm);
  return screenControlsElm;
}