import { io } from 'socket.io-client';

declare global {
  interface Window { io: typeof io }
}

type Controls = boolean[]

interface CircleInitData {
  x: number,
  y: number,
  r: number,
  xVelocity: number,
  yVelocity: number,
  acceleration: number,
  friction: number,
  lineWidth?: number,
  strokeStyle?: string,
  fillStyle?: string,
}

interface BallInitData extends CircleInitData {}

interface PlayerInitData extends CircleInitData {
  id: string,
  name: string,
  controls?: Controls,
  actionStyle?: string
}

interface CircleStateData {
  x: number,
  y: number,
  xVelocity: number,
  yVelocity: number,
}

interface BallStateData extends CircleStateData {}

interface PlayerStateData extends CircleStateData {
  id: string,
  controls: Controls,
}


interface LineInitData {
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color?: string,
  lineWidth?: number,
}

interface WallInitData extends LineInitData {
  type?: 'normal' | 'bouncy'| 'goal-line',
}

interface StadiumData {
  width: number,
  height: number,
  color: string,
  walls: WallInitData[],
  lines: LineInitData[],
  circles: CircleInitData[],
}

interface GameInitData {
  players: PlayerInitData[],
  ball: BallInitData,
  stadium: StadiumData,
  score: number[],
  timeLeft?: number //ms
}

interface GameStateData {
  players: PlayerStateData[]
  ball: BallStateData
}

interface GameRestartData {
  score: number[],
  timeLeft?: number, // ms
  players: PlayerInitData[],
  ball: BallInitData,
}

interface GameContinueData {
  dateNow: number,
  timeout: number
}

