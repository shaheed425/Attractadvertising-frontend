import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  Home,
  Printer,
  Sparkles,
  FileText,
  X,
  Phone,
  Mail,
  Building,
  Tag,
} from 'lucide-react';

export default function BookingSuccess({ bookingResult }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {
    bookingId = `ATT-SCH-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName = 'Valued Client',
    phoneNumber = '+91 70342 04464',
    email = 'client@example.com',
    companyName = '',
    address = '',
    date = 'Scheduled Date',
    preferredDate = '',
    district = 'District',
    place = 'Location',
    timeSlot = 'Morning Prime Slot',
    screenCount = 2,
    basePricePerScreen = 4000,
    originalAmount = 8000,
    couponCode = '',
    discountPercentage = 0,
    discountAmount = 0,
    finalAmount = 8000,
    totalAmount = 8000,
    paymentStatus = 'Pending Confirmation',
    createdAt = new Date().toISOString(),
  } = bookingResult || {};

  const grossTotal = originalAmount || basePricePerScreen * (screenCount || 2);
  const netTotal = finalAmount || totalAmount || grossTotal - discountAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto py-8">
      {/* On-Screen Success Card */}
      <div className="no-print bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl space-y-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B49AD]/20 via-transparent to-transparent pointer-events-none" />

        {/* Animated Check Icon */}
        <div className="relative z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#5B49AD]/20 border-2 border-[#5B49AD] flex items-center justify-center mx-auto text-white shadow-[0_0_40px_rgba(91,73,173,0.8)] animate-pulse">
            <CheckCircle2 size={44} strokeWidth={2.5} className="text-white" />
          </div>

          <div className="mt-6 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5B49AD] flex items-center justify-center gap-2">
              <Sparkles size={14} /> BOOKING CONFIRMATION & QUOTATION
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
              Booking Request Submitted
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-lg mx-auto italic">
              "Your scheduled advertising campaign request has been submitted successfully. Below is your official quotation receipt."
            </p>
          </div>
        </div>

        {/* Reference ID Pill */}
        <div className="inline-block bg-black/60 border border-white/10 px-6 py-3 rounded-full relative z-10">
          <span className="text-xs text-[#A1A1AA] font-bold uppercase tracking-widest mr-2">QUOTATION REF:</span>
          <span className="text-base font-mono font-black text-[#5B49AD] tracking-wider">{bookingId}</span>
        </div>

        {/* On-Screen Campaign Summary Box */}
        <div className="bg-black/50 border border-white/10 p-6 rounded-3xl text-left space-y-4 relative z-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#5B49AD] flex items-center gap-2">
              <ShieldCheck size={16} /> Campaign Summary & Quotation
            </h4>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase rounded-full text-[10px]">
              {paymentStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Client Name</p>
              <p className="text-white font-bold text-sm mt-0.5">{customerName}</p>
              <p className="text-[11px] text-[#A1A1AA]">{phoneNumber}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Date & Time Window</p>
              <p className="text-white font-bold text-sm mt-0.5">{date}</p>
              <p className="text-[11px] text-[#A1A1AA]">{timeSlot}</p>
            </div>

            <div>
              <p className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Location & Capacity</p>
              <p className="text-white font-bold text-sm mt-0.5">{place}, {district}</p>
              <p className="text-[11px] text-[#5B49AD] font-bold">{screenCount} Screens Deployed</p>
            </div>
          </div>

          {/* Pricing Quick Summary */}
          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
            <div>
              <span className="text-[#A1A1AA] font-bold uppercase tracking-wider text-[10px]">Total Campaign Fee</span>
              {couponCode && (
                <span className="block text-[10px] text-emerald-400 font-mono font-bold">
                  Coupon {couponCode} applied (-₹{discountAmount.toLocaleString()})
                </span>
              )}
            </div>
            <span className="font-display font-black text-2xl text-white">
              ₹{netTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto tech-button !bg-[#5B49AD] !text-white px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(91,73,173,0.5)] flex items-center justify-center gap-2"
          >
            <Home size={16} /> Back to Home
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 bg-white/5"
          >
            <FileText size={16} /> View Receipt Paper
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* MODAL VIEW FOR CLEAN QUOTATION RECEIPT PAPER */}
      {showModal && (
        <div className="no-print fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black max-w-2xl w-full rounded-2xl p-6 sm:p-10 shadow-2xl relative space-y-6 font-sans">
            {/* Modal Header Controls */}
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-[#5B49AD]" size={20} />
                <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Official Quotation Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-[#5B49AD] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#5B49AD]/90 flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-500 hover:text-black rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Receipt Paper Preview Container */}
            <QuotationReceiptPaper
              bookingId={bookingId}
              customerName={customerName}
              phoneNumber={phoneNumber}
              email={email}
              companyName={companyName}
              address={address}
              date={date}
              timeSlot={timeSlot}
              district={district}
              place={place}
              screenCount={screenCount}
              basePricePerScreen={basePricePerScreen}
              grossTotal={grossTotal}
              couponCode={couponCode}
              discountAmount={discountAmount}
              netTotal={netTotal}
              paymentStatus={paymentStatus}
              createdAt={createdAt}
            />
          </div>
        </div>
      )}

      {/* HIDDEN PRINTABLE RECEIPT CONTAINER (USED ONLY BY WINDOW.PRINT) */}
      <div className="printable-quotation-paper hidden">
        <QuotationReceiptPaper
          bookingId={bookingId}
          customerName={customerName}
          phoneNumber={phoneNumber}
          email={email}
          companyName={companyName}
          address={address}
          date={date}
          timeSlot={timeSlot}
          district={district}
          place={place}
          screenCount={screenCount}
          basePricePerScreen={basePricePerScreen}
          grossTotal={grossTotal}
          couponCode={couponCode}
          discountAmount={discountAmount}
          netTotal={netTotal}
          paymentStatus={paymentStatus}
          createdAt={createdAt}
        />
      </div>
    </div>
  );
}

{/* CLEAN STANDARD QUOTATION & RECEIPT PAPER COMPONENT */}
function QuotationReceiptPaper({
  bookingId,
  customerName,
  phoneNumber,
  email,
  companyName,
  address,
  date,
  timeSlot,
  district,
  place,
  screenCount,
  basePricePerScreen,
  grossTotal,
  couponCode,
  discountAmount,
  netTotal,
  paymentStatus,
  createdAt,
}) {
  const issueDate = new Date(createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white text-black font-sans text-xs leading-relaxed space-y-6">
      {/* Paper Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase text-black">ATTRACT ADVERTISING</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mobile Backpack LED Street Advertising</p>
          <p className="text-[11px] text-gray-600 mt-1">Web: attractadvertising.in | Tel: +91 70342 04464</p>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded">
            QUOTATION RECEIPT
          </span>
          <p className="text-xs font-mono font-bold mt-2 text-gray-800">REF: {bookingId}</p>
          <p className="text-[10px] text-gray-500">Date: {issueDate}</p>
        </div>
      </div>

      {/* Bill To & Status Row */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CLIENT DETAILS (BILL TO)</p>
          <p className="font-bold text-sm text-black mt-1">{customerName || 'Valued Customer'}</p>
          {companyName && <p className="font-medium text-gray-700">{companyName}</p>}
          <p className="text-gray-600">{phoneNumber} • {email}</p>
          {address && <p className="text-gray-500 text-[11px] mt-0.5">{address}</p>}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BOOKING STATUS</p>
          <p className="font-bold text-sm text-black mt-1 uppercase">{paymentStatus}</p>
          <p className="text-gray-500 text-[11px] mt-1">Primary Date: <strong>{date}</strong></p>
          <p className="text-gray-500 text-[11px]">Window: <strong>{timeSlot}</strong></p>
        </div>
      </div>

      {/* Itemized Campaign Quotation Table */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CAMPAIGN SPECIFICATIONS</p>
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-300">
              <th className="p-2.5 border-r border-gray-300">Service Description</th>
              <th className="p-2.5 border-r border-gray-300">Target Location</th>
              <th className="p-2.5 border-r border-gray-300 text-center">Screens</th>
              <th className="p-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 text-gray-800">
              <td className="p-2.5 border-r border-gray-200">
                <p className="font-bold text-black">Walking Billboard Dual HD LED Backpack Campaign</p>
                <p className="text-[10px] text-gray-500">Date: {date} ({timeSlot})</p>
              </td>
              <td className="p-2.5 border-r border-gray-200">
                {place}, {district}
              </td>
              <td className="p-2.5 border-r border-gray-200 text-center font-bold">
                {screenCount}
              </td>
              <td className="p-2.5 text-right font-mono font-bold">
                ₹{grossTotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pricing Calculation Breakdown (Right Aligned) */}
      <div className="flex justify-end pt-2">
        <div className="w-64 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal / Original Fee:</span>
            <span className="font-mono font-bold text-black">₹{grossTotal.toLocaleString()}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Offer Discount ({couponCode}):</span>
              <span className="font-mono font-bold">-₹{discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-black pt-2 border-t-2 border-black">
            <span>NET AMOUNT DUE:</span>
            <span className="font-mono text-base font-black">₹{netTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Terms & Footer Note */}
      <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex justify-between items-end">
        <div>
          <p className="font-bold text-gray-700 uppercase">ATTRACT ADVERTISING • KERALA, INDIA</p>
          <p>Contact: +91 70342 04464 | Website: attractadvertising.in</p>
          <p className="italic mt-1">This is an official computer-generated quotation & booking confirmation receipt.</p>
        </div>
        <div className="text-right">
          <div className="w-24 h-10 border border-dashed border-gray-400 rounded flex items-center justify-center text-[9px] font-bold text-gray-400 uppercase">
            Official Seal
          </div>
        </div>
      </div>
    </div>
  );
}

