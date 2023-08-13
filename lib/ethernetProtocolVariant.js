/**
 * @typedef {"Ethernet II"} ETHERNET_II
 * @typedef {"IEEE 802.3"} IEEE_802_3
 * @typedef {(ETHERNET_II | IEEE_802_3)} EthernetProtocolVariant
 */

const EthernetProtocolVariant = {
  ETHERNET_II: "Ethernet II",
  IEEE_802_3:  "IEEE 802.3",
};

Object.freeze(EthernetProtocolVariant);

module.exports = { EthernetProtocolVariant };
