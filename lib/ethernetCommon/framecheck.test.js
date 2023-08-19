require('jest');
const { framecheck } = require('./framecheck');
const crc = require('crc');

jest.mock('crc');

describe('framecheck', () => {
  let testString, testBuffer;
  beforeEach(() => {
    testString = 'abcdefg';
    testBuffer = Buffer.from('abcdefg');
  });
  test('it calls the expected function when parameter is a string', () => {
    framecheck(testString);
    expect(crc.crc32).toHaveBeenCalledWith(testString);
  });
  test('it calls the expected function when parameter is a buffer', () => {
    framecheck(testBuffer);
    expect(crc.crc32).toHaveBeenCalledWith(testBuffer);
  })
});
