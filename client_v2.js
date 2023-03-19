const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '/protos/recipes.proto'));
const RecipeProtoService = grpc.loadPackageDefinition(packageDefinition);

const recipeClient = new RecipeProtoService.Recipes(
  "0.0.0.0:50051",
  grpc.credentials.createInsecure()
);

module.exports = { recipeClient };
