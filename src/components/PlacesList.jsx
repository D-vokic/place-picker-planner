// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   showMapPreview,
//   disabled,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <PlaceItem
//           key={place.id}
//           place={place}
//           onSelectPlace={onSelectPlace}
//           onToggleStatus={onToggleStatus}
//           onToggleFavorite={onToggleFavorite}
//           onOpenNotes={onOpenNotes}
//           showMapPreview={showMapPreview}
//           disabled={disabled}
//           highlight={recentlyAddedPlaceId === place.id}
//         />
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places-list">
//       {places.map((place) => (
//         <PlaceItem
//           key={place.id}
//           place={place}
//           onSelectPlace={onSelectPlace}
//           onToggleStatus={onToggleStatus}
//           onToggleFavorite={onToggleFavorite}
//           onOpenNotes={onOpenNotes}
//           disabled={false}
//           showMapPreview={showMapPreview}
//           highlight={place.id === recentlyAddedPlaceId}
//         />
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places-list">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             highlight={place.id === recentlyAddedPlaceId}
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places-list">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             highlight={place.id === recentlyAddedPlaceId}
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places-list">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             highlight={
//               recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
//             }
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             highlight={
//               recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
//             }
//           />{" "}
//         </li>
//       ))}{" "}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             highlight={
//               recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
//             }
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             highlight={
//               recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
//             }
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled = false,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             disabled={disabled}
//             showMapPreview={showMapPreview}
//             highlight={
//               recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
//             }
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

// import PlaceItem from "./PlaceItem.jsx";

// export default function PlacesList({
//   places,
//   onSelectPlace,
//   onToggleStatus,
//   onToggleFavorite,
//   onOpenNotes,
//   disabled = false,
//   showMapPreview,
//   recentlyAddedPlaceId,
// }) {
//   return (
//     <ul className="places">
//       {places.map((place) => (
//         <li key={place.id}>
//           <PlaceItem
//             place={place}
//             onSelectPlace={onSelectPlace}
//             onToggleStatus={onToggleStatus}
//             onToggleFavorite={onToggleFavorite}
//             onOpenNotes={onOpenNotes}
//             showMapPreview={showMapPreview}
//             disabled={disabled}
//             highlight={
//               recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
//             }
//           />
//         </li>
//       ))}
//     </ul>
//   );
// }

import PlaceItem from "./PlaceItem.jsx";

export default function PlacesList({
  places,
  onSelectPlace,
  onToggleStatus,
  onToggleFavorite,
  onOpenNotes,
  disabled = false,
  showMapPreview,
  recentlyAddedPlaceId,
}) {
  return (
    <ul className="places">
      {places.map((place) => (
        <li key={place.id}>
          <PlaceItem
            place={place}
            onSelectPlace={onSelectPlace}
            onToggleStatus={onToggleStatus}
            onToggleFavorite={onToggleFavorite}
            onOpenNotes={onOpenNotes}
            showMapPreview={showMapPreview}
            disabled={disabled}
            highlight={
              recentlyAddedPlaceId && place.id === recentlyAddedPlaceId
            }
          />
        </li>
      ))}
    </ul>
  );
}
