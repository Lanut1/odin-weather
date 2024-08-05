async function getUserLocation() {
  try {
    const response = await fetch('https://api.weatherapi.com/v1/ip.json?key=a163bf31947f4c38b92111525240108&q=auto:ip', {mode: "cors"});
    if (!response.ok) throw new Error('Failed to fetch IP information');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}

export default getUserLocation;