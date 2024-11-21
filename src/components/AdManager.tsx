import React, { useState } from 'react';
import type { AdPlacement } from '../types';

interface AdManagerProps {
  ads: AdPlacement[];
  onUpdateAd: (ad: AdPlacement) => Promise<void>;
  onDeleteAd: (adId: string) => Promise<void>;
}

export default function AdManager({ ads, onUpdateAd, onDeleteAd }: AdManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdPlacement>>({});

  const handleEdit = (ad: AdPlacement) => {
    setEditingId(ad.id);
    setEditForm(ad);
  };

  const handleSave = async () => {
    if (!editForm.id) return;
    
    await onUpdateAd(editForm as AdPlacement);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ad Management</h2>
      
      <div className="grid gap-4">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white rounded-lg shadow-md p-6">
            {editingId === ad.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={editForm.location}
                    onChange={e => setEditForm({
                      ...editForm,
                      location: e.target.value as AdPlacement['location']
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="in-content">In Content</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Code</label>
                  <textarea
                    value={editForm.adCode}
                    onChange={e => setEditForm({
                      ...editForm,
                      adCode: e.target.value
                    })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.active}
                    onChange={e => setEditForm({
                      ...editForm,
                      active: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active</label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{ad.location} Ad</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {ad.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(ad)}
                      className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteAd(ad.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <pre className="mt-4 p-2 bg-gray-50 rounded text-sm overflow-x-auto">
                  {ad.adCode}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}