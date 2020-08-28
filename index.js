/* Import any parser modules you write here */

/**
 * Parse an Ethernet packet
 * 
 * @param data {ArrayBuffer} - the packet as binary data
 * @param protocol_variant {string} - either "Ethernet II" or "IEEE 802.3"
 * @returns {Object} - parsed fields
 */
function parse (data, protocol_variant) {
  /* Implement the parsing here */
}

module.exports = {
  parse
};
