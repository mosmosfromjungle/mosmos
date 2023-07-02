import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { PersonOffOutlined, PersonRemoveOutlined, MailOutlineRounded } from '@mui/icons-material'
import { Content, Header, HeaderTitle } from '../GlobalStyle'

import { setShowDMList, setShowDMRoom } from '../../stores/DMStore'
import { HELPER_STATUS, setHelperStatus } from '../../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../../hooks'
import {
  getFriendList,
  getFriendRequestList,
  handleAccept,
  handleReject,
  handleRemove,
  AcceptRequest,
  RejectRequest,
  RemoveRequest,
} from '../../apicalls/friends'

interface friendListInterface {
  username: string
  character: string
}

const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;
`
const Wrapper = styled.div`
  height: 100%;
  margin-top: auto;
`
const Body = styled.div`
  flex: 1;
  height: calc(100% - 76px);
  overflow: auto;
  padding: 10px 0 0 20px;
  display: flex;
  flex-direction: column;
  
  .listitem && {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
  }
`
const ListTitle = styled.div`
  position: relative;
  color: black;
  font-size: 18px;
  font-weight: bold;
  font-family: Font_DungGeun;
  text-align: left;
  padding: 8px 0;
//   background-color: ;
`
const NameWrapper = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const NameProfile = styled.div`
  color: black;
  font-family: Font_DungGeun;
`
const Level = styled.div`
  font-size: 20px;
  line-height: 1;
`
const Username = styled.div`
  font-size: 24px;
  line-height: 1;
  margin: 4px 0 0 0;
`
const ProfileButton = styled.div`
  margin-left: auto;  
  display: flex;
  flex-direction: row;
  Button {
    color: black;
  }
`

export default function FriendDialog() {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const username = useAppSelector((state) => state.user.username)
  const helperStatus = useAppSelector((state) => state.user.helperStatus)
  const [friendList, setFriendList] = useState<friendListInterface[]>([])
  const [friendRequestList, setFriendRequestList] = useState<friendListInterface[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, helperStatus])

  useEffect(() => {
    ;(async () => {
      getFriendList()
        .then((response) => {
          if (!response) return
          const { friendsListForDisplay } = response
          setFriendList(friendsListForDisplay)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      getFriendRequestList()
        .then((response) => {
          if (!response) return
          const { findReceivedRequests } = response
          setFriendRequestList(findReceivedRequests)
        })
        .catch((error) => {
          console.error(error)
        })
    })()
  }, [])

  const receiveAccept = (requester: string, recipient: string) => {
    const body: AcceptRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleAccept(body)
      .then((response) => {
        if (!response) return
        // dispatch(setShowFriend(false))
        dispatch(setHelperStatus(HELPER_STATUS.NONE))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          console.log('message: ' + message)
        }
      })
  }

  const receiveReject = (requester: string, recipient: string) => {
    const body: RejectRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleReject(body)
      .then((response) => {
        if (!response) return
        // dispatch(setShowFriend(false))
        dispatch(setHelperStatus(HELPER_STATUS.NONE))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          console.log('message: ' + message)
        }
      })
  }

  const removeFriendList = (requester: string, recipient: string) => {
    const body: RemoveRequest = {
      requester: requester,
      recipient: recipient,
    }
    handleRemove(body)
      .then((response) => {
        if (!response) return
        // dispatch(setShowFriend(false))
        dispatch(setHelperStatus(HELPER_STATUS.NONE))
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
          console.log('message: ' + message)
        }
      })
  }

  return (
    <Backdrop>
      <Wrapper>
        <Content>
          <Header>
            <HeaderTitle>친구들</HeaderTitle>
            <IconButton
              aria-label="close dialog"
              className="close"
              onClick={() => dispatch(setHelperStatus(HELPER_STATUS.NONE))}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Header>
          <Body>
            {friendRequestList.length > 0 && (
              <ListTitle>!! 친구 요청 !!</ListTitle>
            )}
            {friendRequestList.map((value, index) => (
              <ListItem divider key={index} style={{ padding: '16px'}}>
                <NameWrapper>
                  <ListItemAvatar>
                    <Avatar
                      src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
                    />
                  </ListItemAvatar>
                  <NameProfile>
                    {/* <Level>Lv. {userLevel}</Level> */}
                    <Username>{value.username}</Username>
                  </NameProfile>
                </NameWrapper>
                <ProfileButton>
                  <Button
                    onClick={() => receiveReject(value.username, username)}
                    color="primary"
                  >
                    친구 싫어
                  </Button>
                  <Button
                    onClick={() => receiveAccept(value.username, username)}
                    color="primary"
                  >
                    친구 좋아
                  </Button>
                </ProfileButton>
              </ListItem>
            ))}
            {friendList.length > 0 && (
              <ListTitle>내 친구들</ListTitle>
            )}
            {friendList.map((value, index) => (
              <ListItem divider key={index} style={{ padding: '16px'}}>
                <NameWrapper>
                  <ListItemAvatar>
                    <Avatar
                      src={`../../public/assets/character/single/${value.character}_idle_anim_19.png`}
                    />
                  </ListItemAvatar>
                  <NameProfile>
                    {/* <Level>Lv. {userLevel}</Level> */}
                    <Username>{value.username}</Username>
                  </NameProfile>
                </NameWrapper>
                <ProfileButton>
                  <Button onClick={() => removeFriendList(value.username, username)}>
                    <PersonRemoveOutlined fontSize='large' style={{ color: 'gray'}} />
                  </Button>
                  <Button
                    onClick={() => {
                      // dispatch(setShowDMRoom(true));
                      dispatch(setShowDMList(true))
                      dispatch(setHelperStatus(HELPER_STATUS.NONE))
                    }}
                  >
                    <MailOutlineRounded fontSize='large' />
                  </Button>
                </ProfileButton>
              </ListItem>
            ))}
          </Body>
        </Content>
      </Wrapper>
    </Backdrop>
  )
}
