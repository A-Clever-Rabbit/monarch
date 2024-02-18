import React, {useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from "@/components/user";
import {LoginForm} from "@/features/auth";
import {Button} from "@/components/button";
import {cn} from "@/components/lib/utils";

const LoginPage = () => {
  const location = useLocation();
  const { loginWithPassword, user } = useAuth();
  const navigate = useNavigate();

  const isAdminLoginRoute = location.pathname === "/login/admin";

  useEffect(() => {
    if(user) {
      return navigate("/");
    }
  }, []);

  return <>
    <div className="bg-foreground w-full min-h-screen absolute top-0 overflow-hidden">
      <div className="px-8">
        <div className="flex justify-between items-center border-b border-border py-5">
          <img src="/logo_white_large.svg" alt="logo"/>

          <Button type={"button"} onClick={() => navigate(isAdminLoginRoute ? "/login":"/login/admin")} variant={isAdminLoginRoute ? "defaultBlue" : "pale"}>
            {isAdminLoginRoute ? "Terminal Login" : "Admin Login"}
          </Button>
        </div>
      </div>

      <div className="mt-28 px-4 max-w-2xl mx-auto">
        <div className={cn("py-8 px-7 rounded-md", isAdminLoginRoute ? "bg-dash-grey-200 text-dash-grey-700":"bg-dash-grey-700 text-dash-grey-200")}>
          <div>
            <h1 className="text-2xl mb-6 font-bold">{isAdminLoginRoute ? "Admin Login":"Terminal Login"}</h1>
          </div>
          <LoginForm onSubmit={async ({ email, password }, form) => {
            try {
              await loginWithPassword(email, password);
              if(isAdminLoginRoute) {
                await navigate("/admin");
              } else {
                await navigate("/");
              }
            } catch (error: any) {
              form.setStatus(error);
            }

          }} />
          <Link to="/forgot-password" className="block text-base text-primary mb-4">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  </>
};


export default LoginPage;
