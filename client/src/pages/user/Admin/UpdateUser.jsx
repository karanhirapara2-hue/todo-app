import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as adminServices from "../../../services/admin.services";
import * as userServices from "../../../services/user.sevices";

function UpdateUser({ userId, setUpdate, Email, Name, setChange }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(Name);
  const [email, setEmail] = useState(Email);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [access, setAccess] = useState([]);
  const updating = useSelector((state) => state.Profile.updating);
  const error = useSelector((state) => state.Profile.error);
   const profile = useSelector((state) => state.Profile.data);
  const authUser = useSelector((state) => state.Auth.user);
  const user = profile || authUser;
  const [permissions, setPermissions] = useState(user.access || []);
  useEffect(() => {
  if(user.role!=="69f1c7e7072238bd3255cfb5"){
     setPermissions(prev => prev.filter(item => item !== "User"));
  }},[user.role])
  
  //   useEffect(() => {
  //     setName(user?.name || "");
  //     setEmail(user?.email || "");
  //     if(user?.profilePicture) {
  //       setPreview(`${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`);
  //     }
  //     setPhoto(null);
  //   }, [user]);

  //   useEffect(() => {
  //     if (!photo) return;
  //     const objectUrl = URL.createObjectURL(photo);
  //     setPreview(objectUrl);
  //     return () => URL.revokeObjectURL(objectUrl);
  //   }, [photo]);
  
  useEffect(()=>{
   adminServices.getUserById(userId).then((res) => {
        setAccess(res.data.data.access);
        console.log(res.data.data.access);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  },[])

  const handleAccessChange = (e) => {
    const { value, checked } = e.target;

    setAccess(
      (prev) =>
        checked
          ? [...prev, value] // add
          : prev.filter((item) => item !== value), // remove
    );
  };

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

    adminServices
      .updateUserAdmin({ email, name }, userId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error("Error:", err);
      });

      adminServices
      .updateUserAccessAdmin(access, userId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    userServices
      .uploadProfilePhoto(userId, photo)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
    

    setUpdate(false);
    setChange(2);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">
              Edit profile
            </p>
            <h2 className="text-xl font-semibold text-[#2c2416]">
              Update your information
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-3xl border border-[#e7e2dd] bg-[#f7f2eb] p-4">
            <label className="block text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">
              Profile photo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#d8d0c6]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-[#7a6e5f]">No photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="text-sm text-[#4a3f33]"
              />
            </div>
          </div>

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
          <div>
            {permissions.map((fature) =>(
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value={fature}
                checked={access.includes(fature)}
                onChange={handleAccessChange}
              />
              {fature}
            </label>
            ))
          }
          </div>
          {error && <p className="text-sm text-[#c07057]">{error}</p>}

          <button
            type="submit"
            disabled={updating}
            className="w-full rounded-2xl bg-[#c07057] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a85e47] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {updating ? "Saving..." : "Save changes"}
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

export default UpdateUser;
