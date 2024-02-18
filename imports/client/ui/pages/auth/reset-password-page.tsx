import React from 'react';
import {Link, useParams} from "react-router-dom";
import {toast} from "@/components/ui/use-toast";
import { Accounts } from 'meteor/accounts-base';
import {ResetPasswordForm} from "@/features/auth/reset-pasword-form";

const ResetPasswordPage = () => {
  const { token } = useParams();

  if (!token) {
    return <div>Invalid token</div>;
  }

  return <>
    <div className="bg-foreground w-full min-h-screen absolute top-0 overflow-hidden">
      <div className="h-[150px] lg:h-[300px]">
        <div className="text-primary-foreground font-semibold text-center text-2xl pt-[60px]">Set New Password</div>
      </div>
      <div className="mt-6 px-4 max-w-2xl	mx-auto">
        <div className="w-[228px] py-8">
          <img src={"/logo_white_small.svg"} alt="Image 2" />
        </div>
        <ResetPasswordForm onSubmit={({ password }) => {
          Accounts.resetPassword(token, password, (error) => {
            if (!error) {
              toast({
                title: "Success",
                description: "Password reset successfully.",
              });
            } else {
              toast({
                title: "Error",
                description: `Couldn't reset password. ${error.reason}`,
              })
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

export default ResetPasswordPage;
