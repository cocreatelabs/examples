import { ethers } from "hardhat";
import { CoCreateProject__factory } from "../typechain-types";
import { wallet } from "./utils";

async function createToken() {
  // Set coCreateProjectAddr here
  const coCreateProjectAddr = "0x5f3e0Cc5b4745131046f568592a120C5Ab128206";
  const coCreateProject = CoCreateProject__factory.connect(
    // @ts-ignore
    coCreateProjectAddr,
    wallet
  );
  const projectName = await coCreateProject.name();
  console.log(`coCreateProject ${projectName} at ${coCreateProject.address}`);

  console.log("Deploying a DogPoints Token with a supply of 0");
  const txn = await coCreateProject.deployProjectToken(
    // name
    "DogPoints",
    // description
    "Dog Points",
    // token symbol
    "DOGS",
    // initial supply
    ethers.utils.parseEther("0"),
    // isFixedSupply
    false,
    // isTransferAllowlisted
    false,
    // mint recipients
    [],
    // mint amounts
    []
  );
  console.log("Waiting for 1 confirmation");
  const receipt = await txn.wait(1);
  const tokenDeployedEvent = receipt.events?.find(
    (e) => e.event === "ProjectTokenDeployed"
  );
  console.log(
    // @ts-ignore
    `Successfully deployed DogPoints at address ${tokenDeployedEvent.args.token}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
createToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
