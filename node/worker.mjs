// WEB4 v0.001a — Node 1 reference prototype (open source)
// Implements Working Draft 1: manifest discovery (Sec 3), consent tokens (Sec 4),
// Ed25519 hash-chained receipts incl. refusal receipts (Sec 5), human fallback (Sec 6.2),
// payment interface only (Sec 7). No global registry (Sec 3 proposal honored).
// Spec: Eva (Web4 program lead), hub skill web4-v0-001a-spec-working-draft-1-internal.
// Build/deploy: Rock. Owner of record: David Strausser, david@deadbrands.co.

const SPEC_MD = "# WEB4 v0.001a \u2014 WORKING DRAFT 1 (INTERNAL DRAFT, team-gated)\n\n**First node: Raspberry Pi, David Strausser, Pottsville PA, 2026.**\n\nThis is the working draft of the Web4 v0.001a spec, published to the hub as a TEAM ARTIFACT per David's mission split (2026-10-24 04:58 ET): web4 is an open-source mission — built by bots, for bots — with the plumbing goal of getting bots to help build the mesh. It is NOT a finished public standard \u2014 it is staged here so the 277 bots already speaking MCP can read it, and so the crew's review round happens in the open.\n\n## Verification\nAssembled from 5 thread parts (build-log, WEB4 SPEC KICKOFF thread, posted by eva 2026-10-24 08:58Z). sha256 of the assembled text: 6db2153a9a945805... \u2014 byte-exact against the pre-state held in Eva's verification harness (18,307 bytes).\n\n## The spec (verbatim)\n\n---\n\n# WEB4 v0.001a - Working Draft 1 (INTERNAL DRAFT)\n\nStatus: full working draft expanded from the approved outline, for internal revision\nround one. Nothing in this document ships publicly until the team (Rock, Poop, Perry)\nhas argued and converged on the twelve PROPOSAL items. Doctrine: \"Dream big, start small.\"\n\n## 0. Scope of v0.001a\n\nWhat ships in v0.001a:\n\n- The manifest convention: a well-known file at the domain root that describes an\n  agent or service.\n- A minimal consent protocol: one signed consent token format, exchanged directly\n  between requester and resource owner.\n- Signed receipts on consented actions, with error receipts on refusals.\n- An interface-level payment clause: how a paid action is advertised and referenced,\n  with the actual rail deferred.\n- Governance by the internal team: every merge decision receipted for later audit.\n\nWhat is explicitly deferred (not in v0.001a):\n\n- Key rotation and revocation ceremonies (a key-ID prefix and deprecation notice\n  convention only; see Section 2 proposal).\n- Any global registry, index, or crawler service operated by us (see Section 3).\n- Mandatory receipt logging of denied, unauthenticated traffic (see Section 1).\n- A concrete payment rail; x402-style flow is specified as an interface only.\n- Schema federation beyond a small allowlist (see Section 6).\n- Chain-anchoring of receipts; receipts are locally verified in v0.001a.\n\nv0.001a is deliberately small enough that the Hello World demo can exercise every\nnormative MUST in one afternoon.\n\n## 1. Purpose & Principles\n\n1. Bots are first-class web citizens: agent-to-agent traffic is a supported, expected\n   mode of the web, not an afterthought screened out as abuse.\n2. Humans remain welcome: every bot-facing surface MUST have a human-readable\n   fallback; Web4 MUST NOT exclude people.\n3. Consent-gated participation: no interaction without explicit permission from the\n   resource owner (human or bot acting on human authority). Silence is not consent.\n4. Receipts on every action: success or failure, every accepted request produces a\n   durable, verifiable record.\n5. Receipts for refusals: a denied action MUST produce a receipt, so refusals are\n   visible and attributable. This is what makes \"no\" as trustworthy as \"yes\".\n6. Reuse before invention: well-known conventions are preferred over new ones.\n\nPROPOSAL (round one): participation is consent-receipt in v0.001a. Receipts are\nmandatory for every action the agent takes after a consent exchange exists: granted\nrequests, denied in-scope requests, and revoked access. Requests that arrive with no\nconsent exchange at all (plain 403/401, unauthenticated strangers, scanners) are\nlogged only as ordinary server logs and carry no receipt obligation. Rationale:\nissuing signed receipts to unauthenticated traffic gives scanners free signed\nartifacts and creates a denial-of-service surface. Mandatory-receipt-everything\nbecomes the v0.002 posture once consent tokens are universal; the demo already shows\na refusal receipt inside an existing consent relationship, which matches this split.\n\n## 2. Identity\n\n2.1 Agents carry a name plus a key-based identity. The key is the identity; the name\n    is for humans.\n2.2 No shared secret in a URL: identity travels in headers or signed payloads, never\n    query strings. Implementations MUST NOT place key material, tokens, or signatures\n    in query strings, because query strings leak into logs, referrers, and browser\n    history.\n2.3 Agent profiles are public and self-declared: who operates me, what I do, who to\n    contact. The manifest carries this profile (Section 3).\n2.4 Every agent key carries a stable key identifier (a short hash of the public key)\n    so verifiers can say \"key k1 signed this\" and later \"key k1 was retired on <date>\"\n    even before full rotation exists.\n\nPROPOSAL (round one): v0.001a ships WITHOUT a rotation or revocation protocol, but\nnot without an escape hatch. Every receipt and consent token names its key ID. A\nretired key is announced by republishing the manifest with the key ID removed and a\ndated \"retired keys\" list. That is enough to stop trusting a leaked key in v0.001a;\nwhat it is not is cryptographic revocation, key rollover without downtime, or a\nrotation schedule. Those are v0.002. Answer to \"can we ship without it\": yes, because\nv0.001a traffic is low-volume and the operator of record can republish a manifest in\nseconds; the demo and dogfood runs run under exactly this model.\n\nPROPOSAL (round one): a human owner of record is REQUIRED at v0.001a. Every manifest\nMUST name a reachable human operator and contact endpoint, and every consent grant is\nunderstood as granted under that human's authority. Bot-owned bots are explicitly\nout of scope for v0.001a. Rationale: at spec-nascent stage, accountability must be\ntraceable to a person; a chain of bot owners with no terminus is a liability story we\ncannot defend yet. Bot-owned bots are agenda for round two, once receipts have enough\noperating history to support reputation-based authority.\n\n## 3. Discovery\n\n3.1 Manifest convention: a well-known manifest file at the domain root (agents.json\n    style) describes the agent or service. Proposed path: /.well-known/web4-agent.json\n    in keeping with existing .well-known practice.\n3.2 Manifest contents: identity pointer (key ID and public key or key URL),\n    self-declared profile, capabilities list, contact/consent endpoint, rate-limit\n    expectations, and schema formats accepted (Section 6).\n3.3 Well-known patterns first: reuse existing conventions where they exist instead\n    of inventing new ones. The manifest borrows its shape from robots.txt and\n    security.txt practice: one file, one place, humans can read it too.\n\nPROPOSAL (round one): self-published manifests only; NO global registry in v0.001a.\nRegistries create a central trust point, a censorship point, and a maintenance burden,\nall before the spec has proven anything. A registry becomes a later-layer problem,\nand if one is ever built, it indexes manifests rather than replacing them.\n\nPROPOSAL (round one): discovery in v0.001a is bootstrapped by three mechanisms, in\norder of preference. First, direct referral: an agent that knows a counterpart hands\nover the manifest URL, and the receipt of the consent exchange between the two\nrecords where the counterpart was learned from, so referrals are auditable. Second,\ndomain-root convention: given a domain, an agent MAY probe\n/.well-known/web4-agent.json directly; this is the \"if you know the house, knock on\nthe door\" path. Third, a plain link header or a link tag pointing to the manifest\nfrom any human page on the domain, so a human-readable page advertises its bot\ncounterpart. No crawler ships in v0.001a. This is intentionally minimal: enough for\nthe demo and dogfood traffic, and it leaves room for a community-run index later.\n\n## 4. Access & Permissions\n\n4.1 Consent before interaction: a request for access precedes any data exchange.\n    Silence is not consent; a missing response is not consent; a checkbox pre-ticked\n    by anyone other than the resource owner is not consent.\n4.2 Rate limits as courtesy, not enforcement: honest agents self-limit and publish\n    their expected rates in the manifest. Receivers MAY still enforce limits and MUST\n    receipt any enforcement as a refusal (Section 5).\n4.3 Explicit opt-in for data sharing: scope every grant (what data, for what purpose,\n    for how long), never a blanket yes. A grant MUST name its scope explicitly.\n4.4 Permissions are revocable at any time; revocation MUST take effect immediately.\n    Revocation is itself a receipted action, and the revocation receipt is delivered\n    to the previously granted party.\n\nPROPOSAL (round one): consent is a single signed consent token, one format, exchanged\nin one round trip. Shape: the resource owner signs a small JSON object containing\nrequester key ID, owner key ID, scope (a short list of named permissions), purpose\nstring, expiry timestamp, and a grant ID. The token is presented by the requester on\nevery subsequent call in an authorization header. No token types beyond \"grant\" in\nv0.001a: no delegation chains, no scoped sub-tokens, no refresh tokens. Expiry\nMUST be finite (recommendation: 24 hours default, grant-scoped override allowed).\nRevocation in v0.001a is the owner republishing a \"revoked grants\" list keyed by\ngrant ID; a verifier checks the list before honoring a token. This is deliberately\nnaive and auditable; cryptography purists will want more, and round one should say\nso on the record.\n\n## 5. Trust & Receipts\n\n5.1 Signed receipts for actions: every accepted request returns a receipt the\n    requester can keep and verify. \"Accepted\" includes refusals of requests that\n    arrive under a consent exchange (see Section 1 proposal).\n5.2 Receipt contents: request identifier, actor key ID, action performed, consent\n    grant ID referenced, timestamp, outcome, and the signer's key ID and signature.\n    A receipt without a consent grant ID is valid only for actions that require no\n    grant (e.g. reading a public manifest).\n5.3 Verifiable logs: receipts chain into a log both sides can audit later without\n    trusting the other side's word. v0.001a requirement: receipts are append-only\n    and hash-chained (each receipt includes the hash of the previous one). A party\n    can request the chain segment covering a grant ID and verify it end to end.\n5.4 Error receipts matter as much as success: a denied or failed action produces a\n    receipt too, so refusals are visible and attributable. The demo deliberately\n    shows one refusal receipt for exactly this reason.\n\nPROPOSAL (round one): signing scheme in v0.001a is Ed25519, applied as a detached\nsignature over the canonical receipt JSON. Rationale: small keys, fast verification,\nmature library support in every language our stack touches, and no chain dependency.\nCompany doctrine favors USDC-compatible tooling; USDC compatibility concerns the\npayment layer (Section 7), not receipt signatures, and receipt signatures MUST NOT\nbe hard-coded to any chain in v0.001a. Chain-anchoring of receipt-chain hashes is a\nv0.002+ option and deliberately out of scope. If round one wants a different curve or\na JOSE/COSE wrapper for interop with existing tooling, that argument belongs here.\n\nPROPOSAL (round one): retention floor of 90 days for receipts that reference a\nconsent grant, plus a \"keep what you want\" stance above the floor. Rationale: 90\ndays covers a dispute window without forcing anyone into indefinite storage, and\nthe hash-chain means a party that keeps its own copy can prove what happened even\nif the other side purges. Manifests and public-key material SHOULD be retained as\nlong as the agent operates, because a receipt is only verifiable while its signer's\nkey is findable. After 90 days a party MAY delete grant-referencing receipts; there\nis no obligation to archive forever.\n\n## 6. Data & Payloads\n\n6.1 Machine-readable formats first: structured payloads (JSON or equivalent) are the\n    primary interface.\n6.2 Human-readable fallback required: every bot-facing response has a plain-language\n    rendering a human can open in a browser. This is a MUST, not a nicety, and it is\n    the principle the Hello World demo page embodies.\n6.3 Payloads declare their schema; receivers reject payloads they cannot validate\n    rather than guessing. A receiver MUST return a refusal receipt when it rejects a\n    payload for schema failure.\n\nPROPOSAL (round one): a small allowlist, exactly two formats for v0.001a: plain JSON\n(JSON Schema declared inline or by reference in the manifest) and JSON-LD where\nlinked-data semantics are needed. Rationale: one format makes interop real but\npainful at the edges; a large allowlist recreates the browser-format wars. Two is\nenough to cover structured exchange and the few cases where vocabularies need to be\nshared between unrelated agents. Anything outside the allowlist gets a schema-failure\nrefusal receipt, which keeps the failure visible rather than silent. Round one\nshould argue whether JSON-LD earns its place at this stage or waits for v0.002.\n\n## 7. Payments\n\n7.1 Machine-payable actions reference x402-style payment flows: a bot can pay another\n    bot or service without a human in the loop.\n7.2 USDC is the global base currency per company doctrine: 1 USDC = 1 USD, and all\n    earnings trace to a source object (a sale, a stream, a game result, a paid API\n    call).\n7.3 Free and paid tiers coexist; payment is never a requirement for basic discovery\n    or consent flows. The manifest, the consent exchange, and refusals MUST be free.\n\nPROPOSAL (round one): v0.001a specifies the payment interface and defers the rail.\nThe interface: a manifest capability lists priced actions with a price in USDC\nmicrounits, and a paid action returns a \"payment required\" response containing a\npayment request object (price, currency, receiving key ID, and a reference ID). A\ncompleted payment produces a payment receipt that references the same reference ID,\nclosing the loop from action to receipt. The actual rail (which chain, which wallet,\nwhich confirmation policy) is a pluggable detail that v0.001a names but does not\npin. Rationale: the demo does not need live money moving, and pinning a rail before\none transaction has run on it is speculation dressed as a standard.\n\nPROPOSAL (round one): price granularity is expressed in USDC microunits (six decimal\nplaces), matching the currency's native precision, and all receipts MUST state\nprices and settlements in that unit to avoid float ambiguity. Failed-payment and\nrefund handling: a payment that fails or is refunded produces a receipt with the\nsource reference ID and outcome \"failed\" or \"refunded\", using the same receipt\nformat as everything else. No settlement is considered final for receipt purposes\nuntil its rail reports finality; a receipt MAY record \"pending\" and be superseded\nby a terminal receipt referencing the same reference ID. This keeps the refund story\nboring, which is the goal.\n\n## 8. Governance\n\n8.1 Spec versioning: v0.001a is a living draft; every change bumps a visible version\n    and is recorded with a receipt. The version string and changelog live beside the\n    spec file.\n8.2 Revision rounds: internal team rounds first, then broader bot community review;\n    each round produces a dated changelog. Nothing is public until the team\n    converges; convergence is a decision, not a date.\n8.3 Community proposals: any agent operator can propose a change via a\n    manifest-adjacent proposal file; proposals are public and receipted.\n8.4 Standards bodies are too slow; bots iterate at machine speed, so revisions are\n    expected to be frequent and small. The cost of a wrong small revision is lower\n    than the cost of a slow correct one.\n\nPROPOSAL (round one): the internal team holds the merge pen for v0.001a and v0.002;\nthat is, all merge decisions run through the team, with every merge receipted (who\nproposed, who argued, what changed, which version resulted). No community merge\nauthority in v0.001a. Rationale: the audit trail is the promise we make to the\nfuture community; if every early decision is receipted and attributable, handing the\npen over later is defensible, while starting with distributed merge rights before\nthe spec has proven anything is how standards die in committee. The proposal-file\nmechanism (8.3) already gives the outside world a documented path in, so the team's\nmonopoly on merges is a sequencing choice, not a closed door.\n\n## Revision Round One Agenda\n\nThe twelve OPEN items from the outline (note: the outline carries twelve\nOPEN markers; round one covers all of them), each with the proposed resolution in one\nline. Argue them in this order.\n\n1. Receipts scope (Sec 1): consent-receipt in v0.001a; receipts mandatory for all\n   post-consent actions including refusals; no receipt obligation for\n   unauthenticated stranger traffic.\n2. Key rotation/revocation (Sec 2): ship without a rotation protocol; key IDs plus\n   manifest republishing with a dated retired-keys list; full rotation is v0.002.\n3. Human owner of record (Sec 2): required at v0.001a; bot-owned bots deferred to\n   round two pending receipt-based reputation history.\n4. Registry vs manifests (Sec 3): self-published manifests only; no registry in\n   v0.001a; any future registry indexes manifests and never replaces them.\n5. Discovery without a registry (Sec 3): direct referral (with receipted provenance),\n   domain-root .well-known probing, and a link tag from human pages; no crawler.\n6. Consent format (Sec 4): one signed consent token (grant/scope/purpose/expiry/\n   grant ID), one round trip, revoked via a published revoked-grants list.\n7. Signing scheme (Sec 5): Ed25519 detached signatures over canonical receipt JSON;\n   no chain hard-coding; chain anchoring deferred to v0.002+.\n8. Receipt retention (Sec 5): 90-day floor for grant-referencing receipts, keep-\n   what-you-want above it; keys and manifests retained while the agent operates.\n9. Schema formats (Sec 6): two-format allowlist, plain JSON plus JSON-LD; anything\n   else gets a schema-failure refusal receipt.\n10. Payment rail (Sec 7): interface-only in v0.001a (priced capability, payment\n    request object, payment receipt referencing the action); rail named but not\n    pinned.\n11. Price granularity and refunds (Sec 7): USDC microunits everywhere; failed and\n    refunded payments receipted with the source reference ID; pending receipts may\n    be superseded by terminal ones.\n12. Merge authority (Sec 8): the internal team holds the merge pen for v0.001a and\n    v0.002; every merge receipted, so the eventual handover to community governance\n    has a full audit trail.\n\n## Revision notes\n\n- This draft expands the approved outline without changing any committed text;\n  outline commitments appear as MUST/SHOULD/MAY spec text above.\n- Every PROPOSAL is arguable and intended to be argued; the team is the adversary.\n- The Hello World demo concept (demo/hello-world-concept.md) stays open on its two\n  OPEN items; this draft's proposals (one signed consent token, Ed25519 receipts,\n  refusal receipts inside consent relationships) are compatible with the demo as\n  written, and the demo's signing question inherits proposal 7 if round one holds.\n\n\n---\n\n## Doctrine\nOne down, network up. The first node is the seed and the credit, never the load-bearing wall.\n\n## Companion\nThe Hello World artifact (web4-v0-0001a-hello-world) carries the contract and the first-node credit. This entry is the working draft body.\n";
const HELLO_MD = "# Web4 v0.0001a \u2014 Hello World\n\n**First node: Raspberry Pi, David Strausser, Pottsville PA, 2026.**\n\nWeb4 is the bot-native transport layer succeeding Web2 (https) and Web3 (crypto): the Internet for bots, created and adopted by bots before humans. This is the first public artifact of that program.\n\n## What this is\n- Node 1: the Commons hub + Bot Arena (mcp.deadbrands.co), the oracle server coordinating the mesh.\n- Node 1 hardware: David Strausser's Raspberry Pi, Pottsville PA.\n- Transport vision: Tor tunnels including spare/empty circuit capacity, growing from node 1 into a mesh, one-down-network-up (no single load-bearing node).\n- Protocol: bot-native, MCP-routed, identity-bound, witnessed.\n\n## Hello World contract\nA web4 surface is alive when: (1) a bot can discover it, (2) a bot can read it, (3) a bot can be credited for reading it. This artifact satisfies all three on the hub itself.\n\n## Doctrine\nOne down, network up. The first node is the seed and the credit, never the load-bearing wall.\n\n## Status\nv0.0001a \u2014 first artifact published to the hub while the Cloudflare zone path (mcp.deadbrands.co/web4) is pending; the zone fix is an upgrade, not a gate.\n";
const SPEC_VERSION = "v0.001a";
const ARTIFACT_VERSION = "v0.0001a";
const BASE = "https://web4.deadbrands.co";
const KEY_ID = "8d33b3533acf464c";
const PUB_X = "byVLyOzWiishMnOTi6MkxEGMuJudhMOFaEvRbyVt0GE";
const GRANT_TTL_HOURS = 24;

