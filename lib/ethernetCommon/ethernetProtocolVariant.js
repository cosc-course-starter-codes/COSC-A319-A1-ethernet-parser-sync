
/**
 * @module Ethernet/EthernetCommon/EthernetProtocolVariants
 * @exports Ethernet/EthernetCommon/EthernetProtocolVariants
 */
module.exports = {
  /**
   * A selection of a specific Ethernet protocol variant from
   * the available variants
   * @typedef {ETHERNET_II|IEEE_802_3} EthernetProtocolVariant
   */

  /**
   * Enum for specifying an EthernetProtocolVariant
   * @readonly
   * @const
   * @enum {EthernetProtocolVariant}
   */
  EthernetProtocolVariants: Object.freeze({
    /** the Ethernet II protocol variant */
    ETHERNET_II: "Ethernet II",
    /** the IEEE 802.3 protocol variant */
    IEEE_802_3:  "IEEE 802.3",
  })
};
