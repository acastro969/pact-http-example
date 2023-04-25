# Pact

**The information presented in this text was primarily sourced from the Introduction to contract testing videos by PactFlow on YouTube and the docs.pact.io documentation.**

https://www.youtube.com/playlist?list=PLwy9Bnco-IpfZ72VQ7hce8GicVZs7nm0i

https://docs.pact.io/

---

## Introduction

Pact is a code-first tool for testing HTTP and message integrations using contract tests.

Contract testing is a methodology for ensuring that two separate systems (e.g., microservices) are compatible and can communicate with each another. It captures the interactions that are exchanged between each service, storing them in a contract which can then be used to verify that both parties adhere to it.

The most common integration testing approach is end-to-end, which involves deploying all the components into an environment that resembles production and running a battery of tests against them. In end-to-end testing we are testing the start-to-finish process, and although you can feel very confident about your working system following this approach, the downside is that it is slow. A real request needs to make its way through real systems over the internet and needs to do things (e.g., send emails) that can take time and you normally can't run these tests in parallel, so they will commonly take a lot of time.

Another downside to end-to-end tests is that they are fragile, they often fail because of version mismatches or environment configuration mistakes, and if there are multiple microservices being tested (Microservice A, B, C) and let's say it fails on B, you'll need to dig into your log system to see what went wrong, as you usually can't see that exception from the outside.

## Providers, Consumers, and Registries

The Web Service architecture usually consists of Providers, Consumers, and Registries.

A Provider is an application or system that provides data or functionality through a web service. It exposes a set of APIs or endpoints that consumers can invoke to retrieve data or perform operations.

A Consumer is an application or system that consumes data or functionality provided by a web service. It's the entity that sends a request to a web service to obtain data or trigger some operation (e.g., a mobile app that retrieves weather data from a weather API, a web application that uses a payment gateway API to process payments).

Registries are like "phone books for web services," as they keep track of the web services available on a network and provide information about them, such as their name, location, and what they do. This helps service consumers find the web services they need and use them in their applications (e.g., AWS Service Registry, Apache ZooKeeper).

Public web service registries are often used to help developers discover and consume publicly available APIs, like the Google Maps API or Twitter API. These registries typically contain a listing of publicly available APIs, along with information on how to access them and any relevant documentation.

Private web service registries, on the other hand, are often used within organizations to help teams discover and consume internal APIs. These registries typically contain a listing of APIs that are available within the organization, along with information about them.

## API Contracts: Specification First vs Contract Tests

If we follow a Specification First Design approach, we begin by creating a specification file and publishing it to all consumers. However, when updating our API to the next version, issues may arise if the consumers have not implemented the new features or properties. Although the specification serves as a good communication tool, it does not prevent breaking changes.

This is where Consumer Driven Contracts come in. Consumers specify their requirements, and the API ensures that it supports them. Changes cannot be made on the provider side unless they are compatible with the consumers contract.

Contract Testing can be seen as an alternative approach to end-to-end integration tests. Instead of looking at the entire system, Contract Testing focuses on the integration points and tests each side of the integration point separately. This way, the individual needs of each side of the integration are captured.

With Contract Testing we only need to look at a single component at a time. For example, when working on the frontend, we only need to record the needs of that frontend and document it in that place. We don't need to worry about the other microservices being present for this test. Similarly, when testing the microservice, we only need to know the contracts of the other applications to verify them.

This makes testing much simpler, as we are always testing a single integration at a time. We don't need dedicated test environments as tests can run on a dev machine, and because they run as unit tests, we get fast, reliable feedback. We don't need to bring the entire universe to run our test suite, as the tests run independently.

Having the knowledge of the contracts between the components, we can statically determine at release time which components are compatible with each other. This is because we have the contract that specifies what each component does, and we also have information on which ones have verified that contract. As a result, we have the ability to coordinate the release by knowing the entire state of the system at release time.

## So, what is Pact?

Pact combines the idea of fast unit tests on both sides of the integration point and uses contracts to ensure that those unit tests remain consistent.

It is an open source, consumer-driven contract testing tool that makes it easy to test microservices or distributed systems quickly, independently, and safely.

Pact is used for communication over the internet, utilizing protocols such as HTTP with JSON or message queues, passing XML, and more. It can be used to test websites, backends. Common use cases are React websites, native mobile applications, and RESTful microservices.

