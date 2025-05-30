# 8BB

A web-based 8-bit music creation and editing tool built with React, TypeScript, and Vite.

## Overview

8BB (8-Bit Builder) is a modern web application that allows users to create, edit, and export 8-bit tunes. Inspired by the tune builder from the Animal Crossing series, 8BB offers an intuitive and playful way to compose your own melodies. This little musical toy sparked a love for music and composition in many kids, and 8BB aims to keep that spark alive in a more flexible, digital format.

## Features

- Grid-based staff interface for easy composition
- Interactive note placement with click and drag functionality
- Support for rests and slurs
- Customizable composition length and pitch range
- Tempo control for playback speed adjustment
- Share functionality to generate links to your tunes
- Play and Clear controls for composition management

## How to Use

The main interface is the grid-based staff where:
- Each column represents a beat
- Each row corresponds to a pitch
- Click or drag up and down to change the pitch of each note
- The bottom row is a rest (no sound)
- The second-to-last row is a slur, which extends the previous note

You can:
- Add more columns (notes) or rows (pitches) using the + and – buttons
- Press Clear to reset the composition
- Press Play to hear your song
- Use the tempo slider to adjust playback speed
- Hit Share to generate a link to your tune

## Project Structure

```
eightmidi/
├── src/           # Source code
│   ├── components/  # React components
│   └── images/     # Static images
├── public/        # Static assets
├── node_modules/  # Dependencies
└── ...           # Configuration files
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd eightmidi
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development

The project is built with:
- React
- TypeScript
- Vite
- ESLint for code quality

## TODO

- [ ] Add support for more voices/instruments
- [ ] Implement MIDI export functionality
- [ ] Implement WAV export functionality
