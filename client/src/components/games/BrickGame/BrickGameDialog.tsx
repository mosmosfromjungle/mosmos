import React, { useState, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from '../../../hooks'
import { closeBrickGameDialog } from '../../../stores/BrickGameStore'
import { DIALOG_STATUS, setDialogStatus } from '../../../stores/UserStore'
import { QUIZ_TYPE } from '../../../../../types/IGameState'

import phaserGame from '../../../PhaserGame'
import Bootstrap from '../../../scenes/Bootstrap'
import Game from '../../../scenes/Game'

import img1 from '/assets/game/brickGame/52-2.png'
import img2 from '/assets/game/brickGame/25-2.png'
import img3 from '/assets/game/brickGame/37-2.png'
import img4 from '/assets/game/brickGame/51-2.png'
import img5 from '/assets/game/brickGame/50-2.png'
import img6 from '/assets/game/brickGame/39-2.png'

import ball from '/assets/game/brickGame/ball.png'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { updateLevel, UpdateLevelReqest } from '../../../apicalls/auth'
import ExperienceResultModal from '../../ExperienceResultModal'

import { 
  GlobalStyle, Backdrop, Wrapper, BottomWrapper, 
  RoundWrapper, MidWrapper, HelperWrapper, QuizWrapper, OpponentWrapper, ScoreWrapper, MyWrapper, 
  OppInfo, MyInfo,
  ImageContainer, ImageText, MyBracket, CustomInput, OptionWrapper,
  CustomButton, CustomResetButton, CustomList, CommandArrayWrapper, OppBracket, OppOption, ImageArrayWrapper, 
  Answer, Left, Right, 
  CharacterArea, NameArea, Special, 
} from './BrickGameStyle'

import './BrickGame.css'

const WRONG_OPERATION = '해당 자료구조에서 사용되지 않는 연산입니다!'
const COMMON_MESSAGE = (
  <>
    {/* <span style={{ fontSize: '22px' }}>두 캐릭터를 더하려면 </span>
    <span style={{ fontSize: '30px' }}>'sum' </span> */}

    <span style={{ fontSize: '22px' }}>처음으로 돌리려면 </span>
    <span style={{ fontSize: '30px', color: 'yellow' }}>'reset' </span>

    <span style={{ fontSize: '22px' }}>| 제출하려면 </span>
    <span style={{ fontSize: '30px', color: 'yellow' }}>'submit' </span>

    <span style={{ fontSize: '22px' }}>입력</span>
  </>
)

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function BrickGameDialog() {
  const dispatch = useAppDispatch()
  const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

  // My information
  const username = useAppSelector((state) => state.user.username)
  const character = useAppSelector((state) => state.user.character);
  const myImgpath = `/assets/character/single/${capitalizeFirstLetter(character)}.png`;
  const myPoint = useAppSelector((state) => state.brickgame.myPlayerScore.totalPoint)
  const myLife = useAppSelector((state) => state.brickgame.myPlayerScore.chance)
  const myCurrentImages = useAppSelector((state) => state.brickgame.myPlayerStatus.currentImages)
  const mySelectedOption = useAppSelector((state) => state.brickgame.myPlayerStatus.selectedOption)
  const myCommandArray = useAppSelector((state) => state.brickgame.myPlayerStatus.commandArray)
  const gameMessage = useAppSelector((state) => state.brickgame.gameMessage)

  // Friend information
  const oppUsername = useAppSelector((state) => state.brickgame.oppUsername)
  const oppCharacter = useAppSelector((state) => state.brickgame.oppCharacter)
  const oppImgpath = `/assets/character/single/${capitalizeFirstLetter(oppCharacter)}.png`
  const oppPoint = useAppSelector((state) => state.brickgame.oppPlayerScore.totalPoint)
  const oppLife = useAppSelector((state) => state.brickgame.oppPlayerScore.chance)
  const oppCurrentImages = useAppSelector((state) => state.brickgame.oppPlayerStatus.currentImages)
  const oppSelectedOption = useAppSelector((state) => state.brickgame.oppPlayerStatus.selectedOption)
  const oppCommandArray = useAppSelector((state) => state.brickgame.oppPlayerStatus.commandArray)

  // Game state
  const problemType  = useAppSelector((state) => state.brickgame.brickGameState.problemType)
  const round  = useAppSelector((state) => state.brickgame.brickGameState.currentRound)
  const hasRoundWinner = useAppSelector((state) => state.brickgame.brickGameState.hasRoundWinner)
  const roundWinner = useAppSelector((state) => state.brickgame.brickGameState.roundWinner)
  const [problem, setProblem] = useState<string>('')
  const [number, setNumber] = useState<number>(0)
  const [showProblem, setShowProblem] = useState<boolean>(false)

  // 라운드 승자 표시
  const [winnerModalOpen, setWinnerModalOpen] = useState<boolean>(false)
  useEffect(() => {
    if (roundWinner === '') {
      setWinnerModalOpen(false)
    } else {
      setWinnerModalOpen(true)
      setTimeout(() => {
        setWinnerModalOpen(false)
      }, 2000)
    }
  }, [roundWinner])

  // 문제 출제
  useEffect(() => {
    if (problemType === QUIZ_TYPE.NONE) {
      setShowProblem(false)
    } else if (problemType === QUIZ_TYPE.SAME2) {
      setShowProblem(true)
      setProblem('같은 동물')
      setNumber(2)
    } else if (problemType === QUIZ_TYPE.SAME3) {
      setShowProblem(true)
      setProblem('같은 동물 ')
      setNumber(3)
    } else if (problemType === QUIZ_TYPE.DIFF3) {
      setShowProblem(true)
      setProblem('서로 다른 동물')
      setNumber(3)
    }
  }, [problemType])

  // 이미지 배열 배치
  const imgsrc = [img1, img2, img3, img4, img5, img6]
  const [myImages, setMyImages] = useState<{ src: any; text: string }[]>([])
  const [oppImages, setOppImages] = useState<{ src: any; text: string }[]>([])
  const [command, setCommand] = useState('')

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const openModal = () => {
    setTimeout(() => {
      setIsModalOpen(true)
    }, 200)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    handleClose();
  }

  // 경험치 보내주기
  const gainExpUpdateLevel = (username: string, exp: number) => {
    const body: UpdateLevelReqest = {
      username: username,
      exp: exp,
    }
    updateLevel(body)
      .then((response) => {
        if (!response) return
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data
        }
      })
  }

  // useEffect(() => {
  //   if (winner == username) {
  //     gainExpUpdateLevel(username, 7)
  //   } else if (winner == friendname) {
  //     gainExpUpdateLevel(username, 3)
  //   }
  //   if (winner) {
  //     openModal()
  //   }
  // }, [winner])

  useEffect(() => {
    setMyImages(myCurrentImages.map((value, index) => ({
      src: imgsrc[value.imgidx - 1],
      text: value.text
    })))
  }, [myCurrentImages])

  useEffect(() => {
    setOppImages(oppCurrentImages.map((value, index) => ({
      src: imgsrc[value.imgidx - 1],
      text: value.text
    })));
  }, [oppCurrentImages]);

  const handleClose = () => {
    try {
      const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
      bootstrap.gameNetwork.leaveGameRoom()
      dispatch(closeBrickGameDialog())
      dispatch(setDialogStatus(DIALOG_STATUS.IN_MAIN))
    } catch (error) {
      console.error('Error leaving the room:', error)
    }
  }

  const handleOptionClick = (option) => {
    bootstrap.gameNetwork.brickGameCommand(option)
  }

  const handleEnter = () => {
    bootstrap.gameNetwork.brickGameCommand(command);
    setCommand('');
  }

  const handleSubmit = () => {
    bootstrap.gameNetwork.brickGameCommand('submit');
    setCommand('');

    // 여기에 임시로 경험치 모달 열리게 해둠, 이후 구현 시 아래 두줄 주석 처리 필.
    gainExpUpdateLevel(username, 7);
    setIsModalOpen(true);
  }

  let oppLifeElements = [];
  let myLifeElements = [];

  for (let i = 0; i < oppLife; i++) {
    oppLifeElements.push(
      <img key={ i } src={ ball } width="45px"></img>
    );
  }

  for (let i = 0; i < myLife; i++) {
    myLifeElements.push(
      <img key={ i } src={ ball } width="45px"></img>
    );
  }

  const startBrickGame = () => {
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap
    bootstrap.gameNetwork.startRainGame()
  }
  
  const roundWinnerModal = (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#222639',
          borderRadius: '24px',
          boxShadow: '0px, 10px, 24px, #0000006f',
          padding: '50px',
          zIndex: 1000,
          fontSize: '15px',
          color: '#eee',
          textAlign: 'center',
          fontFamily: 'Font_DungGeun',
        }}
      >
        <h2>{roundWinner}</h2>
      </div>
    )

  return (
    <>
     <GlobalStyle />
      <Backdrop>
        {winnerModalOpen && roundWinnerModal}
        <Wrapper>
          <IconButton
            aria-label="close dialog"
            className="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          {isModalOpen && (
            <ExperienceResultModal open={isModalOpen} handleClose={closeModal} />
          )}

          <RoundWrapper>
            <div style={{ flex: 1, fontSize: '24px' }} className={`${oppUsername ? '' : 'start-game'}`}>
              {oppUsername ? '친구가 들어왔어요,' : '친구가 아직 들어오지 않았어요 !'}
              <br />
              {oppUsername ? '방장은 Start 버튼을 눌러주세요 !' : '친구가 들어와야 게임이 시작돼요.'}
            </div>
            <div className="title" style={{ flex: 'auto', textAlign: 'center', fontSize: '40px' }}>
              자료구조 게임<br/>
              <div className="title" style={{ flex: 'auto', textAlign: 'center', fontSize: '25px' }}>
                문제에 맞는 적절한 자료구조와 명령어를 입력하여 포켓몬들을 구출해주세요 !
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <Button 
                fullWidth
                onClick={() => startBrickGame()}
                style={{ 
                  fontSize: '20px', fontFamily: 'CustomFont', 
                  borderRadius: '20px', backgroundColor: 'yellow',
                  width: '160px', right: '70px'
              }}
              >
                게임 시작
              </Button>
              ROUND {round}/5
            </div>
          </RoundWrapper>

          <MidWrapper>
            <HelperWrapper>
              💡 TIP: 문제에 <Special>알맞은 자료구조</Special>를 선택하여 <Special>추가 점수</Special>를 얻어보세요!
              <br />
              <div style={{ fontSize: '24px ', textAlign: 'left', marginTop: '10px' }}>
                <Special>List</Special> : remove(숫자)<br />
                <Special>Set</Special> : remove(숫자) + 중복 제거<br />
                <Special>Stack</Special> : pop<br />
                <Special>Queue</Special> : dequeue<br />
                <Special>Deque</Special> : pop, popleft<br />
              </div>
            </HelperWrapper>

            <QuizWrapper>
              <div style={{ fontSize: '40px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '32px', margin: '20px' }}>
                  {oppUsername ? (
                    showProblem && (
                      <span>
                        {problem} <span style={{ fontSize: '36px', color: 'yellow' }}> {number} </span> 마리만 남겨주세요!
                      </span>
                    )
                  ) : (
                    '친구가 들어오면 여기에 문제가 보일거예요!'
                  )}
                  {oppUsername && (
                    <OppOption>
                      {COMMON_MESSAGE}
                    </OppOption>
                  )}
                </span>
              </div>
              {/* <ImageArrayWrapper>
                <MyBracket>&#91;</MyBracket>
                {myImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '100px', height: '100px' }}
                    />
                    <ImageText>{image.text}</ImageText>
                  </ImageContainer>
                ))}
                <MyBracket>&#93;</MyBracket>
              </ImageArrayWrapper> */}
            </QuizWrapper>
          </MidWrapper>

          <BottomWrapper>
            <OpponentWrapper>
              <ScoreWrapper>
                <div style={{ flex: 1, color: 'white', fontSize: '20px', lineHeight: '1.5' }}>
                  <OppInfo>
                    <CharacterArea>
                      <img src={ oppImgpath } width="50px" id="friend-character" className={oppUsername ? '' : 'hidden'}></img>
                    </CharacterArea>
                    <NameArea>
                      친구 <br/>
                      [{ oppUsername ? `${ oppUsername.toUpperCase() }` : ''}]
                    </NameArea>
                  </OppInfo>
                </div>
                <div style={{ flex: 1, color: 'white', fontSize: '30px', textAlign: 'right' }}>
                    { oppLifeElements }
                    <br/>
                    { oppPoint } Point <br/>
                </div>
              </ScoreWrapper>

              { oppUsername ? (
              <ImageArrayWrapper>
                {/* <OppBracket>&#91;</OppBracket> */}
                {oppImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '80px', height: '80px' }}
                    />
                    {/* <ImageText>{image.text}</ImageText> */}
                  </ImageContainer>
                ))}
                {/* <OppBracket>&#93;</OppBracket> */}
              </ImageArrayWrapper>
              ) : ''}

              { oppUsername ? (
              <OptionWrapper>
                {oppSelectedOption === 'list' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>List</span> - 
                    remove(숫자)<br />
                  </CustomList>
                ) : oppSelectedOption === 'set' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span> - 
                    remove(숫자), discard(숫자)<br />
                  </CustomList>
                ) : oppSelectedOption === 'stack' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span> - 
                    pop<br />
                  </CustomList>
                ) : oppSelectedOption === 'queue' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span> - 
                    dequeue<br />
                  </CustomList>
                ) : oppSelectedOption === 'deque' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span> - 
                    pop, popleft<br />
                  </CustomList>
                ) : (
                  <OppOption>
                    LIST SET STACK QUEUE DEQUE
                  </OppOption>
                )}
              </OptionWrapper>
              ) : ''}
              
              { oppUsername ? (
              <CommandArrayWrapper>
                {oppCommandArray}
              </CommandArrayWrapper>
              ) : ''}
            </OpponentWrapper>

            <MyWrapper>
              <ScoreWrapper>
                <div style={{ flex: 1, color: 'white', fontSize: '40px', lineHeight: '1.5' }}>
                  <MyInfo>
                    <CharacterArea>
                      <img src={ myImgpath } width="40px" id="my-character"></img>
                    </CharacterArea>
                    <NameArea>
                      나 <br/>
                      [{ username.toUpperCase() }]
                    </NameArea>
                </MyInfo>
                </div>
                <div style={{ color: 'white' }}>{gameMessage}</div>
                <div style={{ flex: 1, color: 'white', fontSize: '25px', textAlign: 'right', lineHeight: '1.5' }}>
                    { myLifeElements }
                    <br/>
                    { myPoint } Point <br/>
                </div>
              </ScoreWrapper>

              { oppUsername ? (
              <ImageArrayWrapper>
                {/* <MyBracket>&#91;</MyBracket> */}
                {myImages.map((image, index) => (
                  <ImageContainer key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index + 1}`}
                      style={{ width: '80px', height: '80px' }}
                    />
                    <ImageText>{image.text}</ImageText>
                  </ImageContainer>
                ))}
                {/* <MyBracket>&#93;</MyBracket> */}
              </ImageArrayWrapper>
              ) : ''}

              { oppUsername ? (
              <OptionWrapper>
                {mySelectedOption === 'list' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>List</span> - 
                    remove(숫자)<br />
                  </CustomList>
                ) : mySelectedOption === 'set' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Set</span> - 
                    remove(숫자), discard(숫자)<br />
                  </CustomList>
                ) : mySelectedOption === 'stack' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Stack</span> - 
                    pop<br />
                  </CustomList>
                ) : mySelectedOption === 'queue' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Queue</span> - 
                    dequeue<br />
                  </CustomList>
                ) : mySelectedOption === 'deque' ? (
                  <CustomList>
                    <span style={{ fontSize: '32px', color: 'yellow' }}>Deque</span> - 
                    pop, popleft<br />
                  </CustomList>
                ) : (
                  <div>
                    <CustomButton onClick={() => handleOptionClick('list')}>LIST</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('set')}>SET</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('stack')}>STACK</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('queue')}>QUEUE</CustomButton>
                    <CustomButton onClick={() => handleOptionClick('deque')}>DEQUE</CustomButton>
                  </div>
                )}
              </OptionWrapper>
              ) : ''}

              { oppUsername ? (
              <CommandArrayWrapper>
                {myCommandArray}
              </CommandArrayWrapper>
              ) : ''}

              {/* <CustomInput
                type="text"
                // value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={handleKeyDown} // 키 다운 이벤트 핸들러 추가
                style={{ margin: '10px' }}
              /> */}
              
              { oppUsername ? (
              <div style={{ color: 'white', textAlign: 'right', padding: '10px' }}>
                잘못 제출하면 목숨이 줄어들어요!
              </div>
              ) : ''}
              <Answer>
                { oppUsername ? (
                <Left>
                  <TextField
                    label="명령어 입력 후 엔터"
                    variant="outlined"
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleEnter();
                      }
                    }}
                    fullWidth
                    InputProps={{
                      autoComplete: 'off',
                      // 친구가 들어오기 전에는 입력할 수 없도록
                      readOnly: oppUsername === '',
                      style: { fontSize: '20px', height: '50px' },
                    }}
                  />
                </Left>
                ) : ''}
                { oppUsername ? (
                <Right>
                  <Button 
                      fullWidth
                      onClick={() => handleSubmit()}
                      style={{ height: '50px' }}>
                    제출
                  </Button>
                </Right>
                ) : ''}
              </Answer>
            </MyWrapper>
          </BottomWrapper>
        </Wrapper>
      </Backdrop>
    </>
  )
}