import { PrismaClient } from "@prisma/client"

const tg = async (db : PrismaClient , ctx : any) => {
    if(ctx.message.text.match('^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$')){
        fetch(`http://0.0.0.0:${process.env.API_PORT}`).then(res => res.json()).then(res => {
            console.log(res)
        })
    }
    else { 
        ctx.reply(ctx.t("COMMAND_NOT_FOUND"));
    }
}

export default tg; 