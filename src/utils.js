"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCoCreateProject = exports.COCREATE_PROTOCOL_GOERLI_ADDR = exports.wallet = exports.goerliProvider = void 0;
const CoCreateInstance__factory_1 = require("./../typechain-types/factories/contracts/createinstance/CoCreateInstance__factory");
const dotenv = __importStar(require("dotenv"));
const typechain_types_1 = require("../typechain-types");
const hardhat_1 = require("hardhat");
// Load .env file
dotenv.config();
exports.goerliProvider = new hardhat_1.ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
const privateKey = "0x" + process.env.PRIVATE_KEY;
exports.wallet = new hardhat_1.ethers.Wallet(privateKey, exports.goerliProvider);
exports.COCREATE_PROTOCOL_GOERLI_ADDR = "0x29d89c8Cc4f5Bb0e9EB97Df756fdaA457DfF1F8C";
async function deployCoCreateProject() {
    const coCreateProtocol = typechain_types_1.CoCreateProtocol__factory.connect(exports.COCREATE_PROTOCOL_GOERLI_ADDR, exports.wallet);
    console.log("Deploying a CoCreate Project");
    const txn = await coCreateProtocol.deployCoCreateInstance("MyProject", "MyProject Desc", exports.wallet.address);
    console.log("Waiting for 1 confirmation");
    const receipt = await txn.wait(1);
    const coCreateInstanceDeployedEvent = receipt.events?.find((e) => e.event === 'CoCreateInstanceDeployed');
    if (coCreateInstanceDeployedEvent) {
        return CoCreateInstance__factory_1.CoCreateInstance__factory.connect(
        // @ts-ignore
        coCreateInstanceDeployedEvent.args.coCreateInstance, exports.wallet);
    }
    throw new Error("Failed to deploy project");
}
exports.deployCoCreateProject = deployCoCreateProject;
