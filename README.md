# Anonymous Payroll

A privacy-preserving payroll management system built with Fully Homomorphic Encryption (FHE) on Ethereum, enabling employers to manage employee salaries with complete on-chain confidentiality.

## 🎯 Overview

Anonymous Payroll is a decentralized application that revolutionizes payroll management by leveraging Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine) technology. The system allows employers to record, manage, and distribute salaries while keeping all sensitive compensation data encrypted on-chain. Unlike traditional payroll systems that expose salary information to administrators or require off-chain storage, Anonymous Payroll ensures that salary amounts remain confidential and can only be decrypted by authorized parties: the employer, the employee, and the smart contract itself.

The project consists of two main smart contracts deployed on Ethereum's Sepolia testnet: **ConfidentialPayroll** for managing encrypted salary records, and **ConfidentialUSDC** for confidential token transfers. A modern React-based web interface provides seamless interaction with the blockchain, offering wallet integration, salary registration with automatic encryption, and decryption capabilities for authorized users.

## 🚀 Key Features

### Privacy & Security
- **Zero-Knowledge Salary Storage**: Employee salaries are encrypted client-side using FHE before being stored on-chain, ensuring no plaintext data is ever exposed
- **Granular Access Control**: Only the employer, employee, and contract itself can decrypt salary information through cryptographic permission management
- **EIP-712 Signed Decryption**: All decryption requests require cryptographically signed user authorization, preventing unauthorized access
- **Immutable Audit Trail**: All salary registrations and updates emit blockchain events with timestamps and employer addresses for compliance and transparency

### Confidential Payments
- **Encrypted Token Transfers**: Salary payments use ConfidentialUSDC, an FHE-enabled token that keeps transaction amounts private
- **Direct On-Chain Payouts**: Employers can send encrypted salary payments directly from the web interface
- **Balance Privacy**: Employee token balances remain encrypted on-chain, visible only to the token holder

### User Experience
- **Multi-Wallet Support**: Integration with 20+ wallet providers through RainbowKit (MetaMask, WalletConnect, Coinbase Wallet, etc.)
- **Real-Time Decryption**: Authorized users can decrypt salary information instantly through Zama's relayer network
- **Intuitive Dashboard**: Clean, tab-based interface for salary registration and employee management
- **Automatic Encryption**: FHE encryption is handled seamlessly in the background—users simply input amounts in plaintext

### Smart Contract Architecture
- **Gas-Optimized**: Solidity optimizer configured for 800 runs, balancing deployment cost with execution efficiency
- **Extensible Design**: Modular contract structure allows for future feature additions without disrupting core functionality
- **Upgradeable Metadata**: Salary records track employer addresses and update timestamps for historical record-keeping
- **Employee Directory**: Maintain a queryable list of all registered employees while preserving salary confidentiality

## 💡 Problems Solved

### 1. Salary Privacy in Traditional Systems
**Problem**: Conventional payroll systems require administrators, accountants, and third-party processors to access employee salary information in plaintext. This creates privacy vulnerabilities and exposes sensitive compensation data to unnecessary parties.

**Solution**: Anonymous Payroll encrypts salaries using FHE before storage. The encryption happens client-side, and even blockchain validators cannot see plaintext amounts. Only cryptographically authorized parties (employer and employee) can decrypt the data.

### 2. Centralized Payroll Data Breaches
**Problem**: Centralized databases storing payroll information are frequent targets for hackers. Data breaches can expose thousands of employees' sensitive financial information, leading to identity theft and fraud.

**Solution**: By storing encrypted data on a decentralized blockchain, Anonymous Payroll eliminates single points of failure. Even if the blockchain is publicly accessible, the encrypted data is mathematically protected by FHE cryptography.

### 3. Trust Requirements in Off-Chain Systems
**Problem**: Traditional payroll requires employees to trust employers and payroll processors to handle their data responsibly. There's no cryptographic guarantee that data won't be misused or shared without consent.

**Solution**: Smart contracts provide trustless execution—the code enforces access controls automatically. Employees can cryptographically verify that only they and their employer can decrypt their salary, with no need to trust third parties.

### 4. Lack of Transparency in Compensation Updates
**Problem**: Employees often don't have real-time visibility into salary updates or a verifiable audit trail showing when and how their compensation changed.

**Solution**: All salary registrations emit blockchain events with timestamps and employer addresses. Employees can independently verify their salary history without relying on employer-provided documents.

### 5. Cross-Border Payment Privacy
**Problem**: International payroll involves multiple intermediaries (banks, payment processors, currency exchanges), each with access to transaction details including amounts and recipient information.

**Solution**: ConfidentialUSDC enables direct peer-to-peer encrypted payments on-chain. The transfer amounts remain private, and the transaction settles without intermediaries accessing sensitive payment details.

