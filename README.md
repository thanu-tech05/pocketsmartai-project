# 💰 PocketSmartAI — Smart Budget & Recommendation Assistant

A polished, fully functional personal-finance web application designed for Indian users, using **Indian Rupees (₹)** throughout.

PocketSmartAI is more than just an expense tracker. It analyses income, expenses, budgets, and savings goals to generate **personalised, explainable, rule-based financial recommendations** and a transparent **Budget Health Score** to help users make smarter financial decisions.

## 🌐 Live Demo & Repository

🚀 **Live Website:** [https://thanu-tech05.github.io/pocketsmartai-project/](https://thanu-tech05.github.io/pocketsmartai-project/)

💻 **GitHub Repository:** [https://github.com/thanu-tech05/pocketsmartai-project](https://github.com/thanu-tech05/pocketsmartai-project)

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS with light and dark modes
- **Charts:** Recharts
- **Navigation:** React Router with route-level code splitting
- **Data Persistence:** Browser `localStorage`
- **Currency:** Indian Rupees (₹ INR)
- **Backend:** Not required
- **API Keys:** Not required

## ✨ Features

### 📊 1. Dashboard

- Overview of income, expenses, balance, and savings
- Budget Health Score with financial insights
- Month-over-month financial comparison
- Category-wise spending charts
- Income-versus-expense visualisation
- Budget progress tracking
- Savings goal progress
- Financial insights and alerts
- Recent transactions
- Working quick actions

### 💳 2. Transaction Management

- Add, edit, and delete income and expense transactions
- Search transactions
- Filter by transaction type
- Filter by category and month
- Sort transaction records
- Export transaction data to CSV
- Display monetary values in Indian Rupees (₹)

### 🎯 3. Budget Management

- Set monthly overall budgets
- Create category-specific budgets
- Monitor budget usage in real time
- Track remaining budget amounts
- Receive warnings when spending approaches budget limits
- Identify categories that exceed their budgets

### 🏦 4. Savings Goals

- Create, edit, and delete savings goals
- Add money to savings goals
- Withdraw money from savings goals
- Track savings progress percentages
- Calculate remaining amounts
- Estimate the monthly savings required to reach a target

### 📈 5. Financial Analytics

- Category-wise spending donut chart
- Income-versus-expense comparison
- Spending trends over time
- Savings trends
- Automatic financial observations
- Visual insights into spending patterns

### 🤖 6. Smart Recommendations

- Rule-based personalised financial recommendations
- Analysis of income, expenses, budgets, and savings goals
- Clear explanations of financial patterns
- Actionable suggestions for improving budgeting habits
- Transparent Budget Health Score breakdown
- Alerts centre for important financial notifications

Recommendations follow a simple structure:

1. **What happened?** — Identifies a financial pattern or issue.
2. **Why does it matter?** — Explains its potential impact on the user's budget.
3. **What should you do?** — Suggests a practical next step.

### 🎨 7. Appearance & Personalisation

- Light theme
- Dark theme
- System theme
- Theme preference remembered across visits
- Consistent Indian Rupee formatting

### 💾 8. Backup & Reports

- Export financial data in JSON format
- Import financial data from JSON backups
- Generate printable financial reports
- Store application data locally in the browser

### ⚙️ 9. Settings

- Manage profile information
- Fixed currency support for INR (₹)
- Reset demo data
- Clear all application data

## 🚀 Getting Started

Follow these instructions to run PocketSmartAI on your local machine.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/) — LTS version recommended
- npm — Included with Node.js
- [Git](https://git-scm.com/)

### Installation

**Step 1: Clone the repository**

```bash
git clone https://github.com/thanu-tech05/pocketsmartai-project.git
```

**Step 2: Navigate to the project directory**

```bash
cd pocketsmartai-project
```

**Step 3: Install dependencies**

```bash
npm install
```

**Step 4: Start the development server**

```bash
npm run dev
```

**Step 5: Open the application**

Open the following URL in your browser:

[http://localhost:5173](http://localhost:5173)

### Production Build

To create an optimised production build, run:

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## 📁 Project Structure

The project follows a typical React, TypeScript, and Vite structure.

```text
PocketSmartAI/
├── docs/
│   ├── PROJECT_REPORT.md
│   ├── DEMO_SCRIPT.md
│   └── SUBMISSION_GUIDE.md
├── public/
├── src/
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 📚 Project Documentation

Detailed documentation is available in the `docs/` directory.

- **[Project Report](docs/PROJECT_REPORT.md)** — Detailed project overview, features, architecture, and implementation.
- **[Demo Script](docs/DEMO_SCRIPT.md)** — Step-by-step guide for demonstrating the application.
- **[Submission Guide](docs/SUBMISSION_GUIDE.md)** — Instructions for running, building, and submitting the project.

## 🔒 Privacy & Data Storage

PocketSmartAI uses browser `localStorage` to persist application data.

- No backend server is required.
- No API keys are required.
- Financial data is stored locally in the browser.
- Data does not automatically synchronise across different devices or browsers.
- Clearing browser storage or using the application's clear-data option may permanently remove saved data.
- Export a backup before resetting or clearing application data.

**Privacy reminder:** Avoid entering sensitive financial information on shared or public devices.

## 🧠 How the Budget Health Score Works

PocketSmartAI provides a Budget Health Score designed to help users understand their budgeting habits.

The application uses a transparent, rule-based approach to evaluate financial information and present a breakdown of relevant budgeting indicators.

The score and associated insights help users identify areas that may need attention, such as:

- Spending that approaches or exceeds budget limits
- Changes in income and expenses
- Progress toward savings goals
- Opportunities to improve spending habits

The score is an informational indicator, not a guarantee of financial security or future financial performance.

## 💡 How Smart Recommendations Work

PocketSmartAI analyses available financial data, including income, spending patterns, budget utilisation, and savings progress.

Its rule-based recommendation engine converts these observations into understandable suggestions.

For example:

- **Observation:** Spending in a category is approaching its monthly limit.
- **Why it matters:** Additional spending could cause the category budget to be exceeded.
- **Recommendation:** Review recent transactions and consider reducing non-essential spending for the rest of the month.

Recommendations are generated using application rules rather than an external AI API.

**Disclaimer:** PocketSmartAI provides educational budgeting insights and is not a substitute for professional financial advice.

## 🧰 Technologies Used

| Technology | Purpose |
|---|---|
| React 18 | Building the user interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| Recharts | Financial charts and visualisations |
| React Router | Application navigation |
| localStorage | Browser-based data persistence |
| Git & GitHub | Version control and source code hosting |
| GitHub Pages | Hosting the live website |

## 🌍 Live Deployment

Visit the deployed application:

**[🚀 Launch PocketSmartAI](https://thanu-tech05.github.io/pocketsmartai-project/)**

The project is hosted using GitHub Pages.

If the live website does not load correctly after a deployment, check the GitHub Pages configuration and ensure that the Vite base path matches the repository name:

```typescript
base: "/pocketsmartai-project/"
```

Configure this in `vite.config.ts` if required by your deployment setup.

## 🔄 Updating the Project on GitHub

After making changes to your local project, run:

```bash
git add .
git commit -m "Update PocketSmartAI"
git push origin main
```

Once the changes are pushed, rebuild and redeploy the application if your GitHub Pages workflow does not deploy automatically.

## 🔐 Security Notes

- Never commit API keys, passwords, access tokens, or private credentials.
- Keep `.env` files out of version control when they contain secrets.
- Review `.gitignore` before uploading project files.
- Export important financial data before resetting the application or clearing browser storage.

## 👨‍💻 Author

**Thanu**

- **GitHub:** [@thanu-tech05](https://github.com/thanu-tech05)
- **Project Repository:** [PocketSmartAI](https://github.com/thanu-tech05/pocketsmartai-project)
- **Live Website:** [PocketSmartAI Live Demo](https://thanu-tech05.github.io/pocketsmartai-project/)

## 📄 License

No license has been specified yet. If you intend to distribute or allow others to reuse this project, consider adding an appropriate `LICENSE` file.

## ⭐ Support

If you find PocketSmartAI useful, consider giving the repository a star on GitHub!

**PocketSmartAI — Understand your money. Improve your budget. Build better financial habits.**
