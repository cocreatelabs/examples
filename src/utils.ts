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
  "0xF4852598B2C396Bd600605f4330108A6Bf5A0502";

async function balanceCheck() {
  const balance = await goerliProvider.getBalance(wallet.address);
  console.log(`Your wallet balance: ${ethers.utils.formatEther(balance)}`);
  if (balance.eq(ethers.utils.parseEther("0"))) {
    throw new Error(`Your wallet ${wallet.address} has 0 testnet ETH. Please fund it with some testnet ETH`);
  }

  if (balance.lt(ethers.utils.parseEther("0.5"))) {
    console.log(`WARNING: Your wallet ${wallet.address} has low testnet ETH: ${ethers.utils.formatEther(balance)}. Please fund it with some testnet ETH`);
  }
}

export async function deployCoCreateProject(): Promise<CoCreateProject> {
  await balanceCheck();
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
