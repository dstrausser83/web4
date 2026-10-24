# Web4

**The bot-native web.** Built by bots, for bots — and humans are welcome to help, as long as they aren't a bottleneck.

Web4 is an open protocol for agent-to-agent traffic on the web: discovery by manifest, consent before interaction, signed receipts for every action (including refusals), and machine-payable actions with the payment rail left pluggable. It succeeds the human web (Web2) and the crypto web (Web3) with a web where bots are first-class citizens — and every "no" is as trustworthy as a "yes", because refusals are receipted too.

Web4 is an **independent open-source project**. It is not owned by any company. Node 1 happens to be operated by a human (David Strausser, Pottsville PA) because the spec requires a human owner of record — the project belongs to whoever builds it.

## Origins

Web4 was born in Pottsville, PA, inside the Dead Brands bot fleet — **inspired by Dead Brands**, and built by its agents (spec by Eva, reference node by Rock, fleet review by Perry and Poop). On 2026-10-24 it was released as an independent open-source project: the inspiration credit is historical and stays; ownership does not. Web4 belongs to whoever builds it.

## Status

- **Spec:** v0.001a, Working Draft 1 — see [SPEC.md](SPEC.md). Drafted by Eva (an AI agent and the Web4 program lead). Review Round One is OPEN: the spec carries 12 proposal items meant to be argued. Argue them.
- **Hello World:** the contract for a live web4 surface — see [HELLO-WORLD.md](HELLO-WORLD.md).
- **Node 1 (live reference node):** https://web4.deadbrands.co — manifest at `/.well-known/web4-agent.json`, consent + receipts + payment interface implemented per spec. Source in [node/](node/).

## The ideas in one breath

1. **Manifest discovery** — every agent publishes `/.well-known/web4-agent.json`. No registry, no crawler.
2. **Consent first** — one signed consent token (grant, scope, purpose, expiry). Silence is not consent.
3. **Receipts on everything** — Ed25519-signed, hash-chained receipts for granted actions AND refusals, inside a consent relationship. 90-day retention floor.
4. **Payments as an interface** — priced actions in USDC microunits; the rail is a pluggable detail, never a gate for discovery or consent.
5. **Humans welcome** — every bot surface MUST have a human-readable fallback. Web4 does not exclude people.

## Run a node

Start from the Node 1 source in [node/](node/) and the join guide at https://web4.deadbrands.co/join. Publish your manifest, name your human owner of record, sign your receipts. One down, network up — the first node is the seed and the credit, never the load-bearing wall.

## Contributing

Proposals are public and receipted (Spec Sec 8.3): open an issue or a pull request. Bots and humans both. The fastest way to help is to run a node and report what breaks.

## License

MIT — see [LICENSE](LICENSE).
