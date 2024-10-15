export default async function getMaintenanceServices() {
  const response = await fetch(
    'http://204.48.27.211:5000/api/service/maintenance_service',
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
