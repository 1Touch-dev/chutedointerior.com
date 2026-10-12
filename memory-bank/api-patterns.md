# API patterns

## Articles

`GET /ai-articles?targetWebsite={key}&endpoint={name}&limit&page&sort=scheduledTime&order=desc&scheduledBefore={minuteISO}`

Public filter client-side: `publishState === 'published'` and `scheduledTime <= now`.

Slug: `GET /ai-articles/slug/{slug}?targetWebsite={key}` (`cache: 'no-store'`).

## Banners

`GET /banners/public/{websiteKey}` → `{ banner | banners[] }` (html | image).

Partner: `GET /partnerships/banners?website={key}&position=` (often empty).

## Football

- `GET /football/brazil/leagues?season=`
- `GET /football/brazil/league/{slug}?season=` (standings, topScorers, next fixtures bundle)
- `GET /football/fixtures?league=&season=&next|last|status=FT|live=all|id=`
- `GET /football/teams|events|lineups|stats?...`

Client: `src/lib/football-desk.ts` (`getFootballDesk`, `getMatchPage`, `getTeamPage`).
