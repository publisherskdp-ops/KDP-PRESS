// ─────────────────────────────────────────────────────────────
// Lulu Print-on-Demand Specification Data
// Source: Lulu manufacturing spec sheets (2024/2025)
// ─────────────────────────────────────────────────────────────

export type InkPaperType =
  | 'Black & White / White'
  | 'Black & White / Cream'
  | 'Standard Color / White'
  | 'Premium Color / White';

export type BindingFormat = 'paperback' | 'hardcover';

export interface PageRange {
  min: number;
  max: number;
}

export interface TrimSpec {
  /** Display label — e.g. "6\" x 9\"" */
  label: string;
  /** Dimension string used internally — e.g. "6 x 9" */
  value: string;
  /** Metric equivalent shown as helper text */
  metric: string;
  /** Whether this is a "Large Trim Size" */
  isLarge: boolean;
  /** Page ranges per ink/paper type. null = not available */
  pageRanges: Record<InkPaperType, PageRange | null>;
}

// ─── Paperback Trim Sizes ────────────────────────────────────

export const PAPERBACK_TRIMS: TrimSpec[] = [
  // Standard Trim Sizes
  {
    label: '5" x 8"', value: '5 x 8', metric: '12.7 x 20.32 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': { min: 24, max: 776 },
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '5.06" x 7.81"', value: '5.06 x 7.81', metric: '12.85 x 19.84 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': { min: 24, max: 776 },
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '5.25" x 8"', value: '5.25 x 8', metric: '13.34 x 20.32 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': { min: 24, max: 776 },
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '5.5" x 8.5"', value: '5.5 x 8.5', metric: '13.97 x 21.59 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': { min: 24, max: 776 },
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '6" x 9"', value: '6 x 9', metric: '15.24 x 22.86 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': { min: 24, max: 776 },
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },

  // Large Trim Sizes
  {
    label: '6.14" x 9.21"', value: '6.14 x 9.21', metric: '15.6 x 23.39 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': { min: 24, max: 776 },
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '6.69" x 9.61"', value: '6.69 x 9.61', metric: '16.99 x 24.41 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '7" x 10"', value: '7 x 10', metric: '17.78 x 25.4 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '7.44" x 9.69"', value: '7.44 x 9.69', metric: '18.9 x 24.61 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '7.5" x 9.25"', value: '7.5 x 9.25', metric: '19.05 x 23.5 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '8" x 10"', value: '8 x 10', metric: '20.32 x 25.4 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 828 },
      'Black & White / Cream': null, // Not available in Cream
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 828 },
    },
  },
  {
    label: '8.25" x 6"', value: '8.25 x 6', metric: '20.96 x 15.24 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 800 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 800 },
    },
  },
  {
    label: '8.25" x 8.25"', value: '8.25 x 8.25', metric: '20.96 x 20.96 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 800 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 800 },
    },
  },
  {
    label: '8.5" x 8.5"', value: '8.5 x 8.5', metric: '21.59 x 21.59 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 590 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 590 },
    },
  },
  {
    label: '8.5" x 11"', value: '8.5 x 11', metric: '21.59 x 27.94 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 590 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 590 },
    },
  },
  {
    label: '8.27" x 11.69"', value: '8.27 x 11.69', metric: '21 x 29.7 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 24, max: 780 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 72, max: 600 },
      'Premium Color / White': { min: 24, max: 590 },
    },
  },
];

// ─── Hardcover Trim Sizes ────────────────────────────────────

export const HARDCOVER_TRIMS: TrimSpec[] = [
  {
    label: '5.5" x 8.5"', value: '5.5 x 8.5', metric: '13.97 x 21.59 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 75, max: 550 },
      'Black & White / Cream': { min: 75, max: 550 },
      'Standard Color / White': { min: 75, max: 550 },
      'Premium Color / White': { min: 75, max: 550 },
    },
  },
  {
    label: '6" x 9"', value: '6 x 9', metric: '15.24 x 22.86 cm', isLarge: false,
    pageRanges: {
      'Black & White / White': { min: 75, max: 550 },
      'Black & White / Cream': { min: 75, max: 550 },
      'Standard Color / White': { min: 75, max: 550 },
      'Premium Color / White': { min: 75, max: 550 },
    },
  },
  {
    label: '6.14" x 9.21"', value: '6.14 x 9.21', metric: '15.6 x 23.39 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 75, max: 550 },
      'Black & White / Cream': { min: 75, max: 550 },
      'Standard Color / White': { min: 75, max: 550 },
      'Premium Color / White': { min: 75, max: 550 },
    },
  },
  {
    label: '7" x 10"', value: '7 x 10', metric: '17.78 x 25.4 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 75, max: 550 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 75, max: 550 },
      'Premium Color / White': { min: 75, max: 550 },
    },
  },
  {
    label: '8.25" x 11"', value: '8.25 x 11', metric: '20.96 x 27.94 cm', isLarge: true,
    pageRanges: {
      'Black & White / White': { min: 75, max: 550 },
      'Black & White / Cream': null,
      'Standard Color / White': { min: 75, max: 550 },
      'Premium Color / White': { min: 75, max: 550 },
    },
  },
];

// ─── Helper Functions ────────────────────────────────────────

const ALL_INK_TYPES: InkPaperType[] = [
  'Black & White / White',
  'Black & White / Cream',
  'Standard Color / White',
  'Premium Color / White',
];

