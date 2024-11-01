export default async function getServiceLoader() {
  const user = localStorage.getItem('userData');
  if (!user) return [];
  const userId = JSON.parse(user).id;
  if (!userId) return [];

  const responseVehicles = await fetch(
    `http://204.48.27.211:5000/api/vehicle/${userId}/vehicles`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    }
  );

  const json = await responseVehicles.json();

  const responseServices = await fetch(`http://204.48.27.211:5000/api/users/${userId}/service-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token') || '',
    },
  })

  const jsonServices = await responseServices.json();

  const object = {
    vehicles: json.detail ? [] : json,
    services: jsonServices.detail ? [] : jsonServices,
    error: json.detail || null,
  };
  return object;
}
