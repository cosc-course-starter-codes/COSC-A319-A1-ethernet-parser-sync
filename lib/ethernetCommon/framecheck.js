const { crc32 } = require('crc');

/**
 * @module Ethernet/EthernetCommon/framecheck
 * @exports Ethernet/EthernetCommon/framecheck
 */
module.exports = {
  /**
   * Compute the CRC-32 checksum of a binary Buffer or String
   * @param {Buffer|String} data - the data to compute a checksum on
   * @returns {number} the checksum value
   */
  framecheck: function (data) { return crc32(data); }
};
