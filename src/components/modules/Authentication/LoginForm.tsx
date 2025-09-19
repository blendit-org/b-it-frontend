import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router";
import PasswordField from "./PasswordField";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { motion } from "framer-motion";

const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have at least 8 characters" })
    .max(20, { message: "Password cannot exceed 20 characters!" }),
});

export function LoginForm({ className }: React.ComponentProps<"form">) {
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const userInfo = {
      email: values.email,
      password: values.password,
    };

    try {
      localStorage.setItem("email", userInfo.email)
      const result = await login(userInfo).unwrap();
      localStorage.setItem("token", result.token);
      console.log(result)
      toast.success("✅ User logged in successfully!");
      navigate("/choose");
    } catch (err: any) {
      console.log(err);
      // toast.error(err.data.description)
      if (err?.status === 403) {
        toast.error("You are not Verified!!!");
        navigate("/verify")
      }
      if (err?.status === 401) {
        toast.error(err.description);
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col gap-6 bg-gradient-to-br from-black via-balck to-black rounded-2xl shadow-xl p-8",
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
          Welcome
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your account
        </p>
      </motion.div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-400">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                    className="border-orange-300 focus:ring-2 focus:ring-orange-500"
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
                <FormLabel className="font-semibold text-gray-400">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordField
                    {...field}
                    className="border-orange-300 focus:ring-2 focus:ring-orange-500"
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
              Login
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Register Link */}
      <motion.div
        className="text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-orange-600 hover:text-pink-600 transition"
        >
          Register here
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default LoginForm;
