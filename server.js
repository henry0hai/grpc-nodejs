const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const newsProtoPath = './news.proto';
const bookStoreProtoPath = './bookStore.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
const newsPackageDefinition = protoLoader.loadSync(newsProtoPath, options);
const bookStorePackageDefinition = protoLoader.loadSync(bookStoreProtoPath, options);

const newsProto = grpc.loadPackageDefinition(newsPackageDefinition);
const bookStoreProto = grpc.loadPackageDefinition(bookStorePackageDefinition);

const newsServer = new grpc.Server();
const bookStoreServer = new grpc.Server();

let news = [
  { id: '1', title: 'Note 1', body: 'Content 1', postImage: 'Post image 1' },
  { id: '2', title: 'Note 2', body: 'Content 2', postImage: 'Post image 2' },
];
// Add the News Service to gRPC Server
newsServer.addService(newsProto.NewsService.service, {
  getAllNews: (_, callback) => {
    callback(null, { news });
  },
  getNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    callback(null, newsItem);
  },
  deleteNews: (_, callback) => {
    const newsId = _.request.id;
    news = news.filter(({ id }) => id !== newsId);
    callback(null, {});
  },
  editNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    if (newsItem) {
      newsItem.body = _.request.body;
      newsItem.postImage = _.request.postImage;
      newsItem.title = _.request.title;
      callback(null, newsItem);
    } else {
      callback(null, {});
    }
  },
  addNews: (call, callback) => {
    let _news = { id: Date.now(), ...call.request };
    news.push(_news);
    callback(null, _news);
  },
});

// Uhm, this is going to mirror our database, but we can change it to use an actual database.
const books = [];

function createBook(call, callback) {
  const book = call.request.book;
  const bookObject = {
    id: books.length + 1,
    book: book,
  };
  books.push(bookObject);
  callback(null, bookObject);
}

function readBook(call, callback) {
  const id = call.request.id;
  const book = books.find((book) => book.id === id);
  callback(null, book);
}

function readBooks(call, callback) {
  callback(null, { books: books });
}

// Add the Book Store Service to gRPC Server
bookStoreServer.addService(bookStoreProto.Book.service, {
  createBook,
  readBook,
  readBooks,
});

newsServer.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
  console.log('Server at port:', port);
  console.log('Server running at http://127.0.0.1:50051');
  newsServer.start();
});

bookStoreServer.bindAsync('127.0.0.1:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
  console.log('Server at port:', port);
  console.log('Server running at http://127.0.0.1:50052');
  bookStoreServer.start();
});