### 6. Regulatory Compliance with Privacy
**Problem**: Some jurisdictions require payroll confidentiality while others mandate certain disclosures. Balancing these requirements is complex with traditional systems.

**Solution**: FHE allows selective disclosure—data exists in encrypted form for compliance purposes, but can be decrypted by authorized auditors or regulators through permission grants, all enforced by smart contracts.

## 🛠️ Technology Stack

### Smart Contracts
| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | ^0.8.27 | Primary smart contract language |
| **Hardhat** | ^2.26.0 | Development environment and testing framework |
| **@fhevm/solidity** | ^0.8.0 | Zama's FHE library for encrypted computation |
| **@zama-fhe/oracle-solidity** | ^0.1.0 | Decryption oracle integration |
| **encrypted-types** | ^0.0.4 | Type definitions for encrypted data structures |
| **new-confidential-contracts** | ^0.1.1 | Zama's confidential token implementations |
| **ethers.js** | ^6.15.0 | Ethereum interaction library |
| **hardhat-deploy** | ^0.12.6 | Deterministic contract deployment plugin |
| **TypeChain** | ^8.3.4 | TypeScript bindings generator for contracts |
| **solidity-coverage** | ^0.8.16 | Code coverage analysis |
| **Solhint** | ^5.0.4 | Solidity linter for code quality |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **TypeScript** | ^5.7.3 | Type-safe JavaScript |
| **Vite** | 7.1.6 | Build tool and dev server |
| **Wagmi** | 2.17.0 | React hooks for Ethereum |
| **viem** | 2.37.6 | Lightweight Ethereum client |
| **RainbowKit** | 2.2.8 | Wallet connection interface (20+ wallets) |
| **TanStack React Query** | 5.89.0 | Async state management and caching |
| **@zama-fhe/relayer-sdk** | ^0.2.0 | FHE encryption/decryption service |
| **ethers.js** | ^6.15.0 | Contract interaction and transaction signing |
| **ESLint** | ^9.20.0 | Code linting |
| **Prettier** | ^3.5.0 | Code formatting |

### Blockchain Infrastructure
- **Network**: Ethereum Sepolia Testnet (Chain ID: 11155111)
- **RPC Provider**: Infura
- **EVM Version**: Cancun (latest Ethereum upgrade)
- **Compiler Optimization**: 800 runs (balanced for frequent contract interaction)

### Development Tools
- **Package Manager**: npm with package-lock.json
- **Testing Framework**: Mocha + Chai
- **Type Generation**: TypeChain with ethers-v6 target
- **Deployment**: Hardhat Deploy with hardhat-deploy-ethers
- **Hosting**: Netlify-compatible (configured in netlify.toml)

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User (Browser)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite + TypeScript)                      │   │
│  │  - Wagmi/RainbowKit (Wallet Connection)                  │   │
│  │  - Zama Relayer SDK (FHE Encryption)                     │   │
│  │  - Ethers.js (Contract Interaction)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ HTTPS (RPC Calls)
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              Ethereum Sepolia Testnet (Blockchain)              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ConfidentialPayroll Contract                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ mapping(address => SalaryRecord)                   │  │  │
│  │  │   - euint64 encryptedSalary                        │  │  │
│  │  │   - address employer                               │  │  │
│  │  │   - uint64 lastUpdated                             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  Functions:                                                │  │
│  │  • registerSalary(address, externalEuint64, proof)        │  │
│  │  • getSalary(address) → euint64                           │  │
│  │  • getSalaryMetadata() → (employer, timestamp)            │  │
│  │  • getEmployees() → address[]                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ConfidentialUSDC Contract (FHE Token)                   │  │
│  │  - Inherits ConfidentialFungibleToken                    │  │
│  │  - Encrypted balances (euint64)                          │  │
│  │  - confidentialTransfer(address, externalEuint64)        │  │
│  │  - mint(address, amount)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                        ↑
                        │ Decryption Requests (EIP-712 Signed)
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              Zama Relayer Network (Off-Chain)                   │
│  - Receives signed decryption requests                          │
│  - Verifies user authorization via signatures                   │
│  - Performs FHE decryption using oracle network                 │
│  - Returns plaintext values to authorized users                 │
└─────────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

#### ConfidentialPayroll.sol
The core contract responsible for salary management with FHE.

**State Variables:**
```solidity
struct SalaryRecord {
    euint64 encryptedSalary;  // FHE-encrypted salary amount
    address employer;          // Who registered/updated the salary
    uint64 lastUpdated;        // Unix timestamp of last update
}

mapping(address => SalaryRecord) private salaries;
mapping(address => bool) private registered;
address[] private employees;
```

**Key Functions:**
- `registerSalary(address employee, externalEuint64 memory salary, bytes calldata proof)`:
  - Converts external encrypted input to on-chain euint64
  - Grants decryption permission to employee, employer, and contract
  - Stores salary record with metadata
  - Emits SalaryRecorded event

