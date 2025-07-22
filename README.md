# Strategic Alignment OS

> **AI-Powered Strategic Analysis Platform for Organizational Excellence**

Strategic Alignment OS is a comprehensive platform that combines the proven McKinsey 7-S Framework and SWOT Analysis with cutting-edge AI technology to help organizations assess their strategic alignment, identify improvement opportunities, and create actionable plans for success.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange)](https://firebase.google.com/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini%202.0-green)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### 📊 **Strategic Analysis Frameworks**
- **7-S Framework Analysis**: Evaluate organizational alignment across Strategy, Structure, Systems, Shared Values, Style, Staff, and Skills
- **SWOT Analysis**: Comprehensive assessment of Strengths, Weaknesses, Opportunities, and Threats
- **AI-Powered Insights**: Get intelligent analysis and prioritized recommendations from Google Gemini 2.0

### 🎯 **Goal Management & Action Planning**
- **Smart Recommendations**: Convert analysis insights into trackable goals
- **Action Item Management**: Break down goals into manageable tasks
- **Progress Tracking**: Monitor completion status and maintain accountability

### 🔧 **User Experience**
- **Industry Templates**: Quick-start templates for tech startups, manufacturing, and non-profits
- **Interactive Visualizations**: Radar charts showing alignment scores across all dimensions
- **Analysis Refinement**: Provide feedback to improve AI-generated insights
- **Export Capabilities**: Save and share analysis results

### 🛡️ **Privacy & Security**
- **Client-Side Storage**: Your data never leaves your browser
- **Zero Server Persistence**: Complete privacy for sensitive organizational information
- **Data Encryption**: AES-256 encryption for local storage
- **Automatic Cleanup**: Configurable data retention policies

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 8+
- **Firebase CLI** (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/strategic-alignment-os.git
   cd strategic-alignment-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Google AI API key
   echo "GOOGLE_AI_API_KEY=your_api_key_here" >> .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 💻 Technology Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

### State Management
- **Client State**: Zustand with persistence middleware
- **Form Management**: React Hook Form with Zod validation
- **Data Storage**: Encrypted localStorage with TTL

### AI & Backend
- **AI Framework**: Google Genkit 1.14.1
- **AI Model**: Google Gemini 2.0 Flash
- **API Layer**: Next.js Server Actions
- **Validation**: Zod schemas

### Development & Deployment
- **Build Tool**: Next.js with Turbopack
- **Hosting**: Firebase App Hosting
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + React Testing Library + Playwright

## 📖 Usage

### Getting Started with Analysis

1. **Choose Your Starting Point**
   - Use an industry template for quick setup
   - Or start from scratch with custom inputs

2. **Complete the 7-S Framework**
   - Fill out detailed descriptions for all seven elements
   - Aim for 2-4 sentences per element for best results

3. **Generate AI Analysis**
   - Click "Generate Analysis" and wait 15-30 seconds
   - Review comprehensive insights and recommendations

4. **Create Action Plans**
   - Convert recommendations into trackable goals
   - Break goals down into specific action items
   - Monitor progress over time

### Analysis Best Practices

- **Be Specific**: Provide concrete examples rather than generic descriptions
- **Use Current Data**: Describe your organization as it exists today
- **Include Context**: Add industry-specific or company-specific details
- **Refine Results**: Use the feedback feature to improve analysis quality

## 🏗️ Development

### Project Structure
```
src/
├── ai/                 # AI flows and Genkit configuration
│   ├── flows/         # Analysis generation flows
│   └── genkit.ts      # AI configuration
├── app/               # Next.js app directory
│   ├── (dashboard)/   # Dashboard pages and layouts
│   ├── actions.ts     # Server actions
│   └── globals.css    # Global styles
├── components/        # Reusable UI components
│   ├── layout/        # Layout components
│   └── ui/           # Base UI components
├── hooks/            # Custom React hooks
└── lib/              # Utilities and configurations
    ├── store.ts      # Zustand store
    ├── types.ts      # TypeScript definitions
    └── utils.ts      # Helper functions
```

### Development Scripts
```bash
# Development
npm run dev              # Start development server
npm run genkit:dev       # Start Genkit development server
npm run genkit:watch     # Start Genkit with file watching

# Building & Testing
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript checks

# Deployment
firebase deploy         # Deploy to Firebase
```

### Adding New Features

1. **Analysis Types**: Extend AI flows in `src/ai/flows/`
2. **UI Components**: Add to `src/components/` following shadcn/ui patterns
3. **Pages**: Create new routes in `src/app/`
4. **State Management**: Extend Zustand store in `src/lib/store.ts`

## 🔧 Configuration

### Environment Variables
```bash
# Required
GOOGLE_AI_API_KEY=your_gemini_api_key

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
GENKIT_ENV=prod
```

### Firebase Configuration
```bash
# Initialize Firebase (first time only)
firebase init

# Configure hosting
firebase hosting:channel:deploy production

# Set secrets
firebase hosting:secrets:set GOOGLE_AI_API_KEY
```

## 📚 Documentation

Our comprehensive documentation covers every aspect of the project:

### **User Documentation**
- 📖 [**User Manual**](./user_manual.md) - Complete guide for end users
- 🔧 [**API Documentation**](./api_documentation.md) - Technical API reference

### **Development Documentation**
- 🏗️ [**Architectural Document**](./architectural_document.md) - System architecture overview
- ⚙️ [**Technical Specification**](./technical_specification.md) - Implementation details
- 🔄 [**Development Workflow**](./development_workflow.md) - Development processes
- 🧪 [**Testing Strategy**](./testing_strategy.md) - Testing approaches and guidelines

### **Operations Documentation**
- 🚀 [**Deployment Guide**](./deployment_guide.md) - Infrastructure and deployment
- 📊 [**Operations Manual**](./operations_manual.md) - Day-to-day operations
- 🔒 [**Security Documentation**](./security_documentation.md) - Security guidelines

### **Business Documentation**
- 📋 [**Product Requirements**](./product_requirements_document.md) - Product vision and requirements
- 🗄️ [**Database Design**](./database_design.md) - Data architecture and storage

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation as needed
4. **Run tests**
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push and create a Pull Request**

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Write tests for new features
- Update documentation for any changes
- Follow [Conventional Commits](https://www.conventionalcommits.org/)

## 🛣️ Roadmap

### Current Version (v1.0)
- ✅ 7-S Framework Analysis
- ✅ SWOT Analysis
- ✅ Goal Management
- ✅ Industry Templates
- ✅ Client-side Storage

### Upcoming Features (v1.1)
- 🔄 Analysis History & Comparison
- 📊 Advanced Visualizations
- 🔗 Integration with Business Tools
- 📱 Mobile App
- 🌐 Multi-language Support

### Future Considerations (v2.0+)
- 👥 Multi-user Collaboration
- 🏢 Organization Management
- 📈 Benchmarking & Industry Comparisons
- 🤖 Advanced AI Models
- ☁️ Cloud Storage Options

## 🔒 Security & Privacy

Strategic Alignment OS prioritizes your privacy and data security:

- **No Server-Side Data Storage**: Your analysis data never leaves your browser
- **Local Encryption**: All data encrypted with AES-256 before storage
- **Zero Tracking**: No user tracking or analytics on your sensitive data
- **Open Source**: Full transparency in how your data is handled

For detailed security information, see our [Security Documentation](./security_documentation.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support & Contact

### Getting Help
- 📖 **Documentation**: Check our comprehensive docs above
- 🐛 **Bug Reports**: [Create an issue](https://github.com/your-org/strategic-alignment-os/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/your-org/strategic-alignment-os/discussions)

### Community
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-org/strategic-alignment-os/discussions)
- 📧 **Email**: support@strategic-alignment-os.com
- 🐦 **Twitter**: [@StrategicAlignmentOS](https://twitter.com/StrategicAlignmentOS)

### For Organizations
- 🏢 **Enterprise Support**: enterprise@strategic-alignment-os.com
- 🎓 **Training & Consulting**: consulting@strategic-alignment-os.com

---

<div align="center">

**Transform your organization with Strategic Alignment OS**

[Get Started](https://strategic-alignment-os.web.app) • [Documentation](./user_manual.md) • [Community](https://github.com/your-org/strategic-alignment-os/discussions)

Made with ❤️ by the Strategic Alignment OS team

</div>