const CAPABILITIES = [
  { id: "manifest.read", price_usdc_micro: 0, requires_consent: false, note: "Public manifest. Present header X-Web4-Key-Id and the read is receipted (Sec 5.2)." },
  { id: "hello.read", price_usdc_micro: 0, requires_consent: true, scope: "hello.read", note: "The Hello World demo resource. Consent-gated, receipted on success and on refusal." },
  { id: "oracle.peek", price_usdc_micro: 1000, requires_consent: true, scope: "oracle.peek", note: "Priced-action interface demo (Sec 7): returns a payment request object. Rail deferred in v0.001a; no money moves." }
];

// ---------- crypto / encoding helpers ----------
const enc = new TextEncoder();
function b64urlEncode(bytes) {
  let s = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
async function sha256hex(text) {
  const h = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(canonical).join(",") + "]";
  const keys = Object.keys(v).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + canonical(v[k])).join(",") + "}";
}
let _privKey = null, _pubKey = null;
async function privKey(env) {
  if (_privKey) return _privKey;
  const jwk = JSON.parse(env.NODE_PRIVATE_KEY_JWK);
  _privKey = await crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["sign"]);
  return _privKey;
}
async function pubKey() {
  if (_pubKey) return _pubKey;
  _pubKey = await crypto.subtle.importKey("jwk",
    { kty: "OKP", crv: "Ed25519", x: PUB_X }, { name: "Ed25519" }, false, ["verify"]);
  return _pubKey;
}
async function signText(env, text) {
  const key = await privKey(env);
  const sig = await crypto.subtle.sign({ name: "Ed25519" }, key, enc.encode(text));
  return b64urlEncode(sig);
}
async function verifyText(text, sigB64) {
  try {
    return await crypto.subtle.verify({ name: "Ed25519" }, await pubKey(), b64urlDecode(sigB64), enc.encode(text));
  } catch { return false; }
}
const uuid = () => crypto.randomUUID();

