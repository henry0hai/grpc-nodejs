const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, '../protos/recipes.proto'));
const packageDefinitionProc = protoLoader.loadSync(path.join(__dirname, '../protos/processing.proto'));
const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci);
const processingProto = grpc.loadPackageDefinition(packageDefinitionProc);

const recipesStub = new recipesProto.Recipes('0.0.0.0:50051', grpc.credentials.createInsecure());
const processingStub = new processingProto.Processing('0.0.0.0:50052', grpc.credentials.createInsecure());

const app = express();
app.use(express.json());

const restPort = 5003;
let orders = {};

function processAsync(order) {
  recipesStub.find({ id: order.productId }, (err, recipe) => {
    if (err) {
      console.log(err);
      return;
    }

    orders[order.id].recipe = recipe;
    const call = processingStub.process({
      orderId: order.id,
      recipeId: recipe.id,
    });
    call.on('data', (statusUpdate) => {
      const oldStatus = orders[order.id].status;
      orders[order.id].status = statusUpdate.status;
      console.log(`Order id: ${order.id}, change from status: ${oldStatus} to status: ${statusUpdate.status}.`);
    });

    call.on('end', () => {
      console.log('===> Processing done for order: ', order.id);
    });
  });
}

app.post('/orders', (req, res) => {
  const productId = req.body.productId;
  if (!productId) {
    res.status(400).send('Product identifier is not set');
    return;
  }
  recipesStub.find({ id: productId }, (err, recipe) => {
    if (err) {
      res.status(400).send('Product is not exist');
      return;
    }
    let orderId = Object.keys(orders).length + 1;
    let order = {
      id: orderId,
      status: 0,
      productId: productId,
      createdAt: new Date().toLocaleString(),
    };
    orders[order.id] = order;
    processAsync(order);
    res.send(order);
  });
});

app.get('/orders/:id', (req, res) => {
  if (!req.params.id || !orders[req.params.id]) {
    res.status(400).send('Order not found');
    return;
  }
  res.send(orders[req.params.id]);
});

app.listen(restPort, () => {
  console.log(`RESTful API is listening on port ${restPort}`);
});
