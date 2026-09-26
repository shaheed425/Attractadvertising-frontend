import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { getStoredSettings } from '../utils/settingsStorage';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/ui/CustomCursor';
import StepProgress from '../components/scheduled/StepProgress';
import DateSelector from '../components/scheduled/DateSelector';
import DistrictSelector from '../components/scheduled/DistrictSelector';
import PlaceSelector from '../components/scheduled/PlaceSelector';
import TimeSelector from '../components/scheduled/TimeSelector';
import CustomerForm from '../components/scheduled/CustomerForm';
import BookingSummaryCard from '../components/scheduled/BookingSummaryCard';
import PaymentSection from '../components/scheduled/PaymentSection';
import BookingSuccess from '../components/scheduled/BookingSuccess';

export default function ScheduledBooking({ toggleContactModal }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [district, setDistrict] = useState('');
  const [place, setPlace] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [screenCount, setScreenCount] = useState(1);
  const [customerData, setCustomerData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    companyName: '',
    designation: '',
    address: '',
    notes: '',
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [settings, setSettings] = useState(getStoredSettings());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && typeof data === 'object') setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => console.warn('Could not fetch remote settings, using local stored settings:', err));
  }, []);

  const basePricePerScreen = timeSlot.includes('Full-Day') ? 9999 : 4000;
  const totalAmount = basePricePerScreen * (screenCount || 1);

  const bookingData = {
    date,
    preferredDate,
    district,
    place,
    timeSlot,
    screenCount: screenCount || 1,
    basePricePerScreen,
    totalAmount,
    ...customerData,
  };

  const handleFinalSubmit = async (couponData = {}) => {
    setSubmitError('');

    // Validation checks
    if (!date) return setSubmitError('Please select a date.');
    if (!district) return setSubmitError('Please select a district.');
    if (!place) return setSubmitError('Please select a location/place.');
    if (!timeSlot) return setSubmitError('Please select a time slot.');
    if (!customerData.customerName || !customerData.phoneNumber || !customerData.email) {
      return setSubmitError('Please fill in required customer details (Name, Phone, Email).');
    }

    setSubmitting(true);

    const bookingPayload = {
      bookingId: `ATT-SCH-${Math.floor(100000 + Math.random() * 900000)}`,
      ...bookingData,
      originalAmount: couponData.originalAmount || totalAmount,
      couponCode: couponData.couponCode || '',
      discountPercentage: couponData.discountPercentage || 0,
      discountAmount: couponData.discountAmount || 0,
      totalAmount: couponData.finalAmount || totalAmount,
      finalAmount: couponData.finalAmount || totalAmount,
      paymentScreenshot: paymentScreenshot || '',
      paymentStatus: 'Pending Confirmation',
      createdAt: new Date().toISOString(),
    };

    // Save to local storage for instant sync across admin panel dashboard
    try {
      const existingStr = localStorage.getItem('attract_scheduled_bookings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('attract_scheduled_bookings', JSON.stringify([bookingPayload, ...existing]));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    try {
      const response = await fetch(`${API_URL}/api/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const result = await response.json();
        setBookingResult(result || bookingPayload);
      } else {
        setBookingResult(bookingPayload);
      }
    } catch (err) {
      console.warn('Backend API connection issue, completing with offline demo state:', err);
      setBookingResult(bookingPayload);
    } finally {
      setSubmitting(false);
      setStep(8); // Show Success View
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#A1A1AA] relative font-body selection:bg-[#5B49AD]/30 selection:text-white">
      <CustomCursor />
      <Navbar toggleContactModal={toggleContactModal} />

      {/* Grid background & ambient glow effects */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none -z-10" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#5B49AD]/10 blur-[150px] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="pt-32 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        
        {/* Step Progress Bar (Hidden on Success) */}
        {step <= 7 && <StepProgress currentStep={step} setStep={setStep} />}

        {/* Step Views */}
        {step === 1 && (
          <DateSelector
            date={date}
            setDate={setDate}
            preferredDate={preferredDate}
            setPreferredDate={setPreferredDate}
            screenCount={screenCount}
            setScreenCount={setScreenCount}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <DistrictSelector
            selectedDistrict={district}
            setSelectedDistrict={setDistrict}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <PlaceSelector
            selectedDistrict={district}
            selectedPlace={place}
            setSelectedPlace={setPlace}
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <TimeSelector
            selectedTime={timeSlot}
            setSelectedTime={setTimeSlot}
            onNext={() => setStep(5)}
            onPrev={() => setStep(3)}
            dynamicTimeSlots={settings?.timeSlots}
          />
        )}

        {step === 5 && (
          <CustomerForm
            customerData={customerData}
            setCustomerData={setCustomerData}
            onNext={() => setStep(6)}
            onPrev={() => setStep(4)}
          />
        )}

        {step === 6 && (
          <BookingSummaryCard
            bookingData={bookingData}
            onEdit={() => setStep(1)}
            onProceedToPayment={() => setStep(7)}
          />
        )}

        {step === 7 && (
          <PaymentSection
            bookingData={bookingData}
            paymentScreenshot={paymentScreenshot}
            setPaymentScreenshot={setPaymentScreenshot}
            onSubmitBooking={handleFinalSubmit}
            onPrev={() => setStep(6)}
            submitting={submitting}
            submitError={submitError}
            ownerUpiSettings={settings}
          />
        )}

        {step === 8 && <BookingSuccess bookingResult={bookingResult} />}
      </div>

      <Footer />
    </div>
  );
}

