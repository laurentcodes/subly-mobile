# Subly Mobile

A modern subscription management app built with React Native and Expo. Track, manage, and analyze all your subscriptions in one place.

## Features

- **Subscription Tracking** - Keep track of all your active subscriptions
- **Smart Analytics** - View spending patterns and statistics
- **Payment Reminders** - Get notified about upcoming payments
- **Multi-Currency Support** - Track subscriptions in different currencies
- **Dark Mode** - Beautiful pastel themes with dark mode support
- **Secure Authentication** - Protected with modern auth using Better Auth

## Tech Stack

- **React Native** - Built with Expo 54
- **HeroUI Native** - Modern UI component library
- **NativeWind** - Tailwind CSS for React Native
- **Better Auth** - Authentication and authorization
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/laurentcodes/subly-mobile.git
   cd subly-mobile
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the root directory:

   ```env
   # Add your environment variables here
   API_URL=your_api_url
   ```

4. Start the development server

   ```bash
   npx expo start
   ```

5. Run on your device
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
subly-mobile/
├── app/                    # App screens and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   └── (general)/         # General screens
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── home/             # Home screen components
│   └── statistics/       # Statistics components
├── contexts/             # React contexts
├── services/             # API services
├── utils/                # Utility functions
├── themes/               # Theme configurations
└── assets/               # Images and fonts

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Contact

For questions or support, please contact the development team.
