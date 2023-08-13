require('jest');
const {EthernetProtocolVariant} = require('./ethernetProtocolVariant');

describe('EthernetProtocolVariant', () => {
  test('it has ETHERNET_II as a variant', () => {
    expect(EthernetProtocolVariant.ETHERNET_II).not.toBeUndefined();
  });
  test('it has IEEE_802_3 as a variant', () => {
    expect(EthernetProtocolVariant.IEEE_802_3).not.toBeUndefined();
  });
  test('it validates the string "Ethernet II" as the ETHERNET_II variant', () => {
    expect(EthernetProtocolVariant.ETHERNET_II).toEqual('Ethernet II');
  });
  test('it validates the string "IEEE 802.3" as the IEEE_802_3 variant', () => {
    expect(EthernetProtocolVariant.IEEE_802_3).toEqual('IEEE 802.3');
  });
});
