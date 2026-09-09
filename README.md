<p align="center"><img src="assets/readme-hero.svg" alt="cassielsp2025 scene-pack finder" width="100%"></p>

# cassielsp2025

**A simple scene-pack finder for editors and creators who need to quickly discover reusable video references on YouTube without exposing the YouTube API key in the browser.**

## Why this is useful

Video editors often spend more time searching for suitable scene packs than editing. This project turns that repetitive search into a small focused tool: type the person, movie, series, character, game, or subject you need and the app searches YouTube through a protected server-side endpoint.

It is useful for:

- video editors collecting scene-pack references for reels, edits, fan videos, AMVs, thumbnails, and motion projects;
- creators who repeatedly search YouTube using the same scene-pack terms;
- small tools that need YouTube search without placing the API key in client-side JavaScript;
- learning the basic pattern of a static frontend calling a serverless API safely.

## What happens when you search

```text
Creator enters a search term
          |
          v
Browser search interface
          |
          v
Serverless /api/youtube endpoint
          |
          v
Scene-pack-aware YouTube search
          |
          v
Matching videos returned to the interface
```

The API handler in `api/youtube.js` reads `YOUTUBE_API_KEY` from the server environment. The credential is not hard-coded into the frontend.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main search interface |
| `styles.css` | Responsive visual presentation |
| `script.js` | Search interactions and result rendering |
| `api/youtube.js` | Server-side YouTube search proxy |
| `vercel.json` | Vercel deployment configuration |
| `package.json` | Project metadata and dependencies |
| `assets/` | Repository presentation assets |

## Configuration

Keep the YouTube API key only in the deployment environment or an ignored local environment file:

```env
YOUTUBE_API_KEY=your_server_side_key
```

Do not place the value in `script.js`, committed configuration, query parameters, README examples, or browser storage. Rotate the credential if a real key is ever published.

## Local development

Install the project dependencies, configure `YOUTUBE_API_KEY`, and run the development command defined in `package.json`. For Vercel, add the same variable through the project environment settings.

## API behavior

`GET /api/youtube?query=<term>`:

- receives a creator's search phrase;
- rejects missing search input;
- keeps the YouTube credential on the server;
- queries YouTube Data API v3;
- returns matching video data to the frontend;
- surfaces upstream failures as structured errors.

## Practical improvements

Useful future additions include saved searches, result filters, duration filters, channel allow/block lists, duplicate detection, a recent-search history, quota-aware caching, and optional download/export links that respect platform terms and copyright.

## Security and reliability

- Restrict the API key to the minimum Google APIs and environments required.
- Add rate limiting before exposing the endpoint to significant traffic.
- Avoid leaking detailed upstream errors to public clients.
- Review CORS if the API should only serve one frontend origin.
- Never treat an external video result as trusted HTML.
- Respect YouTube's terms, creator rights, and copyright when reusing source material.

## Topics and tags

`youtube-api` · `video-editing` · `scene-pack` · `content-creator-tools` · `serverless` · `vercel` · `javascript` · `youtube-search` · `creator-tools` · `api-proxy`

## Suggested GitHub About description

> Scene-pack search tool for video editors and creators, using a server-side YouTube API proxy so searches stay simple and API credentials stay out of the browser.

<p align="center"><sub>Built to make the boring part of editing—finding the right source clips—faster.</sub></p>
