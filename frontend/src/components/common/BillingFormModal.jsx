import { useState } from "react";
import toast from "react-hot-toast";
import { FiX, FiLoader } from "react-icons/fi";

function BillingFormModal({ plan, isOpen, onClose, onSubmit, isChangingPlan }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormComplete = () => {
    if (isChangingPlan) return true;
    return (
      formData.cardholderName.trim() &&
      formData.email.trim() &&
      formData.cardNumber.trim() &&
      formData.expiryDate.trim() &&
      formData.cvc.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.postalCode.trim() &&
      formData.country.trim()
    );
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setFormData({ ...formData, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setFormData({ ...formData, cvc: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormComplete()) {
      toast.error("Please fill in all billing details");
      return;
    }

    if (!isChangingPlan) {
      if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Card number must be 16 digits");
        return;
      }
      if (formData.expiryDate.length !== 5) {
        toast.error("Expiry date must be MM/YY");
        return;
      }
      if (formData.cvc.length !== 3) {
        toast.error("CVC must be 3 digits");
        return;
      }
      if (!formData.email.includes("@")) {
        toast.error("Invalid email address");
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit(isChangingPlan ? {} : formData);
      setFormData({
        cardholderName: "",
        email: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Pakistan",
      });
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 border-b border-gold-400/20 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                {isChangingPlan ? "Confirm Plan Change" : "Complete Your Subscription"}
              </h2>
              <p className="text-gold-400 text-sm mt-1 font-medium">
                {plan?.name} — {plan?.currency || "PKR"} {plan?.price?.toLocaleString()}/month
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {isChangingPlan ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  You are about to change your subscription to the <span className="font-bold">{plan?.name}</span> plan.
                </p>
                <p className="text-xs text-blue-800/80">
                  Your payment method on file will be used. This change will be scheduled to take effect at the start of your next billing cycle.
                </p>
              </div>
            ) : (
              <>
                {/* Cardholder Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Card Details Section */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                    Card Information
                  </h3>

                  {/* Card Number */}
                  <div className="mb-4">
                    <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength="19"
                      className="border border-gray-300 rounded-lg p-3 text-sm w-full focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white font-mono"
                    />
                  </div>

                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        Expiry Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        CVC (3 digits) *
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        maxLength="3"
                        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address Section */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                    Billing Address
                  </h3>

                  {/* Address */}
                  <div className="mb-4">
                    <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold block mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className="border border-gray-300 rounded-lg p-3 text-sm w-full focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white"
                    />
                  </div>

                  {/* City, Postal Code, Country */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Karachi"
                        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="74000"
                        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-wider text-slate-600 font-semibold">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/30 transition-all bg-white"
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="UAE">UAE</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800 font-medium">
                    ✓ All fields are required to proceed with your subscription.
                  </p>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-slate-900 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormComplete() || loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isFormComplete() && !loading
                    ? "bg-gold-400 hover:bg-gold-500 text-slate-950 shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <FiLoader size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : isChangingPlan ? (
                  "Confirm Plan Change"
                ) : (
                  `Subscribe Now — ${plan?.currency || "PKR"} ${plan?.price?.toLocaleString()}/month`
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

export default BillingFormModal;
