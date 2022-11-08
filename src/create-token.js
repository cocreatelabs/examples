"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
async function main() {
    const coCreateProject = await (0, utils_1.deployCoCreateProject)();
    console.log(`coCreateProject created at ${coCreateProject.address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
