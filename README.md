# Sample CoCreate Project

## Setup

```shell
# Install all dependencies
npm install
# Generate typescript bindings
npm run gen:types
# Copy sample env file.
cp .env.example .env

# Update PRIVATE_KEY to your own private key in .env
# You can obtain your PRIVATE_KEY from metamask advanced settings
# https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key
```

## Deploying a token

This project demonstrates a basic CoCreate use case.

Generate the typechain files first by running: `npm run gen:types`.

See the `src/create-token.ts` script for an example on how to create a token. Run it using:

```shell
npm run create-token
```
