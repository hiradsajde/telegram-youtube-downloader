
# CONFIG


## 1.install warp@socks5
[warp-yg:](https://github.com/yonggekkk/warp-yg)

```
bash <(wget -qO- https://gitlab.com/rwkgyg/CFwarp/raw/main/CFwarp.sh 2> /dev/null)
```

## 2.install docker
```
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh ./get-docker.sh --dry-run
```

## 3.install redis

at port **6379**:
```
docker run --name redis -p 6379:6379 -d redis
```

## 4.set environments
```
nano .env.example
```

  

## 5.telegram webhook

  

- SET:

```
https://api.telegram.org/bot{token}/setWebhook?url={domain}
```

- DELETE:

```
https://api.telegram.org/bot{token}/setWebhook?url=
```
## 6.Telegram Bot API server
https://github.com/tdlib/telegram-bot-api

## 7.install nginx-proxy-manager
```
docker compose up -d
```
# INSTALLATION
```
npm i && npm run start
```
