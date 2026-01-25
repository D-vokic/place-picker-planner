export default function createUserPlacesRepository(db) {
  async function getAllByUserAndCollection(userId, collectionId) {
    const rows = await db.all(
      "SELECT data FROM user_places WHERE user_id = ? AND collection_id = ?",
      userId,
      collectionId,
    );
    return rows.map((r) => JSON.parse(r.data));
  }

  async function add(userId, collectionId, place) {
    const data = {
      ...place,
      status: "want",
      isFavorite: false,
    };

    await db.run(
      "INSERT OR IGNORE INTO user_places (id, user_id, collection_id, data) VALUES (?, ?, ?, ?)",
      place.id,
      userId,
      collectionId,
      JSON.stringify(data),
    );

    return data;
  }

  async function update(userId, collectionId, placeId, place) {
    await db.run(
      "UPDATE user_places SET data = ? WHERE id = ? AND user_id = ? AND collection_id = ?",
      JSON.stringify(place),
      placeId,
      userId,
      collectionId,
    );
    return place;
  }

  async function remove(userId, collectionId, placeId) {
    await db.run(
      "DELETE FROM user_places WHERE id = ? AND user_id = ? AND collection_id = ?",
      placeId,
      userId,
      collectionId,
    );
  }

  return {
    getAllByUserAndCollection,
    add,
    update,
    remove,
  };
}