- `getSalary(address employee)`: Returns encrypted salary (euint64) for authorized decryption
- `getSalaryMetadata(address employee)`: Returns employer address and last update timestamp
- `getEmployees()`: Returns array of all registered employee addresses

**Access Control:**
- Salary encryption: Client-side before submission
- Salary decryption: Requires FHE permission + EIP-712 signature
- Registration: Anyone can register (employer verification happens via signature in frontend)

#### ConfidentialUSDC.sol
FHE-enabled ERC20 token for confidential salary payments.

**Features:**
- Inherits `ConfidentialFungibleToken` from Zama's library
- All balances stored as `euint64` (encrypted 64-bit unsigned integers)
- Standard `transfer()` and `confidentialTransfer()` for encrypted amount transfers
- `mint()` function for testing (creates tokens for specified address)
- 6 decimal places (matches real USDC)

**Security:**
- Transfer amounts encrypted end-to-end
- Balances only visible to token holder
- All ERC20 operations work on encrypted values

### Frontend Architecture

#### Component Hierarchy
```
App (Providers Setup)
├── WagmiProvider (Blockchain Connection)
│   └── QueryClientProvider (React Query)
│       └── RainbowKitProvider (Wallet UI)
│           └── PayrollApp (Main Application)
│               ├── Header
│               │   └── RainbowKit ConnectButton
│               └── Tab Navigation
│                   ├── Register Salary Tab
│                   │   └── SalaryRegistration Component
│                   │       ├── Employee Address Input
│                   │       ├── Salary Amount Input
│                   │       ├── Zama Encryption (createEncryptedInput)
│                   │       └── Submit Transaction
│                   └── Manage Employees Tab
│                       └── EmployeeManager Component
│                           ├── useContractRead (get employees list)
│                           └── EmployeeRow[] (for each employee)
│                               ├── Address Display
│                               ├── Decrypt Salary Button
│                               │   ├── Generate Keypair
│                               │   ├── Sign EIP-712 Request
│                               │   └── Call Zama Relayer
│                               └── Send cUSDC Payout Button
│                                   ├── Encrypt Amount
│                                   └── confidentialTransfer()
```

#### Custom React Hooks

**useZamaInstance()**
- Initializes Zama FHE instance for encryption operations
- Manages instance lifecycle (creation, caching, cleanup)
- Provides `createEncryptedInput()` for salary encryption
- Returns: `{ instance, isLoading, error }`

**useEthersSigner()**
- Converts Wagmi's wallet client to ethers.js Signer
- Enables contract write operations with ethers library
- Bridges Wagmi (read) and Ethers (write) patterns
- Returns: `Signer | undefined`

#### Data Flow Examples

**Registering a Salary:**
```
1. User inputs employee address and salary amount (plaintext)
2. Frontend validates inputs (address format, amount > 0)
3. useZamaInstance() creates FHE encrypted input
4. Add salary amount as 64-bit encrypted value
5. Call contract.registerSalary(employee, encryptedSalary, proof)
6. Transaction submitted to Sepolia testnet
7. Contract stores encrypted salary with employer address and timestamp
8. SalaryRecorded event emitted
9. Frontend updates employee list
```

**Decrypting and Paying a Salary:**
```
1. User clicks "Decrypt Salary" for an employee
2. Frontend generates Zama keypair
3. Create EIP-712 signature request for decryption
4. User signs with wallet (MetaMask popup)
5. Send signed request to Zama relayer network
6. Relayer verifies signature and checks FHE permissions
7. Oracle network decrypts euint64 → plaintext
8. Decrypted amount displayed in UI
9. User clicks "Send cUSDC Payout"
10. Frontend encrypts payout amount using Zama SDK
11. Call cUSDC.confidentialTransfer(employee, encryptedAmount, proof)
12. Transaction submitted and employee receives encrypted tokens
```

### FHE (Fully Homomorphic Encryption) Deep Dive

#### What is FHE?
Fully Homomorphic Encryption is a cryptographic technique that allows computations to be performed on encrypted data without decrypting it first. In the context of Anonymous Payroll:

- **Encrypted Storage**: Salary amounts are stored as `euint64` (encrypted 64-bit unsigned integers)
- **Encrypted Computation**: Smart contracts can compare, add, or transfer encrypted values without seeing plaintext
- **Selective Decryption**: Only parties with proper cryptographic permissions can decrypt specific values

#### How It Works in This Project

**Encryption Flow:**
1. User inputs salary: `$5000` (plaintext)
2. Frontend uses Zama SDK: `createEncryptedInput(contractAddress, userAddress)`
3. Add value: `input.add64(5000 * 10^6)` // Convert to 6 decimals
4. Generate proof: `input.encrypt()` → returns `{handles, proof}`
5. Submit to blockchain: `registerSalary(employee, handles[0], proof)`

