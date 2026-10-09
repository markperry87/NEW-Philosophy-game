# Philosophy: A World Within

A complete remake inspired by markperry87/philosophy-incremental, published publicly with ChatGPT Sites. The reference GitHub game is not the publication target.

## Current playtest update

- Removed Thought Police, Paradox encounters, and the Beyond tab. Transcendence, Eternal Truths, and Cosmic Synthesis are now in Ideas, with their existing unlocks. Existing retired achievement bonuses are retained but hidden, so players lose no earned production.
- Automaters have explicit Start/Pause controls. Starting group replaces the unexplained seed label; Stop at sets the banked count. Start applies edited targets, losses rebuild the group, reaching the target pauses the slot, and raising the target permits restart. Slots retain independent speed/luck upgrades and unique thinker assignments.
- Each age illustration now uses a 627px tile in one of four 1254px 2×2 atlases, replacing the roughly 314px tiles in the original 4×4 sheet. This quadruples pixels per scene. Crisp pixel rendering and the existing thinker portraits are preserved. Prompts and asset provenance are in ART-PROMPTS-V2.json.
- Wager outcomes count one event per win or loss, irrespective of the number of thinkers. Journal shows wins, losses, total, actual win percentage, and separate manual/automated records from this update onward. Old combined records are migrated without inventing their source. Seeded tests cover 100,000 manual and 100,000 automated outcomes; both match their advertised odds within 0.5 percentage points. No bias was found in the prior counter logic; its ambiguous wins/losses presentation has been removed.
- Classical only unlocks the Philosopher. Later thinker generations are spread across later ages. Scholasticism costs 6M (previously about 1.43M); later age costs increase tenfold per age. Existing discovered thinkers remain recruitable.
- Without buying, wagering, upgrading, or advancing, open-page production rests at 20% after one minute and 2% after three minutes. Successful investments restore full production. Automaters doing actual buying/wagering also restore it. Think's click value continues to use full potential production.
- Away income is 1% of production for at most one hour and at most 10% of the next age's cost per absence. No offline buying, wagering, or age advancement. The final age instead has a one-hour 1% cap.
- A sticky toolbar displays current thoughts, actual production per second and per minute, resting status, and a Think button across every tab, including mobile.

## Saves and sharing

Public visitors can play immediately with browser-local saves; optional signed-in cloud journeys remain private to each account. Browser and cloud journeys are separate. Export/Import transfers backups. Saving uses revisions, session ownership, and retry IDs to prevent stale-window overwrites. New game resets the selected journey only. Remake version-1 saves migrate in place; no reset is required for this update.

## Verification

22 engine/browser-save regression tests cover independent automation, loss recovery, target restart, pause, statistics, retired-mechanic migration, old-save validation, offline limits, idle tiers, progression gates, prestige, and browser isolation. The local API suite covers authentication, origin checks, corruption, idempotent retries, concurrent writes, window handoff, and reset. TypeScript and the production build are checked before publication.

40 seeded active strategies (one Think per second, rebuild four thinkers, wager every five seconds until 64) spent a median 15.0 minutes in Classical, range 3.2–16.8 minutes. Early pacing tests compare active wagering against a small circle that stops recruiting; these are simulated strategies, not human play-time guarantees. Browser checks cover all three automaters starting and operating, pause/restart with changed targets, actual win-rate reporting, mobile sticky tracking, desktop/mobile artwork, and no browser console errors.

## Core systems retained

15 thinkers and ages, five metaphilosophies, 28 visible achievements, six Eternal Truths, and late Cosmic Synthesis. Manual wager odds 50–60%; independent automated odds 48–54%. Wagers double or lose one thinker type. Production has diminishing returns above 512 of a type. Permanent Wisdom is 1 + 0.12 × sqrt(Wisdom); separately spent Eternal Ink does not reduce that multiplier. Illustrated unlocks, optional sound, reduced motion, and Space-to-Think remain.
