import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import { useAppSelector, useAppDispatch } from '../../hooks'
import { ENTRY_PROCESS, setAccessToken, setEntryProcess } from '../../stores/UserStore'

import phaserGame from '../../PhaserGame'
import Game from '../../scenes/Game'
import Bootstrap from '../../scenes/Bootstrap'

import { login, LoginRequest } from '../../apicalls/auth'


const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
  font-family: Font_DungGeun;
`
const Wrapper = styled.form`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`
const Title = styled.p`
  margin: 5px;
  font-size: 50px;
  color: #c2c2c2;
  text-align: center;
  font-family: Font_DungGeun;
`
const Content = styled.div`
  margin: 50px 50px;
`
const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    font-size: 20px;
    font-family: Font_DungGeun;
  }
`
const ProgressBar = styled(LinearProgress)`
  width: 360px;
`
const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`


export default function LoginDialog() {
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [idFieldEmpty, setIdFieldEmpty] = useState<boolean>(false)
  const [passwordFieldEmpty, setPasswordFieldEmpty] = useState<boolean>(false)
  const [userIdError, setUserIdError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const dispatch = useAppDispatch()
  
  const videoConnected = useAppSelector((state) => state.user.videoConnected)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const game = phaserGame.scene.keys.game as Game

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // reset the error message
    setIdFieldEmpty(false)
    setPasswordFieldEmpty(false)

    event.preventDefault()

    if (id === '') {
      setIdFieldEmpty(true);
    } else if (password === '') {
      setPasswordFieldEmpty(true);
    } else {
      const body: LoginRequest = {
        userId: id,
        password: password,
      }
      login(body).then((response) => {
        const { status, payload } = response
        if (status === 200) {
          const token = payload.accessToken
          if (token) {
            dispatch(setAccessToken(token)) // FIXME: User Store에 엑세스 토큰을 저장하는 이유를 모르겠음. axios header에 설정하는걸로 부족한가?
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          }
          if (lobbyJoined) {
            const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
            bootstrap.network
              .joinOrCreatePublic()
              .then(() => bootstrap.launchGame())
              .catch((error) => console.error(error))
          }
          dispatch(setEntryProcess(ENTRY_PROCESS.WELCOME))
        }
      }).catch((error) => {
        const { status, message } = error.response.data
        if (status === 409) {
          setUserIdError(message);
        } else if (status === 410) {
          setPasswordError(message);
        }
      })
    }    
  }

  return (
    <>
      <Backdrop>
        <Wrapper onSubmit={handleSubmit}>
          <Title>Login</Title>
            <Content>
              <TextField
                autoFocus
                fullWidth
                label="아이디"
                variant="outlined"
                color="secondary"
                error={idFieldEmpty || !!userIdError}
                helperText={idFieldEmpty ? '아이디를 입력해주세요 !' : userIdError}
                onInput={(e) => {
                  setId((e.target as HTMLInputElement).value)
                  setUserIdError('')
                }}
              />
              <TextField
                fullWidth
                label="패스워드"
                variant="outlined"
                color="secondary"
                error={passwordFieldEmpty || !!passwordError}
                helperText={passwordFieldEmpty ? '패스워드를 입력해주세요 !' : passwordError}
                onInput={(e) => {
                  setPassword((e.target as HTMLInputElement).value);
                  setPasswordError('')
                }}
              />
            </Content>

            <Content>
              {!videoConnected && (
                <Warning>
                  <Alert variant="outlined" severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    No webcam/mic connected - <strong>connect one for best experience!</strong>
                  </Alert>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      game.network.webRTC?.getUserMedia()
                    }}
                  >
                    Connect Webcam
                  </Button>
                </Warning>
              )}

              {videoConnected && (
                <Warning>
                  <Alert variant="outlined">Webcam connected!</Alert>
                </Warning>
              )}
            </Content>
          <Bottom>
            <Button variant="contained" size="large" type="submit">
              Login
            </Button>
          </Bottom>
        </Wrapper>
        
        {!lobbyJoined && (
          <ProgressBarWrapper>
            <h3> Connecting to server...</h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>
        )}
      </Backdrop>
    </>
  )
}