---
title: "Why Trace won’t follow every link"
description: "A redirect checker makes requests on someone else’s behalf. Here’s how Trace limits where those requests can go, and why some links stay unresolved."
date: "2026-10-14"
project: "trace"
---

Trace has two distinct jobs. It can inspect a URL and remove known tracking parameters in your browser. It can also ask a server to check where a link leads. The first job works with text. The second crosses a security boundary.

That boundary is the subject of this case study. The design gives network restrictions priority over resolving every possible link. Sometimes the useful result is an honest explanation of where a check stopped.

## The server can reach places the visitor cannot

Imagine someone submits a public-looking link. Its first response redirects to a private address: perhaps an internal admin interface or a cloud metadata endpoint. If the checker automatically follows it, the visitor has persuaded our server to make an internal request for them.

This is server-side request forgery, usually shortened to SSRF. A redirect checker is an obvious place to take it seriously: making requests to user-supplied destinations is its purpose.

Blocking the word `localhost` is not enough. A hostname can resolve to a private address, an IP can have an unusual spelling, or a later redirect can cross into a restricted network.

## Every hop has to qualify

Trace handles the redirect chain one request at a time. Before each request, it validates the target and resolves its hostname again.

The policy accepts HTTP and HTTPS URLs without embedded credentials, on ports 80 or 443. It rejects non-public addresses, including loopback, private and link-local networks. Cloud metadata destinations and additional special-use ranges are excluded too. IPv4-mapped IPv6 addresses are classified using their underlying IPv4 address.

For a hostname, Trace collects both IPv4 and IPv6 answers. If any returned address is blocked, it rejects the target rather than choosing only an answer that happens to pass. A failure to fully resolve one address family also stops the check.

In outline, the sequence is:

```text
Submitted URL
  → validate scheme, credentials, and port
  → resolve and check every returned IP address
  → connect to one validated IP
  → inspect the response for a supported redirect
  → repeat the checks for the next target
```

A public first hop does not grant permission to follow the rest of the chain. The rules apply again to every extracted target, including redirects found in page content.

## Checking DNS once is not enough

A second problem appears if a hostname is checked, then resolved again when the HTTP client connects. An attacker could change the answer between those operations: public during validation, private during connection.

Trace avoids that second lookup. It selects a validated address and gives that IP directly to the connection. The connection is pinned to the address that passed the policy.

The original hostname still matters. Trace keeps it in the HTTP Host header and uses it for TLS server naming and certificate identity verification. Connecting to a vetted IP must not turn off the checks that establish which HTTPS server answered.

The implementation in `server/transport.ts` uses a fresh connection, without a shared connection pool or automatic redirect handling. The destination policy is implemented in `server/security.ts`.

This has an availability cost. Trace tries the first validated address; it does not retry all alternatives if that connection fails. A site might work in your browser and still fail this check.

## Remote pages stay inert

Some links redirect through an HTML page rather than an HTTP Location header. Trace can inspect a bounded amount of HTML as text for supported navigation instructions, including meta refresh and narrowly defined, literal JavaScript targets.

It does not execute JavaScript or launch a browser. It does not load the page’s images, external scripts, forms, or other assets. Computed script targets, login sessions, CAPTCHAs, and interactive flows are outside this model. Conflicting explicit targets stop the check instead of prompting a guess.

User cookies, authorization headers, and browser referrers are not forwarded. Response cookies are not replayed on later hops.

These choices deliberately limit compatibility. Executing a remote page would introduce a much larger set of behaviors to control. A short link that needs those behaviors can remain unresolved.

## Requests have a budget

A reachable public server can still stall, loop, or send excessive content. The default limits include:

- Up to eight redirect hops after the starting request.
- Five seconds per request, including DNS and bounded body reading.
- Twenty seconds for the complete check.
- At most 256 KB of encoded and decoded HTML content, with bounded streaming decompression.
- Process-local rate and concurrency limits.

Cancellation stops outstanding work. A stopped check preserves the steps already observed and does not label an unreached target as the final destination.

These limits are boundaries around the work the checker performs. They are not a guarantee that every permitted request is harmless.

## What the tests establish

The automated tests exercise the policy with controlled addresses and responses. They include private and special-use address rejection, unusual IP spellings, IPv4-mapped IPv6 addresses, and DNS answers that mix public and private addresses.

The transport tests simulate a hostname changing from a public address to a loopback address. They check that the first connection uses the validated IP without a second lookup, preserves the destination’s Host and TLS settings, and that a subsequent check rejects the changed answer.

Redirect-chain tests exercise revalidation on later hops, deadlines, cancellation, loops, and partial results. Page-response tests cover bounded decompression, stalled bodies, and unsupported or ambiguous page redirects.

The relevant test files are `tests/security.test.ts`, `tests/redirects.test.ts`, and `tests/page-transport.test.ts`. These are implementation tests using controlled fixtures and mocked network behavior. They do not establish that a particular production host has the correct firewall configuration, and they are not an independent security audit.

## Deployment is another boundary

Application checks need an additional network boundary on the host. Trace includes an outbound firewall template intended to restrict requests to permitted public destinations and a chosen DNS resolver. That template must be adapted, installed, and verified in the actual environment, including any containers or network namespaces.

In production mode, redirect checks remain disabled unless the operator sets `EGRESS_RESTRICTED=true`. That flag is an operator assertion. It does not inspect or verify the firewall. `REDIRECT_CHECKS_ENABLED=false` can keep checks disabled explicitly.

Deployment verification needs to test private IPv4 and IPv6 destinations, mapped addresses, metadata endpoints, disallowed ports, and DNS changes from the running service. Passing the code tests is not evidence that this separate work has happened.

Request privacy also depends on infrastructure. Destination servers see requests from Trace’s server, DNS resolvers see hostname lookups, and hosting or proxy systems may log data independently of the application. A request can expose a token or consume a one-time link. Those effects cannot be undone by cancelling afterward.

That is why checking redirects requires an explicit action. Pasting, inspecting, editing parameters, and copying a cleaned link do not contact its destination.

## An unresolved link can be the correct result

Trace describes the requests it observed within these boundaries. It does not promise to reproduce every browser session, identify malware, or establish that a destination is trustworthy.

The useful promise is narrower: inspect locally when that is enough, make external requests deliberately, and stop when the next step would exceed the checker’s restrictions.

The project is licensed under MIT. Its source repository will be linked here when the Daggmask GitHub organization is ready.
