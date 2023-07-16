# Welcome to this Blockchain project

- The project is seperated into to two parts:

  - The frontend
  - The backend

- For you to run the front end follow the steps

```
    cd www
    npm install
    npm start
```

- Open another terminal and do the following to run the backend

```
    cd blockchain
    npm install
    npm run build
    npm run dev
    npm run dev-peer (to run multiple peer instances within your blockchain)
```

- Now the backend can either has two simulation of pub/sub: (one:) redis and (two:) pubnub
- on the `blockchain/utils` folder you can find both `index.redis.ts` and `index.pubnub.ts`
- all the implementations are optimized and working perfectly
- the pubnub instance would need you to create a pubnub account for you to use API keys
- while the redis instance would need you to download redis locally into your computer
- you can paste either of the index files on your `blockchain/index.ts` and repeat the following commands

```
    cd blockchain
    npm install
    npm run build
    npm run dev
    npm run dev-peer (to run multiple peer instances within your blockchain)
```
