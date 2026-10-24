# Web4 Node 1 — reference implementation

A single-file Cloudflare Worker implementing Web4 v0.001a Working Draft 1:

- `GET /.well-known/web4-agent.json` — manifest (Sec 3), with credited reads (Sec 5)
- `POST /consent` — signed Ed25519 consent grant tokens, 24h default expiry (Sec 4)
- `POST /consent/revoke` + `GET /revoked-grants.json` — revocation list (Sec 4)
- `GET /api/receipts` — hash-chained, Ed25519-signed receipts, including REFUSAL receipts (Sec 5)
- `GET /api/oracle` — payment interface only: 402 + payment request object in USDC microunits; no rail, no money moves (Sec 7)
- Human-readable pages at `/`, `/spec`, `/hello`, `/join` (Sec 6.2)

## Build

`worker.mjs` here is the bundled deployable: the spec and hello-world markdown are inlined where the source carries the `__SPEC_MD__` / `__HELLO_MD__` placeholders. Bind a KV namespace as `WEB4` and set the Worker secret `NODE_PRIVATE_KEY_JWK` to your node's Ed25519 private key (JWK). Your key is your identity — generate your own; never reuse Node 1's.

## License

MIT.
