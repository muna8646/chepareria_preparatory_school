"use client";

import { useState } from "react";
import { CalendarIcon, CheckCircle2, Info } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "emailjs-com";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form Schema
const formSchema = z.object({
  // Student Information
  studentFirstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  studentLastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  dateOfBirth: z.date({ required_error: "Please select a date of birth." }),
  gender: z.string({ required_error: "Please select a gender." }),
  gradeApplying: z.string({ required_error: "Please select a grade." }),

  // Parent/Guardian Information
  parentFirstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  parentLastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  relationship: z.string({ required_error: "Please select your relationship to the student." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your full address." }),

  // Additional Information
  previousSchool: z.string().optional(),
  medicalConditions: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export default function AdmissionsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentFirstName: "",
      studentLastName: "",
      parentFirstName: "",
      parentLastName: "",
      email: "",
      phone: "",
      address: "",
      previousSchool: "",
      medicalConditions: "",
      additionalInfo: "",
    },
  });

  // Function to send email
  interface FormData {
    studentFirstName: string;
    studentLastName: string;
    dateOfBirth: Date;
    gender: string;
    gradeApplying: string;
    parentFirstName: string;
    parentLastName: string;
    relationship: string;
    email: string;
    phone: string;
    address: string;
    previousSchool?: string;
    medicalConditions?: string;
    additionalInfo?: string;
  }

  type TemplateParams = Omit<FormData, 'dateOfBirth'> & {
    to_email: string;
    from_name: string;
    message: string;
    dateOfBirth: string;
  };

  const sendEmail = async (formData: FormData): Promise<void> => {
    try {
      // Prepare email parameters
      const templateParams: TemplateParams = {
        ...formData,
        to_email: "munasirkorei@gmail.com",
        from_name: `${formData.parentFirstName} ${formData.parentLastName}`,
        message: "Please find the admission application form details below:",
        dateOfBirth: format(formData.dateOfBirth, "PPP"),
      };

      // Send email using EmailJS
      await emailjs.send(
        "service_y2x9oqk", // Replace with your EmailJS service ID
        "template_39zf32x", // Replace with your EmailJS template ID
        templateParams,
        "GOmiNIEVpgkJqKEp7" // Replace with your EmailJS user ID
      );

      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsSubmitted(true);
    sendEmail(values); // Send the form data via email
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Admissions</h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Join our school community and give your child the gift of quality education under the Competency-Based
              Curriculum.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"></div>
        </div>
      </section>

      {/* Admissions Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Admissions Process</h2>... <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: "1",
                title: "Application",
                description: "Complete and submit the online application form with all required documents.",
              },
              {
                step: "2",
                title: "Assessment",
                description: "Students undergo an age-appropriate assessment to determine their learning needs.",
              },
              {
                step: "3",
                title: "Interview",
                description: "Parents and students are invited for an interview with our admissions team.",
              },
              {
                step: "4",
                title: "Offer",
                description: "Successful applicants receive an offer letter with enrollment instructions.",
              },
              {
                step: "5",
                title: "Enrollment",
                description: "Complete the enrollment process by paying fees and submitting additional documents.",
              },
              {
                step: "6",
                title: "Orientation",
                description: "Attend the orientation program to familiarize with the school environment.",
              },
            ].map((step) => (
              <Card key={step.title} className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-2">
                    {step.step}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <Alert className="mb-8">
              <Info className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                Applications for the next academic year are now open. Please ensure all required documents are submitted
                with your application.
              </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="item-1">
                <AccordionTrigger>Required Documents</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Birth certificate (copy)</li>
                    <li>Previous school reports (if applicable)</li>
                    <li>Passport-sized photographs (2)</li>
                    <li>Immunization records</li>
                    <li>Parent/guardian ID (copy)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Fee Structure</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4 text-muted-foreground">
                    Our fee structure varies by grade level. Please contact our admissions office for detailed
                    information.
                  </p>
                  <p className="text-muted-foreground">The fees generally cover:</p>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Tuition</li>
                    <li>Learning materials</li>
                    <li>Extracurricular activities</li>
                    <li>Technology resources</li>
                    <li>School development fund</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Scholarships & Financial Aid</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    We offer a limited number of scholarships based on academic excellence, talent, and financial need.
                    Applications for scholarships should be submitted along with the admissions application. Please
                    contact our admissions office for more information on eligibility criteria and application process.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Student Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Student Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture89-bouMlLpE5qI2UV3E5pOHMJzeTzW6vQ.png"
                alt="Student with guitar"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture1-jozGotLnSLvwQa1lEBRRar3umDkrmq.png"
                alt="Graduate student"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture62-YfovYZYtXrSrXrj8dsNgTLKpukZ97I.png"
                alt="Graduate student"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Application Form</h2>... {isSubmitted ? (
            <div className="max-w-3xl mx-auto bg-background rounded-lg p-8 shadow-sm">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold">Application Submitted Successfully!</h3>
                <p className="text-muted-foreground">
                  Thank you for applying to our school. We have received your application and will contact you shortly
                  to schedule an assessment and interview.
                </p>
                <Button onClick={() => setIsSubmitted(false)} className="mt-4">
                  Submit Another Application
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-background rounded-lg p-6 md:p-8 shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Student Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="studentFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="studentLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={
                                      "w-[240px] pl-3 text-left font-normal" +
                                      (field.value ? " text-black" : " text-muted-foreground")
                                    }
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="gradeApplying"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Grade Applying For</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Grade 1</SelectItem>
                              <SelectItem value="2">Grade 2</SelectItem>
                              <SelectItem value="3">Grade 3</SelectItem>
                              <SelectItem value="4">Grade 4</SelectItem>
                              <SelectItem value="5">Grade 5</SelectItem>
                              <SelectItem value="6">Grade 6</SelectItem>
                              <SelectItem value="7">Grade 7</SelectItem>
                              <SelectItem value="8">Grade 8</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Parent/Guardian Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="parentFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="parentLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Relationship to Student</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email address" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Previous School (if applicable)</FormLabel>
                          <FormControl>
                            <Input placeholder="Previous school" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medicalConditions"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Medical Conditions (if any)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Medical conditions" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Any Additional Information</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional information" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
