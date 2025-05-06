## Overview

This is an online video editor built with nextjs, remotion for real-time preview and ffmpeg (web assembly port) for high-quality render.

## Features

- 🎞️ Real-time Preview: See immediate previews of edits.
- 🧰 Render with ffmpeg (web assembly port) with various options supports up to 1080p export.
- 🕹️ Interactive Timeline Editor: Precisely arrange, trim, and control media through a custom-built timeline.
- ✂️ Element Utilities: Easily split, duplicate, and manage individual media layers.
- 🖼️ Flexible Media Support: Import and mix videos, audio tracks, images, and text elements seamlessly.
- 🛠️ Advanced Element Controls: Adjust properties like position, opacity, z-index and volume per element.

![Alt Text](/images/image.png)

## Installation

Clone the repo, install dependencies, and run the dev server:

```bash
npm install

npm run dev
```

Then navigate to [http://localhost:3000](http://localhost:3000)

## TODOs

Prioritized tasks contributions are welcomed!

- [x] render option with ffmpeg (web assembly port).
- [x] add various font types
- [x] option for marker to be tracked or not.
- [x] add zoom in out for timeline **(ui)**
- [x] duplicate and split for each element on timeline
- [x] bug with duplicated and split elements
- [x] z-index bug with timeline elements
- [x] elements and timeline names bug
- [x] font is bold in render bug
- [x] change error and not found pages style
- [x] add toasts **(ui)**
- [ ] Allow changing the playback time not only through the built-in Remotion player but also via the custom timeline.**(ui)**
- [ ] add loading to each page 
- [ ] enhance seo
- [ ] shortcuts
	- [ ] space
	- [ ] ctrl + z
	- [ ] ctrl + c
	- [ ] ctrl + x
	- [ ] del split duplicate
	- [ ] etc 
- [ ] handle left resize in timeline elements
- [ ] functionality to separate audio from vids
- [ ] progress bar when rendering but ffmpeg on progress gave inconsistent results (need investigation)
- [ ] add playback speed for vids and audio
- [ ] add close option to each sidebars **(ui)**
- [ ] responsive for phones **(ui)**
- [ ] Refactor timeline components cause it has a lot of repetitive code.
- [ ] add elements as shapes blur effects.
- [ ] add crop feature to vids with react-moveable and make positioning with it too
- [ ] more effects for text
- [ ] PWA Mode: So users can edit offline.
- [ ] insert elements in timeline with https://www.npmjs.com/package/react-moveable (already used in timelines) **(ui)**
- [ ] thumbnail for listed vids and imgs **(ui)**
- [ ] migrate to WebGL or WebGpu or a library that work on it like https://github.com/diffusionstudio/core

There are also other various TODOS across the project (search with TODO)