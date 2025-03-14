"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// ✅ Define valid roles
const roles = ["admin", "teacher", "parent", "student", "secretary"];

// ✅ Zod schema for validation
const loginSchema = z.object({
  role: z.string().min(1, { message: "Role is required" }),
  identifier: z.string().min(1, { message: "Email/Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export default function PortalPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("admin");

  const router = useRouter();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "admin",
      identifier: "",
      password: ""
    }
  });

  interface LoginValues {
    role: string;
    identifier: string;
    password: string;
  }

  async function onLoginSubmit(values: LoginValues): Promise<void> {
    setLoading(true);
    setError("");
  
    console.log("📦 Values being sent:", values);
    console.log("👉 Role sent:", values.role);
  
    try {
      const response: Response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
  
      const data = await response.json();
      console.log("✅ Response data:", data);
  
      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }
  
      const userRole = data.user?.role;
      console.log("✅ User role received:", userRole);
  
      if (!userRole || !roles.includes(userRole)) {
        console.error("❌ Invalid role received:", userRole);
        setError("Invalid role detected. Please contact support.");
        return;
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("roles", JSON.stringify([userRole]));
  
      console.log(`✅ Logged in as ${userRole}`);
  
      switch (userRole) {
        case "admin":
          router.push("/AdminDashboard");
          break;
        case "teacher":
          router.push("/TeacherDashboard");
          break;
        case "parent":
          router.push("/parent/dashboard");
          break;
        case "student":
          router.push("/student/dashboard");
          break;
        case "secretary":
          router.push("/SecretaryDashboard");
          break;
        default:
          setError("Role not recognized.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Parent, Student & Secretary Portal
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl">
              Access your child's academic records, attendance, school communications, or manage school operations.
            </p>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {error && (
                      <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                        className="space-y-4"
                      >
                        {/* Role Selector */}
                        <FormField
                          control={loginForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setRole(value);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map((roleOption) => (
                                      <SelectItem
                                        key={roleOption}
                                        value={roleOption}
                                      >
                                        {roleOption.charAt(0).toUpperCase() +
                                          roleOption.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Identifier */}
                        <FormField
                          control={loginForm.control}
                          name="identifier"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {(role === "admin" || role === "teacher" || role === "secretary")
                                  ? "Email"
                                  : "Username (ID Number / Admission Number)"}
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    placeholder={
                                      (role === "admin" || role === "teacher" || role === "secretary")
                                        ? "name@example.com"
                                        : "username"
                                    }
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password */}
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="pl-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? "Hide" : "Show"}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Login"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
