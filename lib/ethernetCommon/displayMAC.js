/**
 * @module Ethernet/EthernetCommon/displayMAC
 * @exports Ethernet/EthernetCommon/displayMAC
 */
module.exports = {
  /**
   * Generate a display string that is a human-readable representation
   * of the provided MAC address
   * @param {Buffer} buf 
   * @returns {string}
   * @throws Error when the buffer is not the correct length for a MAC address
   */
  displayMAC: function (buf) {
    if (buf.length < 6 && buf.length !== 3) {
      throw new Error('Cannot format MAC for display: invalid buffer length');
    }
    return Array.from(buf.subarray(0, 6).values())
      .map((byte) => zeroPadLeft(byte.toString(16), 2)).join(':');
  }
};

/**
 * Zero-pad the string on the left to the given length
 * @param {string} str - the string to zero-pad 
 * @param {number} n - the intended length of the resulting string
 * @returns {string} - the resulting left-side zero-padded string of length n
 */
function zeroPadLeft (str, n) {
  let s = str;
  while (s.length < n) {
    s = `0${s}`
  }
  return s;
}
