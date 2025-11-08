# Cloud Database Monitoring Dashboard

A professional, production-ready Next.js web application for monitoring database performance metrics. Built with Next.js (App Router), TypeScript, TailwindCSS, and Apache ECharts.

## Features

- 📊 **Comprehensive Metrics Dashboard**: Visualize all AWS RDS CloudWatch metrics grouped into logical sections
- 🎨 **Modern UI**: Clean, cloud-console-like interface with dark/light mode support
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Charts**: Interactive ECharts line charts with smooth animations
- 🔄 **Mock API**: Ready-to-replace API endpoint for easy integration with real CloudWatch API
- ♿ **Accessible**: Semantic HTML and ARIA labels for better accessibility

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **ECharts** (via echarts-for-react)
- **next-themes** (for dark mode)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── layout.tsx          # Root layout with theme provider
  ├── page.tsx            # Main dashboard page
  ├── components/         # Reusable React components
  │   ├── Chart.tsx       # ECharts wrapper component
  │   ├── MetricCard.tsx  # Individual metric card
  │   ├── SectionHeader.tsx
  │   ├── Navbar.tsx
  │   ├── ThemeToggle.tsx
  │   ├── SummaryCard.tsx
  │   └── LoadingSkeleton.tsx
  ├── data/
  │   └── metrics.json    # Mock metrics data
  ├── lib/
  │   └── types.ts        # TypeScript interfaces
  ├── api/
  │   └── metrics/
  │       └── route.ts    # API endpoint for metrics
  ├── providers/
  │   └── ThemeProvider.tsx
  └── styles/
      └── globals.css
```

## Dashboard Sections

### Overview
- CPUUtilization
- FreeableMemory
- FreeStorageSpace
- DatabaseConnections

### Performance
- DBLoad
- ReadLatency
- WriteLatency
- DiskQueueDepth
- TotalIOPS

### Resource
- CPUCreditBalance
- SwapUsage
- TransactionLogsDiskUsage

### Replication & Backup
- OldestReplicationSlotLag
- TransactionLogsGeneration

### Network
- NetworkReceiveThroughput
- NetworkTransmitThroughput

## Integration with Real CloudWatch API

To integrate with the real AWS CloudWatch API:

1. Replace the mock data in `app/data/metrics.json` with API calls
2. Update `app/api/metrics/route.ts` to fetch from CloudWatch
3. Install AWS SDK: `npm install @aws-sdk/client-cloudwatch`
4. Configure AWS credentials and region

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Strict mode enabled

## License

MIT

