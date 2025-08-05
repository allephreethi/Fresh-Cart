// AccountSettings.jsx
import { useState, useRef } from 'react';
import {
  User,
  Lock,
  Settings,
  X,
  MapPin,
  Upload,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// InputField with eye toggle for passwords
const InputField = ({ name, type = 'text', value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <input
        type={isPassword && show ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 rounded-md bg-[#E8FFD7] pr-10 ${error ? 'border border-red-500' : ''}`}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-2 text-[#5E936C]"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

// Modal component
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-500 hover:text-red-500"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-bold mb-4 text-[#5E936C]">{title}</h2>
      {children}
    </motion.div>
  </div>
);

// Validation
const validate = (data, fields) => {
  const errors = {};
  fields.forEach((field) => {
    if (!data[field]) errors[field] = 'This field is required';
  });
  return errors;
};

export default function AccountSettings() {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    notify: false,
    addressFullName: '',
    mobile: '',
    pincode: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const fileRef = useRef();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClose = () => {
    setActiveModal(null);
    setFormErrors({});
    setFormData((prev) => ({
      ...prev,
      password: '',
      newPassword: '',
      confirmPassword: '',
      addressFullName: '',
      mobile: '',
      pincode: '',
      address: '',
    }));
    setEditingAddress(false);
    setEditingIndex(null);
  };

  const openAddressModal = (edit = false, index = null) => {
    if (edit && index !== null) {
      const addr = savedAddresses[index];
      setFormData((prev) => ({
        ...prev,
        addressFullName: addr.fullName,
        mobile: addr.mobile,
        pincode: addr.pincode,
        address: addr.address,
      }));
      setEditingIndex(index);
    }
    setEditingAddress(edit);
    setActiveModal('address');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAddress = (index) => {
    const updated = [...savedAddresses];
    updated.splice(index, 1);
    setSavedAddresses(updated);
    toast.success('Address deleted');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 space-y-8 border border-[#93DA97]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#5E936C]">Account Settings</h1>
          <p className="text-zinc-600 mt-2">Manage your personal info, security, preferences & addresses.</p>
          <div className="flex justify-center mt-4">
            <div className="relative group">
              <img
                src={profileImage || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-[#E8FFD7] object-cover"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-[#5E936C] p-1 rounded-full text-white hover:bg-[#4e7b5b]"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section icon={<User className="w-6 h-6 text-[#5E936C] mt-1" />} title="Personal Info" desc="Update your name & email."
            onClick={() => setActiveModal('info')} btnText="Edit Info" />

          <Section icon={<Lock className="w-6 h-6 text-[#5E936C] mt-1" />} title="Change Password" desc="Update your password regularly."
            onClick={() => setActiveModal('password')} btnText="Update Password" />

          <Section icon={<Settings className="w-6 h-6 text-[#5E936C] mt-1" />} title="Preferences" desc="Notification preferences."
            onClick={() => setActiveModal('preferences')} btnText="Manage Preferences" />

          <Section icon={<MapPin className="w-6 h-6 text-[#5E936C] mt-1" />} title="Saved Addresses" desc="Your delivery addresses."
            onClick={() => openAddressModal(false)} btnText="Add Address" />
        </div>

        {/* Address list */}
        {savedAddresses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-[#5E936C] mb-4">Your Saved Addresses</h2>
            <div className="space-y-4">
              {savedAddresses.map((addr, index) => (
                <div key={index} className="bg-[#f9fff5] border border-[#E8FFD7] rounded-lg p-4 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-zinc-800">{addr.fullName}</h3>
                    <p className="text-zinc-500 text-sm">{addr.address}</p>
                    <p className="text-zinc-500 text-sm mt-1">📞 {addr.mobile} | 📍 {addr.pincode}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAddressModal(true, index)}
                      className="text-[#5E936C] hover:text-[#4e7b5b]"
                      aria-label="Edit Address"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Address"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeModal === 'info' && (
          <Modal title="Edit Personal Info" onClose={handleClose}>
            <form
              className="grid md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const errors = validate(formData, ['fullName', 'email']);
                setFormErrors(errors);
                if (Object.keys(errors).length === 0) {
                  toast.success('Info updated');
                  handleClose();
                }
              }}
            >
              <InputField name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" error={formErrors.fullName} />
              <InputField type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" error={formErrors.email} />
              <button type="submit" className="col-span-2 w-full bg-[#5E936C] text-white py-2 rounded-md hover:bg-[#4e7b5b]">Save Changes</button>
            </form>
          </Modal>
        )}

        {activeModal === 'password' && (
          <Modal title="Change Password" onClose={handleClose}>
            <form
              className="grid md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const errors = validate(formData, ['password', 'newPassword', 'confirmPassword']);
                if (formData.newPassword !== formData.confirmPassword) {
                  errors.confirmPassword = 'Passwords do not match';
                }
                setFormErrors(errors);
                if (Object.keys(errors).length === 0) {
                  toast.success('Password updated');
                  handleClose();
                }
              }}
            >
              <InputField type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Current Password" error={formErrors.password} />
              <InputField type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder="New Password" error={formErrors.newPassword} />
              <InputField type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm New Password" error={formErrors.confirmPassword} />
              <button type="submit" className="col-span-2 w-full bg-[#5E936C] text-white py-2 rounded-md hover:bg-[#4e7b5b]">Update Password</button>
            </form>
          </Modal>
        )}

        {activeModal === 'preferences' && (
          <Modal title="Manage Preferences" onClose={handleClose}>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Preferences saved');
                handleClose();
              }}
            >
              <label className="flex items-center gap-2 text-zinc-700">
                <input type="checkbox" name="notify" checked={formData.notify} onChange={handleInputChange} className="accent-[#5E936C]" />
                Enable Notifications
              </label>
              <button type="submit" className="w-full bg-[#5E936C] text-white py-2 rounded-md hover:bg-[#4e7b5b]">Save Preferences</button>
            </form>
          </Modal>
        )}

        {activeModal === 'address' && (
          <Modal title={editingAddress ? 'Edit Address' : 'Add New Address'} onClose={handleClose}>
            <form
              className="grid md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const errors = validate(formData, ['addressFullName', 'mobile', 'pincode', 'address']);
                setFormErrors(errors);
                if (Object.keys(errors).length === 0) {
                  const newAddress = {
                    fullName: formData.addressFullName,
                    mobile: formData.mobile,
                    pincode: formData.pincode,
                    address: formData.address,
                  };
                  let updated = [...savedAddresses];
                  if (editingAddress && editingIndex !== null) {
                    updated[editingIndex] = newAddress;
                    toast.success('Address updated');
                  } else {
                    updated.push(newAddress);
                    toast.success('Address saved');
                  }
                  setSavedAddresses(updated);
                  handleClose();
                }
              }}
            >
              <InputField name="addressFullName" value={formData.addressFullName} onChange={handleInputChange} placeholder="Full Name" error={formErrors.addressFullName} />
              <InputField type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" error={formErrors.mobile} />
              <InputField type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" error={formErrors.pincode} />
              <div className="md:col-span-2">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  rows={3}
                  className={`w-full p-2 rounded-md bg-[#E8FFD7] ${formErrors.address ? 'border border-red-500' : ''}`}
                ></textarea>
                {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
              </div>
              <button type="submit" className="col-span-2 w-full bg-[#5E936C] text-white py-2 rounded-md hover:bg-[#4e7b5b]">{editingAddress ? 'Update Address' : 'Save Address'}</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Section Card
function Section({ icon, title, desc, onClick, btnText }) {
  return (
    <section className="p-5 rounded-xl border border-[#E8FFD7] bg-[#f9fff5] flex gap-4 items-start">
      {icon}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>
        <p className="text-zinc-500 text-sm mt-1">{desc}</p>
        <button onClick={onClick} className="mt-3 px-4 py-2 bg-[#E8FFD7] hover:bg-[#d3f6c9] text-sm text-[#5E936C] font-medium rounded-lg transition">{btnText}</button>
      </div>
    </section>
  );
}
