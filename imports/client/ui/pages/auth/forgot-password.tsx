import React from 'react'
import {Link} from 'react-router-dom'
import {ForgotPasswordForm} from "@/features/auth/forgot-pasword-form";
import {useMethodMutation} from "@/hooks/api";
import {toast} from "@/components/use-toast";

const ForgotPasswordPage = () => {
  const resetPasswordMutation = useMethodMutation("users.sendPasswordResetEmail");

  return <>
    <div className="bg-foreground w-full min-h-screen absolute top-0 overflow-hidden">
      <div className="h-[150px] lg:h-[300px]">
        <div className="text-primary-foreground font-semibold text-center text-2xl pt-[60px]">Forgot Password</div>
      </div>
      <div className="mt-6 px-4 max-w-2xl	mx-auto">
        <div className="w-[228px] py-8">
          <img src={"/logo_white_small.svg"} alt="Image 2" />
        </div>
        <ForgotPasswordForm onSubmit={({ email }) => {
          resetPasswordMutation.mutate({ email }, {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Password reset email sent. Check your inbox",
              });
            },
            onError: () => {
              toast({
                title: "Error",
                description: "Couldn't send password reset email.",
              });
            }
          });
        }} />
      </div>
      <div className="absolute bottom-4 flex w-full justify-center">
        <Link to="/login" className="text-base text-primary">
          Login
        </Link>
      </div>
    </div>
  </>
};


export default ForgotPasswordPage;
