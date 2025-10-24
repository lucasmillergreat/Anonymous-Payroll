import { useState } from 'react';
import { Header } from './Header';
import { SalaryRegistration } from './SalaryRegistration';
import { EmployeeManager } from './EmployeeManager';
import '../styles/PayrollApp.css';

type Tab = 'register' | 'employees';

export function PayrollApp() {
  const [activeTab, setActiveTab] = useState<Tab>('register');

  return (
    <div className="payroll-app">
      <Header />
      <main className="payroll-main">
        <div className="tab-header">
          <nav className="tab-navigation">
            <button
              type="button"
              className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register Salary
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              Manage Employees
            </button>
          </nav>
        </div>

        {activeTab === 'register' ? <SalaryRegistration /> : <EmployeeManager />}
      </main>
    </div>
  );
}
