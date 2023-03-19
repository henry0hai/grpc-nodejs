// test_v2.js

const {recipeClient} = require("./client_v2");

// Find a recipe
recipeClient.find(
  {
    id: 1000,
  },
  (error, recipe) => {
    if (error) throw error;
    console.log(recipe);
  }
);