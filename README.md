# Async Race

## Score: \_\_\_/400 pts

## 🚀 Live Demo

**Deployed Application:** [Your Deployment Link Here]

---

## 📖 Project Overview

Async Race is a Single Page Application (SPA) designed to manage a collection of radio-controlled cars and organize drag-racing competitions. The application allows users to create, edit, and delete cars, control their engines, and track race statistics to discover which car is the fastest.

This project was developed as a technical assessment, recreating functionality based on demo requirements and using a provided server mock for backend operations.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18+ with TypeScript
- **State Management:** Redux Toolkit
- **Styling:** CSS3 with modern features
- **Build Tool:** Vite/Create React App
- **Code Quality:** ESLint (Airbnb config) + Prettier
- **API Communication:** Fetch API with async/await

## 🎯 Key Features

### 🚗 Garage Management

- Create cars with custom names and colors
- Edit existing car attributes
- Delete cars from the collection
- Generate 100 random cars with one click
- Pagination (7 cars per page)
- Responsive design for screens as small as 500px

### 🏁 Racing System

- Individual car engine start/stop controls
- Full page race mode for all cars
- Real-time race animations with accurate timing
- Winner detection and announcement
- Race state management and controls

### 🏆 Winners Tracking

- Winners table with comprehensive statistics
- Sortable columns (wins count, best time)
- Pagination (10 winners per page)
- Persistent winner data across sessions

### 🎨 User Experience

- Persistent state between view switches
- Disabled navigation during active races
- Loading states and error handling
- Responsive animations and smooth transitions

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Header/          # Navigation header
│   ├── CarItem/         # Individual car component
│   └── RaceControlPanel/ # Race management controls
├── hooks/               # Custom React hooks
├── store/               # Redux store and slices
│   ├── garageSlice.ts   # Garage state management
│   ├── winnersSlice.ts  # Winners state management
│   ├── uiSlice.ts       # UI state management
│   └── *Thunks.ts       # Async actions
├── services/            # API communication
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone [your-repo-url]
   cd async-race
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the backend server:**

   ```bash
   git clone https://github.com/mikhama/async-race-api.git
   cd async-race-api
   npm install
   npm start
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run format` - Format code with Prettier
- `npm run ci:format` - Check formatting issues

## 📋 Implementation Checklist \_\_\_/400 pts

## 🚀 UI Deployment

- [ ] **Deployment Platform:** Successfully deploy the UI on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or similar service

## ✅ Requirements to Commits and Repository

- [x] **Commit guidelines compliance:** All commits follow Conventional Commits format
- [x] **Checklist included in README.md:** Project checklist included in README.md file
- [x] **Score calculation:** Score calculated and displayed at top of README.md
- [x] **UI Deployment link in README.md:** Deployment link included at top of README.md

## Basic Structure (80 points)

- [ ] **Two Views (10 points):** "Garage" and "Winners" views implemented
- [ ] **Garage View Content (30 points):** Complete garage view with all required sections:
  - [ ] Name of view
  - [ ] Car creation and editing panel
  - [ ] Race control panel
  - [ ] Garage section
- [ ] **Winners View Content (10 points):** Complete winners view with:
  - [ ] Name of view ("Winners")
  - [ ] Winners table
  - [ ] Pagination
- [ ] **Persistent State (30 points):** View state preserved when navigating between views

## Garage View (90 points)

- [ ] **Car Creation And Editing Panel. CRUD Operations (20 points):** Full CRUD operations for cars with name and color attributes
- [ ] **Color Selection (10 points):** RGB color picker with visual feedback
- [ ] **Random Car Creation (20 points):** Generate 100 random cars with varied names and colors
- [ ] **Car Management Buttons (10 points):** Update and delete buttons for each car
- [ ] **Pagination (10 points):** Garage pagination (7 cars per page)
- [ ] **EXTRA POINTS (20 points):**
  - [ ] **Empty Garage:** User-friendly empty state handling
  - [ ] **Empty Garage Page:** Auto-navigation when last car on page is deleted

## 🏆 Winners View (50 points)

- [ ] **Display Winners (15 points):** Winners displayed in table after race completion
- [ ] **Pagination for Winners (10 points):** Winners pagination (10 per page)
- [ ] **Winners Table (15 points):** Complete table with car #, image, name, wins count, best time
- [ ] **Sorting Functionality (10 points):** Sort by wins and time (ascending/descending)

## 🚗 Race (170 points)

- [ ] **Start Engine Animation (20 points):** Engine start with API integration and smooth animation
- [ ] **Stop Engine Animation (20 points):** Engine stop functionality with position reset
- [ ] **Responsive Animation (30 points):** Smooth animations on screens down to 500px
- [ ] **Start Race Button (10 points):** Start race for all cars on current page
- [ ] **Reset Race Button (15 points):** Reset all cars to starting positions
- [ ] **Winner Announcement (5 points):** Display winner message with car name
- [ ] **Button States (20 points):** Proper button enable/disable states during races
- [ ] **Actions during the race (50 points):** Controlled actions during active races

## 🎨 Prettier and ESLint Configuration (10 points)

- [ ] **Prettier Setup (5 points):** Configured with `format` and `ci:format` scripts
- [ ] **ESLint Configuration (5 points):** Airbnb style guide with `lint` script

## 🌟 Overall Code Quality (100 points)

- [ ] **Modular Design:** Clear separation between API, UI, and state management
- [ ] **Function Modularization:** Small, focused functions under 40 lines
- [ ] **Code Duplication and Magic Numbers:** Minimal duplication, no magic values
- [ ] **Readability:** Clear variable and function naming
- [ ] **Extra features:** Custom hooks, modern React patterns
