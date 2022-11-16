import { ethers } from "hardhat";
import { deployCoCreateProject, wallet } from "./utils";

async function createToken() {
  const coCreateProject = await deployCoCreateProject();
  console.log(`coCreateProject created at ${coCreateProject.address}`);
  console.log("Deploying a ApeCoin Token with a supply of 1,000,000");
  const txn = await coCreateProject.deployProjectToken(
    // name
    "ApeCoin",
    // description
    "Yuga Labs Token",
    // token symbol
    "APE",
    // initial supply
    ethers.utils.parseEther("1000000"),
    // isFixedSupply
    true,
    // isTransferAllowlisted
    false,
    // mint recipients
    [await wallet.getAddress()],
    // mint amounts
    [ethers.utils.parseEther("1000000")]
  );
  console.log("Waiting for 1 confirmation");
  const receipt = await txn.wait(1);
  const tokenDeployedEvent = receipt.events?.find(
    (e) => e.event === "ProjectTokenDeployed"
  );
  console.log(
    // @ts-ignore
    `Successfully deployed ApeCoin Token at address ${tokenDeployedEvent.args.token}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
createToken().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
