/* eslint-disable class-methods-use-this */
import Scene from 'telegraf/scenes/base.js';
import axios from 'axios';

class SeceneGenerator {
  genArtistScene() {
    const artistS = new Scene('artistS');
    artistS.enter(async (ctx) => {
      await ctx.reply('Hi! Here you can find lyrics of any song! \n\n Enter the artist!');
    });
    artistS.on('text', async (ctx) => {
      ctx.session.artist = ctx.message.text;
      await ctx.reply(`Entered artist is ${ctx.session.artist}`);
      ctx.scene.enter('songS');
    });
    artistS.on('message', (ctx) => {
      ctx.reply('Please! Enter artist name!');
    });
    return artistS;
  }

  genSongScene() {
    const songS = new Scene('songS');
    songS.enter(async (ctx) => {
      await ctx.reply('Enter the song!');
    });
    songS.command('home', (ctx) => {
      ctx.scene.leave();
    });
    songS.on('text', async (ctx) => {
      ctx.session.song = ctx.message.text;
      await ctx.reply(`Entered song is ${ctx.session.artist} : ${ctx.session.song}`);
      const response = await axios.get(`https://api.lyrics.ovh/v1/${ctx.session.artist}/${ctx.session.song}`);
      ctx.reply(`${response.data.lyrics}`);
    });
    songS.on('message', (ctx) => {
      ctx.reply('Please! Enter song!');
    });
    return songS;
  }
}

export default SeceneGenerator;
