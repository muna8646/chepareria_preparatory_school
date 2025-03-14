"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function EventsPage() {
  interface Event {
    id: string;
    image: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.statusText}`);
        }
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-lg text-gray-700">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            console.log("Event Image:", event.image); // Debug log
            return (
              <div key={event.id} className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                src={`http://localhost:5000/${event.image}` || "/placeholder.jpg"} // Fallback image
                alt={event.title}
                fill
                className="rounded-lg object-cover"
              />
                </div>
                <h2 className="text-xl font-semibold mt-4">{event.title}</h2>
                <p className="text-gray-700 mt-2">{event.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Location:</strong> {event.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Category:</strong> {event.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}