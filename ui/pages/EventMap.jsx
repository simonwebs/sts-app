import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'leaflet';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

export const EventMap = () => {
  const { eventId } = useParams();

  const event = useTracker(() => {
    // Fetch event data based on the eventId
    // Replace this with your data fetching logic
    const eventData = {
      title: 'Event Title',
      location: {
        latitude: 51.505,
        longitude: -0.09,
      },
    };
    return eventData;
  });

  return (
    <div>
      <h2>{event.title}</h2>
      <Map center={[event.location.latitude, event.location.longitude]} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[event.location.latitude, event.location.longitude]}>
          <Popup>{event.title}</Popup>
        </Marker>
      </Map>
    </div>
  );
};
