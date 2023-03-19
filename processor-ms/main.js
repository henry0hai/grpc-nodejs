const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../protos/processing.proto'));
const processingProto = grpc.loadPackageDefinition(packageDefinition);

function process(call) {
  let orderRequest = call.request;
  let time = orderRequest.orderId * 1500 + orderRequest.recipeId * 100;
  let status = 1;
  call.write({ status });
  setTimeout(() => {
    status ++
    call.write({ status });
    setTimeout(() => {
      status ++
      call.write({ status });
      call.end();
    }, time);
  }, time);
}

const server = new grpc.Server();
server.addService(processingProto.Processing.service, { process });
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('processor running at http://0.0.0.0:50052');
});
