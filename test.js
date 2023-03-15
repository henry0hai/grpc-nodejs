// test.js
// get all news
const {newsClient, bookStoreClient} = require("./client");

newsClient.getAllNews({}, (error, news) => {
  if (error) throw error;
  console.log("Original news: ", news);
});

// add a news
newsClient.addNews(
  {
    title: "Title news 3",
    body: "Body content 3",
    postImage: "Image URL here",
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully created a news.");
  }
);

// edit a news
newsClient.editNews(
  {
    id: 2,
    body: "Body content 2 edited.",
    postImage: "Image URL edited.",
    title: "Title for 2 edited.",
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully edited a news.");
  }
);

// delete a news
newsClient.deleteNews(
  {
    id: 2,
  },
  (error, news) => {
    if (error) throw error;
    console.log("Successfully deleted a news item.");
  }
);

newsClient.getAllNews({}, (error, news) => {
  if (error) throw error;
  console.log("Final news: ", news);
});


bookStoreClient.createBook({ 'id': -1, 'book': 'Cracking the Interview' }, (err, response) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`From server`, JSON.stringify(response));
	}
});

bookStoreClient.readBook({ 'id': 1 }, (err, response) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`From server`, JSON.stringify(response));
	}
});

bookStoreClient.readBooks(null, (err, response) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`From server`, JSON.stringify(response));
	}
});