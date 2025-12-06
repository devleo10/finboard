# Finance Dashboard

A customizable Finance Dashboard where users can build their own real-time finance monitoring dashboard by connecting to various financial APIs and displaying real-time data through customizable widgets.

## Features

- **Widget Management**: Create, edit, and delete widgets
- **Multiple Display Modes**: Card, Table, and Chart views
- **Drag & Drop**: Rearrange widgets with intuitive drag-and-drop
- **Real-time Updates**: Configurable refresh intervals for each widget
- **API Integration**: Connect to any financial API endpoint
- **Field Selection**: Interactive field explorer to select specific data fields
- **Data Persistence**: All configurations saved to localStorage
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit/core
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding a Widget

1. Click the "+ Add Widget" button
2. Enter a widget name (e.g., "Bitcoin Price Tracker")
3. Enter an API URL (e.g., `https://api.coinbase.com/v2/exchange-rates?currency=BTC`)
4. Click "Test" to verify the API connection
5. Select a display mode (Card, Table, or Chart)
6. Choose fields to display from the available fields list
7. Set the refresh interval (in seconds)
8. Click "Add Widget"

### Widget Types

- **Card Widget**: Displays key-value pairs in a card format
- **Table Widget**: Shows data in a paginated, searchable, sortable table
- **Chart Widget**: Visualizes data as a line chart

### Managing Widgets

- **Refresh**: Click the refresh icon to manually update widget data
- **Settings**: Click the settings icon to edit widget configuration
- **Delete**: Click the delete icon to remove a widget
- **Reorder**: Drag widgets by the grip handle to rearrange them

## API Examples

### Coinbase API
```
https://api.coinbase.com/v2/exchange-rates?currency=BTC
```

### Alpha Vantage (requires API key)
```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── widgets/           # Widget components
│   ├── modals/            # Modal components
│   └── ui/                # Reusable UI components
├── store/                 # Zustand store
├── services/              # API and storage services
├── hooks/                # Custom React hooks
└── utils/                # Utility functions
```

## Building for Production

```bash
npm run build
npm start
```

## Notes

- API responses are cached for 30 seconds to reduce redundant requests
- Widget configurations are automatically saved to localStorage
- Some APIs may require CORS proxy for browser access
- Rate limits are handled gracefully with user-friendly error messages

## License

MIT