**On-Chain Storage:**
```solidity
// Value stored as euint64 (never plaintext)
euint64 encrypted = FHE.fromExternal(externalEncrypted, proof);
salaries[employee].encryptedSalary = encrypted;

// Grant decryption permissions
FHE.allow(encrypted, employee);        // Employee can decrypt
FHE.allow(encrypted, msg.sender);      // Employer can decrypt
FHE.allowThis(encrypted);              // Contract can decrypt
```

**Decryption Flow:**
1. User requests decryption from frontend
2. Generate keypair: `const { publicKey, privateKey } = generateKeypair()`
3. Create EIP-712 typed data with public key and contract address
4. User signs with wallet
5. Send to Zama relayer: `relayer.decrypt(encryptedValue, signature)`
6. Relayer verifies:
   - Signature is valid (user owns the address)
   - Address has FHE permission for this encrypted value
7. Oracle network performs decryption
8. Plaintext returned to requester

#### Security Guarantees

- **Confidentiality**: Blockchain validators, block explorers, and other contracts cannot see plaintext salary values
- **Authorization**: Decryption requires both cryptographic permission (FHE.allow) AND valid EIP-712 signature
- **Integrity**: Encrypted values cannot be tampered with—any modification breaks the cryptographic proof
- **Auditability**: Permission grants are on-chain and verifiable, creating an audit trail of who can decrypt what

## 📦 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Anonymous-Payroll.git
cd Anonymous-Payroll
```

### 2. Install Smart Contract Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Sepolia testnet RPC
INFURA_API_KEY=your_infura_api_key_here

# Deployment wallet (12-word seed phrase)
MNEMONIC="your twelve word mnemonic phrase here for deployment"

# Optional: Etherscan API for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 4. Compile Smart Contracts
```bash
npm run compile
```

This generates:
- Contract artifacts in `artifacts/`
- TypeChain TypeScript bindings in `typechain-types/`
- ABI files for frontend integration

### 5. Run Tests (Optional)
```bash
npm run test
```

Tests use Hardhat's built-in FHE mock environment to simulate encryption/decryption.

### 6. Deploy Contracts to Sepolia
```bash
npm run deploy:sepolia
```

After deployment, note the contract addresses:
- `ConfidentialPayroll deployed to: 0x...`
- `ConfidentialUSDC deployed to: 0x...`

### 7. Verify Contracts on Etherscan (Optional)
```bash
npm run verify:sepolia
```

### 8. Setup Frontend
```bash
cd ui
npm install
```

### 9. Configure Frontend Environment
Create `ui/.env`:
```env
VITE_PAYROLL_ADDRESS=0x_your_deployed_payroll_contract_address
VITE_CUSDC_ADDRESS=0x_your_deployed_cusdc_contract_address
```

### 10. Run Development Server
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 11. Build for Production
```bash
npm run build
```

Built files will be in `ui/dist/` ready for deployment to Netlify or any static host.

## 🎮 Usage Guide

### For Employers

#### Register Employee Salary
1. **Connect Wallet**: Click "Connect Wallet" in the top-right corner
2. **Select Wallet**: Choose your preferred wallet (MetaMask, WalletConnect, etc.)
3. **Switch to Sepolia**: Ensure your wallet is connected to Sepolia testnet
4. **Navigate to "Register Salary" Tab**
5. **Enter Employee Details**:
   - **Employee Address**: The Ethereum address of the employee (0x...)
   - **Salary Amount**: Annual salary in USD (e.g., 50000 for $50,000)
6. **Submit**: Click "Register Salary"
7. **Approve Transaction**: Confirm in your wallet
8. **Wait for Confirmation**: Transaction will be mined in ~15 seconds

**What Happens:**
- Your input is encrypted using FHE before submission
- Encrypted salary is stored on-chain with your address as employer
- Employee is added to the employee directory
- Timestamp is recorded for audit purposes
- Only you and the employee can decrypt this salary

#### Update Existing Salary
- Simply register the salary again with the same employee address
- New encrypted value overwrites the old one
- Employer address and timestamp are updated
- Previous salary history is not retained (designed for current salary only)

#### Pay Employees
1. **Navigate to "Manage Employees" Tab**
2. **View Employee List**: All registered employees appear in the table
3. **Decrypt Salary** (if needed):
   - Click "Decrypt Salary" next to employee
   - Sign the decryption request in your wallet
   - Decrypted amount appears in the UI
4. **Send Payment**:
   - Click "Send cUSDC Payout" next to employee
   - Confirm the transaction in your wallet
   - Payment is sent as encrypted ConfidentialUSDC
5. **Verify**: Check transaction on Sepolia Etherscan

**Note**: You must have sufficient cUSDC balance. Use the mint function from Hardhat tasks to create test tokens.

### For Employees

#### View Your Salary
1. **Connect Wallet**: Use the wallet address that was registered as employee
2. **Navigate to "Manage Employees" Tab**
3. **Find Your Address**: Look for your address in the employee list
4. **Decrypt Salary**:
   - Click "Decrypt Salary" next to your address
   - Sign the decryption request
   - Your salary appears in plaintext (only visible to you)

**Privacy Note**: The decryption happens off-chain through Zama's relayer. Even when decrypted, the value is only shown in your browser—it's not broadcast to the blockchain or visible to others.

#### Check Your cUSDC Balance
Currently, balance checking requires using Hardhat tasks (CLI). Future frontend versions will include a balance display component.

```bash
npm run cusdc:balance -- --account 0xYourAddress
```

### For Developers

#### Hardhat Tasks Reference

**Payroll Tasks:**
```bash
# Get deployed payroll contract address
npm run payroll:address

