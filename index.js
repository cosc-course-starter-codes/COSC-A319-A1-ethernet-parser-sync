/* Import any parser modules you write here */

/**
 * @typedef {
 *   protocol: EthernetProtocolVariant,
 *   header: {
 *     destinationMAC: Buffer,
 *     destination: string,
 *     sourceMAC: Buffer,
 *     source: string,
 *     type: number,
 *     length: number,
 *     llc: undefined | {
 *       dsap: number,
 *       ssap: number,
 *       control: number
 *     },
 *     snap_oui: undefined | Buffer
 *   },
 *   payload: Buffer,
 *   frame_check: number,
 *   frame_check_valid: boolean
 *  } ParsedEthernetFrame 
 */

/**
 * Parse an Ethernet packet
 * 
 * @param data {ArrayBuffer} - the packet as binary data
 * @param protocol_variant {EthernetProtocolVariant} - the variant of the Ethernet Protocol being parsed
 * @returns {ParsedEthernetFrame} - parsed fields
 */
function parse (data, protocol_variant) {
  /* Implement the parsing here */
}

module.exports = {
  parse
};
