import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import {
  CoCreateLaunch__factory,
  CoCreateProject,
  CoCreateProject__factory,
} from "../typechain-types";

// Load .env file
dotenv.config();

export const goerliProvider = new ethers.providers.JsonRpcProvider(
  "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY not set");
}

const privateKey = "0x" + process.env.PRIVATE_KEY;
export const wallet = new ethers.Wallet(privateKey, goerliProvider);

export const COCREATE_PROTOCOL_GOERLI_ADDR =
  "0x8263d477DBAA9E3C197dB3C14C290629526E87Af";

export async function deployCoCreateProject(): Promise<CoCreateProject> {
  const coCreateLaunch = CoCreateLaunch__factory.connect(
    COCREATE_PROTOCOL_GOERLI_ADDR,
    wallet
  );
  console.log("Deploying a CoCreate Project");
  const txn = await coCreateLaunch.deployCoCreateProject(
    "MyProject",
    "MyProject Desc",
    wallet.address
  );
  console.log("Waiting for 1 confirmation");
  const receipt = await txn.wait(1);
  const coCreateProjectDeployedEvent = receipt.events?.find(
    (e) => e.event === "CoCreateProjectDeployed"
  );
  if (coCreateProjectDeployedEvent) {
    return CoCreateProject__factory.connect(
      // @ts-ignore
      coCreateProjectDeployedEvent.args.project,
      wallet
    );
  }
  throw new Error("Failed to deploy project");
}
