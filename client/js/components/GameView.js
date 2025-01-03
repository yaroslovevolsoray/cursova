import { SettingsDialog } from './SettingsDialog.js';
import { ScreenControls } from './ScreenControls.js';

const settingsItems = [{
  id: 'settings-screen-controls',
  name: 'screenControls',
  text: 'Screen controls'
},/*{
  id: 'audio',
  name: 'audio',
  text: 'Allow audio'
}*/];

export function GameView({handleExit}) {
  const gameViewElm = document.createElement('div');
  gameViewElm.id = 'game-view';
  gameViewElm.tabIndex = 1;
  const containerElm = document.createElement('div');
  containerElm.classList.add('game-view__container');

  function handleSettingsChange(settings) {
    if (settings.screenControls) {
      canvasContainerElm.append(ScreenControls());
    } else {
      canvasContainerElm.querySelector('#screen-controls')?.remove();
    }
  }
  const settingsDialogElm = SettingsDialog(handleSettingsChange, settingsItems);

  //bar
  const barContainerElm = document.createElement('div');
  barContainerElm.classList.add('game-view__bar-container');
  const barElm = document.createElement('div');
  barElm.classList.add('game-view__bar');

  const scoreElm = document.createElement('div');
  scoreElm.classList.add('bar__score');
  scoreElm.textContent = '-:-'

  const timerElm = document.createElement('div');
  timerElm.classList.add('bar__timer');
  timerElm.textContent = '--:--'
  
  const exitBtn = document.createElement('button');
  exitBtn.classList.add('bar__exit-btn');
  exitBtn.textContent = 'exit'
  exitBtn.addEventListener('click', handleExit);

  const settingsButton = document.createElement('button');
  settingsButton.classList.add('bar__settings-btn', 'settings-btn');
  settingsButton.addEventListener('click', (e) => { settingsDialogElm.classList.remove('settings-dialog--hidden') });

  //game
  const canvasContainerElm = document.createElement('div');
  canvasContainerElm.classList.add('game-view__canvas-container');
  const canvasElm = document.createElement('canvas');
  canvasElm.id = 'canvas';

  barElm.append(scoreElm, timerElm, exitBtn, settingsButton);
  barContainerElm.append(barElm);
  canvasContainerElm.append(canvasElm);
  containerElm.append(barContainerElm, canvasContainerElm);
  gameViewElm.append(containerElm, settingsDialogElm);

  return gameViewElm;
}