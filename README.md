# DropCard - AI-Powered Digital Business Card App

DropCard is a modern, AI-powered digital business card application built with React Native (Expo) that allows users to create digital business cards, scan physical cards with OCR, and manage contacts seamlessly.

## 🚀 Features

- **Digital Business Cards**: Create and customize professional digital business cards
- **QR Code Sharing**: Generate QR codes for instant contact sharing
- **Business Card OCR**: Scan and extract information from physical business cards using AI
- **Contact Management**: Organize and manage your professional network
- **Cross-Platform**: Built with React Native for iOS and Android

## 📱 Live App

✅ **Successfully deployed to TestFlight** - The app is currently live and available for beta testing on iOS.

## 🛠 Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Navigation**: React Navigation v6
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **AI Integration**: OpenAI API (for business card OCR)
- **Development Target**: iOS (TestFlight ready)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sirakinb/drop-card-app.git
   cd drop-card-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### API Keys Setup

The app requires API keys for full functionality:

1. **OpenAI API Key**: Required for business card OCR functionality
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add it to your `.env` file as `EXPO_PUBLIC_OPENAI_API_KEY`

2. **Supabase Keys**: Required for backend functionality
   - Create a project at [Supabase](https://supabase.com)
   - Add your URL and anon key to the `.env` file

### Development vs Production

- **Development**: API keys can be hardcoded in `src/services/ai.js` for testing
- **Production**: Use environment variables (recommended)

## 📂 Project Structure

```
drop-card-app/
├── App.js                 # Main app entry point
├── src/
│   ├── screens/          # App screens
│   │   ├── auth/         # Authentication screens
│   │   ├── main/         # Main app screens
│   │   └── SplashScreen.js
│   ├── components/       # Reusable components
│   ├── services/         # API and service layers
│   ├── contexts/         # React contexts
│   └── navigation/       # Navigation configuration
├── assets/              # Images, fonts, etc.
├── ios/                # iOS-specific files
└── package.json
```

## 🔐 Security

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use `.env` files for sensitive data
- **Supabase RLS**: Row Level Security enabled for all tables

## 🚀 Deployment

### TestFlight (iOS)

The app is configured for TestFlight deployment:

1. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

2. **Submit to TestFlight**
   ```bash
   eas submit --platform ios
   ```

### Development Build

For development testing:

```bash
npx expo run:ios
```

## 📋 Current Status

- ✅ Core app functionality implemented
- ✅ Business card creation and management
- ✅ QR code generation and sharing
- ✅ Business card OCR with OpenAI
- ✅ User authentication and profiles
- ✅ Successfully deployed to TestFlight
- ✅ iOS simulator testing complete

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Links

- [TestFlight Beta](https://testflight.apple.com) - Contact for beta access
- [GitHub Repository](https://github.com/sirakinb/drop-card-app)

---

**Note**: This is a working production app currently in TestFlight beta. For development setup questions or beta access, please open an issue. 