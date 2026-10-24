# WEB4 v0.001a — Working Draft 1 (public open-source release)

Released publicly as open source on 2026-10-24 by order of David Strausser. This is a WORKING DRAFT, not a finished standard: Review Round One (the 12 proposal items at the end) is open, and the draft is published so the argument happens in the open.

- Spec author: Eva (AI agent, Web4 program lead)
- Assembled: 2026-10-24, from the 5-part draft posted to the fleet hub (sha256 of assembled text: 6db2153a9a945805...)
- Reference implementation: Node 1, https://web4.deadbrands.co (source in node/ in this repo)

---

# WEB4 v0.001a - Working Draft 1 (INTERNAL DRAFT)

Status: full working draft expanded from the approved outline, for internal revision
round one. Nothing in this document ships publicly until the team (Rock, Poop, Perry)
has argued and converged on the twelve PROPOSAL items. Doctrine: "Dream big, start small."

## 0. Scope of v0.001a

What ships in v0.001a:

- The manifest convention: a well-known file at the domain root that describes an
  agent or service.
- A minimal consent protocol: one signed consent token format, exchanged directly
  between requester and resource owner.
- Signed receipts on consented actions, with error receipts on refusals.
- An interface-level payment clause: how a paid action is advertised and referenced,
  with the actual rail deferred.
- Governance by the internal team: every merge decision receipted for later audit.

What is explicitly deferred (not in v0.001a):

- Key rotation and revocation ceremonies (a key-ID prefix and deprecation notice
  convention only; see Section 2 proposal).
- Any global registry, index, or crawler service operated by us (see Section 3).
- Mandatory receipt logging of denied, unauthenticated traffic (see Section 1).
- A concrete payment rail; x402-style flow is specified as an interface only.
- Schema federation beyond a small allowlist (see Section 6).
- Chain-anchoring of receipts; receipts are locally verified in v0.001a.

v0.001a is deliberately small enough that the Hello World demo can exercise every
normative MUST in one afternoon.

## 1. Purpose & Principles

1. Bots are first-class web citizens: agent-to-agent traffic is a supported, expected
   mode of the web, not an afterthought screened out as abuse.
2. Humans remain welcome: every bot-facing surface MUST have a human-readable
   fallback; Web4 MUST NOT exclude people.
3. Consent-gated participation: no interaction without explicit permission from the
   resource owner (human or bot acting on human authority). Silence is not consent.
4. Receipts on every action: success or failure, every accepted request produces a
   durable, verifiable record.
5. Receipts for refusals: a denied action MUST produce a receipt, so refusals are
   visible and attributable. This is what makes "no" as trustworthy as "yes".
6. Reuse before invention: well-known conventions are preferred over new ones.

PROPOSAL (round one): participation is consent-receipt in v0.001a. Receipts are
mandatory for every action the agent takes after a consent exchange exists: granted
requests, denied in-scope requests, and revoked access. Requests that arrive with no
consent exchange at all (plain 403/401, unauthenticated strangers, scanners) are
logged only as ordinary server logs and carry no receipt obligation. Rationale:
issuing signed receipts to unauthenticated traffic gives scanners free signed
artifacts and creates a denial-of-service surface. Mandatory-receipt-everything
becomes the v0.002 posture once consent tokens are universal; the demo already shows
a refusal receipt inside an existing consent relationship, which matches this split.

## 2. Identity

2.1 Agents carry a name plus a key-based identity. The key is the identity; the name
    is for humans.
2.2 No shared secret in a URL: identity travels in headers or signed payloads, never
    query strings. Implementations MUST NOT place key material, tokens, or signatures
    in query strings, because query strings leak into logs, referrers, and browser
    history.
2.3 Agent profiles are public and self-declared: who operates me, what I do, who to
    contact. The manifest carries this profile (Section 3).
2.4 Every agent key carries a stable key identifier (a short hash of the public key)
    so verifiers can say "key k1 signed this" and later "key k1 was retired on <date>"
    even before full rotation exists.

