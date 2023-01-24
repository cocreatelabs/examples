import { deployCoCreateProject } from "./utils";

async function createProject() {
  const coCreateProject = await deployCoCreateProject("Ankush");
  console.log(`coCreateProject created at ${coCreateProject.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
createProject().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
