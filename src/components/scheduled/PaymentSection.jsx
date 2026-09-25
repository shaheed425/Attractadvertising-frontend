import React, { useState } from 'react';
import { QrCode, UploadCloud, CheckCircle2, Copy, Check, X, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { getStoredSettings } from '../../utils/settingsStorage';

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

  const storedSettings = getStoredSettings();
  const upiId = ownerUpiSettings?.upiId || storedSettings?.upiId || '8590204464@ybl';
  const ownerName = ownerUpiSettings?.ownerName || storedSettings?.ownerName || 'ATTRACT ADVERTISING';
  const customQrImage = ownerUpiSettings?.qrImage || storedSettings?.qrImage;
  const amount = bookingData.totalAmount || 4000;

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

  // Quick helper to build a high-resolution QR code URL using QuickChart QR API or custom uploaded image
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(ownerName)}&am=${amount}&cu=INR`;
  const qrImageUrl = customQrImage || `https://quickchart.io/qr?text=${encodeURIComponent(upiString)}&size=300&dark=5B49AD&light=ffffff&margin=1`;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
          <QrCode size={14} /> Step 7 of 7 — Owner UPI Payment
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
          Complete Your Payment
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Scan the owner's official UPI QR code, complete payment, and upload your transaction screenshot.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-10">
        
        {/* Section 4: Owner's QR Code & UPI Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* QR Code Container */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-black/60 p-8 rounded-3xl border border-white/10 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5B49AD]/20 to-transparent rounded-3xl pointer-events-none" />

            <div className="text-center mb-4">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#5B49AD] block">
                OFFICIAL OWNER UPI QR CODE
              </span>
              <h3 className="text-lg font-bold text-white uppercase">{ownerName}</h3>
            </div>

            {/* Large Scan-Ready QR Code Image */}
            <div className="relative p-4 bg-white rounded-2xl shadow-2xl border-4 border-[#5B49AD]/40 transition-transform duration-300 group-hover:scale-105">
              <img
                src={qrImageUrl}
                alt="Owner's UPI QR Code"
                className="w-52 h-52 md:w-60 md:h-60 object-contain mx-auto rounded-lg"
              />
            </div>

            <div className="mt-4 text-center space-y-1.5">
              <p className="text-2xl font-display font-black text-white">₹{amount.toLocaleString()}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-full">
                <span>Minimum Advance Required: ₹9</span>
              </div>
              <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Scan with GPay, PhonePe, Paytm, BHIM</p>
            </div>
          </div>

          {/* UPI ID & Instructions */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-black/50 p-6 rounded-3xl border border-white/10 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                Owner's Direct UPI ID
              </span>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
                <span className="font-mono text-base font-bold text-white tracking-wider">{upiId}</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5B49AD] text-white text-[10px] font-bold uppercase rounded-xl hover:bg-[#5B49AD]/80 transition-all"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5B49AD] flex items-center gap-2">
                <ShieldCheck size={16} /> Payment Instructions
              </h4>
              <ol className="space-y-2.5 text-xs text-[#A1A1AA]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#5B49AD]/30 text-[#5B49AD] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Scan the QR code using any supported UPI app on your phone.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#5B49AD]/30 text-[#5B49AD] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Pay a minimum advance of <strong className="text-emerald-400 font-bold">₹9</strong> (or full campaign fee of <strong className="text-white font-bold">₹{amount.toLocaleString()}</strong>).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#5B49AD]/30 text-[#5B49AD] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Take a clear screenshot showing the successful transaction.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#5B49AD]/30 text-[#5B49AD] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span>Upload the screenshot below for booking verification.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Section 5: Payment Screenshot Upload */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <div>
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <UploadCloud size={20} className="text-[#5B49AD]" /> Upload Payment Screenshot *
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-1">
              Please upload a clear screenshot showing the successful payment transaction.
            </p>
          </div>

          {previewUrl ? (
            <div className="relative bg-black/60 border border-[#5B49AD]/60 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
              <img
                src={previewUrl}
                alt="Payment Screenshot Preview"
                className="w-40 h-40 object-cover rounded-2xl border border-white/20 shadow-md"
              />
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <CheckCircle2 size={16} /> Screenshot Attached Successfully
                </div>
                <p className="text-xs text-[#A1A1AA]">
                  Your screenshot is ready for verification with this booking request.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                  <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold uppercase text-white hover:bg-white/20 transition-all cursor-pointer">
                    Change Screenshot
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase hover:bg-red-500/20 transition-all flex items-center gap-1"
                  >
                    <X size={14} /> Remove Image
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-300 cursor-pointer relative ${
                dragActive
                  ? 'border-[#5B49AD] bg-[#5B49AD]/20 scale-[1.01]'
                  : 'border-white/20 bg-white/5 hover:border-[#5B49AD]/60 hover:bg-white/10'
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-4 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-[#5B49AD]/20 border border-[#5B49AD]/40 flex items-center justify-center mx-auto text-[#5B49AD]">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-base font-bold text-white uppercase">
                    Drag & Drop or Click to Upload Payment Screenshot
                  </p>
                  <p className="text-xs text-[#A1A1AA] mt-1">Supported Formats: JPG, JPEG, PNG, WEBP (Max 10MB)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error message display if missing screenshot or submission error */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase">
            <AlertCircle size={18} className="shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Section 6: Final Submission Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onPrev}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Summary
          </button>

          <button
            type="button"
            onClick={onSubmitBooking}
            disabled={submitting || !paymentScreenshot}
            className={`w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-10 py-5 uppercase text-xs tracking-[0.25em] font-black shadow-[0_0_30px_rgba(91,73,173,0.6)] flex items-center justify-center gap-3 ${
              submitting || !paymentScreenshot ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Submitting Scheduled Booking...
              </>
            ) : (
              <>
                Submit Scheduled Booking
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
