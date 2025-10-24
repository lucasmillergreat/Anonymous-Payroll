import { useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { Contract } from 'ethers';

import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { PAYROLL_CONTRACT, CUSDC_CONTRACT, isConfigured } from '../config/contracts';
import { formatPayrollAmount, formatTimestamp } from '../utils/token';
import '../styles/EmployeeManager.css';

type EmployeeEntry = {
  employee: string;
  encryptedSalary: string;
  lastUpdatedBy: string;
  lastUpdatedAt: bigint;
};

const EMPLOYEE_QUERY_KEY = ['payroll', 'employees'];

function truncateAddress(value: string) {
  return value.length > 10 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;
}

type EmployeeRowProps = {
  entry: EmployeeEntry;
  accountAddress?: string;
  signerPromise: ReturnType<typeof useEthersSigner>;
  zamaInstance: ReturnType<typeof useZamaInstance>['instance'];
};

function EmployeeRow({ entry, accountAddress, signerPromise, zamaInstance }: EmployeeRowProps) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [decryptedSalary, setDecryptedSalary] = useState<bigint | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [lastTx, setLastTx] = useState('');

  const resetMessages = () => {
    setFeedback('');
    setError('');
  };

  const handleDecrypt = async () => {
    resetMessages();

    if (!accountAddress) {
      setError('Connect your wallet to decrypt salaries.');
      return;
    }

    if (!zamaInstance) {
      setError('Encryption service not ready yet.');
      return;
    }

    try {
      setIsDecrypting(true);
      const keypair = zamaInstance.generateKeypair();
      const handleContractPairs = [
        {
          handle: entry.encryptedSalary,
          contractAddress: PAYROLL_CONTRACT.address,
        },
      ];

      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '10';
      const contractAddresses = [PAYROLL_CONTRACT.address];

      const eip712 = zamaInstance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        durationDays
      );

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message
      );

      const result = await zamaInstance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        accountAddress,
        startTimestamp,
        durationDays
      );

      const decryptedRaw = result[entry.encryptedSalary];
      if (!decryptedRaw) {
        throw new Error('Decryption result missing');
      }

      const amount = BigInt(decryptedRaw);
      setDecryptedSalary(amount);
      setFeedback(`Decrypted salary: ${formatPayrollAmount(amount)} cUSDC`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to decrypt salary';
      setError(message);
      console.error('Decrypt salary error:', err);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handlePay = async () => {
    resetMessages();

    if (!accountAddress) {
      setError('Connect your wallet to send payouts.');
      return;
    }

    if (!zamaInstance) {
      setError('Encryption service not ready yet.');
      return;
    }

    if (!decryptedSalary) {
      setError('Decrypt the salary before sending cUSDC.');
      return;
    }

    try {
      setIsPaying(true);

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const input = zamaInstance.createEncryptedInput(CUSDC_CONTRACT.address, accountAddress);
      input.add64(decryptedSalary);
      const encryptedAmount = await input.encrypt();

      const cusdc = new Contract(CUSDC_CONTRACT.address, CUSDC_CONTRACT.abi, signer);
      const tx = await cusdc.confidentialTransfer(
        entry.employee,
        encryptedAmount.handles[0],
        encryptedAmount.inputProof
      );

      setLastTx(tx.hash);
      setFeedback('Payroll transfer submitted. It will settle once the transaction confirms.');
      await tx.wait();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send salary';
      setError(message);
      console.error('Pay salary error:', err);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="employee-card">
      <div className="employee-header">
        <div>
          <h3 className="employee-address">{entry.employee}</h3>
          <p className="employee-meta">
            Last submitted by {truncateAddress(entry.lastUpdatedBy)} • {formatTimestamp(entry.lastUpdatedAt)}
          </p>
        </div>
      </div>

      {feedback && <p className="employee-feedback success">{feedback}</p>}
      {error && <p className="employee-feedback error">{error}</p>}

      {lastTx && (
        <p className="employee-feedback info">
          Transfer hash: <span className="tx-hash">{lastTx}</span>
        </p>
      )}

      <div className="employee-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={handleDecrypt}
          disabled={isDecrypting}
        >
          {isDecrypting ? 'Decrypting…' : 'Decrypt salary'}
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handlePay}
          disabled={isPaying || !decryptedSalary}
        >
          {isPaying ? 'Sending…' : 'Send cUSDC payout'}
        </button>
      </div>

      {decryptedSalary !== null && (
        <p className="employee-amount">
          Ready to transfer <strong>{formatPayrollAmount(decryptedSalary)} cUSDC</strong>
        </p>
      )}
    </div>
  );
}

export function EmployeeManager() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const signerPromise = useEthersSigner();
  const { instance } = useZamaInstance();

  const addressesConfigured =
    isConfigured(PAYROLL_CONTRACT.address) && isConfigured(CUSDC_CONTRACT.address);

  const queryEnabled = useMemo(
    () => Boolean(publicClient) && addressesConfigured,
    [publicClient, addressesConfigured]
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery<EmployeeEntry[]>({
    queryKey: EMPLOYEE_QUERY_KEY,
    enabled: queryEnabled,
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    queryFn: async () => {
      if (!publicClient) {
        return [];
      }

      const employees = (await publicClient.readContract({
        address: PAYROLL_CONTRACT.address,
        abi: PAYROLL_CONTRACT.abi,
        functionName: 'getEmployees',
      })) as string[];

      if (!employees.length) {
        return [];
      }

      const entries = await Promise.all(
        employees.map(async (employee) => {
          const metadata = (await publicClient.readContract({
            address: PAYROLL_CONTRACT.address,
            abi: PAYROLL_CONTRACT.abi,
            functionName: 'getSalaryMetadata',
            args: [employee as `0x${string}`],
          })) as readonly [string, bigint];

          const encryptedSalary = (await publicClient.readContract({
            address: PAYROLL_CONTRACT.address,
            abi: PAYROLL_CONTRACT.abi,
            functionName: 'getSalary',
            args: [employee as `0x${string}`],
          })) as string;

          return {
            employee,
            encryptedSalary,
            lastUpdatedBy: metadata[0],
            lastUpdatedAt: metadata[1],
          } satisfies EmployeeEntry;
        })
      );

      return entries;
    },
  });

  if (!addressesConfigured) {
    return (
      <section className="employee-section">
        <div className="placeholder">
          <p>
            Configure both <code>VITE_PAYROLL_ADDRESS</code> and <code>VITE_CUSDC_ADDRESS</code> to manage
            encrypted salaries.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="employee-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Employees</h2>
          <p className="section-subtitle">
            Decrypt salaries before dispatching payouts with Confidential USDC.
          </p>
        </div>
        <div className="section-actions">
          <button type="button" className="secondary-button" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Refreshing…' : 'Refresh list'}
          </button>
        </div>
      </div>

      {error && (
        <p className="section-error">Failed to load payroll data. {String(error)}</p>
      )}

      {isLoading && <p className="placeholder">Loading registered employees…</p>}

      {!isLoading && (!data || data.length === 0) && (
        <div className="placeholder">
          <p>No employees registered yet. Add a salary to see it here.</p>
        </div>
      )}

      <div className="employee-list">
        {data?.map((entry) => (
          <EmployeeRow
            key={entry.employee}
            entry={entry}
            accountAddress={address}
            signerPromise={signerPromise}
            zamaInstance={instance}
          />
        ))}
      </div>
    </section>
  );
}
