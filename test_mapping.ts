import { generateLuluIdFromKDP, type KDPBookSpec, type KDPOptionInterior } from './src/lib/kdpMapper';

console.log("=== Testing KDP to Lulu POD ID Mapping ===\n");

const tests: { name: string; spec: KDPBookSpec; expectedId?: string; expectError?: boolean }[] = [
  {
    name: 'Paperback, 6x9, B&W White, Glossy, 200 pages',
    spec: {
      format: 'Paperback',
      trimSize: '6 x 9',
      interiorType: 'Black ink and white paper',
      coverFinish: 'Glossy',
      pageCount: 200,
    },
    expectedId: '0600X0900.BW.STD.PB.060UW444.GXX',
  },
  {
    name: 'Paperback, 5x8, B&W Cream, Matte, 300 pages',
    spec: {
      format: 'Paperback',
      trimSize: '5 x 8',
      interiorType: 'Black ink and cream paper',
      coverFinish: 'Matte',
      pageCount: 300,
    },
    expectedId: '0500X0800.BW.STD.PB.060UC444.MXX',
  },
  {
    name: 'Hardcover, 6x9, Premium Color, Glossy, 100 pages',
    spec: {
      format: 'Hardcover',
      trimSize: '6 x 9',
      interiorType: 'Premium color interior with white paper',
      coverFinish: 'Glossy',
      pageCount: 100,
    },
    expectedId: '0600X0900.FC.PRE.HC.080CW444.GXX',
  },
  {
    name: 'Paperback, 8.5x11, Standard Color, Matte, 150 pages',
    spec: {
      format: 'Paperback',
      trimSize: '8.5 x 11',
      interiorType: 'Standard color interior with white paper',
      coverFinish: 'Matte',
      pageCount: 150,
    },
    // Note: 8.5x11 standard color upgrades to Premium quality internally in luluSpecs,
    // and Premium 8.5x11 paperbacks are forced to Gloss finish due to Lulu manufacturing limits.
    expectedId: '0850X1100.FC.PRE.PB.080CW444.GXX',
  },
  {
    name: 'FAIL: Paperback B&W Cream with 800 pages (max 776)',
    spec: {
      format: 'Paperback',
      trimSize: '6 x 9',
      interiorType: 'Black ink and cream paper',
      coverFinish: 'Glossy',
      pageCount: 800,
    },
    expectError: true,
  },
  {
    name: 'FAIL: Hardcover with 50 pages (min 75)',
    spec: {
      format: 'Hardcover',
      trimSize: '6 x 9',
      interiorType: 'Black ink and white paper',
      coverFinish: 'Glossy',
      pageCount: 50,
    },
    expectError: true,
  },
  {
    name: 'FAIL: Standard color paperback with 50 pages (min 72)',
    spec: {
      format: 'Paperback',
      trimSize: '6 x 9',
      interiorType: 'Standard color interior with white paper',
      coverFinish: 'Glossy',
      pageCount: 50,
    },
    expectError: true,
  }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    const resultId = generateLuluIdFromKDP(test.spec);
    if (test.expectError) {
      console.error(`❌ FAILED: [${test.name}] Expected an error but got ID ${resultId}`);
      failed++;
    } else if (resultId === test.expectedId) {
      console.log(`✅ PASSED: [${test.name}] -> ${resultId}`);
      passed++;
    } else {
      console.error(`❌ FAILED: [${test.name}] Expected ${test.expectedId}, got ${resultId}`);
      failed++;
    }
  } catch (error: any) {
    if (test.expectError) {
      console.log(`✅ PASSED: [${test.name}] -> Caught expected error: ${error.message}`);
      passed++;
    } else {
      console.error(`❌ FAILED: [${test.name}] Unexpected error: ${error.message}`);
      failed++;
    }
  }
}

console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
