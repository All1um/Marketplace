const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

mongoose.connect('mongodb+srv://Cluster86887:LooL1205@marketplace.giqf26g.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    initializeCategories(); 
})
.catch((error) => console.error('Error connecting to MongoDB:', error));

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    category: String,
});

const Product = mongoose.model('Product', productSchema);

const categorySchema = new mongoose.Schema({
    name: String,
});

const Category = mongoose.model('Category', categorySchema);

async function initializeCategories() {
    const categoriesList = ['Men', 'Women', 'Teens'];
    for (let categoryName of categoriesList) {
        const existingCategory = await Category.findOne({ name: categoryName });
        if (!existingCategory) {
            const newCategory = new Category({ name: categoryName });
            await newCategory.save();
            console.log(`Category '${categoryName}' added to database.`);
        } else {
            console.log(`Category '${categoryName}' already exists in the database.`);
        }
    }
}

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          res.status(404).json({ error: 'Product not found' });
          return;
        }
        res.json(product);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve product' });
      }
});

app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          res.status(404).json({ error: 'Product not found' });
          return;
        }
        res.json(product);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve product' });
      }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
          res.status(404).json({ error: 'Product not found' });
          return;
        }
        res.json(product);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
      }
});

app.post('/categories', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product) {
          res.status(404).json({ error: 'Product not found' });
          return;
        }
        res.json({ message: 'Product deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
      }
});

app.get('/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
      }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
