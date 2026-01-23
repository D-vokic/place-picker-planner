// function toRad(value) {
//   return (value * Math.PI) / 180;
// }

// function calculateDistance(lat1, lng1, lat2, lng2) {
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lng2 - lng1);
//   const l1 = toRad(lat1);
//   const l2 = toRad(lat2);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(l1) * Math.cos(l2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const d = R * c;
//   return d;
// }

// export function sortPlacesByDistance(places, lat, lon) {
//   const sortedPlaces = [...places];
//   sortedPlaces.sort((a, b) => {
//     const distanceA = calculateDistance(lat, lon, a.lat, a.lon);
//     const distanceB = calculateDistance(lat, lon, b.lat, b.lon);
//     return distanceA - distanceB;
//   });
//   return sortedPlaces;
// }

function degreesToRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS_KM = 6371;

  const deltaLat = degreesToRadians(lat2 - lat1);
  const deltaLon = degreesToRadians(lon2 - lon1);
  const radLat1 = degreesToRadians(lat1);
  const radLat2 = degreesToRadians(lat2);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return distance;
}

export function sortPlacesByDistance(places, lat, lon) {
  const sortedPlaces = [...places];

  sortedPlaces.sort((a, b) => {
    const distanceA = calculateDistance(lat, lon, a.lat, a.lon);
    const distanceB = calculateDistance(lat, lon, b.lat, b.lon);
    return distanceA - distanceB;
  });

  return sortedPlaces;
}
