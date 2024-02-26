import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
import { InlineKeyboard, InputFile } from "grammy";
import {execSync } from "child_process";
import {bot} from './bot'
import url from 'url'
 
function formatBytes(bytes: number) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 2; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
} const tg = async (db: PrismaClient, ctx: any) => {
    if(ctx.message.text?.split('?')[0]?.split('.')[1]?.split('/')[1] == 'playlist')
        ctx.reply(ctx.t("not_ability_to_download_playlist"),{reply_parameters: { message_id: ctx.msg.message_id }})
    else if (ctx.message.text.match('^(https?\:\/\/)?((www\.)?(music\.)?youtube\.com|youtu\.be)\/.+$')) {
        const data = JSON.parse(execSync(`yt-dlp --print "%()j" --proxy ${process.env.PROXY} ${url.parse(ctx.message.text,true).query.v ? url.parse(ctx.message.text,true).query.v : ctx.message.text }`).toString())
        await bot.api.sendChatAction(ctx.chat.id , 'upload_photo');
        let qualityKeyboard = new InlineKeyboard()
        const qualityTemp: string[] = ['Default', "Premium"]
        const formats = data.formats.filter((format: { ext: string, format_note: string, format_id: string, source_preference: number }) => {
            const isTarget: boolean = (format.ext == 'mp4' || format.ext == 'm4a') && qualityTemp.includes(format.format_note) == false && format.source_preference == -1 && format.format_note != undefined;
            if (isTarget) qualityTemp.push(format.format_note);
            return isTarget;
        })
        let number_of_sounds = 0;
        const audio_size = formats.find((format : {ext : string , format_note : string}) => format.ext == 'm4a' && format.format_note == 'medium').filesize;
        for (const format of formats.reverse()) {
            if (format.ext == 'mp4') {
                qualityKeyboard.text(`🎬 ${format.resolution} (${format.format_note}) - ${formatBytes(format.filesize + audio_size)}`, `q___${data.id}___${format.format_id}___${format.format_note}___${format.ext}___${data.duration}`)
                qualityKeyboard.row()
            }
            else {
                let quality_title: number = NaN;
                if (['medium', 'ultralow'].includes(format.format_note)) {
                    switch (format.format_note) {
                        case 'medium':
                            quality_title = 320;
                            break;
                        case 'ultralow':
                            quality_title = 180;
                            break;
                    }
                    qualityKeyboard.text(`🎧 ${quality_title} - ${formatBytes(format.filesize)}`, `q___${data.id}___${format.format_id}___${format.format_note}___${format.ext}___${data.duration}`)
                    number_of_sounds++;
                    if (number_of_sounds % 2 == 0) {
                        qualityKeyboard.row();
                    }
                }
            }
        }
        ctx.replyWithPhoto(new InputFile(new URL(data.thumbnails.filter((thumbnail : {url : string , resolution : string}) => thumbnail.url.includes('jpg') && thumbnail.resolution != undefined).pop().url)) , {
            caption: `🎈${data.title}\n\n${ctx.t("SELECT_QUALITY")}`,
            reply_markup: qualityKeyboard,
            reply_parameters: { message_id: ctx.msg.message_id }
        })
    }
    else {
        ctx.reply(ctx.t("COMMAND_NOT_FOUND") , {reply_parameters: { message_id: ctx.msg.message_id }});
    }
}

export default tg; 