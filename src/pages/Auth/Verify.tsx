import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";



const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email] = useState(location.state);
    const [confirmed, setConfirmed] = useState(false)
    const [sendOtp] = useSendOtpMutation()
    const [verifyOtp] = useVerifyOtpMutation()
    const [timer, setTimer] = useState(10);


    // !needed for development
    // useEffect(()=>{
    //     if(!email) {
    //         navigate("/");
    //     }
    // },[email])

    useEffect(() => {
    if (!(email && confirmed)) return; // don’t even start if invalid
    
    const timerId = setInterval(() => {
        setTimer((prev) => prev>0 ? prev-1:0);
    }, 1000);

    return () => clearInterval(timerId); // cleanup on dependency change/unmount
}, [email, confirmed]);

    
    const OtpSchema = z.object({
        pin: z.string().min(6, { message: "Your one time password must be at least 6 character!!" }).max(6)
    });


    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            pin: ""
        }
    });

    const handleSendOtp = async () => {
        const toastId = toast.loading("Sending OTP...")
        try {
            const res = await sendOtp({ email: email });
            console.log(res);
            if (res.data?.success === true) {
                toast.success(`OTP send to ${email} successfully...`, { id: toastId });
                setConfirmed(true);
                setTimer(10);
            }
            
        } catch (error:any) {
            toast.error(error.data?.message);
        }
    };

    const onSubmit = async (data: z.infer<typeof OtpSchema>) => {
        console.log(data);
        toast("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                        {/* {data} */}
                    </code>
                </pre>
            ),
        });

        try {
            const res = await verifyOtp({ email: email, otp: data.pin }).unwrap();
            console.log(res);
            if (res.success) {
                toast.success("You are verified Successfully...");
                navigate("/login");
            }
        } catch (error: any) {
            toast.error(error)
        }

    };

    
    
    return (
        <div className='min-h-screen grid place-items-center'>
            {
            confirmed?
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>
                        Verify Your Email Address
                    </CardTitle>
                    <CardDescription>
                        Please Enter the 6-digit code we sent to <br /> {email}
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid place-items-center'>
                    <Form {...form}>
                        <form id="otp-form" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem className="grid place-items-center">
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                </InputOTPGroup>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={1} />
                                                </InputOTPGroup>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <Dot />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={4} />
                                                </InputOTPGroup>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription className="text-wrap">
                                            
                                            {
                                                timer == 0 ?
                                                    <Button type="button" onClick={handleSendOtp} variant="link" className="text-right cursor-pointer">Resend OTP!</Button>
                                                    :
                                                    <span className="text-gray-400">Resend OTP!   <span className="text-red-400 p-2">{timer}</span></span>
                                            }
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className='flex justify-end'>
                    <Button form="otp-form" type='submit' className='w-full'>Submit</Button>
                </CardFooter>
                
            </Card> 
            :
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl'>
                        Verify Your Email Address
                    </CardTitle>
                    <CardDescription>
                        We will send you an OTP at <br /> {email}
                    </CardDescription>
                </CardHeader>
                
                <CardFooter className='flex justify-end'>
                    <Button onClick={handleSendOtp} className='w-[300px]'>Confirm</Button>
                </CardFooter>
                
            </Card>
            }
        </div>
    );
};

export default Verify;