import React from 'react';

export default function PrivateIndex() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Private Area</h1>
      <p className="mb-4">This area is only visible to authenticated users.</p>
    </div>
  );
}
