import { CoCreateProtocol__factory } from "../typechain-types";
import {
  COCREATE_PROTOCOL_GOERLI_ADDR,
  deployCoCreateProject,
  wallet,
} from "./utils";
import { ethers } from "hardhat";

async function createToken() {
  const coCreateProject = await deployCoCreateProject();
  console.log(`coCreateProject created at ${coCreateProject.address}`);
  console.log("Deploying a ApeCoin Token with a supply of 1,000,000");
  const txn = await coCreateProject.deployInstanceToken(
    "ApeCoin",
    "Yuga Labs Token",
    "APE",
    ethers.utils.parseEther("1000000"),
    true,
    false,
    [await wallet.getAddress()],
    [ethers.utils.parseEther("1000000")]
  );
  console.log("Waiting for 1 confirmation");
  const receipt = await txn.wait(1);
  console.log("Successfully deployed ApeCoin Token");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
createToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
