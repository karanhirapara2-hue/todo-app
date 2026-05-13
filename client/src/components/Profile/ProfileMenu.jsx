import React from "react";

function ProfileMenu({ user, onClose, onEdit }) {
//  console.log('Rendering ProfileMenu with user:', user.profilePicture);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {user?.profilePhoto ? (
              <img
                 src={`${import.meta.env.VITE_BASE_URL}/${user.profilePicture}`}
                alt={user.name || "Profile photo"}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c07057] text-xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <p className="text-sm text-[#9e9182] uppercase tracking-[0.2em]">Account</p>
              <h2 className="text-xl font-semibold text-[#2c2416]">{user?.name || "Unknown user"}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sm text-[#9e9182] hover:text-[#c07057]"
          >
            Close
          </button>
        </div>

        <div className="rounded-3xl border border-[#e7e2dd] bg-[#fbf7f2] p-5 mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#9e9182] mb-2">Email</p>
          <p className="text-sm text-[#4a3f33] break-words">{user?.email || "No email provided"}</p>
        </div>

        <button
          onClick={onEdit}
          className="w-full rounded-2xl bg-[#c07057] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a85e47]"
        >
          Edit profile
        </button>
      </div>
    </div>
  );
}

export default ProfileMenu;
