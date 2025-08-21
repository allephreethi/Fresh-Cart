// src/pages/AccountSettings.jsx
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";
import { useUser } from "../context/UserContext";

export default function AccountSettings() {
  const { user, updateUser, updateProfilePic, getProfileImageUrl } = useUser();
  const userId = Number(user?.id);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    profileFile: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [addressForm, setAddressForm] = useState(initialAddressForm());

  function initialAddressForm() {
    return {
      fullName: "",
      street: "",
      postalCode: "",
      label: "Home",
      city: "",
      state: "",
      country: "",
    };
  }

  // ===== Load User + Addresses =====
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const userRes = await api.get(`/api/users/${userId}`);
        setUserData({
          name: userRes.data.name || "",
          email: userRes.data.email || "",
          password: "",
          profileFile: null,
        });

        // Fetch addresses
        try {
          const addrRes = await api.get(`/api/addresses/user/${userId}`);
          setAddresses(Array.isArray(addrRes.data) ? addrRes.data : []);
        } catch (addrErr) {
          if (addrErr.response?.status === 404) setAddresses([]);
          else console.error("❌ Fetch addresses error:", addrErr.response || addrErr);
        }
      } catch (err) {
        console.error("❌ Fetch user error:", err.response || err);
        toast.error("Failed to load account data");
      }
    };

    fetchData();
  }, [userId]);

  // ===== Profile Update =====
  const handleProfileUpdate = async () => {
    if (!userId) return;
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      if (userData.password) formData.append("password", userData.password);

      const res = await api.put(`/api/users/update/${userId}`, formData);
      const updatedUser = res.data.user || res.data;

      updateUser(updatedUser);
      setUserData((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated ✅");
    } catch (err) {
      console.error("❌ Profile update error:", err.response || err);
      toast.error("Failed to update profile");
    }
  };

  // ===== Profile Pic Upload =====
  const handleProfilePicUpload = async (file) => {
    if (!userId || !file) return;
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await api.put(`/api/users/update/${userId}`, formData);
      const updatedUser = res.data.user || res.data;

      updateUser(updatedUser);
      if (updatedUser.profileImage) updateProfilePic(updatedUser.profileImage);

      setUserData((prev) => ({ ...prev, profileFile: null }));
      toast.success("Profile picture updated ✅");
    } catch (err) {
      console.error("❌ Profile pic upload error:", err.response || err);
      toast.error("Failed to upload profile picture");
    }
  };

  // ===== Save Address =====
  const handleSaveAddress = async () => {
    if (!userId) return;

    const { fullName, street, postalCode, label } = addressForm;
    if (!fullName || !street || !postalCode || !label) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editAddress) {
        // Update address
        await api.put(`/api/addresses/${editAddress.id}`, addressForm);
        setAddresses((prev) =>
          prev.map((a) => (a.id === editAddress.id ? { ...a, ...addressForm } : a))
        );
        toast.success("Address updated ✅");
      } else {
        // Add new address
        const res = await api.post(`/api/addresses/${userId}`, addressForm);
        const newAddress = { id: res.data.id, ...addressForm };
        setAddresses((prev) => [...prev, newAddress]);
        toast.success("Address added ✅");
      }
      handleCloseModal();
    } catch (err) {
      console.error("❌ Add/update address error:", err.response || err);
      toast.error("Failed to save address");
    }
  };

  // ===== Delete Address =====
  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/api/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted ✅");
    } catch (err) {
      console.error("❌ Delete address error:", err.response || err);
      toast.error("Failed to delete address");
    }
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
    setEditAddress(null);
    setAddressForm(initialAddressForm());
  };

  if (!userId) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-6 mb-6 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border">
            {userData.profileFile ? (
              <img
                src={URL.createObjectURL(userData.profileFile)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={getProfileImageUrl()}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200">
            <Upload size={16} /> Change
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUserData({ ...userData, profileFile: file });
                handleProfilePicUpload(file);
              }}
            />
          </label>
        </div>

        <InputRow
          icon={<User size={18} />}
          type="text"
          placeholder="Your Name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <InputRow
          icon={<Mail size={18} />}
          type="email"
          placeholder="Your Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <div className="flex items-center gap-2 mb-3 border rounded-lg p-2">
          <Lock size={18} />
          <input
            type={showPassword ? "text" : "password"}
            className="flex-1 outline-none"
            placeholder="New Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          onClick={handleProfileUpdate}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Save Changes
        </button>
      </motion.div>

      {/* Addresses Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
          <button
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={18} /> Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses saved yet.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEdit={() => {
                  setEditAddress(addr);
                  setAddressForm(addr);
                  setShowAddressModal(true);
                }}
                onDelete={() => handleDeleteAddress(addr.id)}
              />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAddressModal && (
          <AddressModal
            addressForm={addressForm}
            setAddressForm={setAddressForm}
            onClose={handleCloseModal}
            onSave={handleSaveAddress}
            editAddress={editAddress}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */
function InputRow({ icon, ...props }) {
  return (
    <div className="flex items-center gap-2 mb-3 border rounded-lg p-2">
      {icon}
      <input {...props} className="flex-1 outline-none" />
    </div>
  );
}

function AddressCard({ addr, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start">
      <div>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs mr-2">
          {addr.label}
        </span>
        <p className="font-semibold">{addr.fullName}</p>
        <p className="text-gray-600">{addr.street}</p>
        <p className="text-gray-600">Pincode: {addr.postalCode}</p>
        {addr.city && <p className="text-gray-600">{addr.city}</p>}
        {addr.state && <p className="text-gray-600">{addr.state}</p>}
        {addr.country && <p className="text-gray-600">{addr.country}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function AddressModal({ addressForm, setAddressForm, onClose, onSave, editAddress }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h3 className="text-lg font-bold mb-4">
          {editAddress ? "Edit Address" : "Add New Address"}
        </h3>

        {["fullName", "street", "postalCode", "city", "state", "country"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={addressForm[field]}
            onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
          />
        ))}

        <select
          value={addressForm.label}
          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
