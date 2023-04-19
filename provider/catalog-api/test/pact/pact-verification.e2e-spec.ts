import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PactProviderModule, PactVerifierService } from 'nestjs-pact';
import { AppModule } from '../../src/app.module';
import { Product } from '../../src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

describe('Pact Verification', () => {
  let verifierService: PactVerifierService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          logging: true,
          host: process.env.TEST_DATABASE_HOST,
          port: parseInt(process.env.TEST_DATABASE_PORT),
          username: process.env.TEST_DATABASE_USER,
          password: process.env.TEST_DATABASE_PASSWORD,
          database: process.env.TEST_DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true, // Disable on production
          entities: [Product],
        }),
        PactProviderModule.register({
          provider: 'CatalogAPI',
          pactBrokerUrl: process.env.PACT_BROKER_URL,
          pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
          pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
          consumerVersionTags: ['master'],
          publishVerificationResult: true,
          providerVersion: '1.0.0',
          stateHandlers: {
            'Products exist': async () => {
              const product = new Product();
              product.available = true;
              product.description = 'Game Console';
              product.id = 1;
              product.name = 'Playstation 4';

              app = moduleRef.createNestApplication();
              await app.init();

              const productRepository: Repository<Product> = moduleRef.get<
                Repository<Product>
              >(getRepositoryToken(Product));

              await productRepository.save(product);
            },
            'No products exist': async () => {
              app = moduleRef.createNestApplication();
              await app.init();

              const productRepository: Repository<Product> = moduleRef.get<
                Repository<Product>
              >(getRepositoryToken(Product));

              await productRepository.clear();
            },
            'Product with ID 1 exists': async () => {
              const product = new Product();
              product.available = true;
              product.description = 'Game Console';
              product.id = 1;
              product.name = 'Playstation 4';

              app = moduleRef.createNestApplication();
              await app.init();

              const productRepository: Repository<Product> = moduleRef.get<
                Repository<Product>
              >(getRepositoryToken(Product));

              await productRepository.query(`INSERT INTO public.product(id, name, description, available)
                VALUES (${product.id}, '${product.name}', '${product.description}', ${product.available});`);
            },
            'Product with ID 1 does not exists': async () => {
              app = moduleRef.createNestApplication();
              await app.init();

              const productRepository: Repository<Product> = moduleRef.get<
                Repository<Product>
              >(getRepositoryToken(Product));

              productRepository.clear();
              Promise.resolve('Product with ID 1 does not exists');
            },
            'A valid product that does not exists': async () => {
              const product = new Product();
              product.available = true;
              product.description = 'Game Console';
              product.id = 1;
              product.name = 'Playstation 4';

              app = moduleRef.createNestApplication();
              await app.init();

              const productRepository: Repository<Product> = moduleRef.get<
                Repository<Product>
              >(getRepositoryToken(Product));

              await productRepository.save(product);
            },
          },
        }),
      ],
    }).compile();

    verifierService = moduleRef.get(PactVerifierService);

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('validates the expectations of Matching Service', async () => {
    await verifierService.verify(app);
  });

  afterAll(async () => {
    await app.close();
  });
});
