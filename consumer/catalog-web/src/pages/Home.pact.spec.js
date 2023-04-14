import {
  PactV3,
  MatchersV3,
  SpecificationVersion,
} from "@pact-foundation/pact";
import axios from "axios";
import path from "path";
const { eachLike } = MatchersV3;

const provider = new PactV3({
  consumer: "CatalogWeb",
  provider: "CatalogAPI",
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), "pacts"),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V2,
});

describe("Products Service", () => {
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
          body: eachLike({
            id: 1,
            name: "Playstation 4",
            description: "Game Console",
            availability: true,
          }),
        },
      });

      await provider.executeTest(async (mockService) => {
        const product = await axios
          .get(mockService.url + "/products")
          .then((response) => response.data);

        expect(product).toStrictEqual([
          {
            id: 1,
            name: "Playstation 4",
            description: "Game Console",
            availability: true,
          },
        ]);
      });
    });
  });
});