# List all registered employees
npm run payroll:employees

# Register a salary via CLI (uses encryption)
npm run payroll:register -- --employee 0x... --amount 50000

# Decrypt an employee's salary (requires signer authorization)
npm run payroll:decrypt -- --employee 0x...
```

**ConfidentialUSDC Tasks:**
```bash
# Get deployed cUSDC contract address
npm run cusdc:address

# Mint test tokens
npm run cusdc:mint -- --account 0x... --amount 10000

# Check encrypted balance
npm run cusdc:balance -- --account 0x...
```

**Account Management:**
```bash
# List available accounts from mnemonic
npx hardhat accounts
```

#### Testing Locally with Hardhat Node

1. **Start Local Node** (in one terminal):
```bash
npx hardhat node
```

2. **Deploy to Local** (in another terminal):
```bash
npx hardhat deploy --network localhost
```

3. **Run Tasks Against Local**:
```bash
npx hardhat payroll:employees --network localhost
```

**Note**: Local FHE testing uses mocks. Full FHE functionality requires Sepolia or other Zama-supported networks.

## 🔧 Configuration

### Hardhat Configuration
`hardhat.config.ts` contains:
- **Network Settings**: Sepolia RPC URL, chain ID, gas settings
- **Compiler Options**: Solidity version, optimizer runs, EVM version
- **Plugins**: hardhat-deploy, typechain, gas-reporter, coverage
- **Paths**: Custom paths for deployments, tests, artifacts

Key settings:
```typescript
solidity: {
  version: "0.8.27",
  settings: {
    optimizer: { enabled: true, runs: 800 },
    evmVersion: "cancun"
  }
}
```

### Wagmi Configuration
`ui/src/config/wagmi.ts` configures:
- **Chains**: Sepolia testnet
- **Transports**: HTTP provider (Infura or public RPC)
- **Wallet Connectors**: RainbowKit's default connectors (20+ wallets)

### Contract Configuration
`ui/src/config/contracts.ts` exports:
- **Contract Addresses**: From environment variables
- **ABIs**: Imported from contract artifacts
- **Type-Safe Contract Interfaces**: Generated by TypeChain

## 🧪 Testing

### Smart Contract Tests
Location: `test/ConfidentialPayroll.ts`

**Test Cases:**
1. ✅ **Salary Registration and Decryption**
   - Registers encrypted salary
   - Verifies decryption by authorized party
   - Validates timestamp and employer metadata

2. ✅ **Multi-Employer Updates**
   - Multiple employers update same employee's salary
   - Verifies last employer is recorded correctly
   - Ensures salary overwrites work properly

3. ✅ **Unregistered Employee Error Handling**
   - Attempts to get salary for non-existent employee
   - Verifies appropriate revert occurs

4. ✅ **Zero Address Validation**
   - Tests rejection of 0x0 as employee address
   - Validates input sanitization

**Running Tests:**
```bash
# Run all tests
npm run test

# Run with coverage
npm run coverage

# Run specific test file
npx hardhat test test/ConfidentialPayroll.ts

