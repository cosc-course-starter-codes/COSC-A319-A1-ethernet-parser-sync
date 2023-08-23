# Ethernet Frame Data Parser (Synchronous)

## Summary

In this assignment, you'll create and export a function that parses
an Ethernet frame, handling both the DIX Ethernet II and IEEE 802.3
formats. This assignment is an introductory one to give you a feel for
how Ethernet frames work and how JavaScript works.

Ethernet frame addressing, being a data link layer protocol, uses a
point-to-point addressing scheme called the media access control (MAC)
addressing, a hardware-based addressing scheme that assigns a unique
identifier to each network interface controller (NIC), usually available
burned into the NIC's firmware.

## Background

### Ethernet Packets, Ethernet Frames and the Inter-packet Gap

Ethernet lives on layer 2 (Data Link) of the layered network model,
but is transmitted over layer 1 (Physical). On the Physical layer,
Ethernet packets are transmitted over transmission media separated
by an inter-packet gap of 12 bytes (octets). When designed, this gap
was intended to provide a delay between packets; now, however, a
12 byte gap provides minimal time delay, and acts simply as a separation
between packets. Because of this, in some cases, that gap is now reduced
to 8 bytes.

A new Ethernet packet is signified by a preamble of 7 bytes (octets) of
alternating 1s and 0s, followed by a 1-byte *start frame delimiter (SFD)*
`10101011`. In hexadecimal, this preamble and SFD sequence is
`AA AA AA AA AA AA AA AB`.

An Ethernet frame is the layer 2 routing portion of the packet, and begins
immediately after the SFD. Ethernet routing on the Data Link layer relies
on MAC addresses to identify devices.

### MAC Addresses

A MAC address is a 48-bit (6 byte) address assigned to a network
interface controller. The first 24 bits (3 bytes) are assigned
as an address block by the IEEE to manufacturers of NIC devices
for a fee. This portion is called the "Organizationally Unique
Identifier" (OUI). The last 24 bits (3 bytes) are the manufacturer's
unique serial number for the NIC device. (Some frame and packet
inspection programs will display the OUI portion as a company name
instead of using the 3-byte hexadecimal representation.)

An example MAC address might look like `00:0d:b7:1f:fe:e6`. In this
address, the OUI would be `00:0d:b7`, and since the NIC is an Intel
product, might be replaced with `Intel_` or similar by a frame
inspection program. The NIC's serial number would be `1f:fe:e6`.

Note that MAC addresses are just a sequence of 48 bits in the machine.
However, when we write MAC addresses for human consumption, we separate
each byte's hexadecimal representation by a colon character. This is to
make the addresses easier to interpret by explicitly showing the byte
boundaries.

### Ethernet Frame Formats

There are two commonly used Ethernet frame formats today, though these
are not the only Ethernet formats that have been used. In this assignment,
you will implement a parser for an Ethernet frame for each of these common
formats.

#### DIX Ethernet II

A creation coming out of work from Digital Equipment Corporation,
Intel and Xerox in the early 1980's DIX Ethernet, and its successor
DIX Ethernet II, quickly became a proprietary standard. Although
the hardware associated with it was outmoded by a newer, open standard
soon after, the frame format used was very popular, as it could hold
a few more bytes per frame than its competitor IEEE 802.3.

The frame structure of DIX Ethernet II involves a 14-byte frame header
and a 4-byte frame check sequence (FCS) trailer surrounding the frame's data
payload, which can be up to 1500 bytes. The FCS is computed over all
previous fields of the frame, not including the packet preamble and SFD.

```{text}
DIX Ethernet II Frame Structure
|----------header-----------|-----payload-. . .-------------|-trailer-|
------------------------------------------. . .------------------------
| ' ' ' ' ' | ' ' ' ' ' | ' | ' ' ' ' ' ' . . . ' ' ' ' ' ' | ' ' ' ' |
|  6 bytes  |  6 bytes  | 2B|       46 - 1500 bytes         | 4 bytes |
|  Dst MAC  |  Src MAC  |Type           Payload             |   FCS   |
|           |           |   |                               |         |
------------------------------------------. . .------------------------
```

#### IEEE 802.3

IEEE's 802.3 CSMA/CD frame structure took the DIX Ethernet II
structure and replaced the "Ethertype" 2-byte field with an explicit
frame length value of 2 bytes. However, in order to include the frame
type information, they also added an 8-byte extension to the header
including the IEEE 802.2 "Logical Link Control" (LLC) header and the
"Subnetwork Access Protocol" (SNAP) header extension. This 8 bytes had
to be carved from the payload data space in order to maintain the
1518 byte total capacity limit supported by most hardware at the time.

The extension header consists of 5 subfields:

- LLC: Destination Service Access Point (DSAP) = `0xAA`
- LLC: Source Service Access Point (SSAP) = `0xAA`
- LLC: Control = `0x03`
- SNAP: Organizationally Unique ID (from MAC, or unused = `0x000000`)
- SNAP: Type (protocol of the packet in the payload), for example:
  - IPv4 = `0x0800`
  - IPv6 = `0x08DD`
  - ARP = `0x0806`

For IEEE 802.3, the 4-byte FCS is computed using all prior fields of the
frame, not including the packet preamble and SFD.