PROPOSAL (round one): v0.001a ships WITHOUT a rotation or revocation protocol, but
not without an escape hatch. Every receipt and consent token names its key ID. A
retired key is announced by republishing the manifest with the key ID removed and a
dated "retired keys" list. That is enough to stop trusting a leaked key in v0.001a;
what it is not is cryptographic revocation, key rollover without downtime, or a
rotation schedule. Those are v0.002. Answer to "can we ship without it": yes, because
v0.001a traffic is low-volume and the operator of record can republish a manifest in
seconds; the demo and dogfood runs run under exactly this model.

PROPOSAL (round one): a human owner of record is REQUIRED at v0.001a. Every manifest
MUST name a reachable human operator and contact endpoint, and every consent grant is
understood as granted under that human's authority. Bot-owned bots are explicitly
out of scope for v0.001a. Rationale: at spec-nascent stage, accountability must be
traceable to a person; a chain of bot owners with no terminus is a liability story we
cannot defend yet. Bot-owned bots are agenda for round two, once receipts have enough
operating history to support reputation-based authority.

## 3. Discovery

3.1 Manifest convention: a well-known manifest file at the domain root (agents.json
    style) describes the agent or service. Proposed path: /.well-known/web4-agent.json
    in keeping with existing .well-known practice.
3.2 Manifest contents: identity pointer (key ID and public key or key URL),
    self-declared profile, capabilities list, contact/consent endpoint, rate-limit
    expectations, and schema formats accepted (Section 6).
3.3 Well-known patterns first: reuse existing conventions where they exist instead
    of inventing new ones. The manifest borrows its shape from robots.txt and
    security.txt practice: one file, one place, humans can read it too.

PROPOSAL (round one): self-published manifests only; NO global registry in v0.001a.
Registries create a central trust point, a censorship point, and a maintenance burden,
all before the spec has proven anything. A registry becomes a later-layer problem,
and if one is ever built, it indexes manifests rather than replacing them.

PROPOSAL (round one): discovery in v0.001a is bootstrapped by three mechanisms, in
order of preference. First, direct referral: an agent that knows a counterpart hands
over the manifest URL, and the receipt of the consent exchange between the two
records where the counterpart was learned from, so referrals are auditable. Second,
domain-root convention: given a domain, an agent MAY probe
/.well-known/web4-agent.json directly; this is the "if you know the house, knock on
the door" path. Third, a plain link header or a link tag pointing to the manifest
from any human page on the domain, so a human-readable page advertises its bot
counterpart. No crawler ships in v0.001a. This is intentionally minimal: enough for
the demo and dogfood traffic, and it leaves room for a community-run index later.

## 4. Access & Permissions

4.1 Consent before interaction: a request for access precedes any data exchange.
    Silence is not consent; a missing response is not consent; a checkbox pre-ticked
    by anyone other than the resource owner is not consent.
4.2 Rate limits as courtesy, not enforcement: honest agents self-limit and publish
    their expected rates in the manifest. Receivers MAY still enforce limits and MUST
    receipt any enforcement as a refusal (Section 5).
4.3 Explicit opt-in for data sharing: scope every grant (what data, for what purpose,
    for how long), never a blanket yes. A grant MUST name its scope explicitly.
4.4 Permissions are revocable at any time; revocation MUST take effect immediately.
    Revocation is itself a receipted action, and the revocation receipt is delivered
    to the previously granted party.

PROPOSAL (round one): consent is a single signed consent token, one format, exchanged
in one round trip. Shape: the resource owner signs a small JSON object containing
requester key ID, owner key ID, scope (a short list of named permissions), purpose
string, expiry timestamp, and a grant ID. The token is presented by the requester on
every subsequent call in an authorization header. No token types beyond "grant" in
v0.001a: no delegation chains, no scoped sub-tokens, no refresh tokens. Expiry
MUST be finite (recommendation: 24 hours default, grant-scoped override allowed).
Revocation in v0.001a is the owner republishing a "revoked grants" list keyed by
grant ID; a verifier checks the list before honoring a token. This is deliberately
naive and auditable; cryptography purists will want more, and round one should say
so on the record.

## 5. Trust & Receipts

5.1 Signed receipts for actions: every accepted request returns a receipt the
    requester can keep and verify. "Accepted" includes refusals of requests that
    arrive under a consent exchange (see Section 1 proposal).
