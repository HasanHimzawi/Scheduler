# Chronos - AI-Powered Event Scheduler

A modern, feature-rich event scheduling application built with React, featuring AI-powered event creation, analytics, and a beautiful glassmorphism UI.

## Features

### Core Functionality
- **Event Management**: Create, edit, and delete events with ease
- **Calendar Views**: Multiple viewing options including calendar grid and list views
- **Event Categories**: Organize events by type (Meeting, Social, Health, Education, Personal)
- **Invitations System**: Send and manage event invitations with RSVP tracking
- **Multi-user Support**: Switch between different demo users (Hasan, Sarah, Alex)

### AI Features
- **AI Quick Create**: Describe your event in plain English and it will be parsed automatically
  - Example: "Lunch with Sarah next Friday at 12:30 at Café Hamra"
  - Automatically extracts: title, date, time, location, and category
- **AI Suggestions**: Get intelligent recommendations based on your event patterns
  - Work-life balance analysis
  - Busy week detection
  - Personalized scheduling tips

### Analytics Dashboard
- **Event Statistics**: Track total events, upcoming events, and event distribution
- **Visual Charts**: 
  - Category distribution (Pie Chart)
  - Monthly trends (Line Chart)
  - Weekly activity (Bar Chart)
  - Hourly heatmap (Area Chart)
- **Custom Date Range**: Filter analytics by specific date ranges

### User Interface
- Beautiful gradient backgrounds with glassmorphism effects
- Responsive design that fills the viewport
- Smooth animations and transitions
- Toast notifications for user feedback
- Modal dialogs for event details and forms

## Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HasanHimzawi/Scheduler.git
   cd Scheduler
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:5173/`
   - The application will automatically reload when you make changes to the code

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## How to Use

### Getting Started
1. **Login**: Select a user from the login screen (Hasan, Sarah, or Alex)
2. **Dashboard**: View your upcoming events and quick statistics
3. **Navigation**: Use the sidebar to switch between different views

### Creating Events

#### Manual Creation
1. Click the **"+ New Event"** button
2. Fill in the event details:
   - Title
   - Date and time
   - Location
   - Category
   - Invitees
3. Click **"Create Event"**

#### AI Quick Create
1. Go to the **Dashboard** view
2. Find the **"AI Quick Create"** section
3. Type a natural language description, e.g.:
   - "Team meeting tomorrow at 2pm"
   - "Lunch with Sarah next Friday at 12:30 at Café Hamra"
   - "Gym workout on Monday at 6am"
4. Press **Enter** or click the purple button
5. The event will be automatically created with extracted details

### Managing Events

#### Viewing Events
- **Dashboard**: See upcoming events in a list view
- **Calendar**: View events in a monthly calendar grid
- **Events**: See all your events in a detailed list

#### Editing Events
1. Click on any event card
2. Modify the details in the modal
3. Click **"Save Changes"**

#### Deleting Events
1. Click on the event card to open the modal
2. Click the **"Delete Event"** button
3. Confirm the deletion

### Invitations

#### Sending Invitations
1. When creating or editing an event, add invitees from the dropdown
2. Selected users will receive an invitation

#### Managing Invitations
1. Go to the **"Invitations"** view
2. See all pending invitations
3. Accept or decline each invitation

### Analytics
1. Navigate to the **"Analytics"** view
2. View comprehensive statistics about your events
3. Use the date range filters to analyze specific periods
4. Explore different charts:
   - Category breakdown
   - Monthly activity trends
   - Weekly patterns
   - Hourly distribution

### AI Suggestions
1. On the Dashboard, check the **"AI Suggestions"** section
2. View personalized recommendations based on your schedule
3. Get insights about work-life balance and busy periods

## Technology Stack

- **React 18+**: Modern UI library with hooks
- **Vite**: Fast build tool and dev server
- **Recharts**: Data visualization library for analytics
- **Lucide React**: Icon library for beautiful UI elements
- **ESLint**: Code quality and consistency

## Project Structure

```
Scheduler/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Additional styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Features Overview

### Event Categories
- 🔵 **Meeting**: Work meetings, calls, standups
- 🟢 **Social**: Lunch, dinner, coffee, parties
- 🔴 **Health**: Gym, workouts, exercise
- 🟡 **Education**: Classes, study sessions, workshops
- 🟣 **Personal**: General personal events

### Data Persistence
- Events are stored in browser's LocalStorage
- Data persists across sessions
- Per-user data isolation

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port.

### Application Not Loading
1. Clear browser cache and LocalStorage
2. Restart the development server
3. Check the browser console for errors

### Events Not Saving
1. Ensure LocalStorage is enabled in your browser
2. Check if you have sufficient storage space
3. Try clearing old data and refreshing

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for educational and demonstration purposes.

---

Built with ❤️ using React and Vite
