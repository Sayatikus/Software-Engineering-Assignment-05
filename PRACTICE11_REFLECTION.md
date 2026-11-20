# Practice #11 — Short reflection

I used an AI coding assistant to design an optional explanation feature for my Smart Campus checker. I wanted the new feature to explain a decision instead of making it. The assistant proposed a mock LLM adapter, a small React component, input and output validation, and tests for normal and failure cases.

I kept the existing `checkAvailability` function unchanged because it already enforces booking rules such as the maximum two-hour duration, blocked rooms and overlapping bookings. The generated explanation receives the result from this function; it cannot decide if a room is free. I also checked that the UI labels the extra text as a mock AI explanation, so students do not confuse it with the confirmed status.

I reviewed the new code for stale asynchronous results and unsupported text. To address these risks, I isolated each check's explanation component and limited the adapter to safe templates. I wrote tests for overlaps, invalid times, empty input, timeout, simulated provider failure and contradictory output. These tests still need an actual run in a local environment before I can honestly claim they pass.

The main lesson for me was that AI can help write a feature quickly, but I still have to decide what it is allowed to change and check the evidence myself.
