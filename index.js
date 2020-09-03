import Telegraf from 'telegraf';
import './misc/env.js';
import axios from 'axios';
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

bot.start((ctx) => ctx.reply('Welcome \n try /getlyrics'));

bot.hears('hi', (ctx) => {
  ctx.reply('Hey there \n try /getlyrics');
});

bot.command('echo', (ctx) => ctx.reply('Echo'));
bot.command('getlyrics', async (ctx) => {
  ctx.scene.enter('artistS');
});

bot.on('voice', async (ctx) => {
  const fileLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
  const response1 = await axios.get(`https://api.audd.io/?url=${fileLink}&return=apple_music,spotify&api_token=${process.env.AUD_TOKEN}`);
  console.log(response1);
  logger.log(response1.data.result.apple_music);
  await ctx.reply(response1.data.result.artist);
  await ctx.reply(response1.data.result.title);
  await ctx.replyWithAudio(response1.data.result.apple_music?.previews[0]?.url);

  // const data = {
  //   url: 'https://audd.tech/example1.mp3',
  //   return: 'apple_music,spotify',
  //   api_token: 'test',
  // };

  // request({
  //   uri: 'https://api.audd.io/',
  //   form: data,
  //   method: 'POST',
  // }, (err, res, body) => {
  //   console.log(body);
  // });

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
