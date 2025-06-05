# Budgeting API

A simple, clean, and modular budgeting API built with Express.js and SQLite.

## Prerequisites

- Node.js (v18.x or later)
- pnpm (v8.x or later)

## Installation

1. Install pnpm globally (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd budgeting-api
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   DB_PATH=./data/budget.db
   ENCRYPTION_KEY=your-secure-key-here
   ```

5. Create the data directory:
   ```bash
   mkdir data
   ```

## Project Structure

```
budgeting-api/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── app.js          # Main application file
├── tests/              # Test files
├── docs/               # Documentation
├── public/             # Static files
└── data/              # Database files
```

## Development

Start the development server:
```bash
pnpm dev
```

## Testing

Run tests:
```bash
pnpm test
```

## API Documentation

API documentation is available in the `docs` directory.

## License

This project is licensed under the MIT License. 