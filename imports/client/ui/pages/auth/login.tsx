import React, {useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from "@/components/user";
import {LoginForm} from "@/features/auth/login/login-form";
import {Button} from "@/components/button";
import {cn} from "@/lib/utils";

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
          <Link to={"/"}>
            <img className={"h-12"} src="/images/logo_gold.png" alt="logo" />
          </Link>


          <Button type={"button"} onClick={() => navigate(isAdminLoginRoute ? "/login":"/login/admin")} variant={isAdminLoginRoute ? "default" : "pale"}>
            {isAdminLoginRoute ? "Login" : "Admin Login"}
          </Button>
        </div>
      </div>

      <div className="mt-28 px-4 max-w-2xl mx-auto">
        <div className={cn("py-8 px-7 rounded-md", isAdminLoginRoute ? "bg-gray-200 text-gray-700":"bg-gray-700 text-gray-200")}>
          <div>
            <h1 className="text-2xl mb-6 font-bold">{isAdminLoginRoute ? "Admin Login":"Login"}</h1>
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
          <Link to="/forgot-password" className="block text-base mb-4">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  </>
};


export default LoginPage;
