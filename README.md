## Overview

This is an Online video editor built with nextjs and remotion for real-time preview.

i am currently working on adding rendering option with ffmpeg (web assembly port) tho.

## Features

- Timeline Editing: Arrange and trim media on a visual timeline.
- Media Support: Add videos, audios, images, and text elements with flexibility.
- Multi-track Support: Edit multiple video and audio tracks simultaneously.
- Real-time Preview: See immediate previews of edits.

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

- [ ] render option with ffmpeg (web assembly port).
- [ ] duplicate and split for each element on timeline
- [ ] add playback speed for vids and audio
- [ ] responsive for phones **(ui)**
- [ ] Refactor timeline components cause it has a lot of repetitive code.
- [ ] add elements as shapes blur effects.
- [ ] functionality to separate audio from vids
- [ ] add crop feature to vids with react-moveable and make positioning with it too
- [ ] Remove Remotion built-in player timeline and fully transition to the custom built one for playback and scrubbing. **(ui)**
- [ ] shortcuts
	- [ ] space
	- [ ] ctrl + z
	- [ ] ctrl + c
	- [ ] ctrl + x
	- [ ] del split duplicate
	- [ ] etc 
- [ ] add zoom in out for timeline **(ui)**
- [ ] more effects for text
- [ ] better ui controls for probs section and adding new text **(ui)**
- [ ] PWA Mode: So users can edit offline.
- [ ] meme effects
- [ ] add toasts **(ui)**
- [ ] insert elements in timeline with https://www.npmjs.com/package/react-moveable (already used in timelines) **(ui)**
- [ ] thumbnail for listed vids and imgs **(ui)**
- [ ] add close option to each sidebars **(ui)**
- [ ] migrate to WebGL or WebGpu or a library that work on it like https://github.com/diffusionstudio/core

There are also other various TODOS across the project (search with TODO)