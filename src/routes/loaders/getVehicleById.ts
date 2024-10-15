export default async function getVehicleById(vehicleId: string) {
  const user = localStorage.getItem('user');
  if (!user) return [];
  const userId = JSON.parse(user).id;
  if (!userId) return [];

  const response = await fetch(
    `http://204.48.27.211:5000/api/vehicle/${vehicleId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    }
  );
  const json = await response.json();

  const responseFuelHistory = await fetch(
    `http://204.48.27.211:5000/api/fuel_refills/vehicles/${vehicleId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    }
  );

  const jsonFuelHistory = await responseFuelHistory.json();

  const object = {
    vehicle: json.detail ? {} : json,
    services: [],
    fuelHistory: jsonFuelHistory.detail ? [] : jsonFuelHistory,
    error: json.detail || null,
  };
  return object;
}
