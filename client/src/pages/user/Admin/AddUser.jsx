import { use, useEffect, useState } from "react";
import * as authService from "../../../services/user.sevices";
import * as adminService from "../../../services/admin.services";
import toast from "react-hot-toast";
function AddUser({setUpdate,isMAdmin,parentUser}) {
  
 const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password,setPassword] =useState("123456");
 const [errors, setErrors] = useState({});  // object — for field-level errors
const [error, setError] = useState(""); 
const [roleAdmin, setRoleAdmin] = useState("69ec311f790dff2bd1294bb7");
 const [roleUser, setRoleUser] = useState("69ef2a4ada34aed37b8cd1a6");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors({ name: "Please enter name" });
      return;
    }

    if (!email.trim()) {
      setErrors({ email: "Please enter email" });
      return;
    }
    
   try {
    if(isMAdmin){
    await authService.register({ name, email, password,role:roleAdmin,parentUser});
    }
    else{
        
    const res =await authService.register({ name, email, password,parentUser,role:roleUser});

    }
    
    const result = await adminService.setPassword({ email });
    
    setUpdate(false);
    toast.success("Staff added successfully ✅");
  } catch (error) {
    console.error(error);
  }
 
    
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">
              add staff
            </p>
            <h2 className="text-xl font-semibold text-[#2c2416]">
             
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="rounded-3xl border border-[#e7e2dd] bg-[#f7f2eb] p-4">
            <label className="block text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">
              Name*
            </label>
            <input
              className="w-full bg-transparent text-[#4a3f33] outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="rounded-3xl border border-[#e7e2dd] bg-[#f7f2eb] p-4">
            <label className="block text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">
              Email*
            </label>
            <input
              type="email"
              className="w-full bg-transparent text-[#4a3f33] outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          
          {error && <p className="text-sm text-[#c07057]">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#c07057] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a85e47] disabled:cursor-not-allowed disabled:opacity-70"
          >
            add Staff
          </button>
        </form>
        <div>
          <button
            onClick={() => setUpdate(false)}
            className="text-sm text-[#9e9182] hover:text-[#c07057]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
