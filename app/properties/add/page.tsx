'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddPropertyPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!session?.user?.email) {
      setError('You must be logged in to add a property');
      return;
    }

    try {
      const propertyData = {
        title: formData.get('title'),
        description: formData.get('description'),
        addressLine1: formData.get('addressLine1'),
        addressLine2: formData.get('addressLine2') || '',
        city: formData.get('city'),
        county: formData.get('county'),
        postCode: formData.get('postCode'),
        bedrooms: parseInt(formData.get('bedrooms') as string),
        bathrooms: parseInt(formData.get('bathrooms') as string),
        propertyType: formData.get('propertyType'),
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add property');
      }

      setSuccess('Property added successfully!');
      // Redirect to properties page after 2 seconds
      setTimeout(() => {
        router.push('/properties');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Add New Property</h1>
        
        {error && <div className="auth-error auth-error-failure">{error}</div>}
        {success && <div className="auth-error auth-error-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="title"
            type="text"
            required
            className="auth-input"
            placeholder="Property Title"
          />

          <input
            name="addressLine1"
            type="text"
            required
            className="auth-input"
            placeholder="Address Line 1"
          />

          <input
            name="addressLine2"
            type="text"
            className="auth-input"
            placeholder="Address Line 2 (Optional)"
          />

          <input
            name="city"
            type="text"
            required
            className="auth-input"
            placeholder="City"
          />

          <input
            name="county"
            type="text"
            required
            className="auth-input"
            placeholder="County"
          />

          <input
            name="postCode"
            type="text"
            required
            className="auth-input"
            placeholder="Post Code"
          />

          <input
            name="bedrooms"
            type="number"
            required
            min="0"
            className="auth-input"
            placeholder="Number of Bedrooms"
          />

          <input
            name="bathrooms"
            type="number"
            required
            min="0"
            step="0.5"
            className="auth-input"
            placeholder="Number of Bathrooms"
          />

          <select
            name="propertyType"
            required
            className="auth-input"
          >
            <option value="">Select property type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>

          <textarea
            name="description"
            required
            className="auth-input"
            rows={4}
            placeholder="Property Description"
          />

          <button type="submit" className="auth-button">
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}