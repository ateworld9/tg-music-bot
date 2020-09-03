import Telegraf from 'telegraf';
import './misc/env.js';
import SceneGenerator from './scenes.js';

const logger = console;

const bot = new Telegraf(process.env.BOT_TOKEN);

const {
  Extra,
  Markup,
  Stage,
  session,
} = Telegraf;

const curScene = new SceneGenerator();

const artistS = curScene.genArtistScene();
const songS = curScene.genSongScene();

const stage = new Stage([artistS, songS]);

bot.use(session());
bot.use(stage.middleware());

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.log('Response time: %sms', ms);
});

bot.start((ctx) => ctx.reply('Welcome'));

bot.hears('hi', (ctx) => {
  ctx.reply('Hey there ');
});
bot.command('echo', (ctx) => ctx.reply('Echo'));
bot.command('getlyrics', async (ctx) => {
  ctx.scene.enter('artistS');
});

bot.on('text', async (ctx) => {
  // const song = ctx.message.text;
  // const response = await axios.get(`https://api.lyrics.ovh/v1/${song}`)
  // Explicit usage
  // ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
  // Using context shortcut
  ctx.reply(`${ctx.message.text}`);
});
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.launch();
