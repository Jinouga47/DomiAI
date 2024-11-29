import Link from "next/link";
import prisma from "@/lib/prisma";
import DashboardLayout from '@/app/components/DashboardLayout';

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <DashboardLayout>
      <div className="welcome-card">
        <h2 className="card-title">Property Listings</h2>
        <p>Manage and view all your properties</p>
        <Link href="/properties/add" className="auth-button mt-4">
          Add New Property
        </Link>
      </div>

      <div className="card-grid">
        {properties.map((property) => (
          <div key={property.id} className="stats-card">
            <h2 className="card-title">{property.title}</h2>
            <p>{property.addressLine1}</p>
            <p>{property.city}</p>
            <p>{property.county}</p>
            <p>{property.postCode}</p>
            {/* <p className="font-bold">${property.price.toLocaleString()}</p> */}
            <div className="mt-4 flex gap-2">
              <Link 
                href={`/properties/${property.id}`}
                className="auth-switch"
              >
                View Details
              </Link>
              <Link 
                href={`/properties/edit/${property.id}`}
                className="auth-button"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
} 