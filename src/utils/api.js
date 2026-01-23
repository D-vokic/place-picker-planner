const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(API_BASE_URL + endpoint, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Network error");
  }

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      /* ignore */
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

const ENDPOINTS = {
  PLACES: "/places",
  USER_PLACES: "/user-places",
};

export function fetchPlaces() {
  return request(ENDPOINTS.PLACES);
}

export function fetchUserPlaces() {
  return request(ENDPOINTS.USER_PLACES);
}

export function addUserPlace(place) {
  return request(ENDPOINTS.USER_PLACES, {
    method: "POST",
    body: JSON.stringify({ place }),
  });
}

export function removeUserPlace(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}`, {
    method: "DELETE",
  });
}

export function togglePlaceStatus(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}/status`, {
    method: "PATCH",
  });
}

export function togglePlaceFavorite(placeId) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}/favorite`, {
    method: "PATCH",
  });
}

export function updatePlaceMeta(placeId, meta) {
  return request(`${ENDPOINTS.USER_PLACES}/${placeId}`, {
    method: "PATCH",
    body: JSON.stringify({ meta }),
  });
}
