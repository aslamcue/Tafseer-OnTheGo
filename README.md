# Tafseer-OnTheGo

> A modern, interactive Quran study platform featuring AI audio, deep-dive podcasts, and seamless Tafseer integration.

![Tafseer OnTheGo](https://github.com/user-attachments/assets/513f2568-9d31-4a3c-8b26-a2ea637f408b)

## ✨ Features

- 🎧 **Interactive Audio Player** - Arabic recitation with translation and tafseer
- 🎙️ **AI-Powered Podcasts** - Deep-dive explanations of surahs
- 📖 **Tafseer Ibn Kathir** - Comprehensive verse-by-verse explanations
- 🔍 **Smart Search** - Find surahs by name, number, or English translation
- ⌨️ **Keyboard Shortcuts** - Navigate efficiently with hotkeys
- 💾 **Persistent Storage** - Save your favorite verses locally
- 🎨 **Modern UI/UX** - Beautiful glass-morphism design with smooth animations
- ♿ **Accessibility First** - ARIA labels, keyboard navigation, and proper focus management
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/aslamcue/Tafseer-OnTheGo.git

# Navigate to the project directory
cd Tafseer-OnTheGo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aslamcue/Tafseer-OnTheGo)

### Manual Deploy

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Configuration

The project includes a `vercel.json` configuration file that:
- Sets up Vite as the build framework
- Configures SPA routing (all routes redirect to index.html)
- Optimizes static asset caching (1 year cache for /assets/*)

No additional configuration is needed!

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Previous verse |
| `→` | Next verse |
| `M` | Mute/Unmute |
| `F` | Toggle favorite (current verse) |
| `Escape` | Close modals/panels |

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, BottomNav)
│   ├── player/          # Audio player components
│   ├── verse/           # Verse display components
│   ├── common/          # Reusable UI components
│   └── ui/              # UI primitives
├── hooks/               # Custom React hooks
│   ├── useAudioPlayer.js
│   ├── useSurahData.js
│   ├── useLocalStorage.js
│   └── useKeyboardShortcuts.js
├── constants/           # App configuration
├── utils/               # Utility functions
├── styles/              # CSS files
└── App.jsx              # Main app component
```

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **APIs:** 
  - AlQuran.cloud (Arabic text and audio)
  - Quran.com (Translations and Tafseer)
- **Deployment:** Vercel

## 🎨 Customization

### Adding OpenAI Voice (Optional)

To enable AI-powered text-to-speech:

1. Open `src/constants/translations.js`
2. Replace `YOUR_OPENAI_KEY_HERE` with your OpenAI API key
3. The app will automatically use OpenAI TTS for translations and tafseer

Without an API key, the app uses the browser's built-in speech synthesis.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Quran text from AlQuran.cloud
- Translations from Quran.com
- Tafseer Ibn Kathir from Quran.com
- Icons by Lucide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
