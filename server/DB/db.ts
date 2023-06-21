import { config } from '../envconfig'
import User from '../models/User'
import Friends from '../models/Friends'
import FriendRequest from '../models/FriendRequest'
// import Chat from '../models/Chat'
// import LastChat from '../models/LastChat'

const mongoose = require('mongoose')

export async function connectDB() {
  mongoose.set('strictQuery', false);
  mongoose.connect(config.db.host, {
    dbName: 'mosmos',
    useNewUrlParser: true,
  })

  createCollection('user')
  createCollection('friends')
  createCollection('friendrequest')
  // createCollection('chat')
  // createCollection('lastchat')
}

export const createCollection = (modelName : string) => {
  if (mongoose.modelNames().includes(modelName)) {
    return mongoose.model(modelName)
  }

  switch (modelName) {
    case 'user':
      new User()
      break
    case 'friends':
      new Friends()
      break
    case 'friendrequest':
      new FriendRequest()
      break
    // case 'chat':
    //   new Chat()
    //   break
    // case 'lastchat':
    //   new LastChat()
    //   break
  }
}
