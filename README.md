# JOBHUB

**AI-Powered Job Matching Platform**

An intelligent job matching hub that analyzes your resume and connects you with perfect job opportunities using advanced AI algorithms.

## 🚀 Features

- **Smart Resume Analysis**: Upload your PDF resume and get instant skill extraction
- **AI-Powered Matching**: Advanced algorithms match your profile with relevant jobs
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Real-time Job Search**: Integration with Adzuna API for live job listings
- **Personalized Insights**: Get tips and recommendations for each job match
- **Export Results**: Download your job matches as a PDF report
- **Smooth Animations**: Framer Motion powered transitions and interactions

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Animations**: Framer Motion
- **PDF Processing**: PDF.js for client-side parsing
- **AI Integration**: Hugging Face Inference API
- **Job Data**: Adzuna API
- **Export**: jsPDF for report generation

## 📋 Prerequisites

- Node.js 16+ and npm
- Adzuna API credentials (free signup at [Adzuna Developer](https://developer.adzuna.com/))
- Hugging Face API token (optional, for enhanced AI features)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vznu7/ai-job-matcher.git
   cd ai-job-matcher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys** (Optional)
   
   Edit the following files to add your API credentials:
   
   - `src/services/jobService.js`: Add your Adzuna App ID and API Key
   - `src/services/aiMatcher.js`: Add your Hugging Face API token
   
   ```javascript
   // In jobService.js
   const ADZUNA_APP_ID = 'your_app_id'
   const ADZUNA_API_KEY = 'your_api_key'
   
   // In aiMatcher.js  
   const HF_API_TOKEN = 'your_hf_token'
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## 🎯 How It Works

1. **Enter Your Role**: Specify the job position you're looking for
2. **Upload Resume**: Drag and drop your PDF resume for analysis
3. **AI Analysis**: The system extracts skills, experience, and qualifications
4. **Job Matching**: Finds relevant positions and calculates match scores
5. **View Results**: Browse personalized job recommendations with insights
6. **Export Report**: Download your matches as a comprehensive PDF

## 🔧 API Configuration

### Adzuna API Setup

1. Sign up at [Adzuna Developer Portal](https://developer.adzuna.com/)
2. Create a new application to get your App ID and API Key
3. Update the credentials in `src/services/jobService.js`

### Hugging Face API Setup (Optional)

1. Sign up at [Hugging Face](https://huggingface.co/)
2. Generate an API token from your account settings
3. Update the token in `src/services/aiMatcher.js`

**Note**: The app works with mock data if API keys are not configured.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🌙 Dark Mode

Toggle between light and dark themes using the button in the top-right corner. Your preference is automatically saved.

## 🚀 Deployment

### Deploy to Vercel

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Adzuna](https://www.adzuna.com/) for job listing API
- [Hugging Face](https://huggingface.co/) for AI/ML models
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the API setup guides

---

**Made with ❤️ for job seekers everywhere**
