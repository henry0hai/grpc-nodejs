# grpc-nodejs

**Tested with node version `18.14.0`**

Have 2 proto message

- `bookStore.proto`
- `news.proto`

Server, Client will run both proto

## Setup

```bash
npm install
```

## Run

First terminal

```bash
node server
```

Second terminal

```bash
node test
```

## Incase you want to run streaming data demo

```bash
yarn serve
```

- Using postman to import the demo REST API call from file: `[localhost] -- sample_postman_call.json`
- Using `POST API` to create several orders
- Using `GET API` to get one of the order to see the `status change` or watch the `console output`
