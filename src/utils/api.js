const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEV_USER_ID = "dev-user";
const DEFAULT_COLLECTION_ID = "default";

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(API_BASE_URL + endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEV_USER_ID}`,
      },
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
    } catch {}

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchPlaces() {
  return request("/places");
}

export function fetchUserPlaces() {
  return request(`/collections/${DEFAULT_COLLECTION_ID}/places`);
}

export function addUserPlace(place) {
  return request(`/collections/${DEFAULT_COLLECTION_ID}/places`, {
    method: "POST",
    body: JSON.stringify({ place }),
  });
}

export function removeUserPlace(placeId) {
  return request(`/collections/${DEFAULT_COLLECTION_ID}/places/${placeId}`, {
    method: "DELETE",
  });
}

export function togglePlaceStatus(placeId) {
  return request(
    `/collections/${DEFAULT_COLLECTION_ID}/places/${placeId}/status`,
    {
      method: "PATCH",
    },
  );
}

export function togglePlaceFavorite(placeId) {
  return request(
    `/collections/${DEFAULT_COLLECTION_ID}/places/${placeId}/favorite`,
    {
      method: "PATCH",
    },
  );
}

export function updatePlaceMeta(placeId, meta) {
  return request(`/collections/${DEFAULT_COLLECTION_ID}/places/${placeId}`, {
    method: "PATCH",
    body: JSON.stringify({ meta }),
  });
}
