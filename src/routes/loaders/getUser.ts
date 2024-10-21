export default async function getUser() {
  const response = await fetch(`http://204.48.27.211:5000/api/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token') || '',
    },
  });

  const userData = await response.json();

  console.log('userData', userData);

  return userData;
}
