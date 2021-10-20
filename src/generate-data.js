const faker = require('faker');
const fs = require('fs');

// Set locale to use Vietnamese
faker.locale = 'vi';

// Random categoryList
const randomCategoryList = (n) => {
  if (n <= 0) return [];

  const categoryList = [];

  // Random data
  for (let i = 0; i < n; i++) {
    const category = {
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    categoryList.push(category);
  }

  return categoryList;
};

// Random productList
const randomProductList = (categoryList, numberOfProduct) => {
  if (numberOfProduct <= 0) return [];

  const productList = [];

  // Random data
  for (const category of categoryList) {
    for (let i = 0; i < numberOfProduct; i++) {
      const product = {
        category_id: category.id,
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: Number.parseFloat(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        created_at: Date.now(),
        updated_at: Date.now(),
        thumnai_url: faker.image.imageUrl(400, 400),
      };

      productList.push(product);
    }
  }

  return productList;
};

// IFFE
(() => {
  // random data
  const categoryList = randomCategoryList(4);
  const productList = randomProductList(categoryList, 5);

  // prepare db object
  const db = {
    categories: categoryList,
    products: productList,
    profile: {
      name: 'Po',
    },
  };

  // store data
  fs.writeFile('db.json', JSON.stringify(db), { encoding: 'utf-8' }, () => {
    console.log('Generate data successfully!');
  });
})();
