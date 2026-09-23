import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Phone, 
  MapPin, 
  Check, 
  ShieldCheck, 
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Service } from '../types';

export const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { showToast } = useCart();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>(BUSINESS_INFO.timeSlots[2] || '01:00 PM');
  
  // Client details
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tomorrow as initial date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);

    api.getServices().then((list) => {
      setServices(list);
      const preselectedId = searchParams.get('serviceId');
      if (preselectedId) {
        setSelectedServiceId(preselectedId);
      } else if (list.length > 0) {
        setSelectedServiceId(list[0].id);
      }
      setLoading(false);
    });
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (!clientName) setClientName(user.name);
      if (!clientPhone) setClientPhone(user.phone);
      if (!clientEmail) setClientEmail(user.email);
    }
  }, [user]);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedDate || !selectedTime || !selectedService) {
      alert('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const aptData = {
        userId: user?.id,
        customerName: clientName,
        clientName: clientName,
        phone: clientPhone,
        clientPhone: clientPhone,
        email: clientEmail,
        clientEmail: clientEmail,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        serviceCategory: selectedService.category,
        price: selectedService.price,
        estimatedPrice: selectedService.price,
        date: selectedDate,
        appointmentDate: selectedDate,
        timeSlot: selectedTime,
        appointmentTime: selectedTime,
        notes,
      };

      const result = await api.createAppointment(aptData);
      showToast('Appointment reserved successfully!');
      navigate(`/booking-confirmation/${result.id || result.bookingId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to submit booking. Please call 03111802834.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FAF7F2]">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Online Appointment Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Book Your Salon Session
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Reserve your preferred styling or treatment slot at Zoellas Beauty Salon, Tariq Road, Karachi.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Service Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-bold">
              1
            </span>
            <h2 className="font-serif text-xl font-normal text-stone-900">Select Treatment or Ritual</h2>
          </div>

          {loading ? (
            <p className="text-xs text-stone-500">Loading salon services...</p>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">Choose Service *</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full text-xs rounded-xl border border-stone-300 py-3 px-3 bg-[#FAF7F2] text-stone-800 focus:outline-hidden focus:border-[#8C5D3D]"
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category}) — Rs. {s.price.toLocaleString()} · {s.duration}
                  </option>
                ))}
              </select>

              {selectedService && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8D5CE] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{selectedService.name}</span>
                    <p className="text-stone-500 mt-0.5">{selectedService.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-base font-bold text-stone-900 block">Rs. {selectedService.price.toLocaleString()}</span>
                    <span className="text-[11px] text-[#8C5D3D]">{selectedService.duration}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Date & Time Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            <h2 className="font-serif text-xl font-normal text-stone-900">Pick Date & Time Slot</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Appointment Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden focus:border-[#8C5D3D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Available Time Slots *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUSINESS_INFO.timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-colors ${
                      selectedTime === slot
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Client Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-bold">
              3
            </span>
            <h2 className="font-serif text-xl font-normal text-stone-900">Client Details & Notes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Zainab Tariq"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="0311-1802834"
                className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address (Optional)</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Special Preferences / Sensitivity Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please let us know about any allergies, bridal jewelry setting requests, or special accommodations..."
              className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Location & Guarantee Notice */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8D5CE] text-xs text-stone-600 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-stone-900">
            <MapPin className="w-4 h-4 text-[#8C5D3D]" />
            <span>Zoellas Beauty Salon · 867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi</span>
          </div>
          <p className="text-stone-500 pl-6">
            No advance online card payment required. Payment is made at the salon reception following your treatment.
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-2xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
          >
            {submitting ? 'Confirming Your Salon Reservation...' : 'Confirm Appointment Reservation'}
          </button>
        </div>

      </form>
    </div>
  );
};
