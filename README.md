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

1. We will begin by writing the tests for the consumer, where we capture the contract. We have the consumer talk to a mock of the provider that Pact provides, and we expect to receive a response. We repeat this process for all the interactions that the consumer has with the provider. At the end of the test session, we have all the integrations we need, and the Pact mock verifies that the consumer makes the correct API calls, does what it's supposed to do, and can handle the response back. If the consumer fails, we won't serialize the contract.

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
