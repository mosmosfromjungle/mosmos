import { useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import { useAppSelector, useAppDispatch } from './hooks'
import { DIALOG_STATUS } from './stores/UserStore'

import EntryDialog from './components/entrydialog/EntryDialog'
import LoginDialog from './components/entrydialog/LoginDialog'
import JoinDialog from './components/entrydialog/JoinDialog'
import WelcomeDialog from './components/entrydialog/WelcomeDialog'

import GameLobbyDialog from './components/gamedialog/GameLobbyDialog'
import GameWelcomeDialog from './components/gamedialog/GameWelcomeDialog'


import ComputerDialog from './components/ComputerDialog'
import WhiteboardDialog from './components/WhiteboardDialog'
import MoleGameDialog from './components/MoleGameDialog'
import VideoConnectionDialog from './components/VideoConnectionDialog'
import HelperButtonGroup from './components/HelperButtonGroup'
import MobileVirtualJoystick from './components/MobileVirtualJoystick'

// ↓ HelperButtonGroup Dialog
import ChatDialog from './components/ChatDialog'
import DMDialog from './components/DMDialog'
import UserDialog from './components/UserDialog'
import LogoutDialog from './components/LogoutDialog'

// ↓ Profile Button & Dialog
import ProfileButton from './components/ProfileButton'
import ProfileDialog from './components/ProfileDialog'

import GlobalFont from '../public/assets/fonts/GlobalFont'

import { authenticateUser } from './apicalls/auth';

// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

// TODO: Production 서버에 옮겨가면 해당 부분 수정 필요 
axios.defaults.baseURL = 'http://localhost:2567'
console.log('axios.defaults.baseURL ', axios.defaults.baseURL);

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const dialogStatus = useAppSelector((state) => state.user.dialogStatus)
  // const entryProcess = useAppSelector((state) => state.user.entryProcess)
  // const entered = useAppSelector((state) => state.user.entered)
  // const gameEntered = useAppSelector((state) => state.user.gameEntered)
  // const gameWelcome = useAppSelector((state) => state.user.gameWelcome)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const audioConnected = useAppSelector((state) => state.user.audioConnected)
  // const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  // const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  // const moleGameDialogOpen = useAppSelector((state) => state.molegame.moleGameDialogOpen)
  const brickGameOpen = useAppSelector((state) => state.brickgame.brickGameOpen)
  const moleGameOpen = useAppSelector((state) => state.molegame.moleGameOpen)
  const rainGameOpen = useAppSelector((state) => state.raingame.rainGameOpen)

  // ↓ HelperButtonGroup Dialog
  const showChat = useAppSelector((state) => state.chat.showChat)
  const showDM = useAppSelector((state) => state.chat.showDM)
  const showUser = useAppSelector((state) => state.chat.showUser)
  const showLogout = useAppSelector((state) => state.user.showLogout)

  // ↓ Profile Dialog
  const showProfile = useAppSelector((state) => state.user.showProfile)

  const dispatch = useAppDispatch()

  // TODO: cookie 가져오는 부분 해결 필요 
  // useEffect(() => {
  //   // 첫 렌더링 시, refresh token이 있다면 token 인증을 통해 entry 상태를 설정 
  //   // const refreshToken = cookies.get('refreshToken');
  //   // console.log('refresh token: ', refreshToken)
  //   // if (refreshToken) { 
  //   authenticateUser().then((result) => {
  //     if (result.status === 200) {
  //       dispatch(setEntryProcess(ENTRY_PROCESS.WELCOME));
  //     }
  //   })
  //   // }
  // }, [])

  let ui: JSX.Element
  if (dialogStatus === DIALOG_STATUS.JOIN) {
    ui = <JoinDialog />
  } else if (dialogStatus === DIALOG_STATUS.LOGIN) {
    ui = <LoginDialog />
  } else if (dialogStatus === DIALOG_STATUS.WELCOME) {
    ui = <WelcomeDialog/>
  } else if (dialogStatus === DIALOG_STATUS.IN_MAIN) {
    ui = (
      <>  // UGLY: Need to move to HelperButtonGroup 
        {showChat && <ChatDialog />}
        {showDM && <DMDialog />}
        {showUser && <UserDialog />}
        {showLogout && <LogoutDialog />}
        {showProfile && <ProfileDialog />}
        {!videoConnected && <VideoConnectionDialog />}
        <MobileVirtualJoystick />
        <HelperButtonGroup />
        <ProfileButton />
      </>
    )
  } else if (dialogStatus === DIALOG_STATUS.GAME_LOBBY) {
    ui = <GameLobbyDialog />
  } else if (dialogStatus === DIALOG_STATUS.GAME_WELCOME) {
    ui = <GameWelcomeDialog />
  } else if (dialogStatus === DIALOG_STATUS.IN_GAME) {
    if (brickGameOpen) ui = <ComputerDialog />
    if (moleGameOpen) ui = <MoleGameDialog />
    if (rainGameOpen) ui = <WhiteboardDialog />
  } else {
    ui = <EntryDialog />
  }

  return (
    <Backdrop>
      <GlobalFont />
      {ui}
    </Backdrop>
  )
}

export default App
