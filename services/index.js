const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([
    {
      id: "prod-1",
      name: "Sample Product",
      description: "A starter product",
      price: 19.99,
      stock: 100
    }
  ], null, 2));
}

function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading products', err);
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
}

const app = express();
app.use(bodyParser.json());

// Health
app.get('/', (req, res) => res.json({ok: true}));

// GET /products
app.get('/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// GET /products/:id
app.get('/products/:id', (req, res) => {
  const products = readProducts();
  const prod = products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ message: 'Not found' });
  res.json(prod);
});

// POST /products
app.post('/products', (req, res) => {
  const { name, description = '', price = 0, stock = 0 } = req.body;
  if (!name) return res.status(400).json({ message: 'name required' });
  const products = readProducts();
  const newProd = {
    id: uuidv4(),
    name,
    description,
    price: Number(price),
    stock: Number(stock)
  };
  products.push(newProd);
  writeProducts(products);
  res.status(201).json(newProd);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Catalog service listening on ${PORT}`);
});