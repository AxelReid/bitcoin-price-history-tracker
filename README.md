# Bitcoin Price Tracker

A full-stack application for tracking and visualizing Bitcoin prices with real-time data collection and historical analysis.

## Features

- **Real-time Bitcoin Price Tracking**: Automatic hourly data collection from Coinbase API
- **Interactive Charts**: Dynamic price visualization with Recharts
- **Flexible Time Periods**: 1 day, 1 week, 1 month, 1 year, and custom date ranges
- **Statistics Dashboard**: Min/Max prices, averages, and percentage changes
- **Responsive Design**: Modern UI with dark/light mode support
- **Dockerized Deployment**: Complete containerization with Docker Compose

## Tech Stack

### Backend
- **NestJS**: Node.js framework with TypeScript
- **Prisma**: Database ORM with SQLite
- **@nestjs/schedule**: Cron job scheduler for data collection
- **Axios**: HTTP client for API requests

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Charting library for data visualization
- **date-fns**: Date manipulation utilities

### Database
- **SQLite**: Lightweight database for data storage

### DevOps
- **Docker & Docker Compose**: Containerization
- **Nginx**: Reverse proxy for frontend

## Project Structure

```
bitcoin-tracker/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── bitcoin/        # Bitcoin module (controller, service)
│   │   ├── prisma/         # Prisma service
│   │   └── main.ts         # Application entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.ts          # API service layer
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Multi-container Docker setup
└── README.md
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd bitcoin-tracker
```

2. Start the application:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Local Development

#### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Bitcoin Price Endpoints
- `GET /bitcoin/prices` - Get price data with optional period/date filters
  - Query parameters: `period`, `startDate`, `endDate`
- `GET /bitcoin/latest` - Get the most recent price
- `GET /bitcoin/stats` - Get statistics for a time period

### Example API Usage
```bash
# Get prices for the last week
curl "http://localhost:4000/bitcoin/prices?period=week"

# Get prices for custom date range
curl "http://localhost:4000/bitcoin/prices?startDate=2024-01-01&endDate=2024-01-31"

# Get current statistics
curl "http://localhost:4000/bitcoin/stats?period=day"
```

## Data Collection

The application automatically collects Bitcoin price data:
- **Frequency**: Every hour via cron job
- **Source**: Coinbase API
- **Storage**: SQLite database
- **Initial Seed**: 365 days of historical data on first run

## Features in Detail

### Time Period Selection
- **Predefined Periods**: Day, Week, Month, Year
- **Custom Date Range**: User-defined start and end dates
- **Quick Filters**: Last 7, 30, 90 days shortcuts

### Statistics Dashboard
- Current price with percentage change
- Period high/low prices
- Average price calculation
- Visual indicators for price movement

### Interactive Charts
- Responsive line chart with zoom and pan
- Hover tooltips with detailed information
- Time-based X-axis with proper formatting
- Price-formatted Y-axis

### Responsive Design
- Mobile-first approach
- Dark/light mode support
- Grid layouts for different screen sizes
- Tailwind CSS for consistent styling

## Environment Variables

### Backend
- `DATABASE_URL`: SQLite database connection string
- `NODE_ENV`: Environment mode (development/production)

### Frontend
- `VITE_API_URL`: Backend API URL for development

## Docker Configuration

The application uses multi-stage Docker builds for optimization:

### Backend Container
- Node.js 18 Alpine base image
- Prisma generation and database migration
-
