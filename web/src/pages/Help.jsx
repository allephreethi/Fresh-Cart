import { useState, useEffect } from 'react';
import { Mail, Phone, ChevronDown, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const faqs = [
  { question: 'How do I track my order?', answer: 'You can track your order from the "My Orders" page after logging in.' },
  { question: 'Can I cancel or modify my order?', answer: 'Yes, orders can be canceled or modified within 1 hour of placement.' },
  { question: 'How do I update my delivery address?', answer: 'Go to Account Settings > Saved Addresses to update your delivery address.' },
  { question: 'What payment methods are accepted?', answer: 'We accept UPI, credit/debit cards, net banking, and cash on delivery.' },
];

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Help() {
  const { user } = useAppContext();
  const [openIndex, setOpenIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const getToken = () => user?.token || localStorage.getItem('token');

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  // Auto-fill name/email from user when form opens
  useEffect(() => {
    if (showForm && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        message: '',
      });
    }
  }, [showForm, user]);

  const fetchRequests = async () => {
    const token = getToken();
    if (!token) return setRequests([]);
    try {
      const res = await axios.get(`${API_URL}/api/help-request`, authHeaders());
      setRequests(res.data || []);
    } catch (err) {
      console.error('Fetch requests error:', err);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return showToast('You must be logged in to submit requests', 'error');

    try {
      await axios.post(`${API_URL}/api/help-request`, formData, authHeaders());
      setShowForm(false);
      setFormData(prev => ({ ...prev, message: '' })); // reset only message
      fetchRequests();
      showToast('Request submitted successfully!', 'success');
    } catch (err) {
      console.error('Submit request error:', err);
      showToast('Failed to submit request.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await axios.delete(`${API_URL}/api/help-request/${id}`, authHeaders());
      fetchRequests();
      showToast('Request deleted successfully!', 'success');
    } catch (err) {
      console.error('Delete request error:', err);
      showToast('Failed to delete request.', 'error');
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-[#93DA97] p-6 sm:p-8 lg:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#5E936C]">Help & Support</h1>
          <p className="text-zinc-600 mt-3 text-sm sm:text-base">
            Need assistance? Browse common questions or contact us directly.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-[#E8FFD7] rounded-xl p-5 sm:p-6 mb-10">
          <h2 className="text-xl font-semibold text-[#5E936C] mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-md p-4 shadow-sm border border-[#93DA97]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full text-left font-medium text-[#5E936C]"
                >
                  {faq.question}
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === index && (
                  <p className="text-sm text-zinc-700 mt-3">{faq.answer}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <ContactCard
            icon={<Phone className="w-5 h-5" />}
            title="Call Us"
            desc={<a href="tel:+15551234567" className="text-[#5E936C] underline hover:text-[#4e7b5b]">+1 (555) 123-4567</a>}
          />
          <ContactCard
            icon={<Mail className="w-5 h-5" />}
            title="Email Us"
            desc={<a href="mailto:support@freshcart.com" className="text-[#5E936C] underline hover:text-[#4e7b5b]">support@freshcart.com</a>}
          />
          <ContactCard
            icon={<Settings className="w-5 h-5" />}
            title="Request Type"
            desc={
              getToken() ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-2 px-4 py-1 text-sm bg-[#5E936C] text-white rounded-md hover:bg-[#4e7b5b] transition"
                >
                  Contact Support
                </button>
              ) : (
                <p className="text-red-500 mt-2 text-sm">Please login to contact support.</p>
              )
            }
          />
        </div>

        {/* User Requests */}
        {getToken() && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-[#5E936C] mb-4">Your Submitted Requests</h2>
            {requests.length ? (
              <div className="space-y-4">
                {requests.map(req => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border p-4 rounded-md bg-white flex justify-between items-start shadow-sm"
                  >
                    <div>
                      <p><strong>Name:</strong> {req.name}</p>
                      <p><strong>Email:</strong> {req.email}</p>
                      <p><strong>Message:</strong> {req.message}</p>
                    </div>
                    <button onClick={() => handleDelete(req.id)} className="text-red-500 hover:text-red-700">
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No requests yet. Start by contacting support!</p>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-[#93DA97] max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-[#5E936C] hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-[#5E936C] mb-5">Submit Your Request</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md border-[#93DA97] bg-white focus:outline-none focus:ring-2 focus:ring-[#5E936C]"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md border-[#93DA97] bg-white focus:outline-none focus:ring-2 focus:ring-[#5E936C]"
                  />
                </div>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="How can we help you?"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md border-[#93DA97] bg-white focus:outline-none focus:ring-2 focus:ring-[#5E936C]"
                ></textarea>
                <button type="submit" className="bg-[#5E936C] text-white px-6 py-3 rounded-md hover:bg-[#4e7b5b] transition">
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white z-50 ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactCard({ icon, title, desc }) {
  return (
    <div className="bg-[#F9FFF2] border border-[#93DA97] rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2 text-[#5E936C] font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-sm text-zinc-700">{desc}</div>
    </div>
  );
}
