import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { sanitizeId } from '../util'
import { BackgroundMode } from '../../../types/BackgroundMode'

import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'

export function getInitialBackgroundMode() {
  const currentHour = new Date().getHours()
  return currentHour > 6 && currentHour <= 18 ? BackgroundMode.DAY : BackgroundMode.NIGHT
}

export enum DIALOG_STATUS {
  ENTRY = 'entry',
  JOIN = 'join',
  LOGIN = 'login',
  WELCOME = 'welcome',
  IN_MAIN  = 'in_main',
  GAME_LOBBY = 'game_lobby',
  GAME_WELCOME = 'game_welcome',
  IN_GAME = 'in_game',
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    backgroundMode: getInitialBackgroundMode(),
    showJoystick: window.innerWidth < 650,
    
    /* Initial value for user */
    sessionId: '',   // TODO: colyseus 서버에서 세션으로 관리되고 있다면 굳이 token을 안해도 되지 않을까?? 어차피 session이 끝나지 않으면 로그아웃이 되지 않을텐데..?
    gameSessionId:'',
    accessToken: '',
    userId: '',
    username: '',
    character: '',
    userLevel: '',
    // userTier: '',
    playerNameMap: new Map<string, string>(),
    
    /* Status regarding screen dialog */
    dialogStatus: DIALOG_STATUS.ENTRY,
    showLogout: false,
    showQuit: false,
    showVersion: false,
    showProfile: false,

    /* Video and Audio connection */
    videoConnected: false,
    audioConnected: false,
  },
  reducers: {
    toggleBackgroundMode: (state) => {
      const newMode =
        state.backgroundMode === BackgroundMode.DAY ? BackgroundMode.NIGHT : BackgroundMode.DAY

      state.backgroundMode = newMode
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.changeBackgroundMode(newMode)
    },
    setShowJoystick: (state, action: PayloadAction<boolean>) => {
      state.showJoystick = action.payload
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setGameSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setCharacter: (state, action: PayloadAction<string>) => {
      state.character = action.payload
    },
    setUserLevel: (state, action: PayloadAction<string>) => {
      state.userLevel = action.payload
    },
    setPlayerNameMap: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.playerNameMap.set(sanitizeId(action.payload.id), action.payload.name)
    },
    removePlayerNameMap: (state, action: PayloadAction<string>) => {
      state.playerNameMap.delete(sanitizeId(action.payload))
    },
    setDialogStatus: (state, action: PayloadAction<DIALOG_STATUS>) => {
      state.dialogStatus = action.payload
    },
    setShowLogout: (state, action: PayloadAction<boolean>) => {
      state.showLogout = action.payload
    },
    setShowVersion: (state, action: PayloadAction<boolean>) => {
      state.showVersion = action.payload
    },
    setVideoConnected: (state, action: PayloadAction<boolean>) => {
      state.videoConnected = action.payload
    },
    setAudioConnected: (state, action: PayloadAction<boolean>) => {
      state.audioConnected = action.payload
    },
    setShowProfile: (state, action: PayloadAction<boolean>) => {
      state.showProfile = action.payload
    },
  },
})

export const {
  toggleBackgroundMode,
  setShowJoystick,
  setSessionId,
  setGameSessionId,
  setAccessToken,
  setUserId,
  setUsername,
  setCharacter,
  setUserLevel,
  setPlayerNameMap,
  removePlayerNameMap,
  setDialogStatus,
  setShowLogout,
  setShowVersion,
  setVideoConnected,
  setAudioConnected,
  setShowProfile,
} = userSlice.actions

export default userSlice.reducer