The goal of Pact is to eliminate the need for end-to-end integration tests and reduce reliance on complex test environments, sometimes removing them altogether.

## How Pact works

Suppose we have a JavaScript website (consumer) that needs to communicate with a back-end Java microservice (provider). The HTTP messages or interactions that occur between these systems are collectively known as the contract or pact.

Ordinarily, without contract testing, we would start up both the provider and the consumer, issue a request from the consumer to the provider, and ensure that everything worked as expected. However, if we did this, the provider may have its own provider, and that provider may have its own provider, leading to us having to stand up all of these services. With Pact, we only test one application at a time and capture its view of the integration point.

We can think of this as a three steps process:

1. We will begin by writing the tests for the consumer, where we capture the contract. We have the consumer communicate to a mock of the provider provided by Pact, and we expect to receive a certain response. We repeat this process for all the interactions. At the end of the test session, we have all the integrations we need, and the Pact mock verifies that the consumer makes the correct API calls, does what it's supposed to do, and can handle the response back. If the consumer fails, we won't serialize the contract.

2. Step two involves sending all those requests to a Pact broker like PactFlow, which is a commercial version of the broker, and sharing the version and collaborating on that contract.

3. Lastly, we test the provider and verify the contract. We call this contract validation. Pact goes to the broker, retrieves all the contracts for all the consumers of this provider, and replays the request against the provider. If the provider responds with the correct response, it means it matched the interaction and is able to do what the consumer needs. The verification checks all response details from that request, such as correct headers, status code, body, and more.

