"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Icon Imports
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { FiLock, FiUser, FiKey } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import Logo from "../../../../public/images/Logo.png";
import { MeshGradientComponent } from "@/components/ui/mesh-gradient";
import { AUTH_API_URL } from "@/lib/env";
import { setTokens, getAccessToken } from "@/lib/auth";

// Validation utility functions
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password.trim()) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
  return null;
};

const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters long";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
  return null;
};

const validateOTP = (otp: string): string | null => {
  if (!otp.trim()) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "OTP must be exactly 6 digits";
  return null;
};

const LoginSignUpPage: React.FC = () => {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [isLogin, setIsLogin] = useState(true);
  const [loginStep, setLoginStep] = useState<"email" | "otp">("email");
  const [showPassword, setShowPassword] = useState(false);

  // Form data states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Validation states
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  
  // UI feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken()
    if(token) {
      router.push('/dashboard')
    }
  }, [])
  

  // --- VALIDATION HELPERS ---
  const validateField = (fieldName: string, value: string): string | null => {
    switch (fieldName) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'name':
        return validateName(value);
      case 'otp':
        return validateOTP(value);
      default:
        return null;
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Clear field error when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    
    // Clear general error messages
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);

    return value;
  };

  // --- HANDLERS ---

  // Toggles between Login and Sign Up modes
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    // Reset all states for a clean slate
    setError(null);
    setSuccessMessage(null);
    setFieldErrors({});
    setLoginStep("email");
    setEmail("");
    setOtp("");
    setSignUpData({ name: "", email: "", password: "" });
  };

  // Handles input changes for the Sign Up form
  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanValue = handleFieldChange(name, value);
    setSignUpData((prev) => ({ ...prev, [name]: cleanValue }));
  };

  // Handles the submission of the Sign Up form
  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate all fields
    const errors: {[key: string]: string} = {};
    const nameError = validateName(signUpData.name);
    const emailError = validateEmail(signUpData.email);
    const passwordError = validatePassword(signUpData.password);

    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccessMessage("Account created successfully! Please log in.");
      // Switch to login mode after successful registration
      setTimeout(() => {
        setIsLogin(true);
        setEmail(signUpData.email); // Pre-fill email for login
        setSignUpData({ name: "", email: "", password: "" });
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 of Login: Submits email to get an OTP
  const handleLoginEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setFieldErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      const response = await fetch(`${AUTH_API_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || result.code === 404) {
        throw new Error(result.message || "User not found.");
      }

      setSuccessMessage(result.message || "OTP sent successfully!");
      setLoginStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 of Login: Verifies the OTP
  const handleLoginOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate OTP
    const otpError = validateOTP(otp);
    if (otpError) {
      setFieldErrors({ otp: otpError });
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch(`${AUTH_API_URL}/v1/auth/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok || result.code === 500) {
        throw new Error(result.message || "Invalid OTP or OTP expired.");
      }

      setSuccessMessage("Login successful! Redirecting...");
      setTokens(result.data.accessToken, result.data.refreshToken);
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.replace('/dashboard');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER METHOD ---
  return (
    <div className="flex min-h-screen font-sans bg-background text-foreground">
      {/* Left Panel: Branding & Illustration */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between p-8">
        <div className="absolute top-0 left-0 h-full w-full z-0">
          <MeshGradientComponent
            colors={["#1E2A78", "#2B6CB0", "#4FD1C5", "#E2E8F0"]}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="relative z-10">
          <Image src={Logo} alt="Techsolace Logo" className="w-auto h-12" />
        </div>
        <div className="relative z-10 flex flex-col items-start">
          <h1 className="text-7xl text-white font-bold leading-tight">
            Techsolace CMS
          </h1>
          <p className="text-lg text-neutral-200 max-w-md mt-4 font-medium text-start">
            A powerful, user-friendly content management system designed to
            streamline your workflow.
          </p>
        </div>
        <div /> {/* Dummy div for space-between alignment */}
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-foreground">
            {isLogin ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-muted-foreground mt-2 mb-8">
            {isLogin
              ? "Please log in to your account to continue."
              : "Let's get you started."}
          </p>

          {/* --- DYNAMIC FORM SECTION --- */}

          {/* LOGIN FORM */}
          {isLogin ? (
            // OTP LOGIN STEP 1: Email Form
            loginStep === "email" ? (
              <form onSubmit={handleLoginEmailSubmit} className="space-y-5">
                <div className="relative">
                  <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(handleFieldChange('email', e.target.value))}
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      fieldErrors.email ? 'border-red-500' : 'border-input'
                    } bg-transparent rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-sm`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-blue-600 hover:bg-blue-700 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : null}
                  Send OTP
                </button>
              </form>
            ) : (
              // OTP LOGIN STEP 2: OTP Form
              <form onSubmit={handleLoginOtpSubmit} className="space-y-5">
                <div className="relative">
                  <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-3 py-2.5 border border-input bg-muted rounded-md shadow-sm sm:text-sm text-muted-foreground"
                  />
                </div>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(handleFieldChange('otp', value));
                    }}
                    maxLength={6}
                    className={`w-full pl-10 pr-3 py-2.5 border ${
                      fieldErrors.otp ? 'border-red-500' : 'border-input'
                    } bg-transparent rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-sm`}
                  />
                  {fieldErrors.otp && (
                    <p className="mt-1 text-sm text-red-500">{fieldErrors.otp}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-blue-600 hover:bg-blue-700 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : null}
                  Verify & Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginStep("email");
                    setFieldErrors({});
                    setOtp("");
                  }}
                  className="w-full text-center text-sm text-muted-foreground hover:text-primary"
                >
                  Use a different email
                </button>
              </form>
            )
          ) : (
            // SIGN UP FORM
            <form onSubmit={handleSignUpSubmit} className="space-y-5">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                  className={`w-full pl-10 pr-3 py-2.5 border ${
                    fieldErrors.name ? 'border-red-500' : 'border-input'
                  } bg-transparent rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-sm`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
                )}
              </div>
              <div className="relative">
                <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email-signup"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  className={`w-full pl-10 pr-3 py-2.5 border ${
                    fieldErrors.email ? 'border-red-500' : 'border-input'
                  } bg-transparent rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-sm`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  className={`w-full pl-10 pr-10 py-2.5 border ${
                    fieldErrors.password ? 'border-red-500' : 'border-input'
                  } bg-transparent rounded-md shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5" />
                  )}
                </button>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-blue-600 hover:bg-blue-700 duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : null}
                Create Account
              </button>
            </form>
          )}

          {/* Feedback Messages */}
          <div className="mt-4 text-center text-sm min-h-[20px]">
            {error && <p className="text-red-500 font-medium">{error}</p>}
            {successMessage && (
              <p className="text-green-500 font-medium">{successMessage}</p>
            )}
          </div>

          {/* Toggle Form Mode */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={handleToggleMode}
              disabled={isLoading}
              className="font-semibold text-primary hover:underline ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
