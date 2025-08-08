# POC Journey - UX Journey Simulation & Analysis

## Project Overview
This is a Proof of Concept (PoC) project for automated user journey analysis. The system:

1. **Reads journey specifications** from markdown files (app URL, user credentials, journey steps)
2. **Simulates user journeys** using browser automation with screenshots and UX data collection
3. **Analyzes UX data** using AI-powered tools to generate insights and improvement suggestions

## Project Scope
Build a simple, affordable solution to demonstrate automated UX journey analysis capabilities.

## Tech Stack
- **Runtime**: Node.js with TypeScript for type safety
- **Validation**: Zod for schema validation
- **AI**: Hugging Face for UX analysis
- **Storage**: File-based (markdown, JSON, screenshots) - no database required yet
- **Browser Automation**: TBD (Playwright/Puppeteer)

## How to Build This Project

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended package manager)
- Install pnpm: `npm install -g pnpm`

### Initial Setup
```bash
# Initialize package.json if not exists
pnpm init

# Install TypeScript and development dependencies
pnpm add -D typescript @types/node ts-node nodemon

# Install core dependencies
pnpm add zod

# Install browser automation (choose one)
pnpm add playwright
# OR
pnpm add puppeteer

# Install AI/ML dependencies
pnpm add @huggingface/inference
```

### Project Structure
```
poc-journey/
├── src/
│   ├── types/           # TypeScript types and Zod schemas
│   ├── journey/         # Journey specification parsing
│   ├── browser/         # Browser automation logic
│   ├── analysis/        # AI-powered UX analysis
│   └── index.ts         # Main entry point
├── data/
│   ├── journeys/        # Journey specification markdown files
│   ├── screenshots/     # Captured screenshots
│   └── reports/         # Generated UX reports
├── package.json
└── tsconfig.json
```

### Configuration Files

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### package.json scripts
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --exec ts-node src/index.ts",
    "start": "node dist/index.js",
    "lint": "tsc --noEmit",
    "typecheck": "tsc --noEmit",
  }
}
```

#### .prettierrc.json
```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all"
}
```

#### .prettierignore
```
node_modules/
dist/
*.md
```

### Development Commands
```bash
# Install dependencies
pnpm install

# Development with auto-reload
pnpm run dev

# Type checking
pnpm run typecheck

# Build for production
pnpm run build

# Run built version
pnpm start
```

### Core Implementation Steps
1. Create Zod schemas for journey specifications
2. Build markdown parser for journey files
3. Implement browser automation for user simulation
4. Add screenshot and UX data collection
5. Integrate Hugging Face for UX analysis
6. Create report generation system

### Environment Variables
Create `.env` file for:
- `HUGGINGFACE_API_KEY` - For AI analysis
- `BROWSER_HEADLESS` - Browser visibility setting
- `SCREENSHOTS_DIR` - Screenshots storage path
