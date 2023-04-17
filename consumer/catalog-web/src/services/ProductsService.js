import axios from "axios";

export const getAllProducts = (url) =>
  axios.get(url ? url : "http://localhost:3001/products");

export const getProductById = (url) =>
  axios.get(url ? url : `http://localhost:3001/products/{$id}`);

export const createProduct = (url) =>
  axios.post(url ? url : "http://localhost:3001/products");
