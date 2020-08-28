const { crc32 } = require('crc');

/**
 * Compute the CRC-32 checksum of a binary Buffer or String
 * @param {Buffer|String} data - the data to compute a checksum on
 * @returns {number} the checksum value
 */
function framecheck (data) {
  return crc32(data);
}

module.exports = {
  framecheck
};
