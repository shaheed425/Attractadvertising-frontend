import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  QrCode,
  UploadCloud,
  CheckCircle2,
  Copy,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Ticket,
  Tag,
  Sparkles,
  Percent,
  Trash2,
  Zap,
} from 'lucide-react';
import { API_URL } from '../../config';
import { getStoredSettings } from '../../utils/settingsStorage';
import { getStoredCoupons } from '../admin/CouponManager';

export default function PaymentSection({
  bookingData,
  paymentScreenshot,
  setPaymentScreenshot,
  onSubmitBooking,
  onPrev,
  submitting,
  submitError,
  ownerUpiSettings,
}) {
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(paymentScreenshot || null);
  const [dragActive, setDragActive] = useState(false);

  // Coupon state
  const [coupons, setCoupons] = useState(getStoredCoupons().filter((c) => c.status === 'Active' && c.isPublic));
  const [inputCode, setInputCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const storedSettings = getStoredSettings();
  const upiId = ownerUpiSettings?.upiId || storedSettings?.upiId || '8590204464@ybl';
  const ownerName = ownerUpiSettings?.ownerName || storedSettings?.ownerName || 'ATTRACT ADVERTISING';
  const customQrImage = ownerUpiSettings?.qrImage || storedSettings?.qrImage;

  const originalAmount = bookingData.totalAmount || 4000;

  // Calculate dynamic payable amount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayableAmount = Math.max(0, originalAmount - discountAmount);

  useEffect(() => {
    fetchPublicCoupons();
  }, []);

  const fetchPublicCoupons = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/coupons/public`);
      if (Array.isArray(data) && data.length > 0) {
        setCoupons(data);
      }
    } catch (err) {
      console.warn('Public coupons API fallback to local stored coupons:', err);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setPaymentScreenshot(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setPaymentScreenshot('');
  };

  // Coupon Validation Handler
  const handleApplyCouponCode = async (targetCode = inputCode) => {
    setCouponError('');
    if (!targetCode || !targetCode.trim()) {
      return setCouponError('Please enter a coupon code.');
    }

    const cleanCode = targetCode.trim().toUpperCase();
    setValidatingCoupon(true);

    try {
      // Try Backend Validation Endpoint
      const { data } = await axios.post(`${API_URL}/api/coupons/validate`, {
        code: cleanCode,
        originalAmount,
      });

      if (data && data.valid) {
        setAppliedCoupon(data.coupon);
        setInputCode(cleanCode);
        setCouponError('');
      } else {
        setCouponError('Invalid coupon code.');
      }
    } catch (err) {
      console.warn('Backend validation fallback to local calculation:', err);

      // Local Fallback Validation
      const allCoupons = getStoredCoupons();
      const match = allCoupons.find((c) => c.code === cleanCode);

      if (!match) {
        setCouponError('Invalid coupon code.');
      } else if (match.status !== 'Active') {
        setCouponError('This coupon is currently inactive.');
      } else if (new Date() < new Date(match.startDate)) {
        setCouponError('This coupon promotion has not started yet.');
      } else if (new Date() > new Date(match.expiryDate)) {
        setCouponError('This coupon has expired.');
      } else if (match.minimumBookingAmount > 0 && originalAmount < match.minimumBookingAmount) {
        setCouponError(
          `Minimum booking amount of ₹${match.minimumBookingAmount.toLocaleString()} required for this coupon.`
        );
      } else if (match.usageLimit > 0 && match.usageCount >= match.usageLimit) {
        setCouponError('This coupon has reached its maximum redemption limit.');
      } else {
        // Calculate
        let calcDiscount = Math.round((originalAmount * match.discountPercentage) / 100);
        if (match.maximumDiscount > 0 && calcDiscount > match.maximumDiscount) {
          calcDiscount = match.maximumDiscount;
        }

        const calculatedFinal = Math.max(0, originalAmount - calcDiscount);
        setAppliedCoupon({
          code: match.code,
          title: match.title,
          discountPercentage: match.discountPercentage,
          discountAmount: calcDiscount,
          originalAmount,
          finalAmount: calculatedFinal,
        });
        setInputCode(cleanCode);
        setCouponError('');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setInputCode('');
    setCouponError('');
  };

  // Submit Handler including Coupon Metadata
  const handleSubmitWithCoupon = () => {
    const finalData = {
      originalAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      discountPercentage: appliedCoupon ? appliedCoupon.discountPercentage : 0,
      discountAmount: appliedCoupon ? appliedCoupon.discountAmount : 0,
      finalAmount: finalPayableAmount,
      totalAmount: finalPayableAmount,
    };
    onSubmitBooking(finalData);
  };

  // Quick helper to build a high-resolution QR code URL using QuickChart QR API or custom uploaded image
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(ownerName)}&am=${finalPayableAmount}&cu=INR`;
  const qrImageUrl = customQrImage || `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&dark=5B49AD&light=ffffff&margin=1`;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <Sparkles size={14} /> Step 7 of 7 — Offers & Booking Confirmation
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Coupon & Final Confirmation
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Apply your promotional coupon code to calculate final offer pricing, then confirm your scheduled campaign.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8">
        
        {/* APPLY COUPON SECTION */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <Ticket size={20} className="text-[#5B49AD]" /> Have a Coupon Code?
          </h3>

          {!appliedCoupon ? (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. WELCOME20)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCouponCode())}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-white text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#5B49AD]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyCouponCode()}
                  disabled={validatingCoupon}
                  className="px-8 py-3.5 bg-[#5B49AD] text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-[#5B49AD]/80 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {validatingCoupon ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Apply Coupon'
                  )}
                </button>
              </div>

              {couponError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={15} /> {couponError}
                </div>
              )}
            </div>
          ) : (
            /* APPLIED COUPON SUCCESS BANNER */
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 size={16} /> Coupon Applied Successfully
                  </div>
                  <h4 className="text-xl font-display font-bold text-white uppercase">{appliedCoupon.title || 'Promotional Offer'}</h4>
                  <p className="text-xs text-white/60">
                    Code <strong className="font-mono text-emerald-400">{appliedCoupon.code}</strong> applied — Saved{' '}
                    <strong className="text-emerald-400 font-bold">₹{appliedCoupon.discountAmount.toLocaleString()}</strong> ({appliedCoupon.discountPercentage}% OFF)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Trash2 size={14} /> Remove Coupon
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PAYMENT DYNAMIC CALCULATION BREAKDOWN BOX */}
        <div className="bg-black/60 border border-white/10 p-6 md:p-8 rounded-3xl space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5B49AD] border-b border-white/10 pb-3">
            Final Price Summary & Offer Calculation
          </h4>

          <div className="space-y-3 text-xs md:text-sm">
            <div className="flex justify-between items-center text-white/70">
              <span>Original Campaign Booking Fee</span>
              <span className="font-mono font-bold text-white">₹{originalAmount.toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Applied Coupon Code ({appliedCoupon.code})</span>
                  <span className="font-mono font-bold">{appliedCoupon.discountPercentage}% OFF</span>
                </div>

                <div className="flex justify-between items-center text-emerald-400">
                  <span>Discount Savings Amount</span>
                  <span className="font-mono font-bold">-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-base md:text-lg">
              <span className="font-bold text-white uppercase">Net Payable Amount</span>
              <span className="font-display font-black text-2xl md:text-3xl text-white">
                ₹{finalPayableAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Error message display if any submission error occurs */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase">
            <AlertCircle size={18} className="shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Final Submission Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onPrev}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Summary
          </button>

          <button
            type="button"
            onClick={handleSubmitWithCoupon}
            disabled={submitting}
            className={`w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-6 sm:px-10 py-3.5 sm:py-5 uppercase text-xs tracking-[0.15em] sm:tracking-[0.25em] font-black shadow-[0_0_30px_rgba(91,73,173,0.6)] flex items-center justify-center gap-3 ${
              submitting ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Submitting Scheduled Booking...
              </>
            ) : (
              <>
                Confirm & Submit Booking
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
