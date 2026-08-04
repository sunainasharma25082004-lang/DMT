export interface SubCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: SubCategory[];
}

export const CATEGORY_TAXONOMY: Category[] = [
  {
    id: 'beauty',
    name: 'Beauty & Parlour',
    icon: 'cut',
    subcategories: [
      { id: 'manicure_pedicure', name: 'Manicure & Pedicure', description: 'Nail care, spa pedicure & manicure packages' },
      { id: 'facial_cleanup', name: 'Facial & Cleanup', description: 'Glow facials, skin cleanups & detan' },
      { id: 'hair_styling', name: 'Hair Care & Styling', description: 'Haircut, styling, hair spa & coloring' },
      { id: 'waxing_threading', name: 'Waxing & Threading', description: 'Full body waxing & eyebrow threading' },
      { id: 'makeup_bridal', name: 'Party & Bridal Makeup', description: 'Professional makeup artists for occasions' },
    ],
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    icon: 'sparkles',
    subcategories: [
      { id: 'deep_cleaning', name: 'Full Home Deep Cleaning', description: 'Deep room sanitization & scrubbing' },
      { id: 'bathroom_cleaning', name: 'Bathroom Cleaning', description: 'Tile descaling, toilet sanitization' },
      { id: 'kitchen_cleaning', name: 'Kitchen & Chimney Clean', description: 'Degreasing, appliance cleaning' },
      { id: 'sofa_carpet', name: 'Sofa & Carpet Cleaning', description: 'Shampooing & deep vacuuming' },
    ],
  },
  {
    id: 'appliance',
    name: 'AC & Appliance Repair',
    icon: 'construct',
    subcategories: [
      { id: 'ac_servicing', name: 'AC Servicing & Foam Jet', description: 'Foam jet wash, filter clean & inspection' },
      { id: 'ac_repair', name: 'AC Repair & Gas Refill', description: 'Gas leak repair, PCB repair, cooling fix' },
      { id: 'washing_machine', name: 'Washing Machine Repair', description: 'Drum repair, motor check, leak fix' },
      { id: 'refrigerator', name: 'Refrigerator Repair', description: 'Compressor check, gas refill, cooling fix' },
    ],
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: 'water',
    subcategories: [
      { id: 'pipe_fitting', name: 'Pipe Leakage & Fitting', description: 'Drain blockage, pipe repairs' },
      { id: 'tap_basin', name: 'Tap & Basin Repair', description: 'Mixer installation, tap replacement' },
      { id: 'water_tank', name: 'Water Tank Cleaning', description: 'Overhead tank cleaning & sanitization' },
    ],
  },
  {
    id: 'painting',
    name: 'Painting & Decor',
    icon: 'color-palette',
    subcategories: [
      { id: 'home_painting', name: 'Full Home Painting', description: 'Interior & exterior wall painting' },
      { id: 'waterproofing', name: 'Waterproofing & Sealing', description: 'Seepage treatment & damp fix' },
    ],
  },
];
