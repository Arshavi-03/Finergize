export interface SurveyQuestionOption {
    id: string;
    text: string;
    icon?: string;
  }
  
  export interface SurveyQuestion {
    id: string;
    question: string;
    simplified_question?: string;
    type: 'single-choice' | 'multiple-choice' | 'slider';
    options?: SurveyQuestionOption[];
    min?: number;
    max?: number;
    labels?: Record<string, string>;
    allowMultiple?: boolean;
    help_text?: string;
  }
  
  export const surveyQuestions: SurveyQuestion[] = [
    {
      id: "financial_goals",
      question: "What are your primary financial goals?",
      type: "multiple-choice",
      options: [
        { id: "save", text: "Save for emergencies" },
        { id: "invest", text: "Invest for long-term growth" },
        { id: "loan", text: "Get a small loan for specific needs" },
        { id: "education", text: "Learn more about financial management" },
        { id: "community", text: "Save with family or community members" },
        { id: "track", text: "Track and manage my spending better" }
      ],
      allowMultiple: true,
      help_text: "These are things you want to do with your money in the future."
    },
    {
      id: "income_range",
      question: "What is your monthly income range?",
      type: "single-choice",
      options: [
        { id: "income_low", text: "Below ₹15,000" },
        { id: "income_medium_low", text: "₹15,000 - ₹30,000" },
        { id: "income_medium", text: "₹30,000 - ₹60,000" },
        { id: "income_medium_high", text: "₹60,000 - ₹1,20,000" },
        { id: "income_high", text: "Above ₹1,20,000" }
      ],
      help_text: "This is how much money you get each month from your job or business."
    },
    {
      id: "financial_knowledge",
      question: "How would you rate your financial knowledge?",
      type: "single-choice",
      options: [
        { id: "beginner", text: "Beginner - I know very little" },
        { id: "basic", text: "Basic - I understand fundamental concepts" },
        { id: "intermediate", text: "Intermediate - I can make informed decisions" },
        { id: "advanced", text: "Advanced - I understand complex financial products" }
      ],
      help_text: "How much you know about money and financial matters."
    },
    {
      id: "banking_habits",
      question: "How do you currently do most of your banking?",
      type: "single-choice",
      options: [
        { id: "traditional", text: "Traditional bank branches" },
        { id: "atm", text: "ATMs" },
        { id: "net_banking", text: "Net banking on computer" },
        { id: "mobile", text: "Mobile banking apps" },
        { id: "upi", text: "UPI apps (Google Pay, PhonePe, etc.)" },
        { id: "limited", text: "I have limited banking access" }
      ],
      help_text: "How you currently use banking services for your money needs."
    },
    {
      id: "savings_method",
      question: "How do you currently save money?",
      type: "multiple-choice",
      options: [
        { id: "bank", text: "Bank savings account" },
        { id: "cash", text: "Cash at home" },
        { id: "fd", text: "Fixed deposits" },
        { id: "post", text: "Post office schemes" },
        { id: "chit", text: "Chit funds/community savings" },
        { id: "gold", text: "Gold/jewelry" },
        { id: "mutual_funds", text: "Mutual funds" },
        { id: "stocks", text: "Direct stocks" },
        { id: "no_savings", text: "I don't save regularly" }
      ],
      allowMultiple: true,
      help_text: "Different ways to keep your savings safe and growing."
    },
    {
      id: "loan_needs",
      question: "Do you currently need or expect to need a small loan?",
      type: "single-choice",
      options: [
        { id: "current", text: "Yes, I currently need a small loan" },
        { id: "future", text: "Not now, but might in the near future" },
        { id: "no", text: "No, I don't expect to need a loan" }
      ],
      help_text: "Whether you need to borrow money for personal or business needs."
    },
    {
      id: "digital_comfort",
      question: "How comfortable are you using digital/mobile financial apps?",
      type: "single-choice",
      options: [
        { id: "very", text: "Very comfortable - I use multiple apps regularly" },
        { id: "somewhat", text: "Somewhat comfortable - I use basic features" },
        { id: "limited", text: "Limited comfort - I use them with help" },
        { id: "uncomfortable", text: "Uncomfortable - I prefer not to use them" }
      ],
      help_text: "How comfortable you are using apps on your phone for money management."
    },
    {
      id: "tracking_interest",
      question: "How interested are you in tracking and analyzing your spending habits?",
      type: "slider",
      min: 1,
      max: 5,
      labels: {
        "1": "Not Interested",
        "3": "Somewhat Interested",
        "5": "Very Interested"
      },
      help_text: "Understanding where your money goes each month."
    }
  ];