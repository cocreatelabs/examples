import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import { CoCreateProtocol__factory } from "../typechain-types";
// Load .env file
dotenv.config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  );

  console.log(`Block number: ${await provider.getBlockNumber()}`);
  const privateKey = "0x" + process.env.PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Wallet address: ${wallet.address}`);
  const coCreateProtocol = CoCreateProtocol__factory.connect("0x29d89c8Cc4f5Bb0e9EB97Df756fdaA457DfF1F8C", wallet);
  const txn = await coCreateProtocol.deployCoCreateInstance("script", "", wallet.address);
  console.log("Waiting for 1 confirmation");
  const receipt = await txn.wait(1);
  const coCreateInstanceDeployedEvent = receipt.events?.find(
    (e) => e.event === 'CoCreateInstanceDeployed'
  );
  console.log(coCreateInstanceDeployedEvent);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
