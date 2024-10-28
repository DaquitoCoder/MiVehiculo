export default async function getInterestLinks() {
  const user = localStorage.getItem('userData');
  if (!user) return [];

  const response = await fetch(`http://204.48.27.211:5000/api/link/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token') || '',
    },
  });

  const json = await response.json();
  return json;
}
