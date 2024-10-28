export default async function getDocuments() {
  const user = localStorage.getItem('userData');
  if (!user) return [];
  const userId = JSON.parse(user).id;
  if (!userId) return [];

  const response = await fetch(
    `http://204.48.27.211:5000/api/documents/users/${userId}/documents`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token') || '',
      },
    }
  );

  const json = await response.json();

  

  return {
    documents: json.detail ? [] : json,
    error: json.detail || null,
  };
}
