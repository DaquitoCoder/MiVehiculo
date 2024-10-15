export default async function getServices() {
  const user = localStorage.getItem('user');
  if (!user) return [];
  const userId = JSON.parse(user).id;
  if (!userId) return [];

  const response = await fetch(
    `http://204.48.27.211:5000/api/users/${userId}/services_performed`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    }
  );

  const json = await response.json();

  const object = {
    services: json.detail ? [] : json,
    error: json.detail || null,
  };

  return object;
}
