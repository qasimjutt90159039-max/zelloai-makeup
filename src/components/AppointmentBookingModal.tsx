import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Sparkles, Phone, Mail, CheckCircle2, MessageCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Service, Appointment } from '../types';

export const AppointmentBookingModal: React.FC = () => {
  const { isAppointmentModalOpen, closeAppointmentModal, activeBookingService, showToast } = useCart();
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>(BUSINESS_INFO.timeSlots[2] || '01:00 PM');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Appointment | null>(null);

  // Load services
  useEffect(() => {
    api.getServices().then((res) => {
      setServices(res);
      if (activeBookingService) {
        setSelectedServiceId(activeBookingService.id);
      } else if (res.length > 0 && !selectedServiceId) {
        setSelectedServiceId(res[0].id);
      }
    });
  }, [activeBookingService]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setClientName(user.name);
      setClientEmail(user.email);
      setClientPhone(user.phone);
    }
  }, [user]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isoDate = tomorrow.toISOString().split('T')[0];
    setSelectedDate(isoDate);
  }, []);

  if (!isAppointmentModalOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedDate || !selectedTime || !currentService) {
      alert('Please fill in all required appointment details');
      return;
    }

    setSubmitting(true);
    try {
      const aptData: Partial<Appointment> = {
        userId: user?.id,
        customerName: clientName,
        clientName: clientName,
        phone: clientPhone,
        clientPhone: clientPhone,
        email: clientEmail,
        clientEmail: clientEmail,
        serviceId: currentService.id,
        serviceName: currentService.name,
        serviceCategory: currentService.category,
        price: currentService.price,
        estimatedPrice: currentService.price,
        date: selectedDate,
        appointmentDate: selectedDate,
        timeSlot: selectedTime,
        appointmentTime: selectedTime,
        notes,
      };

      const result = await api.createAppointment(aptData);
      setBookingConfirmed(result);
      showToast('Appointment reserved successfully at Zoellas Beauty Salon!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit appointment request. Please call 03111802834.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingConfirmed(null);
    closeAppointmentModal();
  };

  const whatsappConfirmationUrl = bookingConfirmed
    ? `https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
        `Hi Zoellas Beauty Salon! I booked an appointment on your website:\nBooking ID: ${bookingConfirmed.bookingId || bookingConfirmed.appointmentNumber}\nService: ${bookingConfirmed.serviceName}\nDate: ${bookingConfirmed.date || bookingConfirmed.appointmentDate} at ${bookingConfirmed.timeSlot || bookingConfirmed.appointmentTime}\nClient: ${bookingConfirmed.customerName || bookingConfirmed.clientName} (${bookingConfirmed.phone || bookingConfirmed.clientPhone})\nPrice: Rs. ${bookingConfirmed.price.toLocaleString()}\nAddress: 867c Tariq Rd, Block 2 PECHS, Karachi.`
      )}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8D5CE] animate-in fade-in zoom-in-95"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingConfirmed ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
                Booking Confirmed
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-900 mt-1">
                We Look Forward to Welcoming You
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your appointment request has been recorded in our salon ledger.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-5 rounded-xl text-left border border-[#E8D5CE] text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Booking Reference</span>
                <span className="font-mono font-bold text-[#8C5D3D]">{bookingConfirmed.bookingId || bookingConfirmed.appointmentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Service</span>
                <span className="font-medium text-stone-900">{bookingConfirmed.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Scheduled Time</span>
                <span className="font-medium text-stone-900">
                  {bookingConfirmed.date || bookingConfirmed.appointmentDate} · {bookingConfirmed.timeSlot || bookingConfirmed.appointmentTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Client</span>
                <span className="font-medium text-stone-900">{bookingConfirmed.customerName || bookingConfirmed.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Total</span>
                <span className="font-bold text-stone-900">Rs. {bookingConfirmed.price.toLocaleString()}</span>
              </div>
              <div className="flex items-start gap-1.5 pt-2 border-t border-stone-200 text-stone-500">
                <MapPin className="w-3.5 h-3.5 text-[#8C5D3D] shrink-0 mt-0.5" />
                <span>867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Send Confirmation on WhatsApp
              </a>

              <button
                onClick={handleReset}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-xs font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[#8C5D3D] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zoellas Beauty Salon · Tariq Road</span>
              </div>
              <h2 className="font-serif text-2xl font-normal text-stone-900 mt-1">
                Book a Salon Appointment
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Select your service, preferred date & time. Or call us directly at 03111802834.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Select Salon Service *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 py-2.5 px-3 focus:outline-hidden focus:border-[#8C5D3D] bg-white text-stone-800"
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category}) — Rs. {s.price.toLocaleString()} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#8C5D3D]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#8C5D3D] bg-white"
                      required
                    >
                      {BUSINESS_INFO.timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Fatima Khan"
                    className="w-full px-3 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#8C5D3D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="0311-1802834"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#8C5D3D]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#8C5D3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Special Notes / Styling Preferences
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your hair/skin sensitivities or bridal event timings..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:border-[#8C5D3D]"
                />
              </div>

              {/* Price Preview */}
              {currentService && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8D5CE] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500">Service Fee: </span>
                    <span className="font-bold text-stone-900">Rs. {currentService.price.toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] text-stone-500">Payable at salon counter</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white py-3 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Confirming Reservation...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
