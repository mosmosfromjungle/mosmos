/*
  Icon: mui 라이브러리 사용 (https://mui.com/material-ui/material-icons/)
*/
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import CloseIcon from '@mui/icons-material/Close'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { setShowDM, setShowUser } from '../stores/ChatStore'
import { useAppSelector, useAppDispatch } from '../hooks'
import { addFriendReq } from '../../src/apicalls/friend'
import {AddFriendRequestDto} from '../../src/apicalls/friend';
import { IPlayer } from '../../../types/IOfficeState'
import {
  fetchRoomList,
  RoomListResponse,
} from '../../src/apicalls/DM'
import RequestFriendResultModal from './FriendRequest/RequestFriendResultModal';

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

const Content = styled.div`
  margin: 70px auto;
`

const ChatHeader = styled.div`
  position: relative;
  height: 40px;
  background: #000000a7;
  border-radius: 10px 10px 0px 0px;

  .close {
    position: absolute;
    top: 0;
    right: 0;
  }
`

const Title = styled.div`
  position: absolute;
  color: white;
  font-size: 20px;
  font-weight: bold;
  top: 10px;
  left: 150px;
  font-family: Font_DungGeun;
`

const ChatBox = styled(Box)`
  height: 580px;
  width: 360px;
  overflow: auto;
  background: #2c2c2c;
  border: 1px solid #00000029;
  padding: 10px 10px;
  border-radius: 0px 0px 10px 10px;

  Button {
    font-size: 17px;
    font-family: Font_DungGeun;
  }
`

const UserList = styled.div`
  Button {
    width: 100%;
  }
`

const User = styled.div`
  margin: 10px 10px 10px 10px; 
`

const Profile = styled.div`
  color: white;
  width: 120px;
  font-size: 20px;
  font-family: Font_DungGeun;
`

const ProfileButton = styled.div`
  Button {
    width: 150px;
    color: white;
    margin-left: 20px;
    font-size: 15px;
    font-family: Font_DungGeun;
  }
`

// Todo: change the parameter in body part
const getUser = async() => {
  const apiUrl: string = 'http://auth/user/list';
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get user list is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

// Todo: change the parameter in body part
const getUserDetail = async(userId: string) => {
  const apiUrl: string = 'http://auth/user/detail/' + userId;
  await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  }).then(res => {
    if (res.ok) {
      console.log("Get user detail is success.");
    }
    // Todo: need to hanle return codes - 200, 400, 409 ...
  })
};

export default function UserDialog() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatMessages = useAppSelector((state) => state.chat.chatMessages)
  const focused = useAppSelector((state) => state.chat.focused)
  const showUser = useAppSelector((state) => state.chat.showUser)
  
  const userId = useAppSelector((state) => state.user.userId)
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character)
  const userLevel = useAppSelector((state) => state.user.userLevel)
  const [addFriendResult, setAddFriendResult] = useState<number>(0)
  const imgpath = `../../public/assets/character/single/${character}_idle_anim_19.png`
  const players = useAppSelector((state) => state.room.players);
  const [otherPlayers, setOtherPlayers] = useState<IPlayer[]>();
  const [playerNum, setPlayerNum] = useState<number>(0);
  const [rooms, setRooms] = useState<RoomListResponse[]>([]);

  const dispatch = useAppDispatch()
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchRoomList(userId).then((data) => {
      data && setRooms(data);
    });
  }, []);

  useEffect(() => {
    setOtherPlayers(players);
    setPlayerNum(players.length);
  }, [players.length]);
  
  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
    }
  }, [focused])
  
  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, showUser])
  
  const [open, setOpen] = React.useState(true);
  
  const handleClick = () => {
    setOpen(!open);
  };

  async function requestFriend(id: string, name: string) {
    const body:AddFriendRequestDto = {
      myInfo: {
        userId: userId,
        username: username,
      },
      friendInfo: {
        userId: id,
        username: name,
      },
      status: 0,
      message: '친구 요청이 왔습니다',
    };
    try {
      const result = await addFriendReq(body);
      if (result === 1) {
        setAddFriendResult(result!);
      } else if (result === 2) {
        setAddFriendResult(result!);
      } else if (result === 3) {
        setAddFriendResult(result!);
      }
    } catch (error) {
      console.error('error:', error);
    }
  }
  
  return (
    <Backdrop>
        <Wrapper>
          <Content>
            <ChatHeader>
              <Title>
                접속중
              </Title>
              <IconButton
                aria-label="close dialog"
                className="close"
                onClick={() => dispatch(setShowUser(false))}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>
            <ChatBox>
              <ButtonGroup variant="text" aria-label="text button group">
                <Button>Bronze</Button>
                <Button>Silver</Button>
                <Button>Gold</Button>
                <Button>Platinum</Button>
                <Button>Ruby</Button>
              </ButtonGroup>

              {otherPlayers?.map((player, i: number) => {
              return player.userId !== userId ? (<UserList key={i}>
                <User>
                  <ListItem divider>
                    <ListItemAvatar>
                      <Avatar src={imgpath} />
                    </ListItemAvatar>

                    <Profile>
                      레벨 {player.userlevel}<br/><br/>
                      <strong>{player.username}</strong>님
                    </Profile>

                    <ProfileButton>
                      <Button onClick={(event) => {
                        event.preventDefault();
                        requestFriend(
                          player.userId,
                          player.username,
                        )
                        setAddFriendResult(1);
                      }}>
                        친구 추가하기
                      </Button>{addFriendResult === 0 ? null : (
                        <RequestFriendResultModal
                          setAddFriendResult={setAddFriendResult}
                          addFriendResult={addFriendResult}
                          />
                          )}
                      <Button onClick={() => dispatch(setShowDM(true)) }>
                        메세지 보내기
                      </Button>
                    </ProfileButton>
                  </ListItem>
                </User>
              </UserList>): null;
              })}
            </ChatBox>
          </Content>
        </Wrapper>
    </Backdrop>
  )
}