# Run with gas reporting
REPORT_GAS=true npm run test
```

### Frontend Testing (Future)
Currently, frontend testing is manual. Planned additions:
- Jest + React Testing Library for component tests
- Playwright for E2E tests
- Mock Wagmi providers for isolated testing

## 📊 Gas Optimization

The project implements several gas optimization strategies:

### Compiler Optimizations
- **800 optimizer runs**: Balanced for moderate usage frequency
- **Cancun EVM**: Uses latest Ethereum upgrades for efficiency

### Storage Patterns
- **Packed structs**: SalaryRecord struct uses optimal ordering
  ```solidity
  struct SalaryRecord {
      euint64 encryptedSalary;  // 256 bits (FHE encrypted)
      address employer;          // 160 bits
      uint64 lastUpdated;        // 64 bits (packed with address)
  }
  ```
- **Minimal mappings**: Only two mappings required (salaries, registered)
- **Array optimization**: Employee array uses push() for O(1) additions

### Function Efficiency
- **View functions**: getSalary, getEmployees, getSalaryMetadata are read-only (no gas cost for calls)
- **Event emission**: Only one event per registration (SalaryRecorded)
- **No redundant checks**: Permission checks handled by FHE library

### Transaction Cost Estimates (Sepolia)
- **Register Salary**: ~200,000-300,000 gas (first time for employee)
- **Update Salary**: ~100,000-150,000 gas (subsequent updates)
- **Mint cUSDC**: ~80,000-120,000 gas
- **Confidential Transfer**: ~150,000-200,000 gas

**Note**: FHE operations are more expensive than standard operations due to cryptographic overhead. These costs are expected to decrease as Zama's technology matures.

## 🔐 Security Considerations

### Smart Contract Security

#### Access Control
- ✅ **No Owner/Admin Functions**: Contracts are permissionless—no centralized control
- ✅ **Employee Self-Registration**: Any employer can register any employee (flexibility vs. restriction trade-off)
- ⚠️ **No Employer Verification**: Currently, anyone can claim to be an employer for any employee address
  - Mitigation: Future version could add employer whitelisting or employee confirmation flow

#### FHE Security
- ✅ **Encryption at Source**: All sensitive data encrypted before leaving user's browser
- ✅ **Permission Enforcement**: FHE library enforces access control at cryptographic level
- ✅ **Signature Requirements**: Decryption requires valid EIP-712 signatures
- ✅ **No Plaintext Storage**: No salary amounts ever stored in plaintext on-chain

#### Common Vulnerabilities
- ✅ **Reentrancy**: Not applicable (no external calls in state-changing functions)
- ✅ **Integer Overflow**: Solidity 0.8.x has built-in overflow protection
- ✅ **Front-Running**: Encrypted values prevent extractable value from front-running
- ⚠️ **Zero Address**: Validated in contract (reverts if employee == address(0))

### Frontend Security

#### Wallet Integration
- ✅ **No Private Key Handling**: All signing happens in user's wallet
- ✅ **EIP-712 Typed Data**: Human-readable signature requests (prevents blind signing)
- ✅ **Transaction Simulation**: Wagmi shows estimated gas and effects before signing

#### Data Handling
- ✅ **No Plaintext Transmission**: Encrypted values sent to blockchain
- ✅ **Client-Side Decryption**: Decrypted data never leaves user's browser
- ⚠️ **Local Storage**: No sensitive data stored in localStorage (good practice maintained)

#### Dependencies
- ✅ **Regular Updates**: Dependencies updated to latest stable versions
- ⚠️ **Supply Chain Risk**: Project depends on Zama's relayer infrastructure
  - Mitigation: Zama is a well-funded, reputable team with ongoing development

### Recommended Security Practices for Users

**For Employers:**
1. Verify employee addresses carefully before registration (typos cannot be easily corrected)
2. Use a dedicated wallet for payroll operations (separation of concerns)
3. Keep your seed phrase/private key secure (standard Web3 security)
4. Regularly audit employee list to ensure only authorized employees are registered

**For Employees:**
1. Never share your private key or seed phrase
2. Verify the contract address matches the official deployment before interacting
3. Check Etherscan for transaction history to verify salary registrations
4. Be cautious of phishing sites—always verify the URL

### Audit Status
⚠️ **Not Audited**: This project has not undergone a professional security audit. It is intended for educational and demonstration purposes.

**Before Production Use:**
- Conduct formal security audit by reputable firm
- Implement time-locks for critical functions
- Add multi-signature controls for high-value operations
- Deploy to mainnet with gradual rollout strategy

## 🌟 Advantages Over Traditional Systems

### 1. Cryptographic Privacy Guarantees
**Traditional Systems**: Rely on access controls and trust—admins can always see data.
**Anonymous Payroll**: Mathematical guarantee that unauthorized parties cannot decrypt salaries, even if they control the database.

### 2. Decentralization & Censorship Resistance
**Traditional Systems**: Centralized databases can be shut down, censored, or seized.
**Anonymous Payroll**: Deployed on public blockchain—no single entity can shut it down or prevent access.

### 3. Transparency with Privacy
**Traditional Systems**: Either fully transparent (public records) or fully opaque (no verification).
**Anonymous Payroll**: Encrypted data is publicly auditable for compliance, but only decryptable by authorized parties.

### 4. Reduced Data Breach Impact
**Traditional Systems**: Breaches expose complete salary databases in plaintext.
**Anonymous Payroll**: Even if blockchain data is accessed, it's encrypted—attacker would need to break FHE cryptography (computationally infeasible).

### 5. Programmable Compliance
**Traditional Systems**: Compliance requires manual processes and third-party auditors.
**Anonymous Payroll**: Smart contracts can automatically enforce rules (e.g., minimum wage, pay frequency) while maintaining privacy.

### 6. Cost Efficiency
**Traditional Systems**: Require expensive payroll processors, database hosting, security infrastructure.
**Anonymous Payroll**: Blockchain transaction fees (~$1-10 on Sepolia testnet, varying on mainnet) with no monthly subscription costs.

### 7. Interoperability
**Traditional Systems**: Proprietary APIs, vendor lock-in, difficult integrations.
**Anonymous Payroll**: Open-source, standard Ethereum contracts—any Web3 wallet or application can integrate.

### 8. Global Accessibility
**Traditional Systems**: Require bank accounts, credit cards, specific jurisdictions.
**Anonymous Payroll**: Anyone with an Ethereum address can participate—no geographic restrictions or banking requirements.

## 🚧 Known Limitations

### Current Version Limitations

1. **Testnet Only**: Currently deployed on Sepolia testnet
   - No real money at risk
   - Sepolia ETH required for transactions
   - Not suitable for production use without mainnet deployment

2. **No Employer Verification**: Anyone can register a salary for any employee address
   - Intended for flexibility in testing
   - Production version should add employer authentication

3. **No Salary History**: Only current salary is stored
   - Updating a salary overwrites the previous value
   - No historical record of salary changes over time

4. **Simplified Token Economics**: ConfidentialUSDC is a test token
   - Not pegged to real USDC
   - Minting is unrestricted (for testing purposes)
   - Would need proper collateralization for production

5. **Manual Balance Checking**: Employee balance display not in UI
   - Requires CLI commands via Hardhat tasks
   - Planned for future frontend development

6. **Limited Error Handling**: Basic validation only
   - No warnings for duplicate registrations
   - Minimal user feedback on transaction failures

7. **No Multi-Signature Support**: Single employer per salary record
   - No support for dual-approval workflows
   - Limited for large organizations requiring approval chains

8. **Relayer Dependency**: Decryption requires Zama's relayer network
   - Centralized dependency for a decentralized app
   - If relayer is down, decryption is unavailable (though data remains secure on-chain)

### Technical Limitations

1. **Gas Costs**: FHE operations are expensive
   - 3-5x more expensive than standard operations
   - May be cost-prohibitive at scale on Ethereum mainnet
   - Consider L2 deployment for cost reduction

2. **Encryption Overhead**: Client-side encryption adds latency
   - ~1-2 seconds to encrypt before transaction submission
   - Acceptable for salary registration, but impacts UX for high-frequency operations

3. **Browser Compatibility**: Requires modern Web3-capable browser
   - Users need MetaMask or compatible wallet extension
   - Mobile support depends on wallet app compatibility

4. **Scalability**: Employee array grows unbounded
   - Querying all employees becomes expensive as list grows
   - Consider pagination or off-chain indexing for large organizations

## 🛣️ Future Development Roadmap

### Phase 1: Enhanced User Experience (Q2 2025)
- [ ] **Employee Balance Display**: Show cUSDC balance directly in UI
- [ ] **Transaction History**: Display past salary registrations and payments
- [ ] **Notifications**: Toast notifications for transaction success/failure
- [ ] **Loading States**: Better UX feedback during encryption and blockchain operations
- [ ] **Mobile Optimization**: Responsive design improvements for mobile wallets
- [ ] **Multi-Language Support**: i18n integration for global accessibility

### Phase 2: Advanced Features (Q3 2025)
- [ ] **Salary History Tracking**: Store historical salary changes with timestamps
- [ ] **Recurring Payments**: Automate monthly/biweekly salary distribution
- [ ] **Multi-Currency Support**: Allow salaries in different ERC20 tokens (encrypted)
- [ ] **Batch Payments**: Pay multiple employees in one transaction
- [ ] **Employer Dashboard**: Analytics on total payroll, number of employees, payment history
- [ ] **Employee Confirmation**: Require employee to accept salary registration

### Phase 3: Organizational Tools (Q4 2025)
- [ ] **Multi-Signature Approval**: Require multiple approvers for salary registration
- [ ] **Role-Based Access Control**: HR, Finance, Admin roles with different permissions
- [ ] **Department Management**: Organize employees by department with aggregated (encrypted) budgets
- [ ] **Pay Grades**: Template salary ranges for standardization
- [ ] **Compliance Reports**: Generate encrypted reports for auditors with selective decryption
- [ ] **Integration APIs**: REST API for integration with existing HR systems

### Phase 4: Scalability & Mainnet (Q1 2026)
- [ ] **Layer 2 Deployment**: Deploy to Arbitrum, Optimism, or zkSync for lower gas costs
- [ ] **Indexing Service**: Off-chain indexer for fast employee queries (The Graph integration)
- [ ] **Pagination**: UI pagination for large employee lists
- [ ] **Mainnet Deployment**: Production deployment with real USDC integration
- [ ] **Stablecoin Support**: Support for DAI, USDT, and other stablecoins
- [ ] **Fiat On-Ramp**: Partner with services to allow fiat → crypto salary conversion

### Phase 5: Advanced Privacy Features (Q2 2026)
- [ ] **Zero-Knowledge Proofs**: Prove salary meets minimum wage without revealing amount
- [ ] **Anonymous Employee IDs**: Pseudonymous employee identifiers for additional privacy
- [ ] **Encrypted Metadata**: Encrypt employee names, departments, titles on-chain
- [ ] **Self-Custodial Decryption**: Client-side decryption without relayer dependency
- [ ] **Regulatory Compliance Modules**: Configurable compliance rules per jurisdiction

### Phase 6: Ecosystem Integration (Q3 2026)
- [ ] **DeFi Integration**: Allow employees to auto-stake or invest salaries
- [ ] **Insurance Protocols**: Integrate with DeFi insurance for employee benefits
- [ ] **Lending**: Use encrypted salary as collateral for undercollateralized loans
- [ ] **Payroll Lending**: Short-term loans to employers backed by encrypted payroll obligations
- [ ] **DAO Tooling**: Integration with DAO governance platforms (Snapshot, Tally)

### Research & Innovation
- [ ] **FHE Performance**: Collaborate with Zama on gas optimization for FHE operations
- [ ] **Cross-Chain**: Bridge encrypted payroll data across multiple chains
- [ ] **Quantum-Resistant**: Evaluate post-quantum cryptographic upgrades
- [ ] **Homomorphic Analytics**: Perform statistical analysis on encrypted salary data without decryption

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or suggesting ideas, your help is appreciated.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/Anonymous-Payroll.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, commented code
   - Follow existing code style (Prettier + ESLint configs)
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run test              # Run contract tests
   npm run compile           # Ensure contracts compile
   cd ui && npm run build    # Ensure frontend builds
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for test additions
   - `refactor:` for code refactoring

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

   Then open a PR on GitHub with:
   - Clear description of changes
   - Screenshots for UI changes
   - Reference to related issues

### Development Guidelines

**Code Style:**
- Use TypeScript for all new frontend code
- Follow Solidity style guide for contracts
- Run `npm run lint` before committing
- Use `npm run format` to auto-format code

**Testing:**
- Maintain or improve test coverage
- Write unit tests for new contract functions
- Add integration tests for complex features

**Documentation:**
- Update README.md for significant changes
- Add inline comments for complex logic
- Update JSDoc/NatSpec for functions

**Gas Optimization:**
- Be mindful of gas costs for contract changes
- Run gas reporter to compare before/after
- Justify any gas increases in PR description

### Areas for Contribution

**High Priority:**
- Frontend test suite (Jest + React Testing Library)
- Employee balance display component
- Transaction history feature
- Mobile UX improvements
- Gas optimization for FHE operations

**Good First Issues:**
- Documentation improvements
- UI/UX enhancements
- Additional Hardhat tasks
- Error message improvements
- Code comments and cleanup

**Advanced:**
- Multi-signature approval system
- Recurring payment automation
- Layer 2 deployment scripts
- Zero-knowledge proof integration
- Cross-chain bridge development

## 📄 License

This project is licensed under the **BSD-3-Clause Clear License**.

```
BSD 3-Clause Clear License

