import { fetchRooms } from '../api/rooms.js';
import { App } from '../app.js';

/**
 * @returns {HTMLElement}
 */
export function RoomList({ connectToRoom }) {
  const roomListElm = document.createElement('div');
  roomListElm.id = 'room-list'
  const containerElm = document.createElement('div');
  containerElm.classList.add('room-list__container');

  const handleRoomListClick = (event) => {
    if (event.target.dataset.roomId) {
      connectToRoom(event.target.dataset.roomId);
    }
  }

  fetchRooms()
    .then((res) => res.json())  
    .then((res) => {
      res.forEach((room) => {
        const descriptionElm = document.createElement('span');
        descriptionElm.textContent = `${room.name.slice(0, 20).padEnd(20, ' ')}|${room.playerNumber}/${room.playerLimit}`;
        const buttonElm = document.createElement('button');
        buttonElm.dataset.roomId = room.id;
        buttonElm.classList.add('room-list__play-button')
        buttonElm.textContent = 'Play';
        containerElm.append(descriptionElm, buttonElm);

        containerElm.addEventListener('mouseup', handleRoomListClick)
      })
    })
    .catch((reason) => {
      const errorElm = document.createElement('p');
      errorElm.classList.add('error');
      errorElm.textContent = 'Unable to fetch rooms';
      containerElm.append(errorElm);
    });

  roomListElm.append(containerElm);
  return roomListElm;
}