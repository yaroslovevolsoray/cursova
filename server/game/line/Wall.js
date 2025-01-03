import { Line } from './Line.js';

export class Wall extends Line {
  /** @param {WallInitData} data  */
  constructor(data){
    const {type='normal', ...restData} = data;
    super(restData);
    this._type = type;
  }

  initData(){
    return { 
      type: this._type,
      ...super.initData()
    };
  }
  get type() {
    return this._type;
  }
}
