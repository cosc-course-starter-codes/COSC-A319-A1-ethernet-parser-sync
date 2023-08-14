require('jest');
const ethernet = require('./index');
const {EthernetProtocolVariant} = require('./lib/ethernetProtocolVariant');
const framecheck = require('./lib/framecheck');

describe('parse', () => {
  let e2data, e802data;
  beforeEach(() => {
    e2data = Buffer.from(
      [
        0x00, 0xd0, 0xb7, 0x1f, 0xfe, 0xe6, 0x00, 0x05,
        0x85, 0x88, 0xcc, 0xdb, 0x08, 0x00, 0x43, 0x61,
        0x6e, 0x20, 0x79, 0x6f, 0x75, 0x20, 0x70, 0x61,
        0x72, 0x73, 0x65, 0x20, 0x74, 0x68, 0x69, 0x73,
        0x20, 0x66, 0x72, 0x61, 0x6d, 0x65, 0x3f, 0xa4,
        0x38, 0xc4, 0xb7
      ]
    );
  });

  test('it should not error on known protocols', () => {
    expect(() => { ethernet.parse(e2data, EthernetProtocolVariant.ETHERNET_II) }).not.toThrow();
    expect(() => { ethernet.parse(e2data, EthernetProtocolVariant.IEEE_802_3) }).not.toThrow();
  });
  test('it should error on unknown protocols', () => {
    expect(() => { ethernet.parse(e2data, 'Some Unknown Protocol') })
      .toThrow(/Unknown Ethernet protocol variant 'Some Unknown Protocol'/);
  });

  describe('Ethernet II parsing', () => {
    let e2expected, result;
    beforeEach(() => {
      e2expected = {
        protocol: "Ethernet II",
        header: {
          destinationMAC: Buffer.from([
            0x00, 0xd0, 0xb7, 0x1f, 0xfe, 0xe6
          ]),
          destination: "00:d0:b7:1f:fe:e6",
          sourceMAC: Buffer.from([
            0x00, 0x05, 0x85, 0x88, 0xcc, 0xdb
          ]),
          source: "00:05:85:88:cc:db",
          type: 0x0800,
          length: 25
        },
        payload: Buffer.from([
          0x43, 0x61, 0x6e, 0x20, 0x79, 0x6f, 0x75, 0x20,
          0x70, 0x61, 0x72, 0x73, 0x65, 0x20, 0x74, 0x68,
          0x69, 0x73, 0x20, 0x66, 0x72, 0x61, 0x6d, 0x65,
          0x3f
        ]),
        frame_check: 2755183799
      };

      result = ethernet.parse(e2data, EthernetProtocolVariant.ETHERNET_II);
    });
    test('it should include the protocol in the result', () => {
      expect(result).toHaveProperty('protocol');
      expect(result.protocol).toEqual(EthernetProtocolVariant.ETHERNET_II);
    });
    test('it parses header data into a header segment', () => {
      expect(result).toHaveProperty('header');
      expect(result.header).toBeInstanceOf(Object);
    });
    test('it should parse the destination MAC address', () => {
      expect(result.header).toHaveProperty('destinationMAC');
      expect(result.header.destinationMAC)
        .toEqual(e2expected.header.destinationMAC);
    });
    test('it should include the destination MAC address in human-readable form', () => {
      expect(result.header).toHaveProperty('destination');
      expect(result.header.destination)
        .toEqual(e2expected.header.destination);
    });
    test('it should parse the source MAC address', () => {
      expect(result.header).toHaveProperty('sourceMAC');
      expect(result.header.sourceMAC)
        .toEqual(e2expected.header.sourceMAC);
    });
    test('it should include the source MAC address in human-readable form', () => {
      expect(result.header).toHaveProperty('source');
      expect(result.header.source)
        .toEqual(e2expected.header.source);
    });
    test('it should parse the Ethertype', () => {
      expect(result.header).toHaveProperty('type');
      expect(result.header.type).toEqual(e2expected.header.type);
    });
    test('it should provide the payload length', () => {
      expect(result.header).toHaveProperty('length');
      expect(result.header.length).toEqual(e2expected.header.length);
    });
    test('it should parse the Ethertype', () => {
      expect(result.header).toHaveProperty('type');
      expect(result.header.type).toEqual(e2expected.header.type);
    });
    test('it should provide the payload length', () => {
      expect(result.header).toHaveProperty('length');
      expect(result.header.length).toEqual(e2expected.header.length);
    });
    test('it should provide the payload', () => {
      expect(result).toHaveProperty('payload');
      expect(result.payload).toEqual(e2expected.payload);
    });
    test('it should provide the frame check', () => {
      expect(result).toHaveProperty('frame_check');
      expect(result.frame_check).toEqual(e2expected.frame_check);
    });
    describe('when frame check sequence matches', () => {
      beforeEach(() => {
        jest.mock('./lib/framecheck');
        const framecheckModule = require('./lib/framecheck');
        framecheckModule.framecheck.mockReturnValue(e2expected.frame_check)
        result = ethernet.parse(e2data, EthernetProtocolVariant.ETHERNET_II);
      })
      test('it should provide a frame_check_valid status of true', () => {
        expect(result).toHaveProperty('frame_check_valid');
        expect(result.frame_check_valid).toBe(true);
      });
    });
  });

  describe('IEEE 802.3 parsing', () => {
    let e802data, e802expected, result;
    beforeEach(() => {
      e802data = Buffer.from([
        0x00, 0xd0, 0xb7, 0x1f, 0xfe, 0xe6, 0x00, 0x05,
        0x85, 0x88, 0xcc, 0xdb, 0x00, 0x19, 0xAA, 0xAA,
        0x03, 0x00, 0x00, 0x00, 0x08, 0x00, 0x43, 0x61,
        0x6e, 0x20, 0x79, 0x6f, 0x75, 0x20, 0x70, 0x61,
        0x72, 0x73, 0x65, 0x20, 0x74, 0x68, 0x69, 0x73,
        0x20, 0x66, 0x72, 0x61, 0x6d, 0x65, 0x3f, 0x62,
        0x63, 0xab, 0xd5
      ]);
      e802expected = {
        protocol: "IEEE 802.3",
        header: {
          destinationMAC: Buffer.from([
            0x00, 0xd0, 0xb7, 0x1f, 0xfe, 0xe6
          ]),
          destination: "00:d0:b7:1f:fe:e6",
          sourceMAC: Buffer.from([
            0x00, 0x05, 0x85, 0x88, 0xcc, 0xdb
          ]),
          source: "00:05:85:88:cc:db",
          type: 0x0800,
          length: 25
        },
        payload: Buffer.from([
          0x43, 0x61, 0x6e, 0x20, 0x79, 0x6f, 0x75, 0x20,
          0x70, 0x61, 0x72, 0x73, 0x65, 0x20, 0x74, 0x68,
          0x69, 0x73, 0x20, 0x66, 0x72, 0x61, 0x6d, 0x65,
          0x3f
        ]),
        frame_check: 1650699221
      };

      result = ethernet.parse(e802data, EthernetProtocolVariant.IEEE_802_3);
    });
    test('it should include the protocol in the result', () => {
      expect(result).toHaveProperty('protocol');
      expect(result.protocol).toEqual(EthernetProtocolVariant.IEEE_802_3);
    });
    test('it parses header data into a header segment', () => {
      expect(result).toHaveProperty('header');
      expect(result.header).toBeInstanceOf(Object);
    });
    test('it should parse the destination MAC address', () => {
      expect(result.header).toHaveProperty('destinationMAC');
      expect(result.header.destinationMAC).toEqual(e802expected.header.destinationMAC);
    });
    test('it should include the destination MAC address in human-readable form', () => {
      expect(result.header).toHaveProperty('destination');
      expect(result.header.destination).toEqual(e802expected.header.destination);
    });
    test('it should parse the source MAC address', () => {
      expect(result.header).toHaveProperty('sourceMAC');
      expect(result.header.sourceMAC).toEqual(e802expected.header.sourceMAC);
    });
    test('it should include the source MAC address in human-readable form', () => {
      expect(result.header).toHaveProperty('source');
      expect(result.header.source).toEqual(e802expected.header.source);
    });
    test('it should parse the Ethertype', () => {
      expect(result.header).toHaveProperty('type');
      expect(result.header.type).toEqual(e802expected.header.type);
    });
    test('it should provide the payload length', () => {
      expect(result.header).toHaveProperty('length');
      expect(result.header.length).toEqual(e802expected.header.length);
    });
    test('it should parse the Ethertype', () => {
      expect(result.header).toHaveProperty('type');
      expect(result.header.type).toEqual(e802expected.header.type);
    });
    test('it should provide the payload length', () => {
      expect(result.header).toHaveProperty('length');
      expect(result.header.length).toEqual(e802expected.header.length);
    });
    test('it should provide the payload', () => {
      expect(result).toHaveProperty('payload');
      expect(result.payload).toEqual(e802expected.payload);
    });
    test('it should provide the frame check', () => {
      expect(result).toHaveProperty('frame_check');
      expect(result.frame_check).toEqual(e802expected.frame_check);
    });
    describe('when frame check sequence matches', () => {
      beforeEach(() => {
        jest.mock('./lib/framecheck');
        const framecheckModule = require('./lib/framecheck');
        framecheckModule.framecheck.mockReturnValue(e802expected.frame_check)
        result = ethernet.parse(e2data, EthernetProtocolVariant.IEEE_802_3);
      })
      test('it should provide a frame_check_valid status of true', () => {
        expect(result).toHaveProperty('frame_check_valid');
        expect(result.frame_check_valid).toBe(true);
      });
    });
  });
});