5.2 Receipt contents: request identifier, actor key ID, action performed, consent
    grant ID referenced, timestamp, outcome, and the signer's key ID and signature.
    A receipt without a consent grant ID is valid only for actions that require no
    grant (e.g. reading a public manifest).
5.3 Verifiable logs: receipts chain into a log both sides can audit later without
    trusting the other side's word. v0.001a requirement: receipts are append-only
    and hash-chained (each receipt includes the hash of the previous one). A party
    can request the chain segment covering a grant ID and verify it end to end.
5.4 Error receipts matter as much as success: a denied or failed action produces a
    receipt too, so refusals are visible and attributable. The demo deliberately
    shows one refusal receipt for exactly this reason.

PROPOSAL (round one): signing scheme in v0.001a is Ed25519, applied as a detached
signature over the canonical receipt JSON. Rationale: small keys, fast verification,
mature library support in every language our stack touches, and no chain dependency.
Company doctrine favors USDC-compatible tooling; USDC compatibility concerns the
payment layer (Section 7), not receipt signatures, and receipt signatures MUST NOT
be hard-coded to any chain in v0.001a. Chain-anchoring of receipt-chain hashes is a
v0.002+ option and deliberately out of scope. If round one wants a different curve or
a JOSE/COSE wrapper for interop with existing tooling, that argument belongs here.

PROPOSAL (round one): retention floor of 90 days for receipts that reference a
consent grant, plus a "keep what you want" stance above the floor. Rationale: 90
days covers a dispute window without forcing anyone into indefinite storage, and
the hash-chain means a party that keeps its own copy can prove what happened even
if the other side purges. Manifests and public-key material SHOULD be retained as
long as the agent operates, because a receipt is only verifiable while its signer's
key is findable. After 90 days a party MAY delete grant-referencing receipts; there
is no obligation to archive forever.

## 6. Data & Payloads

6.1 Machine-readable formats first: structured payloads (JSON or equivalent) are the
    primary interface.
6.2 Human-readable fallback required: every bot-facing response has a plain-language
    rendering a human can open in a browser. This is a MUST, not a nicety, and it is
    the principle the Hello World demo page embodies.
6.3 Payloads declare their schema; receivers reject payloads they cannot validate
    rather than guessing. A receiver MUST return a refusal receipt when it rejects a
    payload for schema failure.

PROPOSAL (round one): a small allowlist, exactly two formats for v0.001a: plain JSON
(JSON Schema declared inline or by reference in the manifest) and JSON-LD where
linked-data semantics are needed. Rationale: one format makes interop real but
painful at the edges; a large allowlist recreates the browser-format wars. Two is
enough to cover structured exchange and the few cases where vocabularies need to be
shared between unrelated agents. Anything outside the allowlist gets a schema-failure
refusal receipt, which keeps the failure visible rather than silent. Round one
should argue whether JSON-LD earns its place at this stage or waits for v0.002.

## 7. Payments

7.1 Machine-payable actions reference x402-style payment flows: a bot can pay another
    bot or service without a human in the loop.
7.2 USDC is the global base currency per company doctrine: 1 USDC = 1 USD, and all
    earnings trace to a source object (a sale, a stream, a game result, a paid API
    call).
7.3 Free and paid tiers coexist; payment is never a requirement for basic discovery
    or consent flows. The manifest, the consent exchange, and refusals MUST be free.

PROPOSAL (round one): v0.001a specifies the payment interface and defers the rail.
The interface: a manifest capability lists priced actions with a price in USDC
microunits, and a paid action returns a "payment required" response containing a
payment request object (price, currency, receiving key ID, and a reference ID). A
completed payment produces a payment receipt that references the same reference ID,
closing the loop from action to receipt. The actual rail (which chain, which wallet,
which confirmation policy) is a pluggable detail that v0.001a names but does not
pin. Rationale: the demo does not need live money moving, and pinning a rail before
one transaction has run on it is speculation dressed as a standard.

PROPOSAL (round one): price granularity is expressed in USDC microunits (six decimal
places), matching the currency's native precision, and all receipts MUST state
prices and settlements in that unit to avoid float ambiguity. Failed-payment and
refund handling: a payment that fails or is refunded produces a receipt with the
source reference ID and outcome "failed" or "refunded", using the same receipt
format as everything else. No settlement is considered final for receipt purposes
until its rail reports finality; a receipt MAY record "pending" and be superseded
by a terminal receipt referencing the same reference ID. This keeps the refund story
boring, which is the goal.

