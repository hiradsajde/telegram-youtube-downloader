import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { useFluent } from "@grammyjs/fluent";
import { bot } from './lib/bot';
import { limit } from "@grammyjs/ratelimiter";
import { Fluent } from "@moebius/fluent";
import { webhookCallback } from "grammy";
import ytdlp from "./../queue/ytdlp";
import express from 'express'
import quality from './lib/quality';
import path from 'path'

dotenv.config()

const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
})

db.$on('warn', (e) => {
  console.log(e)
})

db.$on('info', (e) => {
  console.log(e)
})

db.$on('error', (e) => {
  console.log(e)
})

export const fluent = new Fluent();

const server = express()
server.use(express.json())
server.use(express.static(path.resolve(__dirname, "./../public")))
server.post(`/bot${process.env.BOT_TOKEN}`, webhookCallback(bot, 'express'))
server.get('', (req, res) => res.json({ status: "Not Found" }))

server.listen(process.env.SERVER_PORT, () => { ytdlp.drain() })
bot.api.setWebhook(`${process.env.DOMAIN_NAME}/bot${process.env.BOT_TOKEN}`)

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
  bot.use(limit());
  bot.on("callback_query:data", async (ctx: any) => {
    const message_id = ctx.update.callback_query.message.message_id
    const bot_id = ctx.update.callback_query.message.from.id
    const callback_query = ctx.update.callback_query.data
    const [action, video_id, format_id, quality, ext, duration] = callback_query;
    const user_id = ctx.update.callback_query.from.id;
    const caption = ctx.update.callback_query.message.caption;
    const thumbnail = (await bot.api.getFile(ctx.update.callback_query.message.photo.pop().file_id)).file_path;
    await db.request.create({ data: { user_id : user_id, video_id : String(video_id) } })
    ytdlp.add(callback_query, {
      callback_query,
      bot_id,
      user_id,
      message_id,
      caption,
      thumbnail,
    }, { removeOnComplete: true, removeOnFail: true })
  })
  bot.chatType("private").command("start", async (ctx: any) => {
    const infoUpdate = await db.user.upsert({
      where: {
        user_id: ctx.msg.chat.id
      },
      update: {
        last_msg: new Date(),
      },
      create: {
        user_id: ctx.msg.chat.id,
        last_msg: new Date(),
        created_at: new Date()
      }
    })
    ctx.reply(ctx.t("WELCOME"))
  })
  bot.on("message:text", (ctx: any) => quality(db, ctx));
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