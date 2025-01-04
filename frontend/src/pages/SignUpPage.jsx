import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { BotMessageSquare,User,Mail,Lock,Eye,EyeOff,Loader2 } from 'lucide-react';
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";

export const SignUpPage = () => {

  const [showPassword,setShowPassword] =useState(false);

  const [formData,setFormData] = useState({
    fullName : "" ,
    email : "",
    password : "",
  });
  const [otpData,setOtpData] = useState({
    otp : "",
  })

  const {otpGenerated,backToSignUpPage} = useAuthStore()

  const {isOtpVerifying, verifyOtp} = useAuthStore();
  const {signUp,isSigningUp} = useAuthStore();


  const validateForm = ()=>{
    if(!formData.fullName.trim()) return toast.error("Full name is required.");
    if(!formData.email.trim()) return toast.error("email is required.");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  } ;

  const handleSignUpSubmit = (event)=>{
    event.preventDefault();
    
    const success = validateForm();
    if(success===true) signUp(formData);
  } ;

  const handleOtpSubmit = (event) => {
    event.preventDefault();

    const key = otpData.otp.trim();
    if(!key) return toast.error("Otp is required for signing up.")
    
    //for now full object is sent to backend it could be changed and only otp can also be sent will help in debugging.
    verifyOtp(otpData);
  };

  const handleBackToSignUp = () => {
    backToSignUpPage();
  };  

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>

      {/* first writing left for signUp side  */}
      {!otpGenerated ? 
        (
          <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
            <div className='w-full max-w-md space-y-8'>
              {/* now logo comes */}
              <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                  >
                    <BotMessageSquare className="size-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                  <p className="text-base-content/60">Get started with your free account</p>
                </div>
              </div>
    
              {/* starts out user form */}
              <form onSubmit={handleSignUpSubmit} className='space-y-6'>
    
              {/* here goes username field form control */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="thisis example"
                      value={formData.fullName}
                      onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                    />
                  </div>
                </div>
    
                {/* here goes email input  */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
    
                {/* here starts password field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
    
                {/* this is my submit button and for having a loading functionality while submiting */}
                <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
    
              </form>
              {/* form ends here */}
    
                  {/* if user already has an account we'll redirect them to login page */}
                <div className="text-center">
                <p className="text-base-content/60">
                  Already have an account?
                  <Link to="/login" className="link  link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
    
            </div>
          </div>
        ) :
        // now if user wants to verify using otp
        (
          <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
            <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors"
                  >
                    <BotMessageSquare className="size-6 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mt-2">Otp sent</h1>
                  <p className="text-base-content/60">Enter the otp sent to your email address</p>
                </div>
            </div>

            <form onSubmit={handleOtpSubmit} className='space-y-6'>

                <div className="form-control">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="Enter otp here"
                      value={otpData.otp}
                      onChange={(event) => setOtpData({ ...otpData, otp: event.target.value })}
                    />
                  </div>
                </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={isOtpVerifying}>
                    {isOtpVerifying ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Verify Otp"
                    )}
                  </button>

                  <button type="button" onClick={handleBackToSignUp} className="btn btn-primary w-full" disabled = {isOtpVerifying}>
                    Back to Signup
                  </button>
                
                
            </form>

          </div>
        ) }

      {/* now here right side begins */}
      <AuthImagePattern
        title="Join our amazing family"
        subtitle="connect with friends, family and stay in touch."
      />

    </div>
  )
}
