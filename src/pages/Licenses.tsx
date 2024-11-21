import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { generateLicenseKey } from '../lib/license';
import LicenseManager from '../components/LicenseManager';
import type { License } from '../types';
import { toast } from 'react-hot-toast';

export default function Licenses() {
  const { currentUser } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const userDoc = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        setLicenses(doc.data().licenses || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCreateLicense = async () => {
    if (!currentUser) return;

    try {
      const newLicense: License = {
        id: crypto.randomUUID(),
        key: generateLicenseKey(),
        userId: currentUser.uid,
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        createdAt: new Date().toISOString()
      };

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        licenses: arrayUnion(newLicense)
      });

      toast.success('License created successfully');
    } catch (error) {
      console.error('Error creating license:', error);
      toast.error('Failed to create license');
    }
  };

  const handleRevokeLicense = async (licenseId: string) => {
    if (!currentUser) return;

    try {
      const updatedLicenses = licenses.map(license =>
        license.id === licenseId
          ? { ...license, status: 'revoked' as const }
          : license
      );

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { licenses: updatedLicenses });

      toast.success('License revoked successfully');
    } catch (error) {
      console.error('Error revoking license:', error);
      toast.error('Failed to revoke license');
    }
  };

  if (loading) {
    return <div className="text-center">Loading licenses...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <LicenseManager
        licenses={licenses}
        onCreateLicense={handleCreateLicense}
        onRevokeLicense={handleRevokeLicense}
      />
    </div>
  );
}