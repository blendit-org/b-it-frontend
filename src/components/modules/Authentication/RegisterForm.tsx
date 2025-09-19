"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordField from "./PasswordField";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ✅ Schema
const RegisterSchema = z
  .object({
    userId: z.string().min(3, { message: "User ID is required" }),
    fullName: z
      .string()
      .min(3, { message: "Name must have at least 3 characters" })
      .max(50),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must have at least 8 characters" })
      .max(20, { message: "Password cannot exceed 20 characters!" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must have at least 8 characters" })
      .max(20, { message: "Password cannot exceed 20 characters!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm({ className }: React.ComponentProps<"form">) {
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      userId: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    const userInfo = {
      userId: values.userId,
      email: values.email,
      password: values.password,
      fullName: values.fullName,
    };

    try {
      localStorage.setItem("email", userInfo.email);
      const result = await registerUser(userInfo).unwrap();
      console.log(result);
      toast.success("🎉 User Created Successfully");
      navigate("/verify");
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong");
    }
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col gap-6 bg-black rounded-2xl shadow-xl p-8 border border-black",
        className
      )}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
          Create Account ✨
        </h1>
        <p className="text-gray-400 text-sm">
          Join us today and start your rendering journey 
        </p>
      </motion.div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-200">username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. uday123"
                    {...field}
                    className="border-orange-400 focus:ring-2 focus:ring-orange-500 bg-gray-900 text-white"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-400">
                  Must be unique.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-200">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="border-orange-400 focus:ring-2 focus:ring-orange-500 bg-gray-900 text-white"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-400">
                  This will be your public display name.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-200">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                    className="border-orange-400 focus:ring-2 focus:ring-orange-500 bg-gray-900 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-200">Password</FormLabel>
                <FormControl>
                  <PasswordField
                    {...field}
                    className="border-orange-400 focus:ring-2 focus:ring-orange-500 bg-gray-900 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-200">Confirm Password</FormLabel>
                <FormControl>
                  <PasswordField
                    {...field}
                    className="border-orange-400 focus:ring-2 focus:ring-orange-500 bg-gray-900 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-2 rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Sign Up
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Footer */}
      <motion.div
        className="text-center text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-orange-500 hover:text-pink-500 transition"
        >
          Login
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default RegisterForm;
