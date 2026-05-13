import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/user.sevices";
import toast from 'react-hot-toast';


function Register({setClose,admin}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const isAdminModal = Boolean(admin);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setError("");

    if (!name.trim()) {
      setErrors({ name: "Please enter name" });
      return;
    }

    if (!email.trim()) {
      setErrors({ email: "Please enter email" });
      return;
    }

    if (!password.trim()) {
      setErrors({ password: "Please enter password" });
      return;
    }

    if (!confirm.trim()) {
      setErrors({ confirm: "Please enter confirm password" });
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const result = await authService.register({ name, email, password });
            // console.log("Registration result:", result);
      const userId = result?.data?.data?._id;

      if (userId && profilePhoto) {
        await authService.uploadProfilePhoto(userId, profilePhoto);
      }

      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed ❌");
    }
    if (isAdminModal && setClose) {
      setClose(true);
    }
  };

  return (
    
    <div
      className={
        isAdminModal
          ? "fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-6 overflow-y-auto"
          : "min-h-screen bg-[#edeae4] flex flex-col items-center justify-center px-4"
      }
    >
      <div className="w-full max-w-md">
        {isAdminModal && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => setClose(true)}
              className="px-3 py-1 text-sm rounded-lg border border-[#d4c9bc] text-[#4a3f33] bg-[#f5f0ea] hover:bg-[#e9e1d7]"
            >
              Close
            </button>
          </div>
        )}

        <div className="text-center mb-8">
          <h1
            className="text-5xl font-bold text-[#2c2416] tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Terra Focus
          </h1>
          <p className="text-[#7a6e5f] mt-2 text-base">
            A clear mind starts here.
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
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-[#4a3f33] placeholder-[#b0a89e] text-base outline-none"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

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

            <div className="bg-[#ddd8cf] rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <label className="text-xs text-[#9e9182] tracking-wide uppercase">
                Confirm Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  className="flex-1 bg-transparent text-[#4a3f33] placeholder-[#b0a89e] text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-[#9e9182] hover:text-[#7a6e5f] transition-colors"
                >
                   {showPassword ? (
    
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
             <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
           ) : (
    
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
             <circle cx="12" cy="12" r="3" />
              </svg>
              )}
          </button>
              </div>  
              {errors.confirm && <p className="text-sm text-red-500">{errors.confirm}</p>}
            </div>

            <div className="bg-[#ddd8cf] rounded-xl px-4 py-3 flex flex-col gap-0.5">
              <label className="text-xs text-[#9e9182] tracking-wide uppercase">
                Profile Photo (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                className="bg-transparent text-[#4a3f33] placeholder-[#b0a89e] text-base outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-1 w-full py-3 bg-[#c07057] hover:bg-[#a85e47] active:scale-[0.98] text-white font-medium rounded-xl transition-all text-base"
            >
              Create account
            </button>
            {isAdminModal && (
              <button
                type="button"
                onClick={() => setClose(true)}
                className="w-full py-3 bg-[#f5f0ea] border border-[#d4c9bc] text-[#4a3f33] font-medium rounded-xl hover:bg-[#e9e1d7] transition-all text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-[#9e9182] mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#c07057] hover:text-[#a85e47] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;