require('dotenv').config();
const { Telegraf, Markup } = require("telegraf");
const TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://7655-121-52-154-154.ngrok-free.app";
const community_link = "https://t.me/rockipointannouncement";


bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = `${web_link}?start=${startPayload}`;
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;
  ctx.replyWithMarkdown(`*Hey, Welcome to My Bot! Contact the Developer of this bot web app @chris_lev11 for your own projects today*
Tap on the coin and see token rise.
      
*THIS BOT Bot* is a Decentralized Exchange on the TON Blockchain. The biggest part of bot TOKEN distribution will occur among the players here.
      
Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "👋 Start now!", web_app: { url: urlSent } }],
        [{ text: "Join our Community", url: community_link }]

      ],
      in: true
    },
  });
});



bot.launch();

app.listen(3005, () => {
  console.log("server is me and now running")
})