/* Import any parser modules you write here */

/**
 * @module Ethernet
 * @exports Ethernet
 */
module.exports = {
  /**
   * A representation of an Ethernet frame's contents parsed into
   * an object containing all of its fields
   * @typedef {{
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
   *     snap_oui: undefined|Buffer
   *   },
   *   payload: Buffer,
   *   frame_check: number,
   *   frame_check_valid: boolean
   *  }} ParsedEthernetFrame
   * @prop {EthernetProtocolVariant} protocol - the Ethernet protocol used to encode this frame
   * @prop {Object} header - the header information from the frame
   * @prop {Buffer} header.destinationMAC - the binary MAC address of the frame destination
   * @prop {string} header.destination - a human-readable string representation of the destination
  *                                      MAC address
   * @prop {Buffer} header.sourceMAC - the binary MAC address of the frame source
   * @prop {string} header.source - a human-readable string representation of the source MAC address
   * @prop {number} header.type - the Ethertype value from the frame header
   * @prop {number} header.length - the frame payload length without the header or frame check
   *                                sequence field
   * @prop {Object?} header.llc - (IEEE 802.3 frames only) the LLC field data from the header
   * @prop {number} header.llc.dsap - the DSAP field value from the header
   * @prop {number} header.llc.ssap - the SSAP field value from the header
   * @prop {number} header.llc.control - the Control field value from the header
   * @prop {Buffer?} header.snap_oui - (IEEE 802.3 frames only) the SNAP OUI field value
   * @prop {Buffer} payload - the payload data of the frame
   * @prop {number} frame_check - the frame check sequence value contained on the end of the frame
   * @prop {boolean} frame_check_valid - a boolean indicating whether the frame check validation
   *                                     succeeded
   */

  /**
   * Parse an Ethernet packet
   * @param data {Buffer} - the packet as binary data
   * @param protocol_variant {EthernetProtocolVariant} - the variant of the Ethernet Protocol being
   *                                                     parsed
   * @returns {ParsedEthernetFrame} - parsed fields
   */
  parse(data, protocol_variant) {
    /* Implement the parsing here */
  },
};
