import {
  PactV3,
  MatchersV3,
  SpecificationVersion,
} from "@pact-foundation/pact";
import { HttpStatusCode } from "axios";
import path from "path";
import {
  getAllProducts,
  getProductById,
  createProduct,
} from "./ProductsService";
const { eachLike, like } = MatchersV3;

const provider = new PactV3({
  consumer: "CatalogWeb",
  provider: "CatalogAPI",
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), "pacts"),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V2,
});

describe("Products Service Pact Test", () => {
  const mockedProductResponse = {
    id: 1,
    name: "Playstation 4",
    description: "Game Console",
    availability: true,
  };

  describe("Getting all products", () => {
    test("Products exists", async () => {
      await provider.addInteraction({
        uponReceiving: "Get all products",
        withRequest: {
          method: "GET",
          path: "/products",
        },
        willRespondWith: {
          status: 200,
          body: eachLike(mockedProductResponse),
        },
      });

      await provider.executeTest(async (mockService) => {
        const response = await getAllProducts(
          `${mockService.url}/products`
        ).then((response) => response.data);

        expect(response).toStrictEqual([mockedProductResponse]);
      });
    });

    test("No products exists", async () => {
      await provider.addInteraction({
        uponReceiving: "Get all products",
        withRequest: {
          method: "GET",
          path: "/products",
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: [],
        },
      });

      await provider.executeTest(async (mockService) => {
        const product = await getAllProducts(
          `${mockService.url}/products`
        ).then((response) => response.data);

        expect(product).toStrictEqual([]);
      });
    });
  });

  describe("Getting one product", () => {
    test("Product ID 1 exists", async () => {
      await provider.addInteraction({
        uponReceiving: "Get product by ID 1",
        withRequest: {
          method: "GET",
          path: "/products/1",
        },
        willRespondWith: {
          status: 200,
          body: like(mockedProductResponse),
        },
      });

      await provider.executeTest(async (mockService) => {
        const response = await getProductById(
          `${mockService.url}/products/1`
        ).then((response) => response.data);

        expect(response).toStrictEqual(mockedProductResponse);
      });
    });

    test("Product ID 1 does not exists", async () => {
      await provider.addInteraction({
        uponReceiving: "Get product by ID 1",
        withRequest: {
          method: "GET",
          path: "/products/1",
        },
        willRespondWith: {
          status: 404,
        },
      });

      await provider.executeTest(async (mockService) => {
        await expect(
          getProductById(`${mockService.url}/products/1`).then(
            (response) => response.data
          )
        ).rejects.toThrow("Request failed with status code 404");
      });
    });
  });

  describe("Creating a product", () => {
    test("Product created", async () => {
      await provider.addInteraction({
        uponReceiving: "Create new product",
        withRequest: {
          method: "POST",
          path: "/products",
        },
        willRespondWith: {
          status: 202,
        },
      });

      await provider.executeTest(async (mockService) => {
        // TODO: Mock body
        const response = await createProduct(
          `${mockService.url}/products`
        ).then((response) => response);

        await expect(response.status).toStrictEqual(HttpStatusCode.Accepted);
      });
    });
  });
});
