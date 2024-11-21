import React, { useState } from 'react';
import { format } from 'date-fns';
import { Shield, AlertTriangle, Check, X } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { generateLicenseKey, isLicenseExpired } from '../lib/license';
import type { License } from '../types';

interface LicenseManagerProps {
  licenses: License[];
  onCreateLicense: () => Promise<void>;
  onUpdateLicense: (licenseId: string, status: 'active' | 'inactive') => Promise<void>;
}

export default function LicenseManager({ 
  licenses, 
  onCreateLicense, 
  onUpdateLicense 
}: LicenseManagerProps) {
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleCreateLicense = async () => {
    try {
      setLoading(true);
      await onCreateLicense();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (license: License) => {
    const newStatus = license.status === 'active' ? 'inactive' : 'active';
    await onUpdateLicense(license.id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          License Management
        </h2>
        <button
          onClick={handleCreateLicense}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg 
                   hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
        >
          <Shield className="w-5 h-5 mr-2" />
          Generate New License
        </button>
      </div>

      {licenses.length === 0 ? (
        <p className="text-gray-600">No licenses found.</p>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => {
            const isExpired = isLicenseExpired(license.expiresAt);
            const statusColor = license.status === 'active' ? 'green' : 'red';
            
            return (
              <div
                key={license.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4
                  ${isExpired ? 'border-red-500' : 
                    license.status === 'active' ? 'border-green-500' : 'border-gray-500'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {license.id}
                      </code>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full 
                                     text-xs font-medium bg-${statusColor}-100 
                                     text-${statusColor}-800`}>
                        {license.status === 'active' ? 
                          <Check className="w-3 h-3 mr-1" /> : 
                          <X className="w-3 h-3 mr-1" />}
                        {license.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Created: {format(new Date(license.createdAt), 'PPP')}</p>
                      <p>Expires: {format(new Date(license.expiresAt), 'PPP')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {isExpired && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="w-5 h-5 mr-1" />
                        Expired
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleStatus(license)}
                      className={`px-3 py-1 rounded-md text-sm font-medium
                        ${license.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } transition-colors duration-200`}
                    >
                      {license.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}