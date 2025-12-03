// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialPayroll is ZamaEthereumConfig {
    struct SalaryRecord {
        euint64 encryptedAmount;
        address lastUpdatedBy;
        uint64 lastUpdatedAt;
    }

    error PayrollEmployeeAddressZero();
    error PayrollEmployeeNotRegistered(address employee);

    event SalaryRecorded(
        address indexed employer,
        address indexed employee,
        bytes32 salaryCiphertext,
        uint64 recordedAt
    );

    mapping(address employee => SalaryRecord) private _salaryRecords;
    mapping(address employee => bool) private _hasSalary;
    address[] private _employees;

    function registerSalary(
        address employee,
        externalEuint64 encryptedSalary,
        bytes calldata inputProof
    ) external {
        if (employee == address(0)) {
            revert PayrollEmployeeAddressZero();
        }

        euint64 salary = FHE.fromExternal(encryptedSalary, inputProof);

        SalaryRecord storage record = _salaryRecords[employee];
        record.encryptedAmount = salary;
        record.lastUpdatedBy = msg.sender;
        record.lastUpdatedAt = uint64(block.timestamp);

        if (!_hasSalary[employee]) {
            _hasSalary[employee] = true;
            _employees.push(employee);
        }

        FHE.allowThis(salary);
        FHE.allow(salary, employee);
        FHE.allow(salary, msg.sender);

        emit SalaryRecorded(msg.sender, employee, euint64.unwrap(salary), record.lastUpdatedAt);
    }

    function getSalary(address employee) external view returns (euint64) {
        if (!_hasSalary[employee]) {
            revert PayrollEmployeeNotRegistered(employee);
        }
        return _salaryRecords[employee].encryptedAmount;
    }

    function getSalaryMetadata(address employee) external view returns (address employer, uint64 lastUpdatedAt) {
        if (!_hasSalary[employee]) {
            revert PayrollEmployeeNotRegistered(employee);
        }
        SalaryRecord storage record = _salaryRecords[employee];
        return (record.lastUpdatedBy, record.lastUpdatedAt);
    }

    function hasSalary(address employee) external view returns (bool) {
        return _hasSalary[employee];
    }

    function getEmployees() external view returns (address[] memory) {
        return _employees;
    }
}
