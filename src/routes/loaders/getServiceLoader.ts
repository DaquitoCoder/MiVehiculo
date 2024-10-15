export default async function getServiceLoader() {
  const user = localStorage.getItem('user');
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

  const object = {
    vehicles: json.detail ? [] : json,
    error: json.detail || null,
  };
  return object;
}
