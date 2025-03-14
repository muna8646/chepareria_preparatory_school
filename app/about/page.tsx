import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              About CHEPARERIA PREPARATORY SCHOOL
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Learn about our history, mission, vision, and the dedicated team behind our educational excellence.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-26%20at%2017.45.15_90b5c25e.jpg-DKDqlB7TbZW1ATzj9FDmIXHxs39109.jpeg"
                  alt="CHEPARERIA PREPARATORY SCHOOL Logo"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Mission & Vision</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To produce a well-rounded individual with the necessary skills and values to contribute positively
                    to society.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">Our Mission</h3>
                  <p className="text-muted-foreground">Nurturing every Pupil potential.</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">Our Motto</h3>
                  <p className="text-muted-foreground font-semibold">"Theatre of Heroes"</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">Our Core Values</h3>
                  <ul className="space-y-2">
                    {[
                      "Integrity",
                      "Discipline",
                      "Respect",
                      "Academic Excellence",
                      "Creativity and Innovation",
                      "Competency",
                      "Responsibility",
                      "Diligence",
                      "Service",
                      "Empathy",
                    ].map((value) => (
                      <li key={value} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Details */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Core Values in Detail</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We actively teach and encourage learners to always be honest, do the right thing, and act responsibly,
                  even when no one is watching. We emphasize values like truthfulness, fairness, and accountability in
                  their everyday actions and interactions with peers and teachers, developing a consistent character
                  where words and actions align with ethical principles.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Discipline</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We instill in students a sense of responsibility, following rules, self-control, and respect for
                  others. This creates an environment where focused learning can occur and positive behaviors are
                  encouraged, ultimately preparing them for academic success and responsible citizenship throughout
                  their lives.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Respect</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We teach learners to treat themselves, others, and their environment with kindness, consideration, and
                  dignity. This encompasses actions like listening attentively, using polite language, valuing diverse
                  perspectives, and taking care of school property, fostering a positive and inclusive learning
                  environment.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Academic Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We have a strong commitment to fostering high academic standards, encouraging students to reach their
                  full intellectual potential through rigorous learning, critical thinking, and a love for knowledge,
                  aiming to prepare them for future academic success.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Creativity and Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We develop creative abilities in primary school pupils, fostering their capacity to think outside the
                  box, generate novel ideas, and approach challenges with flexibility. Our school is well equipped with
                  20 computers and 20 laptops with technologically oriented teachers who combine creativity with
                  transformative technology to achieve better outcomes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Competency</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We focus on developing learners' abilities and skills across various areas, enabling them to
                  confidently tackle challenges, demonstrate mastery in subjects, and effectively apply their knowledge
                  in real-life situations. We aim to equip them with the necessary tools to succeed both inside and
                  outside the classroom, fostering critical thinking, problem-solving, collaboration, communication, and
                  self-regulation skills.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Responsibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We teach pupils to take ownership of their actions, complete tasks diligently, follow rules, and be
                  accountable for their choices, fostering a sense of dependability and reliability in their academic
                  and social lives within the school environment.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Diligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We embody the commitment to thoroughness, perseverance, and attention to detail. For our teachers,
                  diligence means consistently putting in the effort to provide the best learning experience for their
                  pupils, whether inside or outside the classroom. It involves meticulous planning, adapting to
                  students' needs, and continuously striving for improvement.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We are committed to actively contributing to the well-being of the community by performing helpful
                  acts, demonstrating empathy, and prioritizing the needs of others. We foster a culture where students
                  understand the importance of giving back and making a positive impact beyond themselves.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Empathy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We actively foster an environment where students learn to understand and share the feelings of others,
                  promoting positive social interactions, conflict resolution, and a sense of community. We encourage
                  them to consider different perspectives and respond with kindness and compassion towards their peers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our History</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <p>
              Founded in 2019, Chepareria Preparatory School began with a vision to transform education in West Pokot
              County, Kenya. What started as a small institution with just 50 students has grown into a comprehensive
              educational center serving hundreds of students.
            </p>
            <p>
              Over the years, we have continuously evolved our teaching methodologies and curriculum to meet the
              changing needs of our students. The introduction of the Competency-Based Curriculum (CBC) marked a
              significant milestone in our journey, aligning perfectly with our philosophy of holistic education.
            </p>
            <p>
              Today, we stand as a beacon of educational excellence in the region, known for our innovative approach to
              learning and commitment to developing not just academic knowledge, but also practical skills and positive
              values in our students.
            </p>
          </div>
        </div>
      </section>

      

      {/* Parent Involvement */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Parent Involvement</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Strong Parent-School Partnership</h3>
              <p className="text-muted-foreground mb-6">
                We believe in fostering strong partnerships between parents and the school. Regular parent-teacher
                meetings and engagement activities ensure that parents are actively involved in their children's
                educational journey.
              </p>
              <p className="text-muted-foreground">
                Through our parent association and regular meetings, we create opportunities for parents to contribute
                to school development and student success.
              </p>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture25.jpg-1ACCaDl9ExzpFDekl8IcduA1M1bicy.jpeg"
                alt="Parent-teacher meeting"
                width={1200}
                height={675}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Campus */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our School farm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture43.jpg-OLspBseqkKsMUsd33fMHDjpOFOyT2y.jpeg"
                alt="School buildings"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture58.jpg-SDUKyg6kZXPQiGHgPp64aZa1JSJIiQ.jpeg"
                alt="School grounds"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture56.jpg-8zPO0yED5K9qXYtvTmEle39yVOAndv.jpeg"
                alt="Development projects"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Staff */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Staff</h2>
          <div className="relative aspect-video rounded-xl overflow-hidden max-w-3xl mx-auto">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture18.jpg-djgRZFRxObp497iYjgSqyKULHByiUX.jpeg"
              alt="School staff"
              width={1200}
              height={675}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Student Life */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Student Life</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture82.jpg-1nTJjY9RgNhusYs05UANTfal7kVpGM.jpeg"
                  alt="Students in uniform"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture15.jpg-f3ljZYri2EvjRJHUJwwWWih8mZhQCH.jpeg"
                  alt="Music class"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">A Vibrant Learning Community</h3>
              <p className="text-muted-foreground mb-6">
                At CHEPARERIA PREPARATORY SCHOOL, we believe in nurturing well-rounded individuals through a combination
                of academic excellence and engaging extracurricular activities. Our students participate in various
                programs including music, arts, sports, and technology education.
              </p>
              <p className="text-muted-foreground mb-6">
                Our school uniform, featuring the distinctive green plaid design, represents our values of unity,
                discipline, and pride in our school community. Students are encouraged to participate in various
                activities that develop their talents and interests beyond the classroom.
              </p>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture72.jpg-c82dbqn4VophwLTUrNS3YB1Nwh8NYM.jpeg"
                  alt="Students studying"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Facilities</h2>

          <Tabs defaultValue="classrooms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="labs">Laboratories</TabsTrigger>
              <TabsTrigger value="sports">Sports Facilities</TabsTrigger>
            </TabsList>
            <TabsContent value="classrooms" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src="/santos/Picture10.jpg"
                    alt="Modern classrooms"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Modern Classrooms</h3>
                  <p className="text-muted-foreground mb-4">
                    Our spacious, well-lit classrooms are designed to create an optimal learning environment. Each
                    classroom is equipped with modern teaching aids including smart boards, projectors, and internet
                    connectivity to facilitate interactive learning.
                  </p>
                  <p className="text-muted-foreground">
                    The classroom layout promotes both collaborative and individual learning, with flexible seating
                    arrangements that can be adapted to different teaching methodologies as required by the CBC
                    curriculum.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="library" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src="/santos/Picture28.jpg"
                    alt="School library"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Well-Stocked Library</h3>
                  <p className="text-muted-foreground mb-4">
                    Our library houses a vast collection of books, journals, and digital resources that cater to all age
                    groups and interests. It serves as a quiet space for research, reading, and study.
                  </p>
                  <p className="text-muted-foreground">
                    The library is managed by qualified librarians who assist students in finding resources and
                    developing research skills. Regular reading programs and book clubs are organized to foster a love
                    for reading among students.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="labs" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src="/santos/Picture14.jpg"
                    alt="Science laboratories"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">State-of-the-Art Laboratories</h3>
                  <p className="text-muted-foreground mb-4">
                    Our school boasts fully equipped science, computer, and language laboratories that provide hands-on
                    learning experiences for students. The science labs include separate facilities for physics,
                    chemistry, and biology.
                  </p>
                  <p className="text-muted-foreground">
                    The computer labs feature the latest hardware and software, ensuring students develop digital
                    literacy skills essential in today's world. Our language labs facilitate effective language learning
                    through audio-visual aids and interactive software.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="sports" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src="/santos/Picture39.jpg"
                    alt="Sports facilities"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Comprehensive Sports Facilities</h3>
                  <p className="text-muted-foreground mb-4">
                    Physical education is an integral part of our curriculum. Our sports facilities include a large
                    playing field for football, hockey, and athletics, as well as courts for basketball, volleyball, and
                    tennis.
                  </p>
                  <p className="text-muted-foreground">
                    We also have an indoor sports hall for activities like badminton, table tennis, and gymnastics.
                    Qualified physical education teachers and coaches guide students in developing their sporting
                    talents and maintaining physical fitness.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

