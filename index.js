const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5620170411:AAFfC02xeEF3I0qNJpRC2AX4l1PlsR9ulUM'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейсас я загадаю чило от 0 до 9, а ты должен его угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}


const start = async () => {

    bot.setMyCommands( [
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра - угадай число!'}
    ])

    bot.on( 'message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/2e0/d98/2e0d98ad-7d65-4f0b-93f0-1c1d6f865938/3.webp')
            return bot.sendMessage(chatId, `Добро пожаловать на канал пожилой бебры`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, Твой ник ${msg.from.username}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Ты это мне? Не понял  (О-о)')
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if(data === chats[chatId]) {
            return startGame(chatId);
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }

    })
}
start()