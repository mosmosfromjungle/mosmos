import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ArraySchema } from '@colyseus/schema'
import { DATA_STRUCTURE, QUIZ_TYPE, IImageContainer } from '../../../types/IGameState'

import phaserGame from '../PhaserGame'
import Game from '../scenes/Game'

export interface BrickGameStateInterface {
  currentQuiz: QUIZ_TYPE
  originalImages: ArraySchema<IImageContainer>
  gameInProgress: boolean
  gameStarting: boolean
}

const brickGameState: BrickGameStateInterface = {
  currentQuiz: QUIZ_TYPE.NONE,
  originalImages: new ArraySchema<IImageContainer>(),
  gameInProgress: false,
  gameStarting: false,
}

export interface PlayerScoreInterface {
  pointArray: ArraySchema<number>
  totalPoint: number
}

export interface PlayerStatusInterface {
  currentImages: ArraySchema<IImageContainer>
  selectedOption: DATA_STRUCTURE
  commandArray: ArraySchema<string>
}

const myPlayerScore: PlayerScoreInterface = {
  pointArray: new ArraySchema<number>(),
  totalPoint: 0,
}

const myPlayerStatus: PlayerStatusInterface = {
  currentImages: new ArraySchema<IImageContainer>(),
  selectedOption: DATA_STRUCTURE.NONE,
  commandArray: new ArraySchema<string>(),
}

const oppPlayerScore: PlayerScoreInterface = {
  pointArray: new ArraySchema<number>(),
  totalPoint: 0,
}

const oppPlayerStatus: PlayerStatusInterface = {
  currentImages: new ArraySchema<IImageContainer>(),
  selectedOption: DATA_STRUCTURE.NONE,
  commandArray: new ArraySchema<string>(),
}


export const brickGameSlice = createSlice({
  name: 'brickgame',
  initialState: {
    brickGameOpen: false,
    brickGameState,
    myPlayerScore,
    myPlayerStatus,
    oppPlayerScore,
    oppPlayerStatus,
  },
  reducers: {
    openBrickGameDialog: (state) => {
      state.brickGameOpen = true
      const game = phaserGame.scene.keys.game as Game
      // TODO: 해당 화면을 비활성화하는 것도 여기 추가하면 좋을 것 같다. 
      game.disableKeys()
    },
    closeBrickGameDialog: (state) => {
      const game = phaserGame.scene.keys.game as Game
      game.enableKeys()
      state.brickGameOpen = false
    },
    setBrickGameState: (state, action: PayloadAction<BrickGameStateInterface>) => {
      state.brickGameState.currentQuiz = action.payload.currentQuiz
      state.brickGameState.originalImages = action.payload.originalImages
      state.brickGameState.gameInProgress = action.payload.gameInProgress
      state.brickGameState.gameStarting = action.payload.gameStarting
    },
    setMyPlayerScore: (state, action: PayloadAction<PlayerScoreInterface>) => {
      state.myPlayerScore = action.payload
    },
    setMyPlayerStatus: (state, action: PayloadAction<PlayerStatusInterface>) => {
      state.myPlayerStatus = action.payload
    },
    setOppPlayerScore: (state, action: PayloadAction<PlayerScoreInterface>) => {
      state.oppPlayerScore = action.payload
    },
    setOppPlayerStatus: (state, action: PayloadAction<PlayerStatusInterface>) => {
      state.oppPlayerStatus = action.payload
    },
  },
})

export const { 
  openBrickGameDialog, 
  closeBrickGameDialog,
  setBrickGameState,
  setMyPlayerScore,
  setMyPlayerStatus,
  setOppPlayerScore,
  setOppPlayerStatus
} = brickGameSlice.actions

export default brickGameSlice.reducer
