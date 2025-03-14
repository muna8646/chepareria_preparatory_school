"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: number
  title: string
  date: string
  description: string
  image: string
}

export function LatestEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events?limit=3")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return <div>Loading events...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <Image src={event.image || "/placeholder.svg"} alt={event.title} layout="fill" objectFit="cover" />
          </div>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{event.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

