# MindSpace - Student Wellbeing Platform

<div align="center">

![MindSpace Logo](https://img.shields.io/badge/MindSpace-Mental_Health-0ea5e9?style=for-the-badge)

**A privacy-first, AI-powered mental wellbeing platform designed exclusively for students in India**

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Architecture](#architecture)

</div>

---

## 🌟 Overview

MindSpace is a world-class student mental wellbeing platform that combines **AI-powered emotional support** with **privacy-first design**. Built specifically for Indian students, it provides:

- 24/7 AI chatbot with emotion detection & crisis intervention
- Mood & stress tracking with beautiful visualizations
- Private journaling with guided prompts
- Evidence-based coping strategies
- India-specific mental health resources
- Anonymous teacher dashboards for class-level insights

## ✨ Features

### For Students

#### 🤖 **AI Emotional Support Chatbot**
- Real-time emotion detection (anxiety, sadness, anger, happiness, tiredness)
- Crisis keyword detection with immediate helpline suggestions
- Contextual responses based on emotional state
- Automatic mood tracking from conversations
- Complete chat history persistence

#### 📊 **Mood & Stress Tracking**
- Daily mood check-ins (Great, Good, Okay, Low, Struggling)
- Stress level slider (0-10 scale) with visual feedback
- **Calendar view** with color-coded mood visualization
- Timeline view showing emotional journey
- Empty states encouraging engagement

#### 📈 **Insights & Analytics**
- Mood distribution pie chart
- Stress trend line graphs
- Stress source analysis
- AI-generated personalized insights
- Week/month toggle for different time ranges

#### 📔 **Private Journal**
- Secure, encrypted-style journaling
- 5 guided prompts to spark reflection
- **Search functionality** to find past entries
- Chronological timeline view
- Toast notifications on save

#### 🎯 **Guidance & Goals**
- 12 evidence-based coping strategies across 3 categories
- Weekly goal checklist (6 goals)
- Celebration toast when all goals completed
- Personalized tips based on mood patterns

#### 🆘 **Resources**
- **India-specific emergency helplines**:
  - National Emergency: **112**
  - KIRAN Mental Health Helpline: **1800-599-0019**
  - Vandrevala Foundation: **9999 666 555**
- **Mental health resources**:
  - **RVCE Cadabam's: 097414 76476** (highlighted as 24/7 support)
  - iCall: **9152987821**
  - MPower Helpline: **1800-120-820050**
- "When to seek help" guidance

#### 👤 **Profile Management**
- Account settings with email/password update
- **Data export** (download all user data as JSON)
- **Delete all data** with confirmation (danger zone)
- Privacy controls

#### 🎓 **Onboarding Tutorial**
- 4-step welcome modal for new users
- Explains key features (Chat, Track, Privacy)
- Shows only once per user
- Smooth animations with progress dots

### For Teachers

#### 📊 **Anonymous Class Dashboard**
- Aggregated mood distribution across all students
- Average stress levels by day of week
- High-stress student count (>7/10) without individual identification
- Real-time data from all student users
- Privacy notices prominently displayed
- Recommendations for class wellbeing

**Security Features**:
- Teacher accounts **must be created by administrators** via `/admin` panel
- Frontend validation prevents teacher signup misuse
- Role-based access control
- No individual student data accessible

### For Administrators

#### 🛡️ **Admin Panel** (`/admin`)
- Secure access with admin key: `mindspace_admin_2024`
- Create teacher accounts with school/institution ID
- View all existing teacher accounts
- Default password: `teacher123` (must be changed on first login)
- Security warnings and best practices

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mindspace.git
cd mindspace
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:3000`

---

## 📖 Usage

### Student Quick Start

1. **Sign Up**: Go to `/auth` and create an account (or use anonymous mode)
2. **Dashboard**: Check in with your mood and stress level
3. **Chat**: Talk to the AI chatbot about how you're feeling
4. **Track**: View your mood history in timeline or calendar view
5. **Insights**: See patterns and trends in your emotional wellbeing
6. **Journal**: Write private reflections with guided prompts
7. **Resources**: Access emergency helplines and mental health services

### Teacher Quick Start

1. **Get Account**: Contact administrator to create teacher account
2. **Login**: Use provided credentials at `/auth`
3. **Dashboard**: Access `/teacher-dashboard` to view class insights
4. **Monitor**: See aggregated mood and stress patterns
5. **Respond**: Use recommendations to support class wellbeing

### Administrator Quick Start

1. **Access Panel**: Navigate to `/admin`
2. **Authenticate**: Enter admin key: `mindspace_admin_2024`
3. **Create Teachers**: Fill in teacher details and school ID
4. **Manage**: View all existing teacher accounts

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18.2 | UI library with hooks |
| **Build Tool** | Vite 5.0 | Fast development and building |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **Animations** | Framer Motion 10.16 | Smooth page transitions |
| **Charts** | Recharts 2.10 | Data visualization |
| **Icons** | Lucide React 0.303 | Beautiful icon set |
| **Routing** | React Router 6.21 | Client-side routing |
| **Storage** | localStorage | Demo persistence (Supabase-ready) |

### File Structure

```
mindspace/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx         # Main navigation bar
│   │   ├── Toast.jsx              # Toast notification system
│   │   ├── LoadingSpinner.jsx     # Loading states
│   │   └── OnboardingModal.jsx    # First-time user tutorial
│   ├── pages/
│   │   ├── LandingPage.jsx        # Marketing homepage
│   │   ├── AuthPage.jsx           # Login/signup with security
│   │   ├── StudentDashboard.jsx   # Main student hub
│   │   ├── ChatbotPage.jsx        # AI emotional support
│   │   ├── MoodTrackingPage.jsx   # Timeline mood view
│   │   ├── MoodCalendar.jsx       # Calendar mood view
│   │   ├── InsightsPage.jsx       # Charts and analytics
│   │   ├── JournalPage.jsx        # Private journaling
│   │   ├── GuidancePage.jsx       # Coping strategies
│   │   ├── ResourcesPage.jsx      # India helplines
│   │   ├── TeacherDashboard.jsx   # Aggregated class data
│   │   ├── FeedbackPage.jsx       # User feedback
│   │   ├── AboutPage.jsx          # Mission and privacy policy
│   │   ├── ProfilePage.jsx        # Account settings
│   │   └── AdminPanel.jsx         # Teacher account management
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Key Features Implemented

✅ **Core Functionality**
- All 12 pages fully functional
- AI chatbot with emotion detection and crisis handling
- Real user data tracking (no mock data)
- Chat history persistence and loading
- Mood and stress tracking with day-indexed history
- Insights with real data visualization
- Private journaling with search
- Teacher dashboard with privacy protection
- Teacher signup prevention in frontend

✅ **Enhanced Features**
- Toast notification system across app
- Loading spinner component
- Profile page with data export/delete
- Stress level slider on dashboard (0-10)
- Onboarding welcome modal for new users
- Calendar view for mood visualization
- Admin panel for teacher account management
- Real-time teacher dashboard aggregation
- Enhanced authentication with createdAt timestamps
- Journal search functionality
- Goal completion celebrations

---

## 🎨 Design System

### Colors

```javascript
// Primary (Sky Blue)
primary-50: #f0f9ff
primary-100: #e0f2fe
primary-500: #0ea5e9  // Main brand color
primary-600: #0284c7
primary-700: #0369a1

// Mood Colors
Great: #4ade80 (green-400)
Good: #3b82f6 (blue-500)
Okay: #fbbf24 (yellow-400)
Low: #fb923c (orange-400)
Struggling: #ef4444 (red-500)
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: font-medium (500 weight)
- **Body**: text-gray-600 with 1.5-1.75 line-height

---

## 🔒 Privacy & Security

### Data Storage

- **Local-First**: All user data stored in browser localStorage
- **No Server Tracking**: No personal data sent to external servers (demo mode)
- **User Control**: Full data export and deletion capabilities
- **Anonymous Options**: Students can use platform without email

### Teacher Privacy

- **Aggregated Only**: Teachers see class-level statistics only
- **No Individual Access**: Cannot view specific student data
- **Role Separation**: Teacher accounts separate from student accounts
- **Admin-Created**: Prevents unauthorized teacher signup

---

## 📱 Responsive Design

- **Mobile-First**: Optimized for phones (320px+)
- **Tablet**: Breakpoint at 768px
- **Desktop**: Full experience at 1024px+
- **Mobile Menu**: Hamburger navigation for small screens

---

## 🚦 Roadmap

### Phase 1: Core Features ✅ (Complete)
- [x] AI Chatbot with emotion detection
- [x] Mood & stress tracking
- [x] Insights & analytics
- [x] Private journaling
- [x] India-based resources
- [x] Teacher dashboard
- [x] Profile management
- [x] Toast notifications
- [x] Onboarding tutorial
- [x] Calendar view
- [x] Admin panel

### Phase 2: Backend Integration (Next)
- [ ] Supabase setup for persistent storage
- [ ] User authentication with JWT
- [ ] Real-time database sync
- [ ] Push notifications

### Phase 3: AI Enhancement
- [ ] Integrate Hugging Face API for better NLP
- [ ] Google Gemini for advanced conversations
- [ ] Sentiment analysis on journal entries
- [ ] Predictive wellbeing alerts

### Phase 4: Advanced Features
- [ ] Peer support groups (anonymous)
- [ ] Meditation & breathing exercises
- [ ] Dark mode toggle
- [ ] Multi-language support (Hindi, Tamil, etc.)

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- **Helplines**: KIRAN, Vandrevala Foundation, RVCE Cadabam's, iCall, MPower
- **Icons**: Lucide React icon library
- **Fonts**: Inter by Rasmus Andersson

---

## 📞 Support

### For Students
- Browse [Resources](/resources) for helplines
- Emergency: Call **112** or **KIRAN 1800-599-0019**

### For Schools/Institutions
- Request admin access for teacher accounts

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy!

### Netlify

1. Connect GitHub repository
2. Build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

---

<div align="center">

**Made with ❤️ for student mental wellbeing**

</div>
