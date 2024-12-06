'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import Link from 'next/link';

// Define types based on schema
interface Unit {
  id: string;
  unitNumber: string | null;
  squareMetres: number | null;
  bedrooms: number;
  bathrooms: number;
  baseRentPcm: number;
  furnishedStatus: 'FURNISHED' | 'PART_FURNISHED' | 'UNFURNISHED';
  hmoLicense: string | null;
  councilTaxReference: string | null;
}

interface Property {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  cityTown: string;
  county: string | null;
  postcode: string;
  purchaseDate: string | null;
  propertyType: 'DETACHED' | 'SEMI_DETACHED' | 'TERRACED' | 'FLAT';
  tenure: 'FREEHOLD' | 'LEASEHOLD';
  councilTaxBand: string;
  epcRating: string;
  units: Unit[];
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [deletedUnitIds, setDeletedUnitIds] = useState<string[]>([]);

  const addUnit = () => {
    setUnits([...units, {
      id: `temp-${Date.now()}`, // Temporary ID for new units
      unitNumber: '',
      squareMetres: null,
      bedrooms: 0,
      bathrooms: 0,
      baseRentPcm: 0,
      furnishedStatus: 'UNFURNISHED',
      hmoLicense: null,
      councilTaxReference: null
    }]);
  };

  const removeUnit = (index: number) => {
    const unit = units[index];
    if (!unit.id.startsWith('temp-')) {
      // Only track deleted IDs for existing units
      setDeletedUnitIds([...deletedUnitIds, unit.id]);
    }
    setUnits(units.filter((_, i) => i !== index));
  };

  const updateUnit = (index: number, field: string, value: any) => {
    const newUnits = [...units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setUnits(newUnits);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching property with ID:', resolvedParams.id);
        console.log('Property params:', property);
        
        const response = await fetch(`/api/properties/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch property: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw API response structure:', {
          keys: Object.keys(data),
          fullData: data,
        });
        
        // Validate the received data
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid property data received');
        }

        // Check if data is nested within a property field
        const propertyData = data.property || data;
        console.log('Property data being used:', propertyData);

        // Transform the data using the potentially nested structure
        const transformedData = {
          id: propertyData.id,
          addressLine1: propertyData.addressLine1 || '',
          addressLine2: propertyData.addressLine2 || null,
          cityTown: propertyData.cityTown || '',
          county: propertyData.county || null,
          postcode: propertyData.postcode || '',
          propertyType: propertyData.propertyType || 'DETACHED',
          tenure: propertyData.tenure || 'FREEHOLD',
          councilTaxBand: propertyData.councilTaxBand || '',
          epcRating: propertyData.epcRating || '',
          purchaseDate: propertyData.purchaseDate ? 
            new Date(propertyData.purchaseDate).toISOString().split('T')[0] : null,
          units: Array.isArray(propertyData.units) ? propertyData.units.map((unit: Unit) => ({
            id: unit.id,
            unitNumber: unit.unitNumber || null,
            squareMetres: unit.squareMetres ? Number(unit.squareMetres) : null,
            bedrooms: Number(unit.bedrooms) || 0,
            bathrooms: Number(unit.bathrooms) || 0,
            baseRentPcm: Number(unit.baseRentPcm) || 0,
            furnishedStatus: unit.furnishedStatus || 'UNFURNISHED',
            hmoLicense: unit.hmoLicense || null,
            councilTaxReference: unit.councilTaxReference || null,
          })) : []
        };

        console.log('Transformed property data:', transformedData);
        
        setProperty(transformedData);
        if (data.property.units) {
          setUnits(data.property.units);
        }
      } catch (err) {
        console.error('Error in fetchProperty:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams.id]);

  // Add console log before render
  console.log('Current property state before render:', property);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...property,
          units: units.map(unit => ({
            ...unit,
            squareMetres: unit.squareMetres ? Number(unit.squareMetres) : null,
            bedrooms: Number(unit.bedrooms),
            bathrooms: Number(unit.bathrooms),
            baseRentPcm: Number(unit.baseRentPcm),
          })),
          deletedUnitIds // Include deleted unit IDs
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      router.push('/properties');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update property');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading-container"><div className="loading-spinner" /></div>
      </DashboardLayout>
    );
  }

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="auth-error auth-error-failure">{error || 'Property not found'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="welcome-card">
        <h1 className="card-title">Edit Property</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="stats-card">
            <h2 className="card-title">Property Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.addressLine1 || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, addressLine1: e.target.value} : null)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.addressLine2 || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, addressLine2: e.target.value || null} : null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City/Town</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.cityTown || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, cityTown: e.target.value} : null)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">County</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.county || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, county: e.target.value || null} : null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Postcode</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.postcode || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, postcode: e.target.value} : null)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <select
                  className="auth-input"
                  defaultValue={property?.propertyType || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, propertyType: e.target.value as Property['propertyType']} : null)}
                  required
                >
                  <option value="DETACHED">Detached</option>
                  <option value="SEMI_DETACHED">Semi-Detached</option>
                  <option value="TERRACED">Terraced</option>
                  <option value="FLAT">Flat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tenure</label>
                <select
                  className="auth-input"
                  defaultValue={property?.tenure || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, tenure: e.target.value as Property['tenure']} : null)}
                  required
                >
                  <option value="FREEHOLD">Freehold</option>
                  <option value="LEASEHOLD">Leasehold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Council Tax Band</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.councilTaxBand || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, councilTaxBand: e.target.value} : null)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">EPC Rating</label>
                <input
                  type="text"
                  className="auth-input"
                  defaultValue={property?.epcRating || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, epcRating: e.target.value} : null)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Purchase Date</label>
                <input
                  type="date"
                  className="auth-input"
                  defaultValue={property?.purchaseDate || ''}
                  onChange={(e) => setProperty(prev => prev ? {...prev, purchaseDate: e.target.value || null} : null)}
                />
              </div>
            </div>
          </div>

          <div className="units-section">
            <h2 className="section-title">Units</h2>
            {units.map((unit, index) => (
              <div key={unit.id} className="unit-form">
                <div className="unit-header">
                  <h3>Unit {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeUnit(index)}
                    className="remove-unit-button"
                  >
                    Remove Unit
                  </button>
                </div>

                <div className="unit-fields">
                  <input
                    type="text"
                    placeholder="Unit Number (Optional)"
                    value={unit.unitNumber || ''}
                    onChange={(e) => updateUnit(index, 'unitNumber', e.target.value)}
                    className="auth-input"
                  />

                  <input
                    type="number"
                    placeholder="Square Metres (Optional)"
                    value={unit.squareMetres || ''}
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
                    value={unit.hmoLicense || ''}
                    onChange={(e) => updateUnit(index, 'hmoLicense', e.target.value)}
                    className="auth-input"
                  />

                  <input
                    type="text"
                    placeholder="Council Tax Reference (Optional)"
                    value={unit.councilTaxReference || ''}
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

          <div className="flex gap-4 mt-4">
            <button 
              type="submit" 
              className="auth-button flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link 
              href="/properties"
              className="auth-switch flex-1 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 