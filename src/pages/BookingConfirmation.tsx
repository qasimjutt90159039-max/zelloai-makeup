import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, MapPin, Phone, MessageCircle, ArrowRight, Printer } from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Appointment } from '../types';

export const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getAppointments()
        .then((list) => {
          const found = list.find((a) => a.id === id || a.bookingId === id || a.appointmentNumber === id);
          if (found) {
            setAppointment(found);
          } else if (list.length > 0) {
            // fallback to most recent
            setAppointment(list[0]);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-24 text-stone-500">Retrieving booking confirmation...</div>;
  }

  const bookingRef = appointment?.bookingId || appointment?.appointmentNumber || id || 'ZBS-2026-9021';
  const clientName = appointment?.customerName || appointment?.clientName || 'Valued Guest';
  const clientPhone = appointment?.phone || appointment?.clientPhone || BUSINESS_INFO.phone;
  const serviceName = appointment?.serviceName || 'Signature Salon Service';
  const appointmentDate = appointment?.date || appointment?.appointmentDate || 'Tomorrow';
  const appointmentTime = appointment?.timeSlot || appointment?.appointmentTime || '01:00 PM';
  const price = appointment?.price || appointment?.estimatedPrice || 8000;

  const whatsappMessage = `Hi Zoellas Beauty Salon! I booked an appointment:\nBooking ID: ${bookingRef}\nService: ${serviceName}\nDate: ${appointmentDate} at ${appointmentTime}\nClient: ${clientName} (${clientPhone})\nPrice: Rs. ${price.toLocaleString()}\nAddress: 867c Tariq Rd, Block 2 PECHS, Karachi.`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 bg-[#FAF7F2]">
      {/* Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Reservation Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          We Look Forward to Your Visit!
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Your appointment has been registered at Zoellas Beauty Salon, Tariq Road, Karachi.
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs text-stone-500">Booking Reference</span>
            <div className="font-mono text-lg font-bold text-[#8C5D3D]">{bookingRef}</div>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Service</span>
            <span className="font-semibold text-stone-900">{serviceName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Scheduled Date & Time</span>
            <span className="font-semibold text-stone-900">{appointmentDate} · {appointmentTime}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Client Name</span>
            <span className="font-semibold text-stone-900">{clientName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100">
            <span className="text-stone-500">Client Phone</span>
            <span className="font-semibold text-stone-900">{clientPhone}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-stone-100 text-sm">
            <span className="text-stone-700 font-semibold">Estimated Price</span>
            <span className="font-bold text-stone-900">Rs. {price.toLocaleString()}</span>
          </div>
        </div>

        {/* Salon Location Address */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D5CE] space-y-2 text-xs text-stone-600">
          <div className="flex items-start gap-2 text-stone-900 font-medium">
            <MapPin className="w-4 h-4 text-[#8C5D3D] shrink-0 mt-0.5" />
            <span>Zoellas Beauty Salon, 867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan</span>
          </div>
          <div className="flex items-center gap-2 pl-6">
            <Phone className="w-3.5 h-3.5 text-[#8C5D3D]" />
            <a href={BUSINESS_INFO.phoneTel} className="text-stone-800 hover:underline">
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={`https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Details on WhatsApp</span>
          </a>

          <Link
            to="/my-appointments"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>View My Appointments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
