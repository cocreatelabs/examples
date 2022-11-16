# CoCreate Examples

This repository contains examples on how one can use the CoCreate contracts and directly integrate with them in a variety of ways.

We have examples which cover: project creation, token creation, mint/burn and transfer-restrictions management.

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

## Examples

Please complete the Setup and setup your PRIVATE_KEY before running these examples.

### 1. Token Creation

See the `src/createToken.ts` script for an example on how to create a token. Run it using:

```sh
npm run create-token
```

### 2. Mint and Burn

See the `src/mintAndBurn.ts` script for an example on how to mint and burn a token after creation. Run it using:

```sh
npm run mint-burn
```

### 3. Mint and Burn

See the `src/transferRestrictions.ts` script for an example on how to manage a tokens transfer restrictions. Run it using:

```sh
npm run transfer-restrictions
```
