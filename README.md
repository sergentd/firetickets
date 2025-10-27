# UI Tools Atelier

![Deploy to Firebase](https://github.com/YOUR_USERNAME/ui-tools-vue/actions/workflows/firebase-deploy.yml/badge.svg)

A collection of interactive web development tools built with Vue 3, featuring a full CI/CD pipeline and Firebase integration.

## Features

- **Theming Tools**: Color palette generators, gradient builders, CSS shadow generators
- **Reference Guides**: Web development glossary, CSS specificity calculator, UI/UX principles
- **Organization Tools**: Advanced ticketing system with Firebase backend
- **Visualization**: Mind mapping and data visualization tools
- **Skills Assessment**: Interactive skills evaluation system

## Tech Stack

- **Frontend**: Vue 3 + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **State Management**: Pinia
- **Testing**: Vitest + Vue Test Utils
- **CI/CD**: GitHub Actions + Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase CLI (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ui-tools-vue.git
cd ui-tools-vue

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # Lint and fix code
npm run format       # Format code with Prettier
```

## CI/CD Pipeline

This project includes a complete CI/CD pipeline that:

1. ✅ Runs tests with coverage on every push and PR
2. 🏗️ Builds the application for production
3. 🚀 Deploys to Firebase Hosting on main branch
4. 📊 Uploads coverage reports to Codecov

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions.

## Firebase Configuration

The app uses Firebase for:

- **Authentication**: User login and session management
- **Firestore**: Real-time database for ticketing system
- **Hosting**: Production deployment and CDN

### Firestore Collections

- `tickets`: User tickets with status, priority, and metadata
- `users`: User preferences and profile data

## Project Structure

```
ui-tools-vue/
├── frontend/
│   ├── src/
│   │   ├── components/      # Vue components
│   │   ├── services/        # Firebase and API services
│   │   ├── stores/          # Pinia stores
│   │   ├── views/           # Page components
│   │   └── __tests__/       # Test files
│   ├── public/              # Static assets
│   └── dist/                # Build output
├── .github/
│   └── workflows/           # GitHub Actions workflows
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
└── firestore.indexes.json   # Firestore indexes
```

## Testing

Tests are written using Vitest and Vue Test Utils:

```bash
# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage
```

Coverage requirements:
- Lines: 80%
- Functions: 80%
- Branches: 80%

## Deployment

The application is automatically deployed to Firebase Hosting when changes are pushed to the main branch.

**Production URL**: [https://ui-tools-vue.web.app](https://ui-tools-vue.web.app)

For manual deployment:

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with Vue 3 and the amazing Vue ecosystem
- Deployed on Firebase
- CI/CD powered by GitHub Actions