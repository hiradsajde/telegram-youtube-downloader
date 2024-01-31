import { Queue } from 'bullmq';
import dotenv from "dotenv"

dotenv.config({path : './../.env'})

const ytdlp = new Queue('ytdlp' , {connection : {
    host : process.env.REDIS_HOST,
    port : Number(process.env.REDIS_PORT)
}});

export default ytdlp