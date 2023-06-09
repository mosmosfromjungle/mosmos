import React from 'react'
import styled from 'styled-components'

import { useAppSelector } from './hooks'

import RoomSelectionDialog from './components/RoomSelectionDialog'
import LoginDialog from './components/LoginDialog'
import ComputerDialog from './components/ComputerDialog'
import WhiteboardDialog from './components/WhiteboardDialog'
import CodeEditorDialog from './components/CodeEditorDialog'
import VideoConnectionDialog from './components/VideoConnectionDialog'
import HelperButtonGroup from './components/HelperButtonGroup'
import MobileVirtualJoystick from './components/MobileVirtualJoystick'

import GlobalFont from '../public/assets/fonts/GlobalFont';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const computerDialogOpen = useAppSelector((state) => state.computer.computerDialogOpen)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const roomJoined = useAppSelector((state) => state.room.roomJoined)
  const codeEditorDialogOpen = useAppSelector((state) => state.codeeditor.codeEditorDialogOpen)

  let ui: JSX.Element
  if (loggedIn) {
    if (computerDialogOpen) {
      /* Render ComputerDialog if user is using a computer. */
      ui = <ComputerDialog />
    } else if (whiteboardDialogOpen) {
      /* Render WhiteboardDialog if user is using a whiteboard. */
      ui = <WhiteboardDialog />
    } else if (codeEditorDialogOpen) {
      /* Render CodeEditorDialogOpen if user is using a code editor. */
      ui = <CodeEditorDialog />
    } else {
      ui = (
        /* Render Chat or VideoConnectionDialog if no dialogs are opened. */
        <>
          {/* Render VideoConnectionDialog if user is not connected to a webcam. */}
          {!videoConnected && <VideoConnectionDialog />}
          <MobileVirtualJoystick />
        </>
      )
    }
  } else if (roomJoined) {
    /* Render LoginDialog if not logged in but selected a room. */
    ui = <LoginDialog />
  } else {
    /* Render RoomSelectionDialog if yet selected a room. */
    ui = <RoomSelectionDialog />
  }

  return (
    <Backdrop>
      {ui}
      {/* Render HelperButtonGroup if no dialogs are opened. */}
      {!computerDialogOpen && !whiteboardDialogOpen && !codeEditorDialogOpen && <HelperButtonGroup />}
      {<GlobalFont />}
    </Backdrop>
  )
}

export default App
