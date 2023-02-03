import { ethers } from "hardhat";
import { CoCreateERC721A__factory, CoCreateProject__factory } from "../typechain-types";
import { wallet, getPolygonFee } from "./utils";

async function createNFT() {
  // Set coCreateProjectAddr here
  const coCreateProjectAddr = "0xfB8ca074f815E0e3a8d986f602b83E7095c7A6ce";
  const coCreateProject = CoCreateProject__factory.connect(
    // @ts-ignore
    coCreateProjectAddr,
    wallet
  );
  const projectName = await coCreateProject.name();
  console.log(`coCreateProject ${projectName} at ${coCreateProject.address}`);

  console.log("Deploying a NFT Contract");
  // 0x3FEA205BB94500e0d6d461B3393845F3bA337716 corresponds to kms ccdfae38-a541-47e4-8637-f56717840d27 bulleit-dev

  const calldata = CoCreateERC721A__factory.createInterface().encodeFunctionData("initialize", [
    "Test NFT",
    "TST",
    "https://bafybeigeh7c662nadnbm7igsaulo74iwkr6mua344txj54x6rhimttj7fy.ipfs.nftstorage.link/",
    "0x3FEA205BB94500e0d6d461B3393845F3bA337716",
    0,
    5000,
    "0x3FEA205BB94500e0d6d461B3393845F3bA337716",
  ]);
  const tx = await coCreateProject.deployProxy("CoCreateERC721A", calldata, await getPolygonFee());
  const receipt = await tx.wait();
  const erc721AAddr = receipt.events?.filter(x => {
    return x.event == "ProxyDeployed";
  })[0].args?.proxy;
  const erc721A = CoCreateERC721A__factory.connect(erc721AAddr, wallet);
  // const tx2 = await erc721A.transferOwnership("0x3FEA205BB94500e0d6d461B3393845F3bA337716")
  // const receipt2 = await tx2.wait();

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
