import axios from "axios";
import { PRODUCTS_API_URL } from "../utils/Constants";

export const getAllProducts = (baseUrl) =>
  axios.get(`${baseUrl ? baseUrl : PRODUCTS_API_URL}/products`);

export const getProductById = (baseUrl, id) =>
  axios.get(`${baseUrl ? baseUrl : PRODUCTS_API_URL}/products/${id}`);

export const createProduct = (baseUrl, body) =>
  axios.post(`${baseUrl ? baseUrl : PRODUCTS_API_URL}/products`, body);
