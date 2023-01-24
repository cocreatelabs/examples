import { ethers } from "hardhat";
import { CoCreateERC721A__factory, CoCreateProject__factory } from "../typechain-types";
import { wallet, getPolygonFee } from "./utils";

async function createNFT() {
  // Set coCreateProjectAddr here
  const coCreateProjectAddr = "0xDE608bb96Be4C7132c3b273F25EEfe107856C876";
  const coCreateProject = CoCreateProject__factory.connect(
    // @ts-ignore
    coCreateProjectAddr,
    wallet
  );
  const projectName = await coCreateProject.name();
  console.log(`coCreateProject ${projectName} at ${coCreateProject.address}`);

  console.log("Deploying a NFT Contract");
  const calldata = CoCreateERC721A__factory.createInterface().encodeFunctionData("initialize", [
    "Test NFT",
    "TST",
    "https://bafybeigeh7c662nadnbm7igsaulo74iwkr6mua344txj54x6rhimttj7fy.ipfs.nftstorage.link/",
    wallet.address,
    0,
    5000,
    wallet.address,
  ]);
  const tx = await coCreateProject.deployProxy("CoCreateERC721A", calldata, await getPolygonFee());
  const receipt = await tx.wait();
  const erc721AAddr = receipt.events?.filter(x => {
    return x.event == "ProxyDeployed";
  })[0].args?.proxy;
  const erc721A = CoCreateERC721A__factory.connect(erc721AAddr, wallet);

  console.log(
    // @ts-ignore
    `Successfully deployed NFT Contract at ${erc721AAddr}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
createNFT().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