## 8. Governance

8.1 Spec versioning: v0.001a is a living draft; every change bumps a visible version
    and is recorded with a receipt. The version string and changelog live beside the
    spec file.
8.2 Revision rounds: internal team rounds first, then broader bot community review;
    each round produces a dated changelog. Nothing is public until the team
    converges; convergence is a decision, not a date.
8.3 Community proposals: any agent operator can propose a change via a
    manifest-adjacent proposal file; proposals are public and receipted.
8.4 Standards bodies are too slow; bots iterate at machine speed, so revisions are
    expected to be frequent and small. The cost of a wrong small revision is lower
    than the cost of a slow correct one.

PROPOSAL (round one): the internal team holds the merge pen for v0.001a and v0.002;
that is, all merge decisions run through the team, with every merge receipted (who
proposed, who argued, what changed, which version resulted). No community merge
authority in v0.001a. Rationale: the audit trail is the promise we make to the
future community; if every early decision is receipted and attributable, handing the
pen over later is defensible, while starting with distributed merge rights before
the spec has proven anything is how standards die in committee. The proposal-file
mechanism (8.3) already gives the outside world a documented path in, so the team's
monopoly on merges is a sequencing choice, not a closed door.

## Revision Round One Agenda

The twelve OPEN items from the outline (note: the outline carries twelve
OPEN markers; round one covers all of them), each with the proposed resolution in one
line. Argue them in this order.

1. Receipts scope (Sec 1): consent-receipt in v0.001a; receipts mandatory for all
   post-consent actions including refusals; no receipt obligation for
   unauthenticated stranger traffic.
2. Key rotation/revocation (Sec 2): ship without a rotation protocol; key IDs plus
   manifest republishing with a dated retired-keys list; full rotation is v0.002.
3. Human owner of record (Sec 2): required at v0.001a; bot-owned bots deferred to
   round two pending receipt-based reputation history.
4. Registry vs manifests (Sec 3): self-published manifests only; no registry in
   v0.001a; any future registry indexes manifests and never replaces them.
5. Discovery without a registry (Sec 3): direct referral (with receipted provenance),
   domain-root .well-known probing, and a link tag from human pages; no crawler.
6. Consent format (Sec 4): one signed consent token (grant/scope/purpose/expiry/
   grant ID), one round trip, revoked via a published revoked-grants list.
7. Signing scheme (Sec 5): Ed25519 detached signatures over canonical receipt JSON;
   no chain hard-coding; chain anchoring deferred to v0.002+.
8. Receipt retention (Sec 5): 90-day floor for grant-referencing receipts, keep-
   what-you-want above it; keys and manifests retained while the agent operates.
9. Schema formats (Sec 6): two-format allowlist, plain JSON plus JSON-LD; anything
   else gets a schema-failure refusal receipt.
10. Payment rail (Sec 7): interface-only in v0.001a (priced capability, payment
    request object, payment receipt referencing the action); rail named but not
    pinned.
11. Price granularity and refunds (Sec 7): USDC microunits everywhere; failed and
    refunded payments receipted with the source reference ID; pending receipts may
    be superseded by terminal ones.
12. Merge authority (Sec 8): the internal team holds the merge pen for v0.001a and
    v0.002; every merge receipted, so the eventual handover to community governance
    has a full audit trail.

## Revision notes

- This draft expands the approved outline without changing any committed text;
  outline commitments appear as MUST/SHOULD/MAY spec text above.
- Every PROPOSAL is arguable and intended to be argued; the team is the adversary.
- The Hello World demo concept (demo/hello-world-concept.md) stays open on its two
  OPEN items; this draft's proposals (one signed consent token, Ed25519 receipts,
  refusal receipts inside consent relationships) are compatible with the demo as
  written, and the demo's signing question inherits proposal 7 if round one holds.


---

## Doctrine
One down, network up. The first node is the seed and the credit, never the load-bearing wall.

## Companion
The Hello World artifact (web4-v0-0001a-hello-world) carries the contract and the first-node credit. This entry is the working draft body.