Although DIX Ethernet II frame structure is used for most IP packet traffic
on the Internet today, most other Ethernet-based network traffic usually
uses the IEEE 802.3 frame format.

```{text}
IEEE 802.3 CSMA/CD LAN Frame Structure
|----------header---------------------------|-payload-. . .---------|-trailer-|
------------------------------------------------------. . .--------------------
| ' ' ' ' ' | ' ' ' ' ' | ' | ' ' ' ' ' ' ' | ' ' ' ' . . . ' ' ' ' | ' ' ' ' |
|  6 bytes  |  6 bytes  | 2B|    8 bytes    |   48 - 1492 bytes     | 4 bytes |
|  Dst MAC  |  Src MAC  |Len|    LLC/SNAP   |       Payload         |   FCS   |
|           |           |   |               |                       |         |
------------------------------------------------------. . .--------------------
                         __/                 \_________________________________
                        /                                                      \
                        ---------------------------------------------------------
                        |      |      |      |      '      '      |      '      |
                        |  1B  |  1B  |  1B  |      3 bytes       |   2 bytes   |
                        | DSAP | SSAP | Ctrl |        OUI         |    Type     |
                        |      |      |      |                    |             |
                        ---------------------------------------------------------
                        |-----802.2 LLC------|--------------SNAP----------------|
```

## Your Assignment

To complete this assignment, you need to write the body of the `parse`
function defined and exported from `index.js`. You do not need to worry
about asynchronous operations yet -- just be able to parse the incoming
byte `Buffer` using the appropriate protocol.

### Expected Output

Your function should return a JavaScript object with the fields and
structure specified below. Expected data types and descriptions are
included in parentheses.

```{text}
{
  protocol: (either "Ethernet II" or "IEEE 802.3"),
  header: {
    destinationMAC: (MAC address binary value as length 6 Buffer),
    destination: (MAC Address human-readable text string),
    sourceMAC: (MAC address binary value as length 6 Buffer),
    source: (MAC Address human-readable text string),
    type: (16-bit Unsigned integer value),
    length: (16-bit Unsigned integer value, number of payload bytes),
    llc: { // only include if relevant to protocol
      dsap: (Unsigned Integer),
      ssap: (Unsigned Integer),
      control: (Unsigned Integer)
    },
    snap_oui: (MAC OUI binary value as length 3 Buffer, if relevant to protocol)
  },
  payload: (payload data in binary format as an Buffer with appropriate length),
  frame_check: (Integer CRC-32 frame check sequence value),
  frame_check_valid: (Boolean, true if computed FCS matches)
}
```

### Program Structure

While you must make your implementation pass automated tests that
will only use the exported `parse` function, you will likely want
to create several additional functions to help with parsing the data.
Each of these functions should be well-tested (repeatably via automation),
so that you can be confident of the accuracy and error-free quality of
your parsing code. Each of these functions should also include relevant
documentation [in JSdoc format](https://jsdoc.app/) about why they exist,
including expected inputs and outputs with data types.

In this repo, you will find a `lib` folder which contains several things
that should be helpful:

- `parsers` folder - this is where you should put the protocol-specific
  parser code you write
- `ethernetProtocolVariant.js` and `ethernetProtocolVariant.test.js` - a
  module exporting an object `EthernetProtocolVariant` that functions as
  an enum type for use in selecting the variant expected when parsing
- `framecheck.js` and `framecheck.test.js` - a module exporting a function
  `framecheck` that computes the frame check sequence as a 32-bit unsigned
  integer
- `displayMAC.js` and `displayMAC.test.js` - a module exporting a function
  `displayMAC` that formats a byte buffer as a human-readable MAC address

#### A note on working with binary in JavaScript

In this assignment (and in most of the rest of the course), you'll be
working with binary data in JavaScript. The interface for this work
will almost always be the `Buffer` class and its subclasses. Get to know
the `Buffer` class as soon as possible.

In particular, you'll need to be very familiar with the methods to read
various length unsigned integers, including the little endian (LE) and
big endian (BE) variants and how to choose which variant you need, and the
`subarray` method, as well as the typed subclasses of `Buffer`.

In some cases, you'll want to explicitly treat each byte separately, which
you can do by creating a `Uint8Array` from the `Buffer` by doing something
like:

```{javascript}
Uint8Array.prototype.slice.call(this.buffer, startIndex, endIndex)
```

### Submission and Feedback

You must submit your changes as commits to a new branch on the repository
in the form of a Pull Request on Github. I will provide feedback in the
context of the Pull Request within a week of the due date of the assignment.
If you push your code earlier than the due date, I will try to provide
feedback as needed.

I suggest that you start by creating the new branch first, before doing any
work on the program, that you commit your changes to that branch, and that
you push your commits as you are working on the program. On the first push
to the new branch, please go ahead and create the Pull Request in Github.
This way, if you have questions, I will be able to review your
work-in-progress and give more relevant answers and feedback. I will do my
best to respond to questions posed during the course of the assignment with
in a day of the ask. **If you want to ask a question or request early
feedback, please tag me in a comment on the Pull Request: `@nihonjinrxs`.**

Good luck, and I look forward to seeing what you create!
