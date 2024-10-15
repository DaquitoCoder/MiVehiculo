export default async function getMaintenanceById(vehicleId: string) {
  const user = localStorage.getItem('user');
  if (!user) return [];
  const userId = JSON.parse(user).id;
  if (!userId) return [];

  const response = await fetch(
    `http://204.48.27.211:5000/api/maintenance/vehicles/${vehicleId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    }
  );
  const json = await response.json();

  return json;
}
