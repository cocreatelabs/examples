import { ethers } from "hardhat";
import { ProjectToken__factory } from "../typechain-types";
import { deployCoCreateProject, wallet } from "./utils";

async function transferRestrictions() {
  const coCreateProject = await deployCoCreateProject("project name");
  console.log(`coCreateProject created at ${coCreateProject.address}`);
  console.log("Deploying a ApeCoin Token with a supply of 1,000,000");
  // isTransferAllowlisted is false - There are no transfer restrictions set
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
  const projectToken = ProjectToken__factory.connect(
    // @ts-ignore
    tokenDeployedEvent.args.token,
    wallet
  );

  console.log("Updating the transfer allowlist");
  // We can enable transfer restrictions and add/remove addresses form the allowlist
  const updateAllowlistTxn = await projectToken.updateAllowlist(
    // addresses to be added to the allowlist
    [wallet.address],
    // addresses to be removed from the allowlist
    [],
    // Enable transfer restrictions
    true
  );
  console.log("Waiting for 1 confirmation");
  await updateAllowlistTxn.wait(1);
  console.log("Successfully updated the transfer allowlist");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
transferRestrictions().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
