import {App} from './app.js'

const app = new App(document.getElementById('app'));

const startApp = () => {
  app.showNamePrompt();
}

window.addEventListener('load', startApp);