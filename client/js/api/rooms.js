import { BACKEND_URL } from '../constants.js';

export const fetchRooms = () => {
  return fetch(BACKEND_URL + '/rooms');
};