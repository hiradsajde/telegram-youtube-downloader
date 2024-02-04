import { Worker } from 'bullmq';
import { spawn , execSync} from 'child_process';
import path from 'path';
import { InputFile , Bot} from 'grammy';
import { autoRetry } from "@grammyjs/auto-retry";
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config()

const bot = new Bot(String(process.env.BOT_TOKEN) ,  {
  client: {
      apiRoot: 'http://127.0.0.1:8081',
  },
});
bot.api.config.use(autoRetry({
  maxRetryAttempts: 3, // only repeat requests once
  maxDelaySeconds: 5, // fail immediately if we have to wait >5 seconds
}));

const worker = new Worker('ytdlp', async job => {
  const title = job.data.caption.split('\n')[0];
  const callback_data = job.data.callback_query.split('___');
  const [action , video_id , format_id , quality , ext , duration] = callback_data;
  const name = `${video_id}_${format_id}` 
  const spawn_yt_dlp = spawn('yt-dlp', ext == 'mp4' ? ['--proxy',process.env.PROXY,'-f',format_id+'[ext=mp4]+bestaudio[ext=m4a]','-o' , path.join(__dirname,`./../public/${name}`), video_id] : ['--proxy',process.env.PROXY,'-f',format_id,'-o' , path.join(__dirname,`./../public/${name}`), video_id]);
  let timer = Date.now()
  spawn_yt_dlp.stdout.on('data', async(data) => {
    const report = data;
    if(report.includes('Deleting original file') == false && (timer + 1000) < Date.now()){
      try {
        await bot.api.editMessageCaption(job.data.user_id , job.data.message_id , {
          caption : `<b>${title}</b>\n\n${report}` ,
          parse_mode : "HTML"
        })
      } catch(e) {
          console.log(e)
      }
      timer = Date.now()
    }
  });
  spawn_yt_dlp.on('close', async(code) => {
    await bot.api.sendChatAction(job.data.user_id , ext == "mp4" ? "record_video" : "record_voice")
    const file_path = execSync(`find  ${path.join(__dirname,'./../public')} -name "${name}*"`).toString().trim()
    const file_data : any = {
      media : new InputFile({url : `https://${process.env.DOMAIN_NAME}/${file_path.split('/').pop()}`}),
      caption : `<b>${title}</b>\n📺 Quality : ${quality}\n🌐 Source : youtu.be/${video_id}`,
      parse_mode : 'HTML',
      duration : duration
    }
    if(ext == 'mp4') {
      file_data.type = 'video'
      file_data.thumbnail = new InputFile(job.data.thumbnail);
      file_data.supports_streaming = true;
    } else { 
      file_data.type = 'audio'
    }
    await bot.api.editMessageMedia(job.data.user_id , job.data.message_id , file_data)
    await fs.unlinkSync(execSync(`find  ${path.join(__dirname,'./../public')} -name "${name}*"`).toString().trim())
  });
  spawn_yt_dlp.on('exit', async (code) => {
    console.log(`child process exited with code ${code}`);
  });   
  console.log(job.data);
} , {connection : {
    host : "127.0.0.1",
    port : 6379
}});
