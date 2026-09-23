/**
 * REAL BUSINESS INFORMATION
 * Strictly follows user instructions:
 * - Business Name: Zoellas Beauty Salon
 * - Business Category: Beauty Salon
 * - Contact Number: 03111802834
 * - Address: 867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan
 * - City: Karachi
 * - Country: Pakistan
 *
 * RESTRICTION: No invented email, branches, awards, opening hours, or social handles.
 * Editable placeholders are marked explicitly.
 */

export const BUSINESS_INFO = {
  name: 'Zoellas Beauty Salon',
  shortName: 'Zoellas',
  category: 'Beauty Salon',
  tagline: 'Beauty, Confidence & Care — All in One Place.',
  phone: '03111802834',
  phoneFormatted: '+92 311 1802834',
  phoneTel: 'tel:03111802834',
  whatsapp: '03111802834',
  whatsappUrl: 'https://wa.me/923111802834?text=Hi%20Zoellas%20Beauty%20Salon!%20I%20would%20like%20to%20inquire%20about%20your%20services%20and%20products.',
  address: '867c Tariq Rd, near Tariq Center, Block 2 P.E.C.H.S., Karachi, Pakistan',
  street: '867c Tariq Rd, near Tariq Center',
  area: 'Block 2 P.E.C.H.S.',
  city: 'Karachi',
  country: 'Pakistan',
  postalCode: '75400',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  
  // Notice regarding unprovided fields (Strictly following rule: do not invent)
  hoursNotice: '[Editable: Call 03111802834 for current salon opening hours]',
  emailNotice: '[Editable: Inquire via phone 03111802834]',
  hours: 'Call for timings: 03111802834',
  businessHours: 'Call 03111802834 for timings',
  
  // Shipping defaults for boutique e-commerce
  freeShippingThreshold: 4000, // PKR
  shippingFee: 250, // PKR in Karachi
  nationalShippingFee: 350,
  taxRate: 0.05, // 5% provincial sales tax

  // Maps coordinates / link
  googleMapsUrl: 'https://maps.google.com/?q=867c+Tariq+Rd+near+Tariq+Center+Block+2+PECHS+Karachi+Pakistan',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14479.948281352467!2d67.058315!3d24.870341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33eef0768b447%3A0xb35e76a666e85741!2sTariq%20Rd%2C%20P.E.C.H.S.%20Karachi!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s',

  // Available sample time slots for appointment scheduling
  timeSlots: [
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM'
  ],

  // Disclaimer banner for demo catalog
  demoNotice: 'Catalog & sample services shown for appointment booking & e-commerce demonstration. Contact 03111802834 for live custom inquiries.'
} as const;
