SETUP:

BOT.

Step 1: Create a new Telegram Bot and get the bot token and add it to the api server.
https://t.me/BotFather
copy .env.example to .env.example

Go to the file bot/index.js and change the web link and community link
const web_link = "https://tap-swap-mini-app.vercel.app/";
const community_link = "https://t.me/web3hub_mkt"; 


Step 2: Create a Firestore Database on Firebase and add it to adminsdk-firebase.json https://console.firebase.google.com/

Run: npm run dev

Mini app client .

copy file .env.example to .env

Run dev : npm run start

Build and deploy:

Deploy vercel or any hosting
