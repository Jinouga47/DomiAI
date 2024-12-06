'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define types based on your schema
type PropertyType = 'DETACHED' | 'SEMI_DETACHED' | 'TERRACED' | 'FLAT';
type TenureType = 'FREEHOLD' | 'LEASEHOLD';

export default function AddPropertyPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [units, setUnits] = useState([{
    unitNumber: '',
    squareMetres: '',
    bedrooms: '',
    bathrooms: '',
    baseRentPcm: '',
    furnishedStatus: 'UNFURNISHED',
    hmoLicense: '',
    councilTaxReference: ''
  }]);

  const addUnit = () => {
    setUnits([...units, {
      unitNumber: '',
      squareMetres: '',
      bedrooms: '',
      bathrooms: '',
      baseRentPcm: '',
      furnishedStatus: 'UNFURNISHED',
      hmoLicense: '',
      councilTaxReference: ''
    }]);
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const updateUnit = (index: number, field: string, value: string) => {
    const newUnits = [...units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setUnits(newUnits);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!session?.user?.email) {
      setError('You must be logged in to add a property');
      return;
    }

    try {
      // Convert date string to ISO format if it exists
      const purchaseDateStr = formData.get('purchaseDate') as string;
      const purchaseDate = purchaseDateStr ? new Date(purchaseDateStr).toISOString() : null;

      const propertyData = {
        addressLine1: formData.get('addressLine1'),
        addressLine2: formData.get('addressLine2') || null,
        cityTown: formData.get('cityTown'),
        county: formData.get('county') || null,
        postcode: formData.get('postcode'),
        propertyType: formData.get('propertyType'),
        tenure: formData.get('tenure'),
        councilTaxBand: formData.get('councilTaxBand'),
        epcRating: formData.get('epcRating'),
        purchaseDate: purchaseDate,
        units: units.map(unit => ({
          unitNumber: unit.unitNumber || null,
          squareMetres: unit.squareMetres ? parseFloat(unit.squareMetres) : null,
          bedrooms: parseInt(unit.bedrooms),
          bathrooms: parseInt(unit.bathrooms),
          baseRentPcm: parseFloat(unit.baseRentPcm),
          furnishedStatus: unit.furnishedStatus,
          hmoLicense: unit.hmoLicense || null,
          councilTaxReference: unit.councilTaxReference || null,
        }))
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
          <h2 className="section-title">Property Details</h2>
          
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
            name="cityTown"
            type="text"
            required
            className="auth-input"
            placeholder="City/Town"
          />

          <input
            name="county"
            type="text"
            className="auth-input"
            placeholder="County (Optional)"
          />

          <input
            name="postcode"
            type="text"
            required
            className="auth-input"
            placeholder="Postcode"
          />

          <select
            name="propertyType"
            required
            className="auth-input"
          >
            <option value="">Select Property Type</option>
            <option value="DETACHED">Detached</option>
            <option value="SEMI_DETACHED">Semi-Detached</option>
            <option value="TERRACED">Terraced</option>
            <option value="FLAT">Flat</option>
          </select>

          <select
            name="tenure"
            required
            className="auth-input"
          >
            <option value="">Select Tenure</option>
            <option value="FREEHOLD">Freehold</option>
            <option value="LEASEHOLD">Leasehold</option>
          </select>

          <input
            name="councilTaxBand"
            type="text"
            required
            className="auth-input"
            placeholder="Council Tax Band"
          />

          <input
            name="epcRating"
            type="text"
            required
            className="auth-input"
            placeholder="EPC Rating"
          />

          <input
            name="purchaseDate"
            type="date"
            className="auth-input"
            placeholder="Purchase Date (Optional)"
          />

          <div className="units-section">
            <h2 className="section-title">Units</h2>
            {units.map((unit, index) => (
              <div key={index} className="unit-form">
                <div className="unit-header">
                  <h3>Unit {index + 1}</h3>
                  {units.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUnit(index)}
                      className="remove-unit-button"
                    >
                      Remove Unit
                    </button>
                  )}
                </div>

                <div className="unit-fields">
                  <input
                    type="text"
                    placeholder="Unit Number (Optional)"
                    value={unit.unitNumber}
                    onChange={(e) => updateUnit(index, 'unitNumber', e.target.value)}
                    className="auth-input"
                  />

                  <input
                    type="number"
                    placeholder="Square Metres (Optional)"
                    value={unit.squareMetres}
                    onChange={(e) => updateUnit(index, 'squareMetres', e.target.value)}
                    className="auth-input"
                  />

                  <input
                    type="number"
                    placeholder="Number of Bedrooms"
                    value={unit.bedrooms}
                    onChange={(e) => updateUnit(index, 'bedrooms', e.target.value)}
                    required
                    className="auth-input"
                  />

                  <input
                    type="number"
                    placeholder="Number of Bathrooms"
                    value={unit.bathrooms}
                    onChange={(e) => updateUnit(index, 'bathrooms', e.target.value)}
                    required
                    className="auth-input"
                  />

                  <input
                    type="number"
                    placeholder="Monthly Rent (£)"
                    value={unit.baseRentPcm}
                    onChange={(e) => updateUnit(index, 'baseRentPcm', e.target.value)}
                    required
                    className="auth-input"
                  />

                  <select
                    value={unit.furnishedStatus}
                    onChange={(e) => updateUnit(index, 'furnishedStatus', e.target.value)}
                    required
                    className="auth-input"
                  >
                    <option value="UNFURNISHED">Unfurnished</option>
                    <option value="PART_FURNISHED">Part Furnished</option>
                    <option value="FURNISHED">Furnished</option>
                  </select>

                  <input
                    type="text"
                    placeholder="HMO License (Optional)"
                    value={unit.hmoLicense}
                    onChange={(e) => updateUnit(index, 'hmoLicense', e.target.value)}
                    className="auth-input"
                  />

                  <input
                    type="text"
                    placeholder="Council Tax Reference (Optional)"
                    value={unit.councilTaxReference}
                    onChange={(e) => updateUnit(index, 'councilTaxReference', e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addUnit}
              className="add-unit-button"
            >
              Add Another Unit
            </button>
          </div>

          <button type="submit" className="auth-button">
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
}