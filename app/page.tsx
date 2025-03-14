import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Calendar, GraduationCap, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LatestEvents } from "@/components/latest-events"

const facilities = [
  {
    title: "Digital Learning",
    description: "State-of-the-art computer lab with modern equipment",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture14.jpg-MyqGQzeKvpOAeHzSBiL2UUzptS4dTK.jpeg", // Computer lab image
  },
  {
    title: "Arts & Music",
    description: "Comprehensive arts and music programs",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture15.jpg-f3ljZYri2EvjRJHUJwwWWih8mZhQCH.jpeg", // Music class image
  },
  {
    title: "Infrastructure",
    description: "Modern facilities and spacious environment",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture42.jpg-RpgSK4w92CJhJHKodqPPMlvaj9HM50.jpeg", // School building image
  },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-20 w-20 overflow-hidden">
                <Image
                  src="/santos/logo.jpg"
                  alt="CHEPARERIA PREPARATORY SCHOOL Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold">Theatre of Heroes</h2>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">CHEPARERIA PREPARATORY SCHOOL</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              Empowering Students Through Quality Education
            </p>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              CHEPARERIA PREPARATORY SCHOOL provides a nurturing environment where students thrive academically and
              personally under the Competency-Based Curriculum.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Link href="/admissions">Apply Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 font-medium"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard
              title="Academics"
              description="Explore our CBC curriculum and programs"
              icon={<BookOpen className="h-10 w-10" />}
              href="/academics"
            />
            <QuickLinkCard
              title="Admissions"
              description="Apply online and join our community"
              icon={<GraduationCap className="h-10 w-10" />}
              href="/admissions"
            />
            <QuickLinkCard
              title="Events"
              description="Stay updated with school activities"
              icon={<Calendar className="h-10 w-10" />}
              href="/events"
            />
            <QuickLinkCard
              title="Parent Portal"
              description="Access grades and student information"
              icon={<Users className="h-10 w-10" />}
              href="/portal"
            />
          </div>
        </div>
      </section>

      {/* Our Facilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Card key={facility.title} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={facility.image || "/placeholder.svg"}
                    alt={facility.title}
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{facility.title}</CardTitle>
                  <CardDescription>{facility.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">About Our School</h2>
              <p className="text-muted-foreground mb-6">
                Founded with a vision to produce well-rounded individuals, Chepareria Preparatory School has been a
                center of academic excellence since 2019. Our mission is to nurture every pupil's potential, focusing on
                developing necessary skills and values to contribute positively to society.
              </p>
              <p className="text-muted-foreground mb-6">
                Our dedicated teachers and modern facilities create an ideal learning environment that prepares students
                for future success in a rapidly changing world. We embrace our motto, "Theatre of Heroes," as we strive
                to cultivate the heroes of tomorrow.
              </p>
              <Button asChild variant="outline" className="group">
                <Link href="/about">
                  Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture36.jpg-SxvfEMG8NFUOpPKJjzs6e88ou4XEZR.jpeg"
                alt="CHEPARERIA PREPARATORY SCHOOL entrance gate"
                width={1280}
                height={720}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to Join Our School?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Applications for the next academic year are now open. Secure your child's spot in our nurturing educational
            environment.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            <Link href="/admissions">Apply Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function QuickLinkCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="text-primary mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-start group">
          <Link href={href}>
            Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function EventCard({
  title,
  date,
  description,
  image,
}: {
  title: string
  date: string
  description: string
  image: string
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative">
        <img src={image || "/logo.jpg"} alt={title} className="object-cover w-full h-full" />
      </div>
      <CardHeader>
        <div className="text-sm text-muted-foreground mb-1">{date}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-start group">
          <Link href="/events">
            Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string
  author: string
  role: string
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <svg className="h-8 w-8 text-primary/40 mb-4" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
        <CardContent className="p-0">
          <p className="mb-4">{quote}</p>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  )
}

