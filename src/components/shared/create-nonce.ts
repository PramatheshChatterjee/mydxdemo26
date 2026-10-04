declare let __webpack_nonce__: string;

const nonce =
  typeof window !== 'undefined' &&
  (window as Window & { __webpack_nonce__?: string }).__webpack_nonce__;
if (nonce) {
  // Webpack reads this special variable when it inserts script elements.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __webpack_nonce__ = nonce;
}

export {};
