import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { Contract } from 'ethers';
import { isAddress } from 'viem';

import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { PAYROLL_CONTRACT, isConfigured } from '../config/contracts';
import { formatPayrollAmount, parsePayrollAmount } from '../utils/token';
import '../styles/SalaryRegistration.css';

export function SalaryRegistration() {
  const { address } = useAccount();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const queryClient = useQueryClient();
  const payrollConfigured = isConfigured(PAYROLL_CONTRACT.address);

  const [employeeAddress, setEmployeeAddress] = useState('');
  const [salaryInput, setSalaryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetFeedback = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    if (!address) {
      setErrorMessage('Connect your wallet before registering a salary.');
      return;
    }

    if (!instance) {
      setErrorMessage('Encryption service is not ready.');
      return;
    }

    if (!isAddress(employeeAddress)) {
      setErrorMessage('Please provide a valid employee address.');
      return;
    }

    let parsedAmount: bigint;
    try {
      parsedAmount = parsePayrollAmount(salaryInput);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid salary amount');
      return;
    }

    try {
      setIsSubmitting(true);
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const input = instance.createEncryptedInput(PAYROLL_CONTRACT.address, address);
      input.add64(parsedAmount);
      const encrypted = await input.encrypt();

      const payrollContract = new Contract(
        PAYROLL_CONTRACT.address,
        PAYROLL_CONTRACT.abi,
        signer
      );

      const tx = await payrollContract.registerSalary(
        employeeAddress,
        encrypted.handles[0],
        encrypted.inputProof
      );

      await tx.wait();

      setSuccessMessage(
        `Stored ${formatPayrollAmount(parsedAmount)} cUSDC salary for ${employeeAddress}.`
      );
      setEmployeeAddress('');
      setSalaryInput('');

      await queryClient.invalidateQueries({ queryKey: ['payroll', 'employees'] });
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Failed to register salary';
      setErrorMessage(message);
      console.error('Register salary error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!payrollConfigured) {
    return (
      <section className="salary-section">
        <div className="card">
          <h2 className="card-title">Connect deployment details</h2>
          <p className="card-subtitle">
            Set the <code>VITE_PAYROLL_ADDRESS</code> environment variable with your deployed
            ConfidentialPayroll contract address before registering salaries.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="salary-section">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Register encrypted salary</h2>
            <p className="card-subtitle">
              Encrypt salary amounts with Zama FHE and store them on-chain. Salaries are kept
              private until you decrypt them locally.
            </p>
          </div>
          {zamaLoading && <span className="status-tag">Preparing encryption...</span>}
          {zamaError && <span className="status-tag error">Encryption unavailable</span>}
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="form-label">
            Employee address
            <input
              className="form-input"
              type="text"
              value={employeeAddress}
              onChange={(event) => {
                resetFeedback();
                setEmployeeAddress(event.target.value);
              }}
              placeholder="0x..."
              required
            />
          </label>

          <label className="form-label">
            Salary amount (cUSDC)
            <input
              className="form-input"
              type="text"
              inputMode="decimal"
              value={salaryInput}
              onChange={(event) => {
                resetFeedback();
                setSalaryInput(event.target.value);
              }}
              placeholder="e.g. 3500.00"
              required
            />
          </label>

          <p className="hint">
            Amounts support up to 6 decimal places. Values are stored in encrypted cUSDC units.
          </p>

          {errorMessage && <p className="feedback error">{errorMessage}</p>}
          {successMessage && <p className="feedback success">{successMessage}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting || zamaLoading}
          >
            {isSubmitting ? 'Encrypting...' : 'Store encrypted salary'}
          </button>
        </form>
      </div>

      <div className="info-card">
        <h3 className="info-title">How it works</h3>
        <ul className="info-list">
          <li>Enter an employee wallet and salary in cUSDC units.</li>
          <li>
            The salary is encrypted locally using Zama&apos;s FHE relayer before being written to the
            payroll contract.
          </li>
          <li>You can decrypt salaries later and pay with Confidential USDC.</li>
        </ul>
      </div>
    </section>
  );
}
