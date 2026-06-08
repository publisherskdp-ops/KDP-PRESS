import { 
  getTrimCodeForLulu, 
  getInkQualityCodes, 
  getPaperCode, 
  getFinishCode, 
  type InkPaperType, 
  type BindingFormat 
} from './luluSpecs';

export type KDPOptionInterior = 
  | 'Black ink and white paper'
  | 'Black ink and cream paper'
  | 'Standard color interior with white paper'
  | 'Premium color interior with white paper';

export type KDPFormat = 'Paperback' | 'Hardcover';
export type KDPCoverFinish = 'Glossy' | 'Matte';

export interface KDPBookSpec {
  format: KDPFormat;
  trimSize: string; // e.g., '6 x 9'
  interiorType: KDPOptionInterior;
  coverFinish: KDPCoverFinish;
  pageCount: number;
}

/**
 * Maps KDP interior types to Lulu InkPaperTypes
 */
export function mapKDPInteriorToLulu(kdpInterior: KDPOptionInterior): InkPaperType {
  switch (kdpInterior) {
    case 'Black ink and white paper':
      return 'Black & White / White';
    case 'Black ink and cream paper':
      return 'Black & White / Cream';
    case 'Standard color interior with white paper':
      return 'Standard Color / White';
    case 'Premium color interior with white paper':
      return 'Premium Color / White';
    default:
      throw new Error(`Unknown KDP interior type: ${kdpInterior}`);
  }
}

/**
 * Validates if the page count is within KDP's allowed ranges
 */
export function validateKDPPageCount(spec: KDPBookSpec): { valid: boolean; message?: string } {
  const { format, interiorType, pageCount } = spec;
  
  if (format === 'Hardcover') {
    if (pageCount < 75 || pageCount > 550) {
      return { valid: false, message: `Hardcover requires 75-550 pages. Provided: ${pageCount}` };
    }
  } else {
    // Paperback ranges
    if (interiorType === 'Standard color interior with white paper') {
      if (pageCount < 72 || pageCount > 600) {
        return { valid: false, message: `Standard color paperback requires 72-600 pages. Provided: ${pageCount}` };
      }
    } else if (interiorType === 'Black ink and cream paper') {
      if (pageCount < 24 || pageCount > 776) {
        return { valid: false, message: `B&W cream paperback requires 24-776 pages. Provided: ${pageCount}` };
      }
    } else {
      // B&W white paper, Premium color white paper
      if (pageCount < 24 || pageCount > 828) {
        return { valid: false, message: `${interiorType} paperback requires 24-828 pages. Provided: ${pageCount}` };
      }
    }
  }

  return { valid: true };
}

/**
 * Automatically maps a KDP book specification to the exact Lulu POD Package ID.
 * Returns the POD ID if valid, or throws an error if the specification is invalid.
 */
export function generateLuluIdFromKDP(spec: KDPBookSpec): string {
  // 1. Validate KDP Page Counts
  const validation = validateKDPPageCount(spec);
  if (!validation.valid) {
    throw new Error(`Invalid KDP Spec: ${validation.message}`);
  }

  // 2. Map formats
  const luluFormat: BindingFormat = spec.format === 'Paperback' ? 'paperback' : 'hardcover';
  const luluBindingCode = luluFormat === 'paperback' ? 'PB' : 'HC';
  const luluInterior = mapKDPInteriorToLulu(spec.interiorType);
  const luluFinish = spec.coverFinish === 'Glossy' ? 'Gloss' : 'Matte';

  // 3. Generate Lulu components
  const trimCode = getTrimCodeForLulu(spec.trimSize);
  const { inkCode, qualityCode } = getInkQualityCodes(luluInterior, spec.trimSize);
  const paperCode = getPaperCode(luluInterior, inkCode, qualityCode, spec.trimSize);
  const finishCode = getFinishCode(luluFinish, luluFormat, spec.trimSize, qualityCode);

  // 4. Construct Final Lulu POD ID
  const finalId = `${trimCode}.${inkCode}.${qualityCode}.${luluBindingCode}.${paperCode}.${finishCode}`;
  
  return finalId;
}
