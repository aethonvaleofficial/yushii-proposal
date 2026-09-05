# Yushii's Little Universe

## Personalize it

Edit **`src/content.js`**. It is the single source for Yushii's name, DaDDyyy's name, all messages, the exact letter, proposal text, music, kitty easter eggs, future-adventure copy, finale, and the complete memory list.

For real photos, video, or music, create `public/media/`, put the files there, and reference them from `src/content.js` with paths such as `/media/first-memory.jpg` or `/media/our-song.mp3`.

Each memory accepts `title`, `date`, `description`, `image`, `video`, and `accent`. Leave both `image` and `video` blank to retain the designed placeholder. The `media.photos` and `media.videos` arrays are a convenient inventory for supplied files; then assign a path to the relevant memory card.

The letter and cinematic finale in that file are intentionally exact personal copy. Do not edit them unless you explicitly want to change the message.

## Run it

```bash
npm install
npm run dev
```

For a production build, use `npm run build`. You can then open `index.html`
directly from the folder; it launches the self-contained production build.
