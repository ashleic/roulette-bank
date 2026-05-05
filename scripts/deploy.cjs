const hre = require("hardhat");

const hre = require("hardhat");

async function main() {
  const BankApp = await hre.ethers.getContractFactory("BankApp");
  const bankApp = await BankApp.deploy();

  await bankApp.deployed();

  console.log("BankApp deployed to:", bankApp.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});