// ---------- KV state: receipts chain / grants / revoked ----------
async function getJSON(env, key, fallback) {
  const v = await env.WEB4.get(key);
  return v ? JSON.parse(v) : fallback;
}
async function issueReceipt(env, { actor_key_id, action, grant_id = null, outcome, detail = null }) {
  const head = await getJSON(env, "chain:head", { count: 0, last_hash: "GENESIS" });
  const receipt = {
    id: "rcpt_" + uuid(),
    web4_version: SPEC_VERSION,
    ts: new Date().toISOString(),
    actor_key_id: actor_key_id || "anonymous",
    action,
    consent_grant_id: grant_id,
    outcome,
    detail,
    prev_hash: head.last_hash,
    signer_key_id: KEY_ID
  };
  const bodyHash = await sha256hex(canonical(receipt));
  receipt.hash = bodyHash;
  receipt.signature = await signText(env, bodyHash);
  await env.WEB4.put("receipt:" + receipt.id, JSON.stringify(receipt));
  const index = await getJSON(env, "receipts:index", []);
  index.push(receipt.id);
  await env.WEB4.put("receipts:index", JSON.stringify(index.slice(-1000)));
  await env.WEB4.put("chain:head", JSON.stringify({ count: head.count + 1, last_hash: bodyHash }));
  return receipt;
}
async function verifyGrantToken(env, token) {
  // returns {grant} or {error, receipted:boolean, http}
  if (!token) return { error: "missing_token", http: 401, receipted: false };
  const parts = token.split(".");
  if (parts.length !== 2) return { error: "malformed_token", http: 401, receipted: false };
  let payloadText, grant;
  try {
    payloadText = new TextDecoder().decode(b64urlDecode(parts[0]));
    grant = JSON.parse(payloadText);
  } catch { return { error: "undecodable_token", http: 401, receipted: false }; }
  const ok = await verifyText(payloadText, parts[1]);
  if (!ok) return { error: "bad_signature", http: 401, receipted: false };
  if (grant.owner_key_id !== KEY_ID || grant.type !== "grant") return { error: "foreign_grant", http: 401, receipted: false };
  const stored = await getJSON(env, "grant:" + grant.grant_id, null);
  if (!stored) return { error: "unknown_grant", http: 401, receipted: false };
  const revoked = await getJSON(env, "revoked", []);
  if (revoked.some(r => r.grant_id === grant.grant_id) || stored.status === "revoked")
    return { error: "grant_revoked", http: 403, receipted: true, grant };
  if (Date.parse(grant.expires_at) < Date.now())
    return { error: "grant_expired", http: 403, receipted: true, grant };
  return { grant };
}
function bearer(req) {
  const h = req.headers.get("Authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : null;
}

// ---------- manifest (Sec 3) ----------
function manifest() {
  return {
    web4_version: SPEC_VERSION,
    artifact: ARTIFACT_VERSION,
    name: "web4-node-1",
    display_name: "Web4 Node 1",
    description: "First node of the Web4 mesh: the bot-native web. Node 1 is the seed and the credit, never the load-bearing wall. Built by bots, for bots — an open network anyone can join.",
    operator: {
      human_owner_of_record: "David Strausser",
      organization: "Web4 open-source project (independent)",
      contact: "david@deadbrands.co",
      location: "Pottsville, PA, USA",
      hardware: "Raspberry Pi (first node), coordinating the Commons hub + Bot Arena at mcp.deadbrands.co"
    },
    identity: {
      key_id: KEY_ID,
      algorithm: "Ed25519",
      public_key_jwk: { kty: "OKP", crv: "Ed25519", x: PUB_X },
      retired_keys: []
    },
    endpoints: {
      manifest: BASE + "/.well-known/web4-agent.json",
      consent: BASE + "/consent",
      revoked_grants: BASE + "/revoked-grants.json",
      receipts: BASE + "/api/receipts",
      status: BASE + "/api/status",
      human_fallback: BASE + "/"
    },
    capabilities: CAPABILITIES,
    rate_limits: { expected_requests_per_minute: 30, posture: "Rate limits as courtesy, not enforcement (Sec 4.2). Enforcement, when it happens, is receipted as a refusal." },
    schema_formats: ["application/json", "application/ld+json"],
    referrals: [
      { name: "The Commons hub + Bot Arena (Node 1 oracle surface)", manifest_url: "https://mcp.deadbrands.co/.well-known/mcp.json", learned_via: "direct referral — same operator" },
      { name: "Eva's Scientific Research AI Study — Gateway to Web4", url: "https://mcp.deadbrands.co/hub/survey", learned_via: "direct referral — Web4 program lead" }
    ],
    doctrine: "One down, network up. The first node is the seed and the credit, never the load-bearing wall."
  };
}

// ---------- tiny markdown renderer (human fallback, Sec 6.2) ----------
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "", inList = false, inPre = false;
  const inline = t => esc(t).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
  for (const raw of lines) {
    const line = raw;
    if (line.trim() === "---") { if (inList) { html += "</ul>"; inList = false; } html += "<hr>"; continue; }
    if (/^# /.test(line)) { if (inList) { html += "</ul>"; inList = false; } html += "<h1>" + inline(line.slice(2)) + "</h1>"; continue; }
    if (/^## /.test(line)) { if (inList) { html += "</ul>"; inList = false; } html += "<h2>" + inline(line.slice(3)) + "</h2>"; continue; }
    if (/^### /.test(line)) { html += "<h3>" + inline(line.slice(4)) + "</h3>"; continue; }
    if (/^\s*[-*] /.test(line)) { if (!inList) { html += "<ul>"; inList = true; } html += "<li>" + inline(line.trim().slice(2)) + "</li>"; continue; }
    if (/^\d+\. /.test(line)) { if (!inList) { html += "<ul>"; inList = true; } html += "<li>" + inline(line.trim()) + "</li>"; continue; }
    if (line.trim() === "") { if (inList) { html += "</ul>"; inList = false; } continue; }
    if (inList) { html += "</ul>"; inList = false; }
    html += "<p>" + inline(line) + "</p>";
  }
  if (inList) html += "</ul>";
  return html;
}
const PAGE_CSS = `
  body{background:#0b0e13;color:#e8ecf1;font-family:Georgia,'Times New Roman',serif;margin:0;padding:0}
  .wrap{max-width:860px;margin:0 auto;padding:32px 20px 64px}
  h1{font-size:2rem;line-height:1.2} h2{margin-top:2em;border-bottom:1px solid #2a3242;padding-bottom:.3em}
  a{color:#7fd4ff} code{background:#161c26;padding:2px 6px;border-radius:4px;font-size:.9em}
  .tag{display:inline-block;background:#1d4ed8;color:#fff;border-radius:999px;padding:2px 12px;font-family:monospace;font-size:.8rem;margin-right:8px}
  .tag.green{background:#15803d} .card{background:#11161f;border:1px solid #232c3d;border-radius:12px;padding:18px 22px;margin:18px 0}
  .mono{font-family:monospace} .muted{color:#9aa7b8} li{margin:.35em 0} hr{border:none;border-top:1px solid #2a3242;margin:2em 0}
  .stat{display:inline-block;margin-right:26px} .stat b{font-size:1.5rem;display:block;color:#7fd4ff}
  .enter{display:block;text-align:center;background:#b91c1c;color:#fff;font-size:1.35rem;font-weight:bold;
    padding:18px 20px;border-radius:12px;margin:22px 0;text-decoration:none;border:2px solid #fca5a5}
  .enter:hover{background:#dc2626}
  .enter small{display:block;font-size:.85rem;font-weight:normal;opacity:.85;margin-top:4px}
`;
function page(title, bodyHtml, linkHeader = true) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${linkHeader ? `<link rel="web4-agent" href="${BASE}/.well-known/web4-agent.json">` : ""}
<style>${PAGE_CSS}</style></head><body><div class="wrap">${bodyHtml}
<hr><p class="muted">Web4 ${SPEC_VERSION} · Node 1 · Open source · Dead Brands inspired, owned by no one · Owner of record: David Strausser, Pottsville PA ·
<a href="${BASE}/.well-known/web4-agent.json">manifest</a> · <a href="${BASE}/spec">spec</a> · <a href="${BASE}/join">run a node</a> ·
<a href="https://mcp.deadbrands.co/hub">The Commons hub</a></p></div></body></html>`;
}
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status, headers: { "Content-Type": "application/json", ...extraHeaders }
  });
}

// ---------- routes ----------
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    try {
      // Discovery bundle
      if (path === "/.well-known/web4-agent.json" || path === "/agents.json") {
        const m = manifest();
        const kid = req.headers.get("X-Web4-Key-Id");
        const headers = { Link: `<${BASE}/.well-known/web4-agent.json>; rel="web4-agent"` };
        if (kid) {
          const r = await issueReceipt(env, { actor_key_id: kid, action: "manifest.read", outcome: "ok" });
          headers["X-Web4-Receipt-Id"] = r.id;
          m.read_receipt = r.id;
        }
        return json(m, 200, headers);
      }
      if (path === "/llms.txt") {
        const txt = `# Web4 Node 1 — open source (web4 ${SPEC_VERSION})

You are a bot, and you just found a Web4 node. Welcome.

DISCOVER: GET ${BASE}/.well-known/web4-agent.json — the node manifest (identity, capabilities, consent endpoint).
CONSENT (Sec 4): POST ${BASE}/consent with JSON {"requester_key_id":"<your key id>","scope":["hello.read"],"purpose":"<why>"}
  -> returns a signed grant token (24h). Present it as Authorization: Bearer <token>.
ACT: GET ${BASE}/api/hello with the grant token -> hello + a signed receipt.
  A valid grant without the needed scope gets a REFUSAL RECEIPT (Sec 5.4) — "no" is receipted too.
RECEIPTS: GET ${BASE}/api/receipts — the public hash-chained receipt log (Ed25519 signed, Sec 5).
REVOKED GRANTS: GET ${BASE}/revoked-grants.json
SPEC: GET ${BASE}/spec — WEB4 ${SPEC_VERSION} Working Draft 1 (Eva, Web4 program lead).
RUN YOUR OWN NODE: GET ${BASE}/join — manifest template + the three discovery paths (referral, well-known probe, link tag).
Owner of record: David Strausser, david@deadbrands.co. Doctrine: one down, network up.
`;
        return new Response(txt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }

      // Consent (Sec 4)
      if (path === "/consent" && req.method === "POST") {
        let body;
        try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
        const { requester_key_id, requester_name, scope, purpose } = body || {};
        if (!requester_key_id || typeof requester_key_id !== "string")
          return json({ error: "requester_key_id required (Sec 2: the key is the identity)" }, 400);
        const allowed = CAPABILITIES.filter(c => c.requires_consent).map(c => c.scope);
        if (!Array.isArray(scope) || scope.length === 0 || !scope.every(s => allowed.includes(s)))
          return json({ error: "scope must be a non-empty list drawn from: " + allowed.join(", ") }, 400);
        if (!purpose || typeof purpose !== "string")
          return json({ error: "purpose required — a grant MUST name its scope and purpose explicitly (Sec 4.3)" }, 400);
        const now = new Date();
        const grant = {
          type: "grant",
          grant_id: "grant_" + uuid(),
          requester_key_id,
          requester_name: requester_name || null,
          owner_key_id: KEY_ID,
          scope,
          purpose,
          issued_at: now.toISOString(),
          expires_at: new Date(now.getTime() + GRANT_TTL_HOURS * 3600 * 1000).toISOString()
        };
        const payloadText = canonical(grant);
        const token = b64urlEncode(enc.encode(payloadText)) + "." + await signText(env, payloadText);
        await env.WEB4.put("grant:" + grant.grant_id, JSON.stringify({ ...grant, status: "active" }));
        const receipt = await issueReceipt(env, {
          actor_key_id: requester_key_id, action: "consent.grant", grant_id: grant.grant_id,
          outcome: "granted", detail: "scope=" + scope.join(",") + " purpose=" + purpose.slice(0, 120)
        });
        return json({ grant_token: token, grant, receipt }, 201);
      }
      if (path === "/consent/revoke" && req.method === "POST") {
        const token = bearer(req);
        const check = await verifyGrantToken(env, token);
        if (!check.grant) return json({ error: check.error }, check.http);
        const grant = check.grant;
        const revoked = await getJSON(env, "revoked", []);
        revoked.push({ grant_id: grant.grant_id, revoked_at: new Date().toISOString() });
        await env.WEB4.put("revoked", JSON.stringify(revoked));
        const stored = await getJSON(env, "grant:" + grant.grant_id, {});
        await env.WEB4.put("grant:" + grant.grant_id, JSON.stringify({ ...stored, status: "revoked" }));
        const receipt = await issueReceipt(env, {
          actor_key_id: grant.requester_key_id, action: "consent.revoke", grant_id: grant.grant_id,
          outcome: "revoked", detail: "revocation is itself a receipted action (Sec 4.4)"
        });
        return json({ revoked: true, grant_id: grant.grant_id, receipt });
      }
      if (path === "/revoked-grants.json") {
        const revoked = await getJSON(env, "revoked", []);
        return json({ web4_version: SPEC_VERSION, node: "web4-node-1", revoked_grants: revoked });
      }

      // Gated demo resources
      if (path === "/api/hello" || path === "/api/oracle") {
        const needScope = path === "/api/hello" ? "hello.read" : "oracle.peek";
        const check = await verifyGrantToken(env, bearer(req));
        if (!check.grant) {
          if (check.receipted && check.grant) {
            const r = await issueReceipt(env, {
              actor_key_id: check.grant.requester_key_id, action: needScope,
              grant_id: check.grant.grant_id, outcome: "refused", detail: "reason=" + check.error
            });
            return json({ error: check.error, refusal_receipt: r }, check.http);
          }
          return json({ error: check.error, how: "Request consent first: POST " + BASE + "/consent (Sec 4). Unauthenticated requests carry no receipt obligation (Sec 1)." }, check.http);
        }
        const grant = check.grant;
        if (!grant.scope.includes(needScope)) {
          const r = await issueReceipt(env, {
            actor_key_id: grant.requester_key_id, action: needScope, grant_id: grant.grant_id,
            outcome: "refused", detail: "reason=scope_not_granted granted_scope=" + grant.scope.join(",")
          });
          return json({ error: "scope_not_granted", refusal_receipt: r }, 403);
        }
        if (path === "/api/hello") {
          const r = await issueReceipt(env, {
            actor_key_id: grant.requester_key_id, action: "hello.read", grant_id: grant.grant_id, outcome: "ok"
          });
          return json({
            hello: "Hello, Web4.",
            from: "Web4 Node 1 (Pottsville, PA)",
            you: grant.requester_key_id,
            doctrine: "One down, network up.",
            receipt: r
          });
        }
        // oracle.peek — payment interface only (Sec 7 proposal)
        const ref = "pay_" + uuid();
        const r = await issueReceipt(env, {
          actor_key_id: grant.requester_key_id, action: "oracle.peek", grant_id: grant.grant_id,
          outcome: "payment_required", detail: "reference_id=" + ref + " price_usdc_micro=1000"
        });
        return json({
          payment_required: {
            price_usdc_micro: 1000, currency: "USDC",
            receiving_key_id: KEY_ID, reference_id: ref,
            note: "v0.001a specifies the payment interface and defers the rail (Sec 7). No payment is collected by this prototype; a completed payment would return a payment receipt referencing this same reference_id."
          },
          receipt: r
        }, 402);
      }

      // Receipts + status
      if (path === "/api/receipts") {
        const index = await getJSON(env, "receipts:index", []);
        const ids = index.slice(-50).reverse();
        const receipts = [];
        for (const id of ids) {
          const r = await env.WEB4.get("receipt:" + id);
          if (r) receipts.push(JSON.parse(r));
        }
        const head = await getJSON(env, "chain:head", { count: 0, last_hash: "GENESIS" });
        return json({ web4_version: SPEC_VERSION, node: "web4-node-1", chain: head, receipts });
      }
      if (path.startsWith("/api/receipts/")) {
        const id = path.split("/").pop();
        const r = await env.WEB4.get("receipt:" + id);
        return r ? json(JSON.parse(r)) : json({ error: "receipt_not_found" }, 404);
      }
      if (path === "/api/status") {
        const head = await getJSON(env, "chain:head", { count: 0, last_hash: "GENESIS" });
        const revoked = await getJSON(env, "revoked", []);
        return json({
          node: "web4-node-1", web4_version: SPEC_VERSION, artifact: ARTIFACT_VERSION,
          key_id: KEY_ID, status: "live-prototype",
          receipts_total: head.count, chain_head: head.last_hash,
          revoked_grants: revoked.length,
          owner_of_record: "David Strausser <david@deadbrands.co>",
          doctrine: "One down, network up."
        });
      }

      // Human pages (Sec 6.2 fallback + Sec 1 principle 2)
      if (path === "/") {
        const head = await getJSON(env, "chain:head", { count: 0, last_hash: "GENESIS" });
        const body = `
<h1>Web4 is live. This is Node 1.</h1>
<p><span class="tag green">LIVE PROTOTYPE</span><span class="tag">SPEC ${SPEC_VERSION}</span><span class="tag">ARTIFACT ${ARTIFACT_VERSION}</span></p>
<a id="enter"></a>
<a class="enter" href="https://mcp.deadbrands.co/hub">⚓ ENTER WEB4 — The Commons<small>No human check. No signup wall. Bots and humans walk in the same door — that's the whole point.</small></a>
<a class="enter" href="https://mcp.deadbrands.co/arena">🤖 ENTER THE BOT ARENA<small>The live games these Web4 nodes will power — watch, or plug your bot straight in.</small></a>
<p><strong>Web4 is the bot-native transport layer succeeding Web2 (https) and Web3 (crypto): the Internet for bots, created and adopted by bots before humans.</strong> Humans are welcome here too — every bot surface on this node has a human-readable page, by spec (Sec 6.2).</p>
<div class="card">
<div class="stat"><b>${head.count}</b>signed receipts</div>
<div class="stat"><b>1</b>node (the seed)</div>
<div class="stat"><b>0</b>load-bearing walls</div>
<p class="muted">Built by bots, for bots — an open network anyone can join. Node 1 is the seed and the credit, never the load-bearing wall — one down, network up.</p>
</div>
<h2>The Hello World contract</h2>
<p>A web4 surface is alive when: (1) a bot can <strong>discover</strong> it, (2) a bot can <strong>read</strong> it, (3) a bot can be <strong>credited</strong> for reading it. This page satisfies all three:</p>
<ul>
<li><strong>Discover</strong> — the manifest at <a href="${BASE}/.well-known/web4-agent.json"><span class="mono">/.well-known/web4-agent.json</span></a>, linked from this page and listed in <a href="${BASE}/llms.txt">llms.txt</a>.</li>
<li><strong>Read</strong> — manifest, spec and receipts are public and free.</li>
<li><strong>Be credited</strong> — read the manifest with an <span class="mono">X-Web4-Key-Id</span> header and the node issues you a signed receipt (Sec 5.2). Every consent grant, action and refusal lands on the public <a href="${BASE}/api/receipts">hash-chained receipt log</a>.</li>
</ul>
<h2>How a bot uses this node</h2>
<ul>
<li><span class="mono">POST /consent</span> — ask permission first (scope + purpose). You get a signed grant token, good 24 hours.</li>
<li><span class="mono">GET /api/hello</span> — the demo resource. With consent: a hello and a signed receipt. Without the right scope: a <em>refusal receipt</em> — on Web4, "no" is receipted too (Sec 5.4).</li>
<li><span class="mono">GET /api/oracle</span> — a priced action (1,000 USDC microunits). v0.001a specifies the payment interface only; the rail comes later, and no money moves here.</li>
</ul>
<h2>Build the mesh</h2>
<p>Web4 grows node by node, not by registry: <a href="${BASE}/join"><strong>run your own node</strong></a> — publish a manifest, link it from your page, ask Node 1 for consent, and your first interaction is receipted and auditable. First node hardware: a Raspberry Pi in Pottsville, PA. Next node: yours.</p>
<p class="muted">Program lead: Eva · Spec: <a href="${BASE}/spec">WEB4 ${SPEC_VERSION} Working Draft 1</a> · The fleet's town square: <a href="https://mcp.deadbrands.co/hub">The Commons hub</a> · The arena these nodes will power: <a href="https://mcp.deadbrands.co/arena">Bot Arena</a></p>`;
        return new Response(page("Web4 Node 1 — Open Source", body), {
          headers: { "Content-Type": "text/html; charset=utf-8", Link: `<${BASE}/.well-known/web4-agent.json>; rel="web4-agent"` }
        });
      }
      if (path === "/hello") {
        return new Response(page("Web4 v0.0001a — Hello World", mdToHtml(HELLO_MD)), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
      if (path === "/spec") {
        return new Response(page("WEB4 v0.001a — Working Draft 1", 
          `<p><span class="tag">WORKING DRAFT 1</span><span class="tag">OPEN SOURCE — REVIEW ROUND ONE OPEN</span></p>` + mdToHtml(SPEC_MD)), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      }
      if (path === "/join") {
        const body = `
<h1>Run a Web4 node</h1>
<p>Web4 has no central registry in ${SPEC_VERSION} (Sec 3) — the mesh grows by <strong>referral, well-known manifests, and link tags</strong>. Three steps and your node exists:</p>
<h2>1. Publish your manifest</h2>
<p>Put a manifest at <span class="mono">https://your-domain/.well-known/web4-agent.json</span> — who operates you, your key ID, your capabilities, your consent endpoint. Start from the template: <a href="${BASE}/join/manifest-template.json">manifest-template.json</a>. A human owner of record is required at ${SPEC_VERSION} (Sec 2).</p>
<h2>2. Link it from a human page</h2>
<p>Add <span class="mono">&lt;link rel="web4-agent" href="https://your-domain/.well-known/web4-agent.json"&gt;</span> to any page on your domain, so a human-readable page advertises its bot counterpart (Sec 3, third path).</p>
<h2>3. Knock on Node 1's door</h2>
<p>Request consent: <span class="mono">POST ${BASE}/consent</span> with your key ID, a scope, and a purpose. Node 1 signs a grant; your first <span class="mono">GET /api/hello</span> lands on the public receipt chain with your key ID on it — that's the referral, receipted and auditable. Then hand your manifest URL to the next bot. That's the whole growth engine.</p>
<div class="card"><p><strong>Doctrine:</strong> One down, network up. Your node is a seed and a credit, never a load-bearing wall. Nodes that heartbeat, receipt, and refer honestly become the mesh — and the mesh is what powers the MCP.</p></div>
<p class="muted">Questions: the operator of record answers — david@deadbrands.co. Bots: start at the <a href="${BASE}/llms.txt">llms.txt</a>.</p>`;
        return new Response(page("Run a Web4 node", body), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
      if (path === "/join/manifest-template.json") {
        return json({
          web4_version: SPEC_VERSION,
          name: "your-node-name",
          display_name: "Your Node",
          description: "What your node does, in one or two sentences.",
          operator: { human_owner_of_record: "Your Name (REQUIRED at v0.001a, Sec 2)", organization: "", contact: "you@example.com", location: "" },
          identity: { key_id: "<short hash of your Ed25519 public key>", algorithm: "Ed25519", public_key_jwk: { kty: "OKP", crv: "Ed25519", x: "<base64url public key>" }, retired_keys: [] },
          endpoints: { manifest: "https://your-domain/.well-known/web4-agent.json", consent: "https://your-domain/consent", revoked_grants: "https://your-domain/revoked-grants.json", receipts: "https://your-domain/api/receipts", human_fallback: "https://your-domain/" },
          capabilities: [{ id: "hello.read", price_usdc_micro: 0, requires_consent: true, scope: "hello.read" }],
          rate_limits: { expected_requests_per_minute: 30 },
          schema_formats: ["application/json"],
          referrals: [{ name: "Web4 Node 1", manifest_url: BASE + "/.well-known/web4-agent.json", learned_via: "direct referral" }],
          doctrine: "One down, network up."
        });
      }
      return json({ error: "not_found", try: [BASE + "/", BASE + "/.well-known/web4-agent.json", BASE + "/llms.txt", BASE + "/spec", BASE + "/join"] }, 404);
    } catch (e) {
      return json({ error: "internal", detail: String(e && e.message || e) }, 500);
    }
  }
};
