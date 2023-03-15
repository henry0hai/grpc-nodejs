const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const newsProtoPath = './news.proto';
const bookStoreProtoPath = './bookStore.proto';
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var newsPackageDefinition = protoLoader.loadSync(newsProtoPath, options);
var bookStorePackageDefinition = protoLoader.loadSync(bookStoreProtoPath, options);

const NewsService = grpc.loadPackageDefinition(newsPackageDefinition).NewsService;
const BookStoreService = grpc.loadPackageDefinition(bookStorePackageDefinition).Book;

const newsClient = new NewsService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const bookStoreClient = new BookStoreService(
  "localhost:50052",
  grpc.credentials.createInsecure()
);

module.exports = {newsClient, bookStoreClient};
