
# INSTALLATION

## 1.install warp@socks5
[warp-yg:](https://github.com/yonggekkk/warp-yg)
```
bash <(wget -qO- https://gitlab.com/rwkgyg/CFwarp/raw/main/CFwarp.sh 2> /dev/null)
```

## 2.set environments
```
nano .env.example
```

## 3.telegram webhook

- SET:
```
https://api.telegram.org/bot{token}/setWebhook?url={domain}
```

- DELETE:
```
https://api.telegram.org/bot{token}/setWebhook?url=
```
## 4.Telegram Bot API server
https://github.com/tdlib/telegram-bot-api

## 5.install docker
```
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh ./get-docker.sh --dry-run
```

## 6.install nginx-proxy-manager && redis
```
docker compose up -d
```

## 7.install dependencies
```
npm i && npm i -g bun pm2
```

## 8.RUN
```
npx prisma generate dev --name install && npm run start
```
