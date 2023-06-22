import { Schema, ArraySchema, SetSchema, MapSchema, type } from '@colyseus/schema'
import {
  IPlayer,
  IOfficeState,
  IComputer,
  IWhiteboard,
  IMoleGame,
  IChatMessage,
} from '../../../types/IOfficeState'

export class Player extends Schema implements IPlayer {
  @type('string') name = ''
  @type('number') x = 705
  @type('number') y = 500
  @type('string') anim = 'adam_idle_down'
  @type('boolean') readyToConnect = false
  @type('boolean') videoConnected = false
}

export class Computer extends Schema implements IComputer {
  @type('string') roomId = getcomputerRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class Whiteboard extends Schema implements IWhiteboard {
  @type('string') roomId = getwhiteboardRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class MoleGame extends Schema implements IMoleGame {
  @type('string') roomId = getmolegameRoomId()
  @type({ set: 'string' }) connectedUser = new SetSchema<string>()
}

export class ChatMessage extends Schema implements IChatMessage {
  @type('string') author = ''
  @type('number') createdAt = new Date().getTime()
  @type('string') content = ''
}

export class OfficeState extends Schema implements IOfficeState {
  @type({ map: Player })
  players = new MapSchema<Player>()

  @type({ map: Computer })
  computers = new MapSchema<Computer>()

  @type({ map: Whiteboard })
  whiteboards = new MapSchema<Whiteboard>()

  @type({ map: MoleGame })
  molegames = new MapSchema<MoleGame>()

  @type([ChatMessage])
  chatMessages = new ArraySchema<ChatMessage>()
}

export const whiteboardRoomIds = new Set<string>()
export const computerRoomIds = new Set<string>()
export const molegameRoomIds = new Set<string>()
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const charactersLength = characters.length

function getwhiteboardRoomId() {
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  if (!whiteboardRoomIds.has(result)) {
    whiteboardRoomIds.add(result)
    return result
  } else {
    console.log('roomId exists, remaking another one.')
    getwhiteboardRoomId()
  }
}
function getmolegameRoomId() {
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  if (!molegameRoomIds.has(result)) {
    molegameRoomIds.add(result)
    return result
  } else {
    console.log('roomId exists, remaking another one.')
    getmolegameRoomId()
  }
}
function getcomputerRoomId() {
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  if (!computerRoomIds.has(result)) {
    computerRoomIds.add(result)
    return result
  } else {
    console.log('roomId exists, remaking another one.')
    getcomputerRoomId()
  }
}
