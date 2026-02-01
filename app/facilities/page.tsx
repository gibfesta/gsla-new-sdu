async function getFacilities() {
  const res = await fetch("http://localhost:3000/api/facilities", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch facilities");
  }

  return res.json();
}

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Facilities</h1>

      <ul>
        {facilities.map((facility: any) => (
          <li key={facility.id} style={{ marginBottom: "1rem" }}>
            <strong>{facility.name}</strong>
            <div>Type: {facility.type}</div>
            <div>Status: {facility.status}</div>
            <div>Address: {facility.address}</div>
            <div>Email: {facility.contact_email}</div>
            <div>Phone: {facility.contact_phone}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