/** Get the spec data array for a given binding format */
export function getTrimsForFormat(format: BindingFormat): TrimSpec[] {
  return format === 'paperback' ? PAPERBACK_TRIMS : HARDCOVER_TRIMS;
}

/** Find a TrimSpec by its value string */
export function findTrimSpec(format: BindingFormat, trimValue: string): TrimSpec | undefined {
  return getTrimsForFormat(format).find(t => t.value === trimValue);
}

/** Get available ink/paper types for a given format + trim size (excludes unavailable combos) */
export function getAvailableInkTypes(format: BindingFormat, trimValue: string): InkPaperType[] {
  const spec = findTrimSpec(format, trimValue);
  if (!spec) return ALL_INK_TYPES;
  return ALL_INK_TYPES.filter(ink => spec.pageRanges[ink] !== null);
}

/** Get page range for a specific format + trim + ink combo */
export function getPageRange(
  format: BindingFormat,
  trimValue: string,
  inkType: InkPaperType
): PageRange | null {
  const spec = findTrimSpec(format, trimValue);
  if (!spec) return null;
  return spec.pageRanges[inkType];
}

/** Validate page count against Lulu constraints */
export function validatePageCount(
  format: BindingFormat,
  trimValue: string,
  inkType: InkPaperType,
  pageCount: number
): { valid: boolean; min: number; max: number; message: string } {
  const range = getPageRange(format, trimValue, inkType);
  if (!range) {
    return {
      valid: false,
      min: 0,
      max: 0,
      message: 'This ink/paper type is not available for the selected trim size.',
    };
  }
  if (pageCount < range.min) {
    return {
      valid: false,
      min: range.min,
      max: range.max,
      message: `Minimum ${range.min} pages required for this configuration.`,
    };
  }
  if (pageCount > range.max) {
    return {
      valid: false,
      min: range.min,
      max: range.max,
      message: `Maximum ${range.max} pages allowed for this configuration.`,
    };
  }
  return {
    valid: true,
    min: range.min,
    max: range.max,
    message: `✓ ${pageCount} pages — within range (${range.min}–${range.max}).`,
  };
}

/** Get available cover finishes for a specific configuration */
export function getAvailableFinishes(
  format: BindingFormat,
  trimValue: string,
  inkType: InkPaperType
): string[] {
  // Manufacturing limit: 8.5x11 Premium Color Paperbacks cannot be Matte
  if (
    format === 'paperback' &&
    trimValue === '8.5 x 11' &&
    inkType === 'Premium Color / White'
  ) {
    return ['Gloss'];
  }
  return ['Gloss', 'Matte'];
}

// ─── Lulu POD ID Code Mappings ───────────────────────────────

/** Maps a trim value string to the Lulu 4-digit x 4-digit code */
export function getTrimCodeForLulu(trimValue: string): string {
  const map: Record<string, string> = {
    '5 x 8': '0500X0800',
    '5.06 x 7.81': '0506X0781',
    '5.25 x 8': '0525X0800',
    '5.5 x 8.5': '0550X0850',
    '6 x 9': '0600X0900',
    '6.14 x 9.21': '0614X0921',
    '6.69 x 9.61': '0669X0961',
    '7 x 10': '0700X1000',
    '7.44 x 9.69': '0744X0969',
    '7.5 x 9.25': '0750X0925',
    '8 x 10': '0800X1000',
    '8.25 x 6': '0825X0600',
    '8.25 x 8.25': '0825X0825',
    '8.5 x 8.5': '0850X0850',
    '8.5 x 11': '0850X1100',
    '8.27 x 11.69': '0827X1169',
    '8.25 x 11': '0825X1100',
  };
  return map[trimValue] || '0600X0900';
}

/** Resolve ink + quality codes from InkPaperType */
export function getInkQualityCodes(inkType: InkPaperType, trimValue: string): { inkCode: string; qualityCode: string } {
  if (inkType === 'Standard Color / White') {
    // Manufacturing Limit: some trims force upgrade to Premium for standard color
    if (trimValue === '8.5 x 11') {
      return { inkCode: 'FC', qualityCode: 'PRE' };
    }
    return { inkCode: 'FC', qualityCode: 'STD' };
  }
  if (inkType === 'Premium Color / White') {
    return { inkCode: 'FC', qualityCode: 'PRE' };
  }
  // Black & White (both white and cream paper)
  return { inkCode: 'BW', qualityCode: 'STD' };
}

/** Resolve paper code based on ink type */
export function getPaperCode(inkType: InkPaperType, inkCode: string, qualityCode: string, trimValue: string): string {
  if (inkType === 'Black & White / Cream') {
    return '060UC444'; // 60# Uncoated Cream
  }
  if (inkCode === 'FC') {
    if (qualityCode === 'PRE' || trimValue === '6 x 9') {
      return '080CW444'; // 80# Coated White
    }
    return '060UW444';
  }
  return '060UW444'; // 60# Uncoated White (default B&W)
}

/** Resolve cover finish code */
export function getFinishCode(
  finish: string,
  format: BindingFormat,
  trimValue: string,
  qualityCode: string
): string {
  // Manufacturing Limit: 8.5x11 Premium Color Paperbacks force Gloss
  if (
    format === 'paperback' &&
    trimValue === '8.5 x 11' &&
    qualityCode === 'PRE'
  ) {
    return 'GXX';
  }
  return finish === 'Matte' ? 'MXX' : 'GXX';
}