Copyright (c) 2025, Anonymous Payroll Contributors

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### Third-Party Licenses
- **Zama FHEVM Libraries**: BSD-3-Clause Clear License
- **OpenZeppelin Contracts**: MIT License
- **Hardhat Framework**: MIT License
- **React**: MIT License
- **Wagmi**: MIT License

## 📞 Support & Community

### Documentation
- **Zama FHEVM Docs**: https://docs.zama.ai/
- **Hardhat Docs**: https://hardhat.org/docs
- **Wagmi Docs**: https://wagmi.sh/
- **RainbowKit Docs**: https://www.rainbowkit.com/docs

### Community Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Q&A and general discussion
- **Zama Discord**: https://discord.gg/zama

### Getting Help

**For Technical Issues:**
1. Check existing GitHub issues
2. Review documentation and examples
3. Open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots/logs if applicable

**For General Questions:**
- Use GitHub Discussions
- Join Zama community Discord
- Tag questions with appropriate labels

## 🙏 Acknowledgments

This project was made possible by:

- **Zama**: For pioneering FHE technology and providing the FHEVM library
- **Hardhat Team**: For the excellent development framework
- **Wagmi Contributors**: For simplifying Web3 frontend development
- **RainbowKit Team**: For beautiful wallet connection UX
- **Ethereum Foundation**: For the Sepolia testnet and development resources
- **OpenZeppelin**: For secure smart contract libraries and best practices

Special thanks to the FHE research community and all contributors to open-source Web3 tooling that made this project possible.

---

**Built with ❤️ using Fully Homomorphic Encryption**

*Making payroll private, secure, and decentralized.*
