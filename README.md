# Opolis - Web Edition

A web-based implementation of Button Shy Games' city-building card games, including Sprawlopolis, Agropolis, and Casinopolis.

## 🎮 Game Overview

Build your city by strategically placing cards on a grid. Each card contains 4 cells (2x2) with different zone types and road networks. The challenge is to create an efficient, well-connected city while maximizing your score.

### Features

- **Grid-based card placement** with strict placement rules
- **Multiple zone types**: Residential, Commercial, Industrial, and Parks
- **Road networks** that overlay cells and must connect properly
- **180° card rotation** for strategic placement
- **Zoom and pan controls** for navigating large cities
- **Full-screen gameplay** with intuitive controls

## 🎯 How to Play

1. **Draw a card** - Click "Draw Card" to get your next card
2. **Rotate if needed** - Press 'R' or click the Rotate button to rotate 180°
3. **Place the card** - Click on the grid to place your card
4. **Follow placement rules**:
   - Cards must touch edge-to-edge or overlap existing cards
   - Cards cannot connect only at corners
   - New cards can overlap on top of existing ones
   - Cards cannot be tucked under existing cards

### Controls

- **Mouse drag**: Pan around the game board
- **Ctrl + Scroll**: Zoom in/out
- **Pinch**: Zoom on touch devices
- **R key**: Rotate current card
- **Click**: Place card at cursor position

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/opolis.git
cd opolis

# Install dependencies
npm install
```

### Running the Development Server

```bash
npm run dev
```

The game will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## 🏗️ Technical Stack

- **Framework**: [Vike](https://vike.dev) (React-based SSR framework)
- **UI**: React with TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: HTML5 Canvas for game graphics
- **State Management**: React hooks

## 📁 Project Structure

```
├── pages/
│   ├── index/          # Home page
│   ├── about/          # About the games
│   └── play/           # Game page
├── components/
│   └── GameCanvas.tsx  # Main game component
├── layouts/
│   └── LayoutDefault.tsx # App layout with navigation
└── public/             # Static assets
```

## 🎨 Game Components

### Card Structure
Each card consists of:
- **4 cells** arranged in a 2x2 grid
- **Zone types** for each cell (residential, commercial, industrial, park)
- **Road segments** that connect cell edges

### Road System
Roads are not cell types but segments that overlay cells:
- Can be straight (connecting opposite edges)
- Can turn (connecting adjacent edges)
- Typically don't terminate within a card
- Each card has at least one road segment

## 🔄 Future Enhancements

- [ ] Scoring system implementation
- [ ] Multiple game modes (Sprawlopolis, Agropolis, Casinopolis)
- [ ] Challenge cards with unique scoring conditions
- [ ] Save/load game functionality
- [ ] Multiplayer support
- [ ] Achievement system
- [ ] Tutorial mode

## 📝 License

This is a fan-made web adaptation. The original Opolis games are created and owned by [Button Shy Games](https://buttonshygames.com/).

## 🙏 Acknowledgments

- Button Shy Games for creating the amazing Opolis series
- The board game community for inspiration and feedback