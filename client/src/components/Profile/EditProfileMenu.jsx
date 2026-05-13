import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/slices/profileslice";

function EditProfileMenu({ user, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || null);
  const [errors, setErrors] = useState({});
  const updating = useSelector((state) => state.Profile.updating);
  const error = useSelector((state) => state.Profile.error);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    if(user?.profilePicture) {
      setPreview(`${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`);
    }
    setPhoto(null);
  }, [user]);

  useEffect(() => {
    if (!photo) return;
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

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

    const result = await dispatch(
      updateUserProfile({
        name,
        email,
        photo,
        userId: user?.id || user?._id,
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">Edit profile</p>
            <h2 className="text-xl font-semibold text-[#2c2416]">Update your information</h2>
          
          
          </div>
          <button
            onClick={onClose}
            className="text-sm text-[#9e9182] hover:text-[#c07057]"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-3xl border border-[#e7e2dd] bg-[#f7f2eb] p-4">
            <label className="block text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">
              Profile photo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#d8d0c6]">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
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
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
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
      </div>
    </div>
  );
}

export default EditProfileMenu;
