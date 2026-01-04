const API_BASE_URL = "http://localhost:3000";

async function request(url, options = {}) {
  const response = await fetch(API_BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed.");
  }

  return response.json();
}

export function fetchPlaces() {
  return request("/places");
}

export function fetchUserPlaces() {
  return request("/user-places");
}

export async function addUserPlace(place) {
  const data = await request("/user-places", {
    method: "POST",
    body: JSON.stringify({ place }),
  });
  return data.place;
}

export function removeUserPlace(placeId) {
  return request(`/user-places/${placeId}`, {
    method: "DELETE",
  });
}
