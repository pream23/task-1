'use client'
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { useRouter } from "next/navigation";
import OtpModal from "./otpModal"; // Make sure this component exists
type FormType = "Sign-In" | "Sign-Up";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconEye,
    IconEyeOff,
} from "@tabler/icons-react";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/users.action";

// Define separate schemas for better type safety
const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignInFormType = z.infer<typeof signInSchema>;
type SignUpFormType = z.infer<typeof signUpSchema>;

const authFormSchema = (formType: FormType) =>
    formType === "Sign-Up" ? signUpSchema : signInSchema;

const AuthForm = ({ type }: { type: FormType }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [accountId, setAccountId] = useState<string | null>(null);
    const router = useRouter();

    const formSchema = authFormSchema(type);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<SignInFormType | SignUpFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            ...(type === "Sign-Up" && {
                firstName: "",
                lastName: "",
                confirmPassword: "",
            }),
        },
    });

    const onSubmit = async (values: SignInFormType | SignUpFormType) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const user =
                type === "Sign-Up"
                    ? await createAccount({
                        firstName: values.firstName || "",
                        lastName: values.lastName || "",
                        email: values.email,
                        password: values.password
                    })
                    : await signInUser({ email: values.email, password: values.password });

            console.log("User response:", user);

            // Fix: Check the correct property name
            if (user?.accountId) {
                setAccountId(user.accountId);
            } else if (user?.$id) {
                setAccountId(user.$id);
            } else {
                console.error("No account ID found in user response:", user);
                setErrorMessage("Authentication succeeded but no account ID received");
            }
        } catch (error: any) {
            console.error("Authentication error:", error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to process request. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'github' | 'google') => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            console.log(`Signing in with ${provider}`);
            // Implement actual OAuth logic here
        } catch (error: any) {
            console.error(`${provider} sign-in error:`, error);
            setErrorMessage(`Failed to sign in with ${provider}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
                {type === 'Sign-Up' && (
                    <>
                        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                            <LabelInputContainer>
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    type="text"
                                    disabled={isLoading}
                                    {...register("firstName")}
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                                )}
                            </LabelInputContainer>
                            <LabelInputContainer>
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    type="text"
                                    disabled={isLoading}
                                    {...register("lastName")}
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                                )}
                            </LabelInputContainer>
                        </div>
                    </>
                )}

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        disabled={isLoading}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            {...register("password")}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <IconEyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                                <IconEye className="h-4 w-4 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </LabelInputContainer>
                {type === 'Sign-Up' && (
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                placeholder="••••••••"
                                type={showConfirmPassword ? "text" : "password"}
                                disabled={isLoading}
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <IconEyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <IconEye className="h-4 w-4 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </LabelInputContainer>
                )}


                {type === "Sign-In" && (
                    <div className="mb-4 text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-brand-100 hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                )}

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-brand to-brand-100 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : type === "Sign-In" ? "Sign in" : "Sign Up"} &rarr;
                    <BottomGradient />
                </button>

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <div className="body-2 flex justify-center mt-6">
                    <p className="text-light-100">
                        {type === "Sign-In" ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <Link
                        href={type === "Sign-In" ? "/sign-up" : "/sign-in"}
                        className="ml-1 font-medium text-brand-100 hover:underline"
                    >
                        {type === "Sign-In" ? "Sign Up" : "Sign In"}
                    </Link>
                </div>
                <div className="flex flex-col">
                    {accountId && <OtpModal email={watch('email')} accountId={accountId} />}
                </div>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleOAuthSignIn('github')}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Continue with GitHub
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleOAuthSignIn('google')}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Continue with Google
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
};

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};

export default AuthForm;