![](https://pactflow.io/assets/img/pactflow/how-pact-works/slide_5.gif?v=555551e42b)

https://pactflow.io/how-pact-works/#slide-5

## Pact for Asynchronous Messages (e.g. ActiveMQ, Kafka, AWS Kinesis, etc.)

Suppose we have a Kafka queue and a product catalog website that will consume messages from a product queue topic published by a Java order management system. We will refer to the product catalog system as the consumer and the order management system as the provider (or producer), while the message that goes over the Kafka queue, along with the metadata (such as the topic and content type), will be called the contract.

1. First, to test the consumer's ability to handle messages, we will use Pact to simulate the queue by pushing a message to the consumer's message handler and verifying that it can process the event successfully.

2. Next, we will serialize the contract and share it on a Pact broker, which allows us to version, collaborate on, and manage the contract.

3. Lastly, to test the provider's ability to produce the correct message and metadata, we will use Pact to invoke the provider's function that produces the message and verify that it matches the scenario specified in the contract. Pact will do this by triggering the function through code and checking that it produces the correct message and metadata.

By following this process, we can test the interaction between the consumer and provider without having to set up complex states or publish real events to the queue.

## Pact Broker

The Pact Broker is an application for sharing contracts and verification results and are required for integrating Pact into CI/CD pipelines.

It:

- Shows you real examples of the services interactions and relationships.
- Provides up to date API documentation.
- Solves the problem of sharing contracts and verification results between consumers and providers.
- Allows CI/CD contract testing integration and automation.
- Tells you which versions of the application can be deployed safely together.

### Is Using a Pact Broker Mandatory?

If you're just getting started you can exchange pacts via any mechanisms (build artifacts, S3 buckets). However you are losing the before mentioned advantages of implementing a Pact Broker. A Pact Broker allows you to integrate contract testing into your CI/CD pipeline and releasing code faster.

### Self-hosted Pact Broker or PactFlow

The Pact Broker is an Open Source tool that requires you to deploy, administer and host it yourself.

PactFlow is a fork of the Open Source Pact Broker with improved UI, field level verification results and user and teams management.

All PactFlow plans includes the Pact Broker hosting and comes with extra benefits and capabilities.

With the free Starter Plan, you get unlimited users, five contracts and core features, no credit card is needed.

![](https://i.ibb.co/4mp9K6Z/PactFlow.png)

### Users and Security in PactFlow

- PactFlow uses a "seat" based model, where you purchase capacity for how many Users you need and assign them as required. Each user gets a read-only and read-write API token that can be used for automation. Users are able to rotate these tokens as needed.

- All users contribute to the same system, they are simply separately authenticated.

- Users may login with their GitHub credentials (via OAuth2), a Google email domain or standard login (user/pass).

- In addition to 3rd party penetration testing, PactFlow performs regular security scanning encrypting all data at rest and uses TLS for all remote communication. Each customer is further isolated via separate database instances and no customer has access to other customers' data.

- PactFlow recommends that contracts do not contain any sensitive data (e.g. PII) and contain structural example content only, using tools like Faker.

- All webhook secrets are fully encrypted against a customer specific key.

- PactFlow comes with predefined roles, each role being assigned a collection of permissions. https://docs.pactflow.io/docs/permissions/predefined-roles/

## Versioning

To prevent issues when multiple processes (such as consumers or providers) attempt to access and modify a contract concurrently or in an unpredictable order, it is recommended that the version numbers of the applications used to publish pacts and verification results should either be or contain the commit (i.e. the Git SHA or its equivalent in other version control tools).

There are three resources that can have versions in a Pact Broker:

1. The pact file.
2. The consumer application that generated the pact file.
3. The provider application that verified the contract.

Pact users should never have to worry about their pact versions as they are automatically managed by the Pact Broker. However, the versions of the consumer and provider applications should be properly set.

A related concept is the Pact Matrix, which contains all verification states for all versions of existing consumers and providers. It is used by the 'can-i-deploy' tool to determine whether it is safe to deploy an application. Following versioning rules means we can obtain reliable 'can-i-deploy' results and avoid breaking integration points.

### Consumer Versioning

When a pact is published to the broker, it is associated with a consumer name, version, and provider name.

A contract that hasn't changed can belong to multiple consumer versions without any issues, thanks to the broker's duplicate detection. If many consumer versions point to a single contract, verification doesn't have to be repeated if the contracts haven't changed.

### Provider Versioning

When verifying a pact, the provider version is associated with the content of the pact for that particular pair (provider/consumer), which serves to determine a state for each version.

Note that Pact verification is done on a contract, not on a specific consumer version. If another version of the consumer with the same contract is published, then the verification does not need to be repeated.

A provider version can be verified against multiple contracts.

### Best Practices

#### Rules

1. Make sure to always change the consumer version whenever the contract changes.

2. Make sure that version numbers are unique, for example, a feature branch that changes the contract should not have the same version as any other branch.

3. Ensure that your versions can be known during a release.

4. If the application is both a consumer and a provider at the same time, make sure that the version number used to publish the pact is the same as the one used to publish the verification results.

#### Guidelines

1. For git, it's ideal to use the git commit sha (short or long) or include the git commit sha in your version number (e.g., 0.0.10+76a39e5). This way the consumer version will change whenever the pact contract changes, feature branches will have different versions to master branch versions, and you can identify and checkout the production version of the provider if you need to prevent missing verifications.

2. If you are unable to follow the before mentioned point, then ensure that you are able to tag the "version control" repository with an unique application version number at build time.

3. Avoid having random values in your contracts, as you wouldn't be able to take advantage of Pact's duplicate contract detection.

## Implementing Pact in a CI/CD Workflow

To implement Pact in a CI/CD workflow, the following tasks need to be accomplished:

Consumer side:

1. Running the Pact tests.
2. Publishing the Pact to the broker.

Provider side:

3. Fetching the existing pacts.
4. Verifying the existing pacts.
5. Publishing the pact verification.

Optionally, a webhook can be set up to trigger provider builds every time a new contract is published that requires verification.

## Working on Feature Branches

Application versions in the Pact Broker should map 1:1 to repository commits, and the versions used to publish pacts and verification results should be, or contain, the commits.

In the Pact CI/CD Workshop (https://docs.pactflow.io/docs/workshops/ci-cd/workshop/) we associated the consumer app version with the name of the branch when we publish the pacts.

You can also automatically detect the repository branch from known CI, environment variables or git CLI. Supports Buildkite, Circle CI, Travis CI, GitHub Actions, Jenkins, Hudson, AppVeyor, GitLab, CodeShip, Bitbucket and Azure DevOps.

For the provider verification, we have configured that it has to fetch the latest pacts belonging to the mainBranch in each consumer and the pacts that belong to the currently deployed versions.

To ensure that our provider APIs are backwards compatible with consumer versions deployed in production, the Pact Broker needs to know which versions are currently deployed in production. For this purpose, the "record-deployment" command (present in the Makefile) is used in the Pact Broker CLI. In the example of the workshop, it is hardcoded to "production" which has been previously created as an environment using another Pact Broker CLI command called "create-environment".

https://docs.pact.io/pact_broker/client_cli/readme#create-environment

When working with feature branches, if you need to modify the expectations set by your consumer, you can make the changes locally and commit them to a new feature branch. In the CI/CD pipeline, this will trigger Pact tests, which will generate a new contract. Then, the broker will trigger a provider build, which includes the pact verification.

If the pact verification succeeds, the feature branch is ready to be merged into the main consumer branch. If it fails, it means that the new provider expectations have not yet been implemented, and the new consumer code cannot be merged into the main branch yet. In this case, a new feature branch should be created on the provider side to ensure the implementation of the new expectations.

On the provider side, enabling "work in progress pacts" allows for any pact that has not yet published a successful result to be marked as a pending pact. This feature prevents changed pacts from breaking provider builds.

To implement changes in the provider, create a new branch with the same name as the feature branch on the consumer side, and implement the changes, commit and push them. A provider build will be triggered to verify the consumer feature branch pact. If the verification succeeds, merge the changes to the main branch of the provider.

Now, we can manually re-build our consumer, it should pass and then we can merge the changes to the main consumer branch.

When we need to make changes to our provider without having the new expectations published by the consumer, it is important to ensure that we do not break any existing consumer expectations. One approach is to create a new feature branch on the provider side, make the necessary code changes, and commit and push the code. If all expectations are satisfied, the code changes have not broken any consumer expectations and can be merged to master. However, if it fails, it indicates that the provider code changes have broken some consumer expectations, and the broken functionality cannot be merged to master. This approach ensures that any changes made to the provider do not negatively impact the consumer's expectations and avoids potential issues down the line.

## Can I Deploy

The Pact approach to managing deployment dependencies involves using the Pact Matrix and the 'can-i-deploy' tool. The Pact Matrix is a grid that displays all the consumer and provider versions that have been tested against each other using Pact. This grid can be viewed in either the Open Source broker or PactFlow.

By examining the matrix, teams can determine which versions are safe to deploy.

The 'can-i-deploy' tool is used to assess whether it is safe to deploy a new application version based on the currently deployed version's pact. It helps teams avoid deploying a new version that may violate the existing contract.

This tool can verify the compatibility of a provider and consumer based on their contract. If the interactions are correct, the tool will return a success message. If there are changes that break the contract, the tool will return a failure message.

In PactFlow, there is a dedicated page for the Can I Deploy tool with a rich UI that provides a query interface for the Matrix to ensure safe deploys, providing additional context not readily available during CLI usage.

## Webhooks

Webhooks allow you to trigger HTTP requests when a Pact changes, is published, or a Pact verification is published. The most common use case is triggering a build of the provider every time a Pact changes and triggering a build of the consumer every time a verification is published.

There are different events that can trigger a webhook:

- 'contract content changed'
- 'contract requiring verification published'
- 'contract published'
- 'provider verification published'
- 'provider verification succeeded'
- 'provider verification failed'

In PactFlow, you can easily create webhooks by navigating to the "Webhooks" tab inside "Settings" and filling in the details (URL, the events that will trigger the webhook, and any optional headers or body data).

While webhooks can be configured outside of PactFlow, it will require additional work to implement the necessary infrastructure.

https://github.com/pact-foundation/pact_broker/blob/master/lib/pact_broker/doc/views/webhooks.markdown

## Working with Multiple Consumers

After creating the first pact, subsequent consumers must ensure they comply with the original pact. While they may use more or less than what is specified in the pact, the overlapping parts must be the same.

If one or more consumers require a change to the provider, and the provider team agrees, the pacts can help identify which consumers are using a specific field. The provider team can then add the new field alongside the old field, ensure that all consumers are using the new field, and remove the old field. Pacts can help in this process, as once all consumers have switched to the new field, removing the old field from the provider should not cause any issues with the pacts. If there is an issue, it indicates that some consumer is still using the old field.

It is important to remember that pacts solve technological problems and cannot solve people problems. For instance, if two teams have different requirements, pacts cannot resolve the conflict. However, they can help in identifying these issues.

Each consumer has it's own contract with the provider - even if there is significant overlap in functionality.
