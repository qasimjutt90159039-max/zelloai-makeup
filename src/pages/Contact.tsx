import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Navigation,
  Clock
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '0311-',
    email: '',
    subject: 'Salon Appointment Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const faqs = [
    {
      q: 'Where is Zoellas Beauty Salon located in Karachi?',
      a: 'We are conveniently located at 867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan. Easily accessible with nearby parking.',
    },
    {
      q: 'How do I book an appointment?',
      a: 'You can book directly through our online appointment system on this website, or call/message our salon reception on WhatsApp at 03111802834.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD) for beauty products?',
      a: 'Yes! We offer reliable Cash on Delivery across Karachi for all retail skincare, haircare, and cosmetics orders. Free shipping applies on orders over Rs. 4,000.',
    },
    {
      q: 'Do I need to pay online in advance for salon appointments?',
      a: 'No online card advance is mandatory for regular salon appointments. Payment can be settled in person via cash, bank transfer, or card at the salon reception.',
    },
    {
      q: 'How far in advance should I reserve a bridal makeover?',
      a: 'For Barat, Walima, and Nikkah dates during peak wedding season, we advise booking 3 to 6 weeks in advance to secure your preferred artist slot.',
    },
  ];

  const whatsappInquiryUrl = `https://wa.me/92${BUSINESS_INFO.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
    `Hello Zoellas Beauty Salon! I'm reaching out from your website contact page regarding salon services.`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FAF7F2]">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 font-normal">
          Contact Zoellas Salon
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Have an inquiry regarding wedding packages, hair treatments, or store orders? Our reception team in Tariq Road, Karachi is ready to assist you.
        </p>
      </div>

      {/* Main Grid: Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-6">
            <h2 className="font-serif text-2xl font-normal text-stone-900 border-b border-stone-100 pb-3">
              Salon Details
            </h2>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C5D3D] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Studio Location
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan
                </p>
                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C5D3D] hover:underline pt-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C5D3D] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Contact Number
                </span>
                <a
                  href={BUSINESS_INFO.phoneTel}
                  className="text-xs font-medium text-stone-800 hover:text-[#8C5D3D]"
                >
                  {BUSINESS_INFO.phone}
                </a>
                <p className="text-[11px] text-stone-400">Direct phone call for appointments & inquiries</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  WhatsApp Concierge
                </span>
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-700 hover:underline"
                >
                  {BUSINESS_INFO.whatsapp}
                </a>
                <p className="text-[11px] text-stone-400">Fast replies for bridal consultations & shade matching</p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C5D3D] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Salon Hours
                </span>
                <p className="text-xs text-stone-600">{BUSINESS_INFO.businessHours}</p>
                <p className="text-[11px] text-stone-400">Available Monday through Sunday</p>
              </div>
            </div>

          </div>

          {/* Quick WhatsApp Action Banner */}
          <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-normal text-white">Prefer Instant Chat?</h3>
              <p className="text-xs text-stone-400">Send photos of your hair or ask for available times.</p>
            </div>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-stone-900 font-normal">Message Sent Successfully!</h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Our Tariq Road salon desk will review your inquiry and connect with you at <strong>{formData.phone}</strong> promptly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    phone: '0311-',
                    email: '',
                    subject: 'Salon Appointment Inquiry',
                    message: '',
                  });
                }}
                className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#8C5D3D] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="font-serif text-2xl font-normal text-stone-900">Send an Inquiry</h2>
                <p className="text-xs text-stone-500 mt-0.5">We reply promptly during salon operating hours.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0311-1802834"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                  >
                    <option value="Salon Appointment Inquiry">Salon Appointment Inquiry</option>
                    <option value="Bridal / Barat Package">Bridal / Barat Package</option>
                    <option value="Hair Transformation / Keratin">Hair Transformation / Keratin</option>
                    <option value="Cosmetics Order Support">Cosmetics Order Support</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what service you are considering, dates, or product questions..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 bg-[#FAF7F2] focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#1A1A1A] hover:bg-[#8C5D3D] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-[#C5A880]" />
                <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Embedded Map Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D5CE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-normal text-stone-900">Salon Location Map</h2>
            <p className="text-xs text-stone-500">867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi</p>
          </div>
          <a
            href={BUSINESS_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DC] border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Navigation className="w-3.5 h-3.5 text-[#8C5D3D]" />
            <span>Open in Google Maps App</span>
          </a>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-100">
          <iframe
            title="Zoellas Beauty Salon Location Tariq Road Karachi"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.6896253457597!2d67.0601!3d24.8732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33eed689c1d1d%3A0x6b19a16ff42337d1!2sTariq%20Rd%2C%20P.E.C.H.S.%20Block%202%20Karachi!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D5CE] shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#8C5D3D] font-semibold">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl font-normal text-stone-900">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-stone-200">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm font-semibold text-stone-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8C5D3D] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
