import express from 'express';
import './misc/env.js';
import Telegraf from 'telegraf';
import axios from 'axios';

const logger = console;
const app = express();

app.use(express.static('public'));
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.log('Response time: %sms', ms);
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => {
  ctx.reply('Hey there ');
});
bot.on('text', async (ctx) => {
  console.log(ctx.message.text);
  const song = ctx.message.text;
  const response = await axios.get(`https://api.lyrics.ovh/v1/${song}`);
  // Explicit usage
  // ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

  // Using context shortcut
  ctx.reply(`${response.data.lyrics}`);
});
bot.launch();

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  logger.log('Сервер запущен. Порт:', port);
});
