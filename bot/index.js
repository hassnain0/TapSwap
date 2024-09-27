require('dotenv').config();
const { Telegraf, Markup } = require("telegraf");
const TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://luxury-mooncake-6cc3f2.netlify.app/";
const community_link = "https://t.me/Kryptoblockchain";


bot.start((ctx) => {
  const startPayload = ctx.startPayload;
  const urlSent = `${web_link}?start=${startPayload}`;
  const user = ctx.message.from;
  const userName = user.username ? `@${user.username}` : user.first_name;
  ctx.replyWithMarkdown(`*Hey ${userName}, Welcome to Krypto!! Tap into the future of finance! Participate in challenges and watch your token balance soar!*
Tap on the coin and see tokens rise!.
      
*Krypto* is a revolutionary decentralized finance platform where users can earn rewards by leveraging our innovative features. The majority of Krypto token distribution will occur among our active community members.
      
Got friends, family, or colleagues? Invite them to join the fun! More friends, more KRYPTO tokens.?
Share the excitement and start building your financial future today!.`, {
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