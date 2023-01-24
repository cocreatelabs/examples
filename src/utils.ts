import * as dotenv from "dotenv";
import { ethers } from "hardhat";
import {
  CoCreateLaunch__factory,
  CoCreateProject,
  CoCreateProject__factory,
} from "../typechain-types";

// Load .env file
dotenv.config();

export const provider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_PROVIDER
);

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY not set");
}

const privateKey = "0x" + process.env.PRIVATE_KEY;
export const wallet = new ethers.Wallet(privateKey, provider);

export async function getPolygonFee() {
  let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei

  try {
    // https://wiki.polygon.technology/docs/develop/tools/polygon-gas-station/
    const data = await fetch(
      process.env.POLYGON_GAS_ENDPOINT ? process.env.POLYGON_GAS_ENDPOINT : ""
    ).then((response) => response.json());
    maxFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxFee) + "",
      "gwei"
    );
    maxPriorityFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxPriorityFee) + "",
      "gwei"
    );
  } catch {
    console.log("Failed to fetch gas price from Polygon Gas Station, falling back to 40 gwei");
  }
  return {
    maxFeePerGas,
    maxPriorityFeePerGas,
  }
}

async function balanceCheck() {
  const balance = await provider.getBalance(wallet.address);
  console.log(`Your wallet balance: ${ethers.utils.formatEther(balance)}`);
  if (balance.eq(ethers.utils.parseEther("0"))) {
    throw new Error(
      `Your wallet ${wallet.address} has 0 testnet ETH. Please fund it with some testnet ETH`
    );
  }

  if (balance.lt(ethers.utils.parseEther("0.5"))) {
    console.log(
      `WARNING: Your wallet ${
        wallet.address
      } has low testnet ETH: ${ethers.utils.formatEther(
        balance
      )}. Please fund it with some testnet ETH`
    );
  }
}

export async function deployCoCreateProject(
  name: string,
  owner?: string
): Promise<CoCreateProject> {
  await balanceCheck();
  const coCreateLaunch = CoCreateLaunch__factory.connect(
    process.env.COCREATE_LAUNCH_ADDR ? process.env.COCREATE_LAUNCH_ADDR : "",
    wallet
  );
  // if no owner is specified, use the wallet address
  if (!owner) {
    owner = await wallet.getAddress();
  }
  console.log("Deploying a CoCreate Project");
  // https://wiki.polygon.technology/docs/develop/tools/polygon-gas-station/
  const polygonGasFee = await getPolygonFee();
  const txn = await coCreateLaunch.deployCoCreateProject(name, name, owner ? owner : "", polygonGasFee);
  console.log(`Transaction hash: ${txn.hash}`);
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
