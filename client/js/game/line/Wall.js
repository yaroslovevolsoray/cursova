import { Line } from './Line.js';

export class Wall extends Line {
  /** @param {import('../../../types.js').WallInitData} data  */
  constructor(data){
    const {type='normal', ...restData} = data;
    super(restData);
    this._type = type;
  }

  get type() {
    return this._type;
  }
}
