import { ethers } from "hardhat";
import { ProjectToken__factory } from "../typechain-types";
import { deployCoCreateProject, wallet } from "./utils";

async function mintAndBurn() {
  const coCreateProject = await deployCoCreateProject();
  console.log(`coCreateProject created at ${coCreateProject.address}`);
  console.log("Deploying a ApeCoin Token with a supply of 0");
  const txn = await coCreateProject.deployProjectToken(
    // name
    "ApeCoin",
    // description
    "Yuga Labs Token",
    // token symbol
    "APE",
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
  console.log("Waiting for 2 confirmation");
  const receipt = await txn.wait(2);
  const tokenDeployedEvent = receipt.events?.find(
    (e) => e.event === "ProjectTokenDeployed"
  );
  console.log(
    // @ts-ignore
    `Successfully deployed ApeCoin Token at address ${tokenDeployedEvent.args.token}`
  );

  // Minting tokens (isFixedSupply: should be false)
  const projectToken = ProjectToken__factory.connect(
    // @ts-ignore
    tokenDeployedEvent.args.token,
    wallet
  );

  const mintWallet1 = ethers.Wallet.createRandom();
  const mintWallet2 = ethers.Wallet.createRandom();
  const mintWallet3 = ethers.Wallet.createRandom();
  console.log(`Batch minting to addresses ${wallet.address} ${mintWallet1.address} ${mintWallet2.address} ${mintWallet3.address}`);
  const mintTxn = await projectToken.mintBatch(
    [wallet.address, mintWallet1.address, mintWallet2.address, mintWallet3.address],
    [
      ethers.utils.parseEther("10000"),
      ethers.utils.parseEther("5000"),
      ethers.utils.parseEther("3000"),
      ethers.utils.parseEther("25000"),
    ]
  );
  console.log("Waiting for 2 confirmations");
  await mintTxn.wait(2);
  console.log("Mint successful");
  console.log(`Token Balance after mint: ${ethers.utils.formatEther(await projectToken.balanceOf(wallet.address))}`);

  // Burn tokens from a wallet that you own
  console.log("Burning 2000 tokens from your wallet");
  const burnTxn = await projectToken.burn(ethers.utils.parseEther("2000"));
  console.log("Waiting for 2 confirmations");
  await burnTxn.wait(2);
  console.log("Burn successful");
  console.log(`Token Balance after burn: ${ethers.utils.formatEther(await projectToken.balanceOf(wallet.address))}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintAndBurn().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
