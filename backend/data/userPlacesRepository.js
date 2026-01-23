export default function createUserPlacesRepository(db) {
  async function getAllByUser(userId) {
    const rows = await db.all(
      "SELECT data FROM user_places WHERE user_id = ?",
      userId,
    );
    return rows.map((r) => JSON.parse(r.data));
  }

  async function add(userId, place) {
    const data = {
      ...place,
      status: "want",
      isFavorite: false,
    };

    await db.run(
      "INSERT OR IGNORE INTO user_places (id, user_id, data) VALUES (?, ?, ?)",
      place.id,
      userId,
      JSON.stringify(data),
    );

    return data;
  }

  async function getById(userId, placeId) {
    const row = await db.get(
      "SELECT data FROM user_places WHERE id = ? AND user_id = ?",
      placeId,
      userId,
    );
    return row ? JSON.parse(row.data) : null;
  }

  async function update(userId, placeId, place) {
    await db.run(
      "UPDATE user_places SET data = ? WHERE id = ? AND user_id = ?",
      JSON.stringify(place),
      placeId,
      userId,
    );
    return place;
  }

  async function remove(userId, placeId) {
    await db.run(
      "DELETE FROM user_places WHERE id = ? AND user_id = ?",
      placeId,
      userId,
    );
  }

  return {
    getAllByUser,
    add,
    getById,
    update,
    remove,
  };
}
