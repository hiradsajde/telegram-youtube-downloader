import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { FluentContextFlavor , useFluent} from "@grammyjs/fluent";
import { Fluent } from "@moebius/fluent";
import { Bot , Context} from "grammy";
import express from 'express';
import ytdl from 'ytdl-core';
import tg from './lib/tg';

dotenv.config() 
const fluent = new Fluent(); 
export type MyAppContext = Context & FluentContextFlavor;

const db = new PrismaClient() 
const bot_token = String(process.env.BOT_TOKEN)
const bot = new Bot<MyAppContext>(bot_token);



async function main() {
  // telegram bot configurations...
  await fluent.addTranslation({
    // Specify one or more locales supported by your translation:
    locales: "en",
    
    // translation files:
    filePath: [
      `${__dirname}/locals/en.ftl`,
    ],
  
    // All the aspects of Fluent are highly configurable:
    bundleOptions: {
      // Use this option to avoid invisible characters around placeables.
      useIsolating: false, 
    },
  });  
  bot.use( 
    useFluent({
      fluent,
    }), 
  );  
  bot.on("message", (ctx : any) => tg(db , ctx)); 
  bot.start();
  // youtube-dl api configuration
  const server = express()
  server.get('/' , async(req : any , res : any) => {
    const info = await ytdl.getInfo(req.query.url)
    return res.json(info)
  })
  server.listen(process.env.API_PORT)
}

main() 
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  }) 