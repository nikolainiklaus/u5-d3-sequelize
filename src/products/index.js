import express from "express";
import ProductsModel from "./model.js";
import { Op } from "sequelize";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  const query = {};
  // Filter by name or description
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    query[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Filter by price range
  if (req.query.minPrice && req.query.maxPrice) {
    query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
  } else if (req.query.minPrice) {
    query.price = { [Op.gte]: req.query.minPrice };
  } else if (req.query.maxPrice) {
    query.price = { [Op.lte]: req.query.maxPrice };
  }

  // Filter by category
  if (req.query.category) {
    query.category = { [Op.eq]: req.query.category };
  }
  try {
    const products = await ProductsModel.findAll({ where: query });
    res.status(200).send(products);
    console.log(products);
  } catch (error) {
    next(error);
  }
});

// Get a single product by ID
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findByPk(productId);
    if (!product) {
      const error = new Error(`Product with ID ${productId} not found`);
      error.status = 404;
      throw error;
    }
    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

// Create a new product
productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = await ProductsModel.create(req.body);
    res.status(201).send(newProduct);
  } catch (error) {
    next(error);
  }
});

// Edit a single product by ID
productsRouter.put("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findByPk(productId);
    if (!product) {
      const error = new Error(`Product with ID ${productId} not found`);
      error.status = 404;
      throw error;
    }
    const updatedProduct = await product.update(req.body);
    res.status(200).send(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// Delete a single product by ID
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findByPk(productId);
    if (!product) {
      const error = new Error(`Product with ID ${productId} not found`);
      error.status = 404;
      throw error;
    }
    await product.destroy();
    res.status(204).send("product delted successfully");
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
