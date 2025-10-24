import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("payroll:address", "Prints the ConfidentialPayroll address").setAction(
  async function (_: TaskArguments, hre) {
    const { deployments } = hre;
    const deployment = await deployments.get("ConfidentialPayroll");
    console.log(`ConfidentialPayroll address: ${deployment.address}`);
  }
);

task("payroll:employees", "Lists registered employees")
  .addOptionalParam("address", "Optionally specify the payroll contract address")
  .setAction(async function (taskArgs: TaskArguments, hre) {
    const { deployments, ethers } = hre;

    const deployment = taskArgs.address
      ? { address: taskArgs.address }
      : await deployments.get("ConfidentialPayroll");

    const contract = await ethers.getContractAt("ConfidentialPayroll", deployment.address);
    const employees = await contract.getEmployees();
    if (employees.length === 0) {
      console.log("No employees registered yet.");
      return;
    }

    console.log("Registered employees:");
    employees.forEach((employee: string, index: number) => {
      console.log(`${index + 1}. ${employee}`);
    });
  });

task("payroll:register", "Registers or updates a salary entry")
  .addParam("employee", "Employee address")
  .addParam("amount", "Salary amount as an integer")
  .addOptionalParam("address", "Optionally specify the payroll contract address")
  .setAction(async function (taskArgs: TaskArguments, hre) {
    const { deployments, ethers, fhevm } = hre;

    const amount = BigInt(taskArgs.amount);
    if (amount <= 0n) {
      throw new Error("Amount must be greater than zero");
    }

    await fhevm.initializeCLIApi();

    const deployment = taskArgs.address
      ? { address: taskArgs.address }
      : await deployments.get("ConfidentialPayroll");

    const signers = await ethers.getSigners();
    const employer = signers[0];

    const input = await fhevm.createEncryptedInput(deployment.address, employer.address);
    input.add64(amount);
    const encryptedAmount = await input.encrypt();

    const contract = await ethers.getContractAt("ConfidentialPayroll", deployment.address);
    const tx = await contract
      .connect(employer)
      .registerSalary(taskArgs.employee, encryptedAmount.handles[0], encryptedAmount.inputProof);

    console.log(`Submitted transaction ${tx.hash}, waiting for confirmation...`);
    await tx.wait();
    console.log("Salary registered successfully.");
  });

task("payroll:decrypt", "Decrypts an employee salary for the connected signer")
  .addParam("employee", "Employee address")
  .addOptionalParam("address", "Optionally specify the payroll contract address")
  .setAction(async function (taskArgs: TaskArguments, hre) {
    const { deployments, ethers, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const deployment = taskArgs.address
      ? { address: taskArgs.address }
      : await deployments.get("ConfidentialPayroll");

    const contract = await ethers.getContractAt("ConfidentialPayroll", deployment.address);

    const salary = await contract.getSalary(taskArgs.employee);

    const signers = await ethers.getSigners();
    const requester = signers[0];

    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      salary,
      deployment.address,
      requester
    );

    console.log(`Decrypted salary for ${taskArgs.employee}: ${decrypted}`);
  });

task("cusdc:address", "Prints the ConfidentialUSDC address").setAction(async function (_: TaskArguments, hre) {
  const { deployments } = hre;
  const deployment = await deployments.get("ConfidentialUSDC");
  console.log(`ConfidentialUSDC address: ${deployment.address}`);
});

task("cusdc:mint", "Mints new cUSDC to the caller")
  .addParam("amount", "Amount to mint as an integer")
  .addOptionalParam("address", "Optionally specify the cUSDC contract address")
  .setAction(async function (taskArgs: TaskArguments, hre) {
    const { deployments, ethers } = hre;

    const deployment = taskArgs.address
      ? { address: taskArgs.address }
      : await deployments.get("ConfidentialUSDC");

    const amount = BigInt(taskArgs.amount);
    if (amount <= 0n) {
      throw new Error("Amount must be greater than zero");
    }

    const contract = await ethers.getContractAt("ConfidentialUSDC", deployment.address);
    const signer = (await ethers.getSigners())[0];

    const tx = await contract.connect(signer).mint(amount);
    console.log(`Submitted mint transaction ${tx.hash}, waiting for confirmation...`);
    await tx.wait();
    console.log("Mint completed.");
  });

task("cusdc:balance", "Decrypts the confidential balance for a holder")
  .addParam("holder", "Address to inspect")
  .addOptionalParam("address", "Optionally specify the cUSDC contract address")
  .setAction(async function (taskArgs: TaskArguments, hre) {
    const { deployments, ethers, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const deployment = taskArgs.address
      ? { address: taskArgs.address }
      : await deployments.get("ConfidentialUSDC");

    const contract = await ethers.getContractAt("ConfidentialUSDC", deployment.address);
    const balance = await contract.confidentialBalanceOf(taskArgs.holder);

    const signers = await ethers.getSigners();
    const requester = signers[0];

    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      balance,
      deployment.address,
      requester
    );

    console.log(`Decrypted balance for ${taskArgs.holder}: ${decrypted}`);
  });
