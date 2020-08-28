function displayMAC (buf) {
  if (buf.length < 6 && buf.length !== 3) {
    throw new Error('Cannot format MAC for display: invalid buffer length');
  }
  return Array.from(buf.subarray(0, 6).values())
    .map((byte) => zeroPadLeft(byte.toString(16), 2)).join(':');
}

function zeroPadLeft (str, n) {
  let s = str;
  while (s.length < n) {
    s = `0${s}`
  }
  return s;
}

module.exports = {
  displayMAC
};
