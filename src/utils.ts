import { CoCreateInstance__factory } from './../typechain-types/factories/contracts/createinstance/CoCreateInstance__factory';
import * as dotenv from "dotenv";
import { CoCreateInstance, CoCreateProtocol__factory } from "../typechain-types";
import { ethers } from "hardhat";

// Load .env file
dotenv.config();

export const goerliProvider = new ethers.providers.JsonRpcProvider(
  "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);

const privateKey = "0x" + process.env.PRIVATE_KEY;
export const wallet = new ethers.Wallet(privateKey, goerliProvider);

export const COCREATE_PROTOCOL_GOERLI_ADDR = "0x29d89c8Cc4f5Bb0e9EB97Df756fdaA457DfF1F8C";

export async function deployCoCreateProject(): Promise<CoCreateInstance> {
  const coCreateProtocol = CoCreateProtocol__factory.connect(COCREATE_PROTOCOL_GOERLI_ADDR, wallet);
  console.log("Deploying a CoCreate Project");
  const txn = await coCreateProtocol.deployCoCreateInstance("MyProject", "MyProject Desc", wallet.address);
  console.log("Waiting for 1 confirmation");
  const receipt = await txn.wait(1);
  const coCreateInstanceDeployedEvent = receipt.events?.find(
    (e) => e.event === 'CoCreateInstanceDeployed'
  );
  if (coCreateInstanceDeployedEvent) {
    return CoCreateInstance__factory.connect(
      // @ts-ignore
      coCreateInstanceDeployedEvent.args.coCreateInstance,
      wallet
    );
  }
  throw new Error("Failed to deploy project");
}
