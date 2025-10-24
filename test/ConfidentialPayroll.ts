import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("ConfidentialPayroll", function () {
  let employer: HardhatEthersSigner;
  let alternateEmployer: HardhatEthersSigner;
  let employee: HardhatEthersSigner;
  let payrollAddress: string;
  let contract: any;

  before(async function () {
    const signers = await ethers.getSigners();
    employer = signers[0];
    alternateEmployer = signers[1];
    employee = signers[2];
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This test suite requires the mock FHE environment");
      this.skip();
    }

    const factory = await ethers.getContractFactory("ConfidentialPayroll");
    contract = await factory.deploy();
    payrollAddress = await contract.getAddress();
  });

  async function encryptSalary(signer: HardhatEthersSigner, amount: number) {
    const input = await fhevm.createEncryptedInput(payrollAddress, signer.address);
    input.add64(amount);
    return input.encrypt();
  }

  it("registers a salary and allows decrypting it", async function () {
    const salary = 5_000;
    const encrypted = await encryptSalary(employer, salary);

    await contract
      .connect(employer)
      .registerSalary(employee.address, encrypted.handles[0], encrypted.inputProof);

    const cipher = await contract.getSalary(employee.address);
    const clear = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      cipher,
      payrollAddress,
      employer
    );

    expect(clear).to.eq(salary);

    const metadata = await contract.getSalaryMetadata(employee.address);
    expect(metadata[0]).to.eq(employer.address);
    expect(metadata[1]).to.be.gt(0);

    const employees = await contract.getEmployees();
    expect(employees).to.deep.equal([employee.address]);
  });

  it("updates salary when a different employer submits", async function () {
    const firstSalary = 2_000;
    const secondSalary = 4_250;

    const firstEncrypted = await encryptSalary(employer, firstSalary);
    await contract
      .connect(employer)
      .registerSalary(employee.address, firstEncrypted.handles[0], firstEncrypted.inputProof);

    const secondEncrypted = await encryptSalary(alternateEmployer, secondSalary);
    await contract
      .connect(alternateEmployer)
      .registerSalary(employee.address, secondEncrypted.handles[0], secondEncrypted.inputProof);

    const cipher = await contract.getSalary(employee.address);
    const clear = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      cipher,
      payrollAddress,
      alternateEmployer
    );

    expect(clear).to.eq(secondSalary);

    const metadata = await contract.getSalaryMetadata(employee.address);
    expect(metadata[0]).to.eq(alternateEmployer.address);
  });

  it("reverts when querying a missing salary", async function () {
    await expect(contract.getSalary(employee.address)).to.be.revertedWithCustomError(
      contract,
      "PayrollEmployeeNotRegistered"
    );

    await expect(contract.getSalaryMetadata(employee.address)).to.be.revertedWithCustomError(
      contract,
      "PayrollEmployeeNotRegistered"
    );
  });

  it("throws when registering with zero address", async function () {
    const encrypted = await encryptSalary(employer, 1000);
    await expect(
      contract
        .connect(employer)
        .registerSalary(ethers.ZeroAddress, encrypted.handles[0], encrypted.inputProof)
    ).to.be.revertedWithCustomError(contract, "PayrollEmployeeAddressZero");
  });
});
