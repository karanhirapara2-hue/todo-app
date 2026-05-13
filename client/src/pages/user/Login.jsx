import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 import * as authService from "../../services/user.sevices";
import { setAuth } from "../../redux/slices/Authslice";
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import {socket} from "../../services/socket.service"
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [forgot,setForgot]=useState(false);

  const navigate = useNavigate();
    const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setError("");

    if (!email.trim()) {
      setErrors({ email: "Please enter email" });
      return;
    }

    if (!password.trim()) {
      setErrors({ password: "Please enter password" });
      return;
    }

    try {
      const response = await authService.login({ email, password });
      if(response.data.data.user.is_banned){
         toast.error("This ID is banned ❌");
      }
     else {  
      dispatch(setAuth(response.data.data.user));
       
        
      const token = response.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
     
     
      navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password.");
      toast.error("Login failed ❌");
    }

    socket.connect();
  };

const handleForgot = async (e) => {
  e.preventDefault();
  setErrors({});
  setError("");

  try {
    const res = await authService.forgotpassword({ email });
    console.log(res);
    toast.success(res.data.message);
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-[#edeae4] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold text-[#2c2416] tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Terra Focus
          </h1>
          <p className="text-[#7a6e5f] mt-2 text-base">
            Welcome back — pick up where you left off.
          </p>
        </div>

        <div className="bg-[#e8e3db] rounded-2xl px-6 py-7 shadow-sm">
          {error && (
            <p className="text-sm text-[#c07057] bg-[#f5ede9] rounded-xl px-4 py-2 mb-4">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div className="bg-[#ddd8cf] rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <label className="text-xs text-[#9e9182] tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-[#4a3f33] placeholder-[#b0a89e] text-base outline-none"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

             { !forgot &&
            <div className="bg-[#ddd8cf] rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <label className="text-xs text-[#9e9182] tracking-wide uppercase">
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className="flex-1 bg-transparent text-[#4a3f33] placeholder-[#b0a89e] text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9e9182] hover:text-[#7a6e5f] transition-colors"
                >
                  {showPassword ? (
    // Eye-off icon
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
         <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
       ) : (
    // Eye icon
       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
          </svg>
            )}
        </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            }

            {!forgot ?
              (<button
              onClick={handleSubmit}
              className="mt-1 w-full py-3 bg-[#c07057] hover:bg-[#a85e47] active:scale-[0.98] text-white font-medium rounded-xl transition-all text-base"
            >
              Sign in
            </button>
            )
            :(
             <button
              onClick={handleForgot}
              className="mt-1 w-full py-3 bg-[#c07057] hover:bg-[#a85e47] active:scale-[0.98] text-white font-medium rounded-xl transition-all text-base"
            >
              continue
            </button>
            )
            }
          </div>
        </div>

        <p className="text-center text-sm text-[#9e9182] mt-5">
          No account yet?{" "}
          <Link
            to="/register"
            className="text-[#c07057] hover:text-[#a85e47] font-medium transition-colors"
          >
            Create one
          </Link>
          {
            forgot?(
              <button 
              onClick={()=>setForgot(false)}
               className="text-[#c07057] hover:text-[#a85e47] font-medium transition-colors"
            
          >
               back
          </button>
            ):
          (
          <button 
          onClick={()=>setForgot(true)}
           className="text-[#c07057] hover:text-[#a85e47] font-medium transition-colors"
            
          >
               forgot password
          </button>
          )
          }
        </p>
      </div>
    </div>
  );
}

export default Login;