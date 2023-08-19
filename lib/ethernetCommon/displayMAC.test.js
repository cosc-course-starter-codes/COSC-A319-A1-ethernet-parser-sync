require('jest');
const { displayMAC } = require('./displayMAC');

describe('displayMAC', () => {
  let expected, testBuffer;
  beforeEach(() => {
    testBuffer = Buffer.from([0x00, 0xd0, 0xb7, 0x1f, 0xfe, 0xe6, 0x00, 0x05]);
    expectedMAC = '00:d0:b7:1f:fe:e6';
    expectedHalfMAC = '00:d0:b7';
  });
  test('it returns the correct string with a 6-byte Buffer argument', () => {
    expect(displayMAC(testBuffer.subarray(0, 6))).toEqual(expectedMAC);
  });
  test('it uses the first 6 bytes with a longer Buffer argument', () => {
    expect(displayMAC(testBuffer)).toEqual(expectedMAC);
  });
  test('it returns the correct string for a 3-byte Buffer argument (e.g., OUI)', () => {
    expect(displayMAC(testBuffer.subarray(0, 3))).toEqual(expectedHalfMAC);
  });
  test('it throws an error for smaller Buffers not length 3 bytes', () => {
    expect(() => { displayMAC(testBuffer.subarray(0, 0)) }).toThrow();
    expect(() => { displayMAC(testBuffer.subarray(0, 1)) }).toThrow();
    expect(() => { displayMAC(testBuffer.subarray(0, 2)) }).toThrow();
    expect(() => { displayMAC(testBuffer.subarray(0, 4)) }).toThrow();
    expect(() => { displayMAC(testBuffer.subarray(0, 5)) }).toThrow();
  });
});
