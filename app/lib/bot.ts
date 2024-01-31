import { FluentContextFlavor} from "@grammyjs/fluent";
import { Bot , Context} from "grammy";
import dotenv from 'dotenv'

dotenv.config({path : './../../.env'})
type MyAppContext = Context & FluentContextFlavor;
export const bot = new Bot<MyAppContext>(String(process.env.BOT_TOKEN) , {
    client: {
        apiRoot: 'http://127.0.0.1:8081',
    },
});