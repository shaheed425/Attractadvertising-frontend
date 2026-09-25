export const DEFAULT_SETTINGS = {
  upiId: '8590204464@ybl',
  ownerName: 'ATTRACT ADVERTISING',
  qrImage: '',
  instagramUrl: 'https://www.instagram.com/Stackxxio_/',
  heroShowcaseImage: '',
  timeSlots: [
    {
      id: 'slot-morning',
      name: 'Morning Prime Slot',
      title: 'Morning Prime Slot',
      timeRange: '09:00 AM – 01:00 PM',
      duration: '4 Hours',
      status: 'available',
      popular: false,
      tag: 'Office & Morning Commute Traffic',
    },
    {
      id: 'slot-afternoon',
      name: 'Afternoon Retail Slot',
      title: 'Afternoon Retail Slot',
      timeRange: '01:30 PM – 05:30 PM',
      duration: '4 Hours',
      status: 'available',
      popular: false,
      tag: 'Lunch & Mall Footfall',
    },
    {
      id: 'slot-evening',
      name: 'Evening Peak Hour Slot (6:00 PM Peak)',
      title: 'Evening Peak Hour Slot (6:00 PM Peak)',
      timeRange: '06:00 PM – 10:00 PM',
      duration: '4 Hours',
      status: 'available',
      popular: true,
      tag: '🔥 Main 6 PM Peak Impression Rush',
    },
    {
      id: 'slot-fullday',
      name: 'Full-Day All-Access Package',
      title: 'Full-Day All-Access Package',
      timeRange: '09:00 AM – 10:00 PM',
      duration: '13 Hours Full Day',
      status: 'available',
      popular: true,
      tag: 'Maximum Brand Dominance',
    },
  ],
};

export const getStoredSettings = () => {
  try {
    const localData = localStorage.getItem('attract_system_settings');
    if (localData) {
      const parsed = JSON.parse(localData);
      const rawSlots = parsed.timeSlots && parsed.timeSlots.length > 0 ? parsed.timeSlots : DEFAULT_SETTINGS.timeSlots;
      const sanitizedSlots = rawSlots.map((s, idx) => ({
        id: s.id || `slot-${idx}`,
        name: s.name || s.title || s.timeRange || `Slot ${idx + 1}`,
        title: s.title || s.name || s.timeRange || `Slot ${idx + 1}`,
        timeRange: s.timeRange || s.name || s.title || '09:00 AM – 01:00 PM',
        duration: s.duration || '4 Hours',
        status: s.status || (s.enabled === false ? 'booked' : 'available'),
        popular: s.popular !== undefined ? s.popular : false,
        tag: s.tag || 'Standard Slot',
      }));

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        timeSlots: sanitizedSlots,
      };
    }
  } catch (e) {
    console.warn('Error reading stored settings from localStorage:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveStoredSettings = (newSettings) => {
  try {
    const existing = getStoredSettings();
    const updated = { ...existing, ...newSettings };
    localStorage.setItem('attract_system_settings', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Error saving stored settings to localStorage:', e);
    return newSettings;
  }
};
