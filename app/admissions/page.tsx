import { useState, useEffect } from "react";
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
  studentFirstName: z.string().min(2),
  studentLastName: z.string().min(2),
  dateOfBirth: z.date(),
  gender: z.string(),
  gradeApplying: z.string(),
  parentFirstName: z.string().min(2),
  parentLastName: z.string().min(2),
  relationship: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  previousSchool: z.string().optional(),
  medicalConditions: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export default function AdmissionsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");

  useEffect(() => {
    const fetchAdmissionNumber = async () => {
      try {
        const number = await generateAdmissionNumber();

        async function generateAdmissionNumber() {
          // Mock implementation of admission number generation
          return `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        setAdmissionNumber(number);
      } catch (error) {
        console.error('Error fetching admission number:', error);
      }
    };

    fetchAdmissionNumber();
  }, []);

  const form = useForm({
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

  const sendEmail = async (formData: FormData) => {
    try {
      const templateParams = {
        ...formData,
        to_email: "munasirkorei@gmail.com",
        from_name: `${formData.parentFirstName} ${formData.parentLastName}`,
        message: "Please find the admission application form details below:",
        dateOfBirth: format(formData.dateOfBirth, "PPP"),
        admissionNumber,
      };

      await emailjs.send(
        "service_y2x9oqk",
        "template_39zf32x",
        templateParams,
        "GOmiNIEVpgkJqKEp7"
      );

      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

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

  const onSubmit = (values: FormData): void => {
    console.log(values);
    setIsSubmitted(true);
    sendEmail(values);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Admissions</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Join our school community and give your child the gift of quality education.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Application Form</h2>
          {isSubmitted ? (
            <div className="max-w-3xl mx-auto bg-background rounded-lg p-8 shadow-sm">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <h3 className="text-2xl font-bold">Application Submitted Successfully!</h3>
                <p>Thank you for applying. We will contact you shortly.</p>
                <Button onClick={() => setIsSubmitted(false)}>Submit Another Application</Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Admission Number */}
                <div className="mb-4">
                  <FormLabel>Admission Number</FormLabel>
                  <Input
                    placeholder="Admission Number"
                    readOnly
                    value={admissionNumber}
                  />
                </div>

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
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Select {...field}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
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
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input placeholder="Relationship" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Address" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gradeApplying"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Applying For</FormLabel>
                          <FormControl>
                            <Select {...field}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                                <SelectItem value="Grade 1">Grade 1</SelectItem>
                                <SelectItem value="Grade 2">Grade 2</SelectItem>
                                {/* Add more grades as needed */}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous School (if applicable)</FormLabel>
                          <FormControl>
                            <Input placeholder="Previous school" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Conditions (if any)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Medical conditions" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional information" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full">Submit Application</Button>
              </form>
            </Form>
          )}
        </div>
      </section>
    </div>
  );
}