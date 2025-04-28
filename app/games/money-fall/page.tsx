"use client";
import React, { useState, useEffect } from 'react';

const FinancialIslandAdventure = () => {
  // Game state
  const [currentLocation, setCurrentLocation] = useState('dock');
  const [inventory, setInventory] = useState([]);
  const [gameText, setGameText] = useState("Welcome to Financial Island! You're a young adventurer named Morgan who's washed ashore with nothing but the clothes on your back. Your goal is to learn how to manage your money, build wealth, and eventually escape the island with financial freedom.");
  const [dialogueActive, setDialogueActive] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [gameFlags, setGameFlags] = useState({
    hasJob: false,
    hasBank: false,
    hasBudget: false,
    hasCreditKnowledge: false,
    hasInvestmentKnowledge: false,
    hasEmergencyFund: false,
    hasRetirementPlan: false,
    hasPaidDebt: false,
    completedFinancialFreedom: false
  });
  const [verbSelected, setVerbSelected] = useState('look');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [money, setMoney] = useState(10);
  const [bankBalance, setBankBalance] = useState(0);
  const [debt, setDebt] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(null);
  const [creditScore, setCreditScore] = useState(300);
  const [showFinancialDashboard, setShowFinancialDashboard] = useState(false);
  const [gameDay, setGameDay] = useState(1);
  const [showFinancialQuizModal, setShowFinancialQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  
  // Location definitions
  const locations = {
    dock: {
      name: "Financial Island Dock",
      description: "A wooden dock stretches out into the sea. You can see the financial district of the island ahead. A friendly-looking local stands nearby.",
      backgroundImage: "dock-background",
      exits: {
        town: "Go to Financial District",
        beach: "Go to Beach"
      },
      hotspots: [
        {
          id: "local",
          name: "Island Local",
          description: "A friendly local who might help you get oriented.",
          x: 30,
          y: 50,
          width: 10,
          height: 20,
          interaction: {
            look: "A friendly local islander wearing a colorful shirt with dollar signs on it.",
            talk: () => startDialogue("localGuide"),
            use: "I don't think they'd appreciate that."
          }
        },
        {
          id: "board",
          name: "Information Board",
          description: "A board with information about the island.",
          x: 70,
          y: 40,
          width: 10,
          height: 15,
          interaction: {
            look: "The board reads: 'Welcome to Financial Island! To escape with financial freedom, you must master earning, budgeting, saving, investing, and debt management.'"
          }
        }
      ]
    },
    town: {
      name: "Financial District",
      description: "The bustling center of Financial Island with various establishments. You can see a bank, a job center, a market, and an investment office.",
      backgroundImage: "town-background",
      exits: {
        dock: "Return to Dock",
        bank: "Enter the Bank",
        jobCenter: "Enter Job Center",
        market: "Go to Market",
        investmentOffice: "Visit Investment Office"
      },
      hotspots: [
        {
          id: "townsperson",
          name: "Financial Advisor",
          description: "A professional-looking person with a calculator and charts.",
          x: 40,
          y: 50,
          width: 10,
          height: 20,
          interaction: {
            look: "This person looks knowledgeable about finances. They're reviewing some charts and graphs.",
            talk: () => startDialogue("financialAdvisor")
          }
        }
      ]
    },
    beach: {
      name: "Saving Shores",
      description: "A quiet beach with golden sand. This looks like a good place to think about saving money. There's a small book half-buried in the sand.",
      backgroundImage: "beach-background",
      exits: {
        dock: "Return to Dock"
      },
      hotspots: [
        {
          id: "savingsBook",
          name: "Savings Book",
          description: "A book about saving money partially buried in the sand.",
          x: 55,
          y: 70,
          width: 15,
          height: 5,
          visible: !inventory.some(item => item.id === "savingsBook"),
          interaction: {
            look: "A book titled 'The Importance of Emergency Funds and Saving'.",
            take: () => {
              if (!inventory.some(item => item.id === "savingsBook")) {
                addToInventory({
                  id: "savingsBook",
                  name: "Savings Book",
                  description: "A guide to the importance of saving and emergency funds.",
                  interaction: {
                    look: "The book explains that an emergency fund should cover 3-6 months of expenses.",
                    use: () => {
                      setShowFinancialQuizModal(true);
                      setCurrentQuiz("emergencyFund");
                      return "You start reading about emergency funds...";
                    }
                  }
                });
                return "You take the book about savings and emergency funds.";
              }
              return "You already have the savings book.";
            }
          }
        },
        {
          id: "buriedCoins",
          name: "Buried Coins",
          description: "Something shiny is peeking out from the sand.",
          x: 25,
          y: 65,
          width: 8,
          height: 8,
          interaction: {
            look: "There appears to be some coins buried in the sand.",
            take: () => {
              setMoney(money + 5);
              return "You dig up 5 coins from the sand! (+5 coins)";
            }
          }
        }
      ]
    },
    bank: {
      name: "Island National Bank",
      description: "A professional-looking bank with tellers and bank officers. This is where you can save money and learn about credit.",
      backgroundImage: "bank-background",
      exits: {
        town: "Exit to Financial District"
      },
      hotspots: [
        {
          id: "banker",
          name: "Bank Manager",
          description: "A professional-looking banker in a nice suit.",
          x: 50,
          y: 40,
          width: 15,
          height: 25,
          interaction: {
            look: "The bank manager looks professional and knowledgeable about banking services.",
            talk: () => startDialogue("bankManager")
          }
        },
        {
          id: "creditBrochure",
          name: "Credit Information",
          description: "A brochure about credit scores and loans.",
          x: 75,
          y: 60,
          width: 10,
          height: 5,
          interaction: {
            look: "A detailed brochure explaining how credit scores work and the importance of maintaining good credit.",
            take: () => {
              if (!inventory.some(item => item.id === "creditBrochure")) {
                addToInventory({
                  id: "creditBrochure",
                  name: "Credit Guide",
                  description: "Information about credit scores and responsible borrowing.",
                  interaction: {
                    look: "The guide explains that credit scores range from 300-850, and how payment history and debt utilization affect your score.",
                    use: () => {
                      setShowFinancialQuizModal(true);
                      setCurrentQuiz("creditKnowledge");
                      return "You start reading about credit scores and loans...";
                    }
                  }
                });
                return "You take the credit information guide.";
              }
              return "You already have the credit guide.";
            }
          }
        },
        {
          id: "atmMachine",
          name: "ATM Machine",
          description: "An automated teller machine for banking transactions.",
          x: 20,
          y: 50,
          width: 12,
          height: 20,
          interaction: {
            look: "An ATM where you can deposit or withdraw money.",
            use: () => {
              if (gameFlags.hasBank) {
                openBankingScreen();
                return "You access your bank account...";
              } else {
                return "You need to open a bank account first. Speak with the bank manager.";
              }
            }
          }
        }
      ]
    },
    jobCenter: {
      name: "Employment Office",
      description: "A busy office where people are looking for work. Job listings are posted on boards, and career counselors help job seekers.",
      backgroundImage: "job-center-background",
      exits: {
        town: "Exit to Financial District"
      },
      hotspots: [
        {
          id: "jobCounselor",
          name: "Job Counselor",
          description: "A helpful employment specialist ready to help you find work.",
          x: 40,
          y: 40,
          width: 15,
          height: 25,
          interaction: {
            look: "The job counselor is helping people find employment opportunities that match their skills.",
            talk: () => startDialogue("jobCounselor")
          }
        },
        {
          id: "jobBoard",
          name: "Job Listings",
          description: "A board with various job opportunities posted.",
          x: 70,
          y: 50,
          width: 15,
          height: 20,
          interaction: {
            look: "The board shows several jobs: Restaurant Server ($15/day), Store Clerk ($20/day), Office Assistant ($25/day), and Financial Apprentice ($40/day, requires financial knowledge)."
          }
        },
        {
          id: "resumeWorkshop",
          name: "Resume Workshop",
          description: "A workshop for creating effective resumes.",
          x: 15,
          y: 60,
          width: 15,
          height: 15,
          interaction: {
            look: "A workshop to help job seekers create better resumes and increase their earning potential.",
            use: () => {
              if (!gameFlags.hasJob && money >= 5) {
                setMoney(money - 5);
                setGameFlags({...gameFlags, hasJob: true});
                setIncome(income + 15);
                setExpenses([...expenses, {name: "Transportation to Work", amount: 3}]);
                return "You spend 5 coins on the resume workshop. With your improved resume, you secure a job as a Restaurant Server earning 15 coins per day!";
              } else if (gameFlags.hasJob) {
                return "You already have a job. You can speak to the job counselor about advancement opportunities.";
              } else {
                return "The workshop costs 5 coins. You don't have enough money.";
              }
            }
          }
        }
      ]
    },
    market: {
      name: "Island Market",
      description: "A bustling marketplace where you can buy necessities and luxuries. A good place to practice budgeting.",
      backgroundImage: "market-background",
      exits: {
        town: "Exit to Financial District"
      },
      hotspots: [
        {
          id: "shopkeeper",
          name: "Shopkeeper",
          description: "A friendly vendor selling various goods.",
          x: 40,
          y: 40,
          width: 15,
          height: 25,
          interaction: {
            look: "The shopkeeper has food, clothing, and other goods for sale.",
            talk: () => startDialogue("shopkeeper")
          }
        },
        {
          id: "budgetBook",
          name: "Budgeting Guide",
          description: "A book about creating and maintaining a budget.",
          x: 70,
          y: 65,
          width: 10,
          height: 5,
          visible: !inventory.some(item => item.id === "budgetBook"),
          interaction: {
            look: "A practical guide titled '50/30/20: The Key to Budgeting Success'.",
            take: () => {
              if (money >= 5) {
                setMoney(money - 5);
                addToInventory({
                  id: "budgetBook",
                  name: "Budgeting Guide",
                  description: "A guide to creating and following a budget using the 50/30/20 rule.",
                  interaction: {
                    look: "The guide explains the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment.",
                    use: () => {
                      setShowFinancialQuizModal(true);
                      setCurrentQuiz("budgeting");
                      return "You start reading about creating a budget...";
                    }
                  }
                });
                return "You spend 5 coins on the budgeting guide.";
              } else {
                return "The budgeting guide costs 5 coins. You don't have enough money.";
              }
            }
          }
        },
        {
          id: "foodStall",
          name: "Food Stall",
          description: "A stall selling food items.",
          x: 20,
          y: 60,
          width: 15,
          height: 15,
          interaction: {
            look: "The stall has basic food items: Bread (2 coins), Fruit (3 coins), and a Full Meal (5 coins).",
            use: () => {
              if (money >= 2) {
                setMoney(money - 2);
                return "You purchase some bread for 2 coins. It's important to budget for necessities like food!";
              } else {
                return "You don't have enough money to buy even the cheapest food item. This is why emergency funds are important!";
              }
            }
          }
        }
      ]
    },
    investmentOffice: {
      name: "Investment Advisory Office",
      description: "A professional office where investment advisors help clients grow their wealth. Charts of stocks and mutual funds line the walls.",
      backgroundImage: "investment-office-background",
      exits: {
        town: "Exit to Financial District"
      },
      hotspots: [
        {
          id: "investmentAdvisor",
          name: "Investment Advisor",
          description: "A knowledgeable financial professional who helps people invest wisely.",
          x: 40,
          y: 40,
          width: 15,
          height: 25,
          interaction: {
            look: "The investment advisor is analyzing market trends and investment opportunities.",
            talk: () => startDialogue("investmentAdvisor")
          }
        },
        {
          id: "investmentGuide",
          name: "Investment Guide",
          description: "A comprehensive guide to different types of investments.",
          x: 70,
          y: 60,
          width: 10,
          height: 5,
          visible: !inventory.some(item => item.id === "investmentGuide"),
          interaction: {
            look: "A guide titled 'Investment Basics: From Stocks to Bonds and Beyond'.",
            take: () => {
              if (money >= 10) {
                setMoney(money - 10);
                addToInventory({
                  id: "investmentGuide",
                  name: "Investment Guide",
                  description: "A comprehensive guide to different investment types and strategies.",
                  interaction: {
                    look: "The guide covers stocks, bonds, mutual funds, ETFs, and the importance of diversification.",
                    use: () => {
                      setShowFinancialQuizModal(true);
                      setCurrentQuiz("investing");
                      return "You start reading about investment strategies...";
                    }
                  }
                });
                return "You spend 10 coins on the investment guide.";
              } else {
                return "The investment guide costs 10 coins. You don't have enough money.";
              }
            }
          }
        },
        {
          id: "investmentTerminal",
          name: "Investment Terminal",
          description: "A computer terminal for making investments.",
          x: 20,
          y: 50,
          width: 12,
          height: 20,
          interaction: {
            look: "A terminal where you can invest in stocks, bonds, and index funds.",
            use: () => {
              if (gameFlags.hasInvestmentKnowledge) {
                openInvestmentScreen();
                return "You access the investment terminal...";
              } else {
                return "You don't understand enough about investing to use this yet. You should learn the basics first.";
              }
            }
          }
        }
      ]
    },
    retirementCenter: {
      name: "Retirement Planning Center",
      description: "A calming office focused on long-term financial planning and retirement strategies.",
      backgroundImage: "retirement-center-background",
      exits: {
        town: "Exit to Financial District"
      },
      hotspots: [
        {
          id: "retirementPlanner",
          name: "Retirement Planner",
          description: "A specialist in long-term financial planning and retirement strategies.",
          x: 40,
          y: 40,
          width: 15,
          height: 25,
          interaction: {
            look: "The retirement planner is helping clients prepare for their financial future.",
            talk: () => startDialogue("retirementPlanner")
          }
        },
        {
          id: "retirementCalculator",
          name: "Retirement Calculator",
          description: "A device for calculating retirement needs and planning.",
          x: 70,
          y: 60,
          width: 10,
          height: 10,
          interaction: {
            look: "A retirement calculator that helps determine how much you need to save for retirement.",
            use: () => {
              if (gameFlags.hasInvestmentKnowledge) {
                return "The calculator shows that if you invest 10% of your income from age 25 to 65 with a 7% annual return, you could have over 1 million coins for retirement!";
              } else {
                return "The calculator has lots of numbers and formulas that don't make sense to you yet. You should learn more about investing first.";
              }
            }
          }
        }
      ]
    },
    debtCounseling: {
      name: "Debt Counseling Center",
      description: "A helpful center dedicated to helping people manage and eliminate debt.",
      backgroundImage: "debt-center-background",
      exits: {
        town: "Exit to Financial District"
      },
      hotspots: [
        {
          id: "debtCounselor",
          name: "Debt Counselor",
          description: "A specialist who helps people develop strategies to pay off debt.",
          x: 40,
          y: 40,
          width: 15,
          height: 25,
          interaction: {
            look: "The debt counselor is reviewing financial statements and creating debt payoff plans.",
            talk: () => startDialogue("debtCounselor")
          }
        },
        {
          id: "debtPayoffCalculator",
          name: "Debt Payoff Calculator",
          description: "A tool for calculating debt payoff strategies.",
          x: 70,
          y: 60,
          width: 10,
          height: 10,
          interaction: {
            look: "A calculator that compares different debt payoff methods like the avalanche method (highest interest first) and the snowball method (smallest balance first).",
            use: () => {
              if (debt > 0) {
                return "The calculator shows that by paying an extra 5 coins per day towards your debt, you could be debt-free in " + Math.ceil(debt / 5) + " days!";
              } else {
                return "You don't have any debt to calculate right now. Great job staying debt-free!";
              }
            }
          }
        }
      ]
    }
  };

  // Define the financial quizzes
  const financialQuizzes = {
    budgeting: {
      title: "Budgeting Quiz",
      description: "Test your knowledge about budgeting basics.",
      questions: [
        {
          question: "What is the 50/30/20 rule in budgeting?",
          options: [
            "50% savings, 30% needs, 20% wants",
            "50% needs, 30% wants, 20% savings/debt",
            "50% income, 30% expenses, 20% taxes",
            "50% investments, 30% cash, 20% bonds"
          ],
          correctAnswer: 1
        },
        {
          question: "Why is creating a budget important?",
          options: [
            "To impress your friends with financial knowledge",
            "To know exactly how much to spend on luxury items",
            "To track income and expenses and ensure you're living within your means",
            "To avoid paying taxes"
          ],
          correctAnswer: 2
        },
        {
          question: "Which of these is a good budgeting practice?",
          options: [
            "Ignoring small expenses because they don't matter",
            "Planning for irregular expenses like car repairs",
            "Allocating 70% of income to entertainment",
            "Updating your budget once a year"
          ],
          correctAnswer: 1
        }
      ],
      reward: () => {
        setGameFlags({...gameFlags, hasBudget: true});
        setBudget({
          needs: 0.5 * income,
          wants: 0.3 * income,
          savings: 0.2 * income
        });
        return "Congratulations! You've learned the basics of budgeting. You've created your first budget using the 50/30/20 rule!";
      }
    },
    emergencyFund: {
      title: "Emergency Fund Quiz",
      description: "Test your knowledge about emergency funds and saving.",
      questions: [
        {
          question: "How much should an emergency fund ideally cover?",
          options: [
            "1 week of expenses",
            "2-4 weeks of expenses",
            "3-6 months of expenses",
            "10 years of expenses"
          ],
          correctAnswer: 2
        },
        {
          question: "Where is the best place to keep your emergency fund?",
          options: [
            "Invested in stocks",
            "In a high-yield savings account",
            "Under your mattress",
            "In cryptocurrency"
          ],
          correctAnswer: 1
        },
        {
          question: "What is the purpose of an emergency fund?",
          options: [
            "To make large purchases like a TV",
            "To cover unexpected expenses like medical bills or car repairs",
            "To invest when the market is down",
            "To lend money to friends"
          ],
          correctAnswer: 1
        }
      ],
      reward: () => {
        setGameFlags({...gameFlags, hasEmergencyFund: true});
        return "Congratulations! You now understand the importance of emergency funds. You've started your emergency fund savings goal!";
      }
    },
    creditKnowledge: {
      title: "Credit Quiz",
      description: "Test your knowledge about credit scores and responsible borrowing.",
      questions: [
        {
          question: "What credit score range is generally considered 'good'?",
          options: [
            "300-579",
            "580-669",
            "670-739",
            "740-850"
          ],
          correctAnswer: 2
        },
        {
          question: "Which factor impacts your credit score the most?",
          options: [
            "Payment history",
            "Length of credit history",
            "Types of credit used",
            "Recent credit inquiries"
          ],
          correctAnswer: 0
        },
        {
          question: "What is a good practice for maintaining good credit?",
          options: [
            "Maxing out credit cards to build history",
            "Opening many new credit accounts quickly",
            "Keeping credit card balances low and paying on time",
            "Taking out the largest loans possible"
          ],
          correctAnswer: 2
        }
      ],
      reward: () => {
        setGameFlags({...gameFlags, hasCreditKnowledge: true});
        setCreditScore(670);
        return "Congratulations! You now understand credit scores and responsible borrowing. Your knowledge has improved your credit score to 670!";
      }
    },
    investing: {
      title: "Investing Quiz",
      description: "Test your knowledge about investment basics.",
      questions: [
        {
          question: "What is diversification in investing?",
          options: [
            "Buying different stocks in the same industry",
            "Spreading investments across various asset classes to reduce risk",
            "Investing all your money in one promising company",
            "Changing your investments daily"
          ],
          correctAnswer: 1
        },
        {
          question: "Which investment typically has the highest long-term return?",
          options: [
            "Savings account",
            "Government bonds",
            "Stocks/equities",
            "Certificate of Deposit (CD)"
          ],
          correctAnswer: 2
        },
        {
          question: "What is compound interest?",
          options: [
            "Interest earned only on your principal",
            "Interest that can only be earned in a retirement account",
            "Interest earned on both principal and accumulated interest",
            "Interest paid to the government"
          ],
          correctAnswer: 2
        }
      ],
      reward: () => {
        setGameFlags({...gameFlags, hasInvestmentKnowledge: true});
        return "Congratulations! You now understand the basics of investing. You can now use the investment terminal!";
      }
    }
  };

  // Dialogue definitions
  const dialogues = {
    localGuide: {
      character: "Island Local",
      portrait: "local-guide-portrait",
      lines: [
        {
          text: "Ahoy there, stranger! Welcome to Financial Island, where the path to wealth begins with knowledge!",
          responses: [
            { text: "How do I get started here?", next: 1 },
            { text: "What's the goal on this island?", next: 2 },
            { text: "Where can I earn some money?", next: 3 }
          ]
        },
        {
          text: "First things first, head to the Financial District and visit the Job Center. You need income before anything else! Then check out the Bank to learn about saving.",
          responses: [
            { text: "What skills do I need to succeed here?", next: 4 },
            { text: "Thanks for the advice!", next: "end" }
          ]
        },
        {
          text: "Your goal is to achieve financial freedom! This means having enough passive income from investments, no debt, an emergency fund, and a retirement plan. Then you can leave the island as a financial master!",
          responses: [
            { text: "That sounds difficult.", next: 5 },
            { text: "I'm ready for the challenge!", next: 4 }
          ]
        },
        {
          text: "The Job Center in the Financial District is hiring! They have positions for all skill levels. Remember though, increasing your skills can help you earn more.",
          responses: [
            { text: "I'll check it out, thanks!", next: "end" }
          ]
        },
        {
          text: "You'll need to master five key areas: Earning (income), Saving (emergency fund), Budgeting (managing money), Debt Management (borrowing wisely), and Investing (growing wealth).",
          responses: [
            { text: "Where can I learn about these topics?", next: 6 },
            { text: "I'll figure it out as I go.", next: "end" }
          ]
        },
        {
          text: "It might seem overwhelming now, but take it one step at a time. Start with getting income, then learn to budget and save. The rest will follow!",
          responses: [
            { text: "Where can I learn about these financial topics?", next: 6 },
            { text: "Thanks for the encouragement!", next: "end" }
          ]
        },
        {
          text: "Look for books and guides around the island. The Market has a budgeting guide, the Beach has information about saving, and the Investment Office has materials on growing wealth.",
          responses: [
            { text: "I'll keep my eyes open for those resources.", next: "end" }
          ],
          onEnd: () => {
            setGameText("The local suggested finding work at the Job Center first, then learning about budgeting, saving, and investing by exploring the island and finding guides.");
          }
        }
      ]
    },
    financialAdvisor: {
      character: "Financial Advisor",
      portrait: "financial-advisor-portrait",
      lines: [
        {
          text: "Hello there! I'm a financial advisor. I help people create plans to meet their financial goals. How can I assist you today?",
          responses: [
            { text: "Can you give me some general financial advice?", next: 1 },
            { text: "What's the most important financial habit?", next: 2 },
            { text: "How do I know if I'm on track financially?", next: 3 }
          ]
        },
        {
          text: "Absolutely! My top advice is: 1) Spend less than you earn, 2) Build an emergency fund, 3) Pay off high-interest debt, 4) Save for retirement, and 5) Invest for growth.",
          responses: [
            { text: "That's a lot to remember!", next: 4 },
            { text: "Which should I focus on first?", next: 5 }
          ]
        },
        {
          text: "Paying yourself first! Set aside money for savings and investing BEFORE you spend on wants. Automate it if possible so you're not tempted to skip it.",
          responses: [
            { text: "That makes sense.", next: 6 },
            { text: "How much should I save?", next: 7 }
          ]
        },
        {
          text: "Good question! Financial health indicators include: having an emergency fund, keeping debt below 30% of income, saving at least 15% for retirement, and having positive cash flow (income exceeds expenses).",
          responses: [
            { text: "I'm not sure if I meet those criteria.", next: 8 },
            { text: "Thanks for the information!", next: "end" }
          ]
        },
        {
          text: "Start with one habit at a time. Master it, then move to the next. Personal finance is a marathon, not a sprint!",
          responses: [
            { text: "Where should I start?", next: 5 },
            { text: "Thanks for simplifying it!", next: "end" }
          ]
        },
        {
          text: "Start with getting a stable income and building a small emergency fund. Then focus on high-interest debt if you have any. After that, budget efficiently and start investing for the future.",
          responses: [
            { text: "That's helpful, thank you!", next: "end" }
          ]
        },
        {
          text: "The magic of compound interest works best with time. Even small amounts saved consistently can grow significantly over decades.",
          responses: [
            { text: "How much should I be saving?", next: 7 },
            { text: "I'll start saving right away!", next: "end" }
          ]
        },
        {
          text: "Aim to save at least 20% of your income. This can be split between emergency savings, debt repayment, and long-term investments depending on your situation.",
          responses: [
            { text: "That's a good target to aim for.", next: "end" }
          ]
        },
        {
          text: "That's okay! Everyone starts somewhere. Focus on improving one area at a time. Would you like me to review your specific situation?",
          responses: [
            { text: "Yes, please look at my finances.", next: 9 },
            { text: "No thanks, I'll work on it myself.", next: "end" }
          ]
        },
        {
          text: "Let me see... [The advisor reviews your financial situation] Focus on [current priority based on game state]. That's your best next step.",
          responses: [
            { text: "Thank you for the personalized advice!", next: "end" }
          ],
          onEnd: () => {
            // Determine highest priority based on player's financial situation
            let priority = "";
            if (!gameFlags.hasJob) {
              priority = "finding steady income at the Job Center";
            } else if (!gameFlags.hasBudget) {
              priority = "creating a budget with the guide from the Market";
            } else if (!gameFlags.hasEmergencyFund) {
              priority = "building an emergency fund with guidance from the book at the Beach";
            } else if (!gameFlags.hasInvestmentKnowledge) {
              priority = "learning about investing at the Investment Office";
            } else if (debt > 0) {
              priority = "paying off your debt";
            } else {
              priority = "continuing to grow your investments for retirement";
            }
            
            setGameText(`The financial advisor suggests your current priority should be ${priority}.`);
          }
        }
      ]
    },
    bankManager: {
      character: "Bank Manager",
      portrait: "bank-manager-portrait",
      lines: [
        {
          text: "Welcome to Island National Bank! How can I assist you today?",
          responses: [
            { text: "I'd like to open an account.", next: 1 },
            { text: "Can you tell me about interest rates?", next: 2 },
            { text: "What's a credit score and why is it important?", next: 3 }
          ]
        },
        {
          text: gameFlags.hasBank ? 
            "You already have an account with us! You can use the ATM to deposit or withdraw money." : 
            "Excellent! Opening a savings account is a great first step toward financial security. There's no minimum deposit required to open.",
          responses: [
            { text: gameFlags.hasBank ? "Thanks for the reminder." : "I'd like to open one now.", next: gameFlags.hasBank ? "end" : 4 },
            { text: "What benefits does a savings account offer?", next: 2 }
          ]
        },
        {
          text: "We currently offer a 1% annual interest rate on savings accounts. This means for every 100 coins you keep in the account for a year, you earn 1 extra coin.",
          responses: [
            { text: "That doesn't sound like much.", next: 5 },
            { text: "How does it compare to investment returns?", next: 6 }
          ]
        },
        {
          text: "A credit score is a number between 300-850 that represents your creditworthiness. Higher scores mean you're seen as less risky to lenders, resulting in better loan terms and lower interest rates.",
          responses: [
            { text: "How can I improve my credit score?", next: 7 },
            { text: "Why should I care about borrowing?", next: 8 }
          ]
        },
        {
          text: "Your account is now open! You can deposit money to keep it safe, earn interest, and build savings for emergencies or future goals.",
          responses: [
            { text: "Thanks! I'll start saving.", next: "end" }
          ],
          onEnd: () => {
            if (!gameFlags.hasBank) {
              setGameFlags({...gameFlags, hasBank: true});
              setGameText("You've opened a savings account! You can now use the ATM to deposit or withdraw money.");
            }
          }
        },
        {
          text: "The purpose of a savings account isn't primarily growth - it's safety and liquidity. Your money is secure and available when you need it, unlike investments which fluctuate in value and may be harder to access quickly.",
          responses: [
            { text: "That makes sense for emergency funds.", next: 9 },
            { text: "So where should I put money for growth?", next: 6 }
          ]
        },
        {
          text: "Investments like stocks have historically returned around 7-10% annually over long periods, but come with risk and volatility. Your balance can go down as well as up in the short term.",
          responses: [
            { text: "So I should invest all my money?", next: 10 },
            { text: "I see, diversification is important.", next: 9 }
          ]
        },
        {
          text: "To improve your credit score: 1) Pay all bills on time, 2) Keep credit card balances low, 3) Don't close old accounts, 4) Limit new credit applications, and 5) Regularly check your credit report for errors.",
          responses: [
            { text: "Thanks for the advice!", next: "end" }
          ]
        },
        {
          text: "Good credit helps with more than just loans. It can affect your ability to rent an apartment, your insurance rates, and even some job opportunities. It's an important part of your financial health.",
          responses: [
            { text: "I didn't realize it was so important.", next: "end" }
          ]
        },
        {
          text: "Exactly! A balanced financial plan typically includes an emergency fund in savings accounts (3-6 months of expenses) and longer-term money in appropriate investments.",
          responses: [
            { text: "I'll work on building both.", next: "end" }
          ]
        },
        {
          text: "I wouldn't recommend that. A better approach is keeping emergency funds in savings and investing money you won't need for at least 5-7 years. This balances safety and growth.",
          responses: [
            { text: "That's a more balanced approach.", next: "end" }
          ]
        }
      ]
    },
    jobCounselor: {
      character: "Job Counselor",
      portrait: "job-counselor-portrait",
      lines: [
        {
          text: "Welcome to the Employment Office! Are you looking for work?",
          responses: [
            { text: "Yes, I need a job.", next: 1 },
            { text: "I'm interested in increasing my income.", next: gameFlags.hasJob ? 5 : 2 },
            { text: "What jobs pay the most here?", next: 3 }
          ]
        },
        {
          text: gameFlags.hasJob ? 
            "You're already working as a " + (income === 15 ? "Restaurant Server" : income === 20 ? "Store Clerk" : income === 25 ? "Office Assistant" : "Financial Apprentice") + ". Are you looking for a change?" : 
            "Great! We have several entry-level positions available. The restaurant is hiring servers for 15 coins per day, and it requires no experience.",
          responses: [
            { text: gameFlags.hasJob ? "Yes, I'd like to advance my career." : "I'll take the restaurant job!", next: gameFlags.hasJob ? 5 : 4 },
            { text: "What other jobs are available?", next: 3 }
          ]
        },
        {
          text: "Finding a job is the first step to financial security. Once you have steady income, you can start budgeting, saving, and investing.",
          responses: [
            { text: "What jobs do you have available?", next: 3 },
            { text: "How important is income for financial health?", next: 7 }
          ]
        },
        {
          text: "The store clerk position pays 20 coins per day, office assistant pays 25 coins per day, and financial apprentice pays 40 coins per day but requires financial knowledge.",
          responses: [
            { text: "How do I qualify for better jobs?", next: 5 },
            { text: gameFlags.hasJob ? "I'd like to change jobs." : "I'll take the restaurant job for now.", next: gameFlags.hasJob ? 5 : 4 }
          ]
        },
        {
          text: "Excellent! The restaurant server position is yours. You'll earn 15 coins per day. Remember that increasing your skills can lead to better-paying opportunities!",
          responses: [
            { text: "Thank you! I'll start right away.", next: "end" },
            { text: "How can I advance to better jobs?", next: 5 }
          ],
          onEnd: () => {
            if (!gameFlags.hasJob) {
              setGameFlags({...gameFlags, hasJob: true});
              setIncome(income + 15);
              setExpenses([...expenses, {name: "Transportation to Work", amount: 3}]);
              setGameText("Congratulations! You got a job as a Restaurant Server earning 15 coins per day. You'll also need to spend 3 coins per day on transportation to work.");
            }
          }
        },
        {
          text: "Career advancement requires building both skills and experience. Learning about finances, improving your communication, and reliable performance can all help you move up.",
          responses: [
            { text: "What specific skills should I develop?", next: 6 },
            { text: gameFlags.hasJob && income === 15 && gameFlags.hasBudget ? "I'd like to apply for the store clerk position." : "Thanks for the advice!", next: gameFlags.hasJob && income === 15 && gameFlags.hasBudget ? 8 : "end" }
          ]
        },
        {
          text: "For financial sector jobs, knowledge of budgeting, saving, investing, and credit is valuable. For other jobs, customer service, organization, and reliability are always important.",
          responses: [
            { text: "Where can I learn financial skills?", next: 9 },
            { text: gameFlags.hasJob && income === 15 && gameFlags.hasBudget ? "I'd like to apply for the store clerk position." : "I'll work on those skills!", next: gameFlags.hasJob && income === 15 && gameFlags.hasBudget ? 8 : "end" }
          ]
        },
        {
          text: "Income is the foundation of financial health. While managing money wisely is crucial, having sufficient income gives you more options and makes achieving financial goals easier.",
          responses: [
            { text: "So I should focus on maximizing income?", next: 10 },
            { text: "I'll look for a job right away.", next: 1 }
          ]
        },
        {
          text: "I see you have budgeting experience now! That's great. The store clerk position is available for 20 coins per day. Would you like to take it?",
          responses: [
            { text: "Yes, I'll take the store clerk job!", next: 11 },
            { text: "Not right now, thanks.", next: "end" }
          ]
        },
        {
          text: "You can find financial guides at the Market (budgeting), Beach (saving), Bank (credit), and Investment Office (investing). Each location has resources to help you learn.",
          responses: [
            { text: "I'll look for those guides, thanks!", next: "end" }
          ]
        },
        {
          text: "Balance is key. Increasing income is important, but so is managing expenses and investing wisely. A high income poorly managed won't lead to wealth.",
          responses: [
            { text: "I'll focus on both earning and managing money.", next: "end" }
          ]
        },
        {
          text: "Congratulations! You're now a Store Clerk earning 20 coins per day. Keep developing your financial knowledge for even better opportunities!",
          responses: [
            { text: "Thank you! I'll keep learning.", next: "end" }
          ],
          onEnd: () => {
            setIncome(income - 15 + 20); // Replace old income with new
            setGameText("You've been promoted to Store Clerk! Your daily income is now 20 coins.");
          }
        }
      ]
    },
    shopkeeper: {
      character: "Market Shopkeeper",
      portrait: "shopkeeper-portrait",
      lines: [
        {
          text: "Welcome to the Island Market! What can I get for you today?",
          responses: [
            { text: "What do you sell here?", next: 1 },
            { text: "Do you have any financial advice?", next: 2 },
            { text: "I'm just browsing, thanks.", next: "end" }
          ]
        },
        {
          text: "I sell necessities like food and clothing, as well as some helpful guides. The budgeting guide for 5 coins is popular with newcomers to the island.",
          responses: [
            { text: "Tell me about the budgeting guide.", next: 3 },
            { text: "How much is food?", next: 4 }
          ]
        },
        {
          text: "Running this market has taught me a lot about money! The most important thing is distinguishing between needs and wants. Prioritize necessities before luxuries.",
          responses: [
            { text: "That makes sense.", next: 5 },
            { text: "Is that what budgeting is about?", next: 3 }
          ]
        },
        {
          text: "The budgeting guide teaches the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings and debt payment. It's a simple but effective system.",
          responses: [
            { text: "That sounds useful!", next: 6 },
            { text: "I should probably get that guide.", next: "end" }
          ]
        },
        {
          text: "Basic bread is 2 coins, fruit is 3 coins, and a full meal is 5 coins. Everyone needs to eat, which is why food is a 'need' in your budget, not a 'want'!",
          responses: [
            { text: "So some expenses are unavoidable.", next: 7 },
            { text: "Thanks for the prices.", next: "end" }
          ]
        },
        {
          text: "Exactly! I see too many people struggling because they spent on luxuries before covering their basic needs. Financial stability starts with getting the necessities handled first.",
          responses: [
            { text: "Is that what budgeting helps with?", next: 3 },
            { text: "Wise advice, thank you.", next: "end" }
          ]
        },
        {
          text: "Indeed! Many people avoid budgeting because they think it's restrictive, but it actually gives you freedom by ensuring your important expenses are covered first.",
          responses: [
            { text: "I'll check out that guide.", next: "end" }
          ]
        },
        {
          text: "Right you are! Everyone has necessary expenses like food, shelter, and clothing. A good budget acknowledges these necessities while helping you minimize unnecessary spending.",
          responses: [
            { text: "I should look into budgeting.", next: 3 },
            { text: "I'll be more mindful of my spending.", next: "end" }
          ]
        }
      ]
    },
    investmentAdvisor: {
      character: "Investment Advisor",
      portrait: "investment-advisor-portrait",
      lines: [
        {
          text: "Welcome to the Investment Advisory Office! Are you interested in growing your wealth?",
          responses: [
            { text: "Yes, I want to learn about investing.", next: 1 },
            { text: "What's the difference between saving and investing?", next: 2 },
            { text: "Is investing risky?", next: 3 }
          ]
        },
        {
          text: "Excellent! Investing is how you make your money work for you. The key concepts to understand are compound interest, diversification, and time horizon.",
          responses: [
            { text: "Tell me about compound interest.", next: 4 },
            { text: "What is diversification?", next: 5 },
            { text: "What do you mean by time horizon?", next: 6 }
          ]
        },
        {
          text: "Saving is for money you might need soon - it's safe but grows slowly. Investing is for long-term goals - it can grow much more but with short-term ups and downs.",
          responses: [
            { text: "So I need both?", next: 7 },
            { text: "Which types of investments are there?", next: 8 }
          ]
        },
        {
          text: "All investments carry some risk, but the level varies greatly. Generally, higher potential returns come with higher risk. The key is matching your risk level to your time horizon.",
          responses: [
            { text: "How can I reduce investment risk?", next: 5 },
            { text: "What's a good first investment?", next: 9 }
          ]
        },
        {
          text: "Compound interest is when you earn returns not just on your original investment, but also on the returns you've already earned. It's like a snowball effect that accelerates over time.",
          responses: [
            { text: "That sounds powerful.", next: 10 },
            { text: "Can you give an example?", next: 11 }
          ]
        },
        {
          text: "Diversification means spreading your investments across different types of assets to reduce risk. It's the financial equivalent of not putting all your eggs in one basket.",
          responses: [
            { text: "What kinds of assets should I diversify across?", next: 8 },
            { text: "Does diversification guarantee I won't lose money?", next: 12 }
          ]
        },
        {
          text: "Time horizon is how long you plan to invest before needing the money. Longer horizons (5+ years) allow for more growth-focused investments, while shorter horizons require more conservative approaches.",
          responses: [
            { text: "So different goals need different investment approaches?", next: 13 },
            { text: "What's good for retirement investing?", next: 14 }
          ]
        },
        {
          text: "Absolutely! A strong financial foundation includes both: savings for emergencies and short-term goals, and investments for long-term growth and retirement.",
          responses: [
            { text: "That makes sense!", next: 15 },
            { text: "What should I invest in first?", next: 9 }
          ]
        },
        {
          text: "The main types are stocks (ownership in companies), bonds (loans to companies or governments), mutual funds (collections of stocks/bonds), real estate, and cash equivalents like CDs.",
          responses: [
            { text: "Which has the best returns?", next: 16 },
            { text: "Which is safest?", next: 17 }
          ]
        },
        {
          text: "For beginners, a low-cost index fund is excellent. It provides instant diversification across many companies and requires minimal knowledge to get started.",
          responses: [
            { text: "How much do I need to start?", next: 18 },
            { text: "What about individual stocks?", next: 19 }
          ]
        },
        {
          text: "It is! Albert Einstein reportedly called compound interest the 'eighth wonder of the world.' The longer you can let your investments compound, the more dramatic the growth.",
          responses: [
            { text: "So I should start investing early?", next: 20 },
            { text: "Can you give an example?", next: 11 }
          ]
        },
        {
          text: "Sure! If you invest 100 coins at 7% annual return, after one year you have 107. Next year, you earn 7% on 107 (not just the original 100), giving you 114.49. This effect becomes dramatic over decades.",
          responses: [
            { text: "So time is crucial for investing.", next: 20 },
            { text: "What's a realistic return rate?", next: 21 }
          ]
        },
        {
          text: "No, diversification reduces risk but doesn't eliminate it. In severe market downturns, many asset classes can fall simultaneously, though usually not by the same amount.",
          responses: [
            { text: "So there's always some risk?", next: 22 },
            { text: "What's the best diversification strategy?", next: 23 }
          ]
        },
        {
          text: "Exactly! Your emergency fund might be in a savings account, house down payment in CDs or bonds, and retirement in stock-heavy mutual funds.",
          responses: [
            { text: "That makes investing seem less intimidating.", next: 24 },
            { text: "I should set clear financial goals then.", next: 15 }
          ]
        },
        {
          text: "Retirement investing benefits greatly from stocks and stock funds because of the long time horizon. The short-term volatility is less important when you won't need the money for decades.",
          responses: [
            { text: "When should I start retirement investing?", next: 25 },
            { text: "What about closer to retirement?", next: 26 }
          ]
        },
        {
          text: "Setting specific financial goals is the foundation of good investing. Know what you're investing for and when you'll need the money before deciding how to invest it.",
          responses: [
            { text: "I'll work on defining my goals.", next: "end" }
          ],
          onEnd: () => {
            if (!gameFlags.hasInvestmentKnowledge && inventory.some(item => item.id === "investmentGuide")) {
              setGameText("You have the investment guide in your inventory. Using it and applying what you've learned here will help you understand investing better.");
            } else if (!inventory.some(item => item.id === "investmentGuide")) {
              setGameText("The investment advisor's knowledge is helpful, but you should also get the investment guide from this office to fully understand investing fundamentals.");
            }
          }
        },
        {
          text: "Historically, stocks have provided the highest long-term returns (around 7-10% annually averaged over decades), but with significant short-term volatility.",
          responses: [
            { text: "And the safer options?", next: 17 },
            { text: "Is that why stocks are recommended for long-term goals?", next: 27 }
          ]
        },
        {
          text: "Government bonds and high-yield savings accounts are among the safest, but offer lower returns (1-4% typically). There's always a trade-off between risk and potential return.",
          responses: [
            { text: "So higher return means higher risk?", next: 22 },
            { text: "What's a balanced approach?", next: 23 }
          ]
        },
        {
          text: "Many index funds allow you to start with very little money. Even 50 coins can get you started, though consistently adding more over time is key to building wealth.",
          responses: [
            { text: "That's more accessible than I thought!", next: 28 },
            { text: "And how often should I invest?", next: 29 }
          ]
        },
        {
          text: "Individual stocks require more knowledge, time, and risk tolerance. Even professionals struggle to consistently pick winning stocks. For most people, diversified funds are more appropriate.",
          responses: [
            { text: "Index funds sound better for beginners.", next: 28 },
            { text: "But individual stocks could have higher returns?", next: 30 }
          ]
        },
        {
          text: "Absolutely! Time is the most powerful factor in investing. Starting just 10 years earlier can double your final amount due to compound growth.",
          responses: [
            { text: "I should start as soon as possible then.", next: "end" }
          ]
        },
        {
          text: "Over long periods (20+ years), the stock market has historically returned around 7-10% annually on average, though any individual year could be much higher or lower.",
          responses: [
            { text: "That's significant compounding over decades!", next: 20 },
            { text: "But there are no guarantees?", next: 22 }
          ]
        },
        {
          text: "Yes, investing always involves risk. The key is managing that risk through appropriate asset allocation, diversification, and time horizon.",
          responses: [
            { text: "Is that why investing is for long-term goals?", next: 27 },
            { text: "I think I understand the basics now.", next: "end" }
          ]
        },
        {
          text: "A common strategy is age-based allocation: Subtract your age from 110, and that percentage goes to stocks, the rest to bonds. So at 30, you'd have 80% stocks, 20% bonds.",
          responses: [
            { text: "That's a simple rule to follow.", next: 24 },
            { text: "What about other assets like real estate?", next: 31 }
          ]
        },
        {
          text: "Breaking investing down into specific goals with appropriate strategies makes it much more manageable. Start with one investment and build from there.",
          responses: [
            { text: "I'm ready to get started! What's first?", next: 9 },
            { text: "Thanks for all the knowledge!", next: "end" }
          ]
        },
        {
          text: "As early as possible! The power of compounding means that even small amounts invested in your 20s can grow to substantial sums by retirement.",
          responses: [
            { text: "Better late than never though, right?", next: 32 },
            { text: "I'll make retirement investing a priority.", next: "end" }
          ]
        },
        {
          text: "As you approach retirement, gradually shifting toward more conservative investments is wise. This protects your nest egg from a market downturn right when you need the money.",
          responses: [
            { text: "That makes sense - less risk as the goal gets closer.", next: "end" }
          ]
        },
        {
          text: "Exactly! The longer your time horizon, the more short-term volatility you can withstand for greater long-term growth potential.",
          responses: [
            { text: "I'll remember to match investments to time horizons.", next: "end" }
          ]
        },
        {
          text: "Index funds are an excellent foundation for any investment portfolio. They provide broad market exposure with low fees.",
          responses: [
            { text: "I'd like to invest in an index fund.", next: 33 },
            { text: "Thanks for the advice!", next: "end" }
          ]
        },
        {
          text: "Regular, consistent investing is key. Many successful investors use dollar-cost averaging - investing a fixed amount at regular intervals regardless of market conditions.",
          responses: [
            { text: "Like a monthly investment plan?", next: 34 },
            { text: "Should I wait for market dips to invest?", next: 35 }
          ]
        },
        {
          text: "Potentially, yes. But studies show that even professional investors rarely outperform the market consistently over long periods. The extra return comes with significantly more risk.",
          responses: [
            { text: "I'll stick with index funds for now.", next: "end" }
          ]
        },
        {
          text: "Real estate and alternative investments can be valuable additions to a diversified portfolio, but they're generally more complex and often require more capital to start.",
          responses: [
            { text: "I'll focus on stocks and bonds first.", next: "end" }
          ]
        },
        {
          text: "Absolutely! While starting early is ideal, the second-best time to start is today. You may need to save more aggressively if starting later, but it's never too late to begin.",
          responses: [
            { text: "That's encouraging!", next: "end" }
          ]
        },
        {
          text: "Excellent choice! To invest in an index fund here, you'll need to use the investment terminal. You need at least 50 coins and a solid understanding of investment principles.",
          responses: [
            { text: "I'll use the terminal once I'm ready.", next: "end" }
          ],
          onEnd: () => {
            if (!gameFlags.hasInvestmentKnowledge && inventory.some(item => item.id === "investmentGuide")) {
              setGameText("Read your investment guide first to gain the knowledge required to use the investment terminal.");
            }
          }
        },
        {
          text: "Exactly! Setting up an automatic monthly investment is one of the most powerful financial habits you can establish.",
          responses: [
            { text: "I'll plan for regular investments.", next: "end" }
          ]
        },
        {
          text: "Trying to time the market is extremely difficult even for professionals. Studies show that time in the market beats timing the market for most investors.",
          responses: [
            { text: "Regular investing sounds more practical.", next: 29 },
            { text: "I understand now. Thanks!", next: "end" }
          ]
        }
      ]
    },
    retirementPlanner: {
      character: "Retirement Planner",
      portrait: "retirement-planner-portrait",
      lines: [
        {
          text: "Welcome to the Retirement Planning Center! It's never too early to start planning for your future financial security.",
          responses: [
            { text: "Why should I think about retirement now?", next: 1 },
            { text: "How much do I need to save for retirement?", next: 2 },
            { text: "What's the best retirement investment strategy?", next: 3 }
          ]
        },
        {
          text: "The earlier you start, the less you need to save each month due to the power of compound growth. Starting in your 20s might require saving 10-15% of income, while waiting until your 40s could require 20-30%.",
          responses: [
            { text: "That's a compelling reason to start early!", next: 4 },
            { text: "What should I invest my retirement savings in?", next: 3 }
          ]
        },
        {
          text: "A common guideline is to aim for 25 times your annual expenses. So if you need 40,000 coins per year, you'd aim for 1 million coins. This supports the '4% rule' for sustainable withdrawals.",
          responses: [
            { text: "That seems like a lot!", next: 5 },
            { text: "What's the 4% rule?", next: 6 }
          ]
        },
        {
          text: "For long-term retirement investing, a diversified portfolio of primarily stocks when you're younger, gradually shifting to include more bonds as you age, has historically worked well.",
          responses: [
            { text: "How should the allocation change with age?", next: 7 },
            { text: "Are there retirement-specific investment accounts?", next: 8 }
          ]
        },
        {
          text: "Indeed! The difference can be dramatic. Investing 200 coins monthly from age 25 to 65 at 7% return yields about 525,000 coins. Waiting until 35 yields only 250,000 - less than half!",
          responses: [
            { text: "I should prioritize starting, even with small amounts.", next: 9 },
            { text: "Can I catch up if I start late?", next: 10 }
          ]
        },
        {
          text: "It is, but remember it grows over time through consistent contributions and compound growth. Most people build retirement wealth gradually throughout their working years.",
          responses: [
            { text: "What if I can't save that much?", next: 11 },
            { text: "How can I maximize my retirement savings?", next: 12 }
          ]
        },
        {
          text: "The 4% rule suggests you can withdraw 4% of your retirement portfolio in the first year, then adjust that amount for inflation each year, with a high probability of not running out of money over a 30-year retirement.",
          responses: [
            { text: "Is 4% always the right withdrawal rate?", next: 13 },
            { text: "That's helpful for setting a target!", next: "end" }
          ]
        },
        {
          text: "A common guideline is the 'Rule of 100': Subtract your age from 100 to get your stock percentage. So at 30, you'd have 70% stocks, 30% bonds. More conservative investors might use 110 or 120 instead of 100.",
          responses: [
            { text: "That's an easy rule to remember.", next: 14 },
            { text: "Why reduce stock exposure as you age?", next: 15 }
          ]
        },
        {
          text: "Yes! The Retirement Account gives tax advantages for long-term saving. Contributions may be tax-deductible now or withdrawals may be tax-free later, depending on the account type.",
          responses: [
            { text: "How do I open a retirement account?", next: 16 },
            { text: "That sounds beneficial!", next: "end" }
          ]
        },
        {
          text: "Absolutely! Starting with even small amounts is far better than waiting until you can save more. You can increase your contributions as your income grows.",
          responses: [
            { text: "What percentage of income should I aim to save?", next: 17 },
            { text: "I'll start as soon as possible!", next: "end" }
          ]
        },
        {
          text: "Yes, but it requires saving more aggressively. Increasing your savings rate, working a few years longer, or considering part-time work in retirement can help make up for a late start.",
          responses: [
            { text: "Every little bit helps, I guess.", next: 9 },
            { text: "I'll make retirement saving a priority.", next: "end" }
          ]
        },
        {
          text: "Start with whatever you can, even 1% of your income, and increase it gradually. Some success is better than perfect plans never implemented. You can adjust as your situation changes.",
          responses: [
            { text: "That makes it seem more achievable.", next: "end" }
          ]
        },
        {
          text: "Take full advantage of any employer matching in retirement plans - it's free money! Consistently increase savings as your income grows, and maintain a diversified, low-fee investment approach.",
          responses: [
            { text: "What about paying off debt versus saving for retirement?", next: 18 },
            { text: "Thanks for the strategies!", next: "end" }
          ]
        },
        {
          text: "It's a guideline, not a rule. In periods of low returns or high inflation, a lower withdrawal rate (3-3.5%) might be more sustainable. Your specific situation and market conditions matter.",
          responses: [
            { text: "So I should be flexible with my withdrawals?", next: 19 },
            { text: "I see, it's a starting point for planning.", next: "end" }
          ]
        },
        {
          text: "It is! Another approach is having 3-5 years of expenses in bonds/cash, with the rest in a diversified stock portfolio. This provides safety for near-term withdrawals while allowing for long-term growth.",
          responses: [
            { text: "That's an interesting strategy!", next: "end" }
          ]
        },
        {
          text: "As you approach retirement, you have less time to recover from market downturns. Reducing stock exposure helps protect the wealth you've built when you're getting close to needing it.",
          responses: [
            { text: "Makes sense to be more conservative as the goal gets closer.", next: "end" }
          ]
        },
        {
          text: "Visit our retirement specialist at the counter with at least 100 coins for an initial deposit. We'll help you choose between Traditional and Roth options based on your situation.",
          responses: [
            { text: "I'll do that when I have enough saved up.", next: "end" }
          ],
          onEnd: () => {
            if (gameFlags.hasInvestmentKnowledge && money >= 100 && !gameFlags.hasRetirementPlan) {
              setGameText("You have enough money and knowledge to open a retirement account. Visit the retirement specialist when you're ready!");
            }
          }
        },
        {
          text: "Aim for 15% of your pre-tax income as a general target. If that's not immediately possible, start with what you can and work up to it gradually.",
          responses: [
            { text: "15% seems like a good target to work toward.", next: "end" }
          ]
        },
        {
          text: "Generally, prioritize high-interest debt (above 6-8%) before maximizing retirement contributions. For lower-interest debt, consider doing both - perhaps meeting any employer match, then tackling debt, then additional retirement saving.",
          responses: [
            { text: "That's a sensible balanced approach.", next: "end" }
          ]
        },
        {
          text: "Yes! The most successful retirees adjust their spending based on market performance - spending a bit less after down years and potentially more after strong returns.",
          responses: [
            { text: "Flexibility seems key to retirement success.", next: "end" }
          ],
          onEnd: () => {
            if (!gameFlags.hasRetirementPlan && gameFlags.hasInvestmentKnowledge) {
              setGameText("Now that you understand retirement planning concepts, consider opening a retirement account when you have sufficient funds.");
            }
          }
        }
      ]
    },
    debtCounselor: {
      character: "Debt Counselor",
      portrait: "debt-counselor-portrait",
      lines: [
        {
          text: "Welcome to the Debt Counseling Center. I'm here to help you understand and manage debt effectively.",
          responses: [
            { text: "Is all debt bad?", next: 1 },
            { text: "What's the best way to pay off debt?", next: 2 },
            { text: "How does debt affect my financial health?", next: 3 }
          ]
        },
        {
          text: "Not all debt is equal. Productive debt like education loans or mortgages can build wealth long-term. Consumer debt for depreciating items like clothes or electronics generally isn't beneficial.",
          responses: [
            { text: "So some debt can be a tool?", next: 4 },
            { text: "What makes debt 'good' or 'bad'?", next: 5 }
          ]
        },
        {
          text: "There are two popular methods: The Avalanche Method prioritizes highest-interest debt first (saving the most money), while the Snowball Method pays smallest balances first (building momentum with quick wins).",
          responses: [
            { text: "Which method is better?", next: 6 },
            { text: "What about minimum payments?", next: 7 }
          ]
        },
        {
          text: "Debt affects your credit score, cash flow, and stress levels. High-interest debt particularly limits your ability to build wealth, as money goes to interest rather than investments.",
          responses: [
            { text: "How much debt is too much?", next: 8 },
            { text: "Does all debt affect credit score equally?", next: 9 }
          ]
        },
        {
          text: "Yes, when used wisely! Debt can help build assets, start businesses, or increase earning potential. The key is whether the debt creates more value than it costs.",
          responses: [
            { text: "That makes sense!", next: 10 },
            { text: "What types of debt should I avoid?", next: 11 }
          ]
        },
        {
          text: "Good debt typically has lower interest rates, is potentially tax-deductible, builds assets or income potential, and is affordable within your budget. Bad debt has opposite characteristics.",
          responses: [
            { text: "So mortgage debt might be 'good'?", next: 12 },
            { text: "And credit card debt is usually 'bad'?", next: 13 }
          ]
        },
        {
          text: "Both work! Mathematically, the Avalanche Method saves more money. But psychologically, the Snowball Method keeps many people more motivated through quick wins. The best method is the one you'll stick with.",
          responses: [
            { text: "I'd probably prefer quick wins.", next: 14 },
            { text: "I'd rather save the most money possible.", next: 15 }
          ]
        },
        {
          text: "Always make all minimum payments first to avoid fees and credit damage. Then use your chosen method to decide where extra money goes. Even small extra payments can dramatically reduce repayment time.",
          responses: [
            { text: "How much difference do extra payments make?", next: 16 },
            { text: "That's helpful advice!", next: "end" }
          ]
        },
        {
          text: "A common guideline is keeping debt payments below 36% of gross income, with housing below 28%. But comfort level varies - some prefer lower debt for more flexibility.",
          responses: [
            { text: "What about debt-to-income ratio?", next: 17 },
            { text: "That's a useful benchmark.", next: "end" }
          ]
        },
        {
          text: "No. Payment history affects all credit, but credit cards impact 'credit utilization' (percentage of available credit used). Keeping this under 30% helps your score.",
          responses: [
            { text: "So I should keep balances low relative to limits?", next: 18 },
            { text: "Does paying off debt improve my score?", next: 19 }
          ]
        },
        {
          text: "Remember: debt is a financial tool, like a chainsaw - powerful when used correctly, potentially harmful otherwise. Intention and knowledge make all the difference.",
          responses: [
            { text: "I'll be thoughtful about taking on debt.", next: "end" }
          ]
        },
        {
          text: "High-interest consumer debt like payday loans and high-interest credit cards. Also be cautious with debt for rapidly depreciating items like electronics and clothing.",
          responses: [
            { text: "What's considered a high interest rate?", next: 20 },
            { text: "I'll avoid those types of debt.", next: "end" }
          ]
        },
        {
          text: "Typically yes, if affordable for you. It's usually lower interest, builds equity in an appreciating asset, and may provide tax benefits. But even 'good' debt should align with your overall financial goals.",
          responses: [
            { text: "That's helpful perspective.", next: "end" }
          ]
        },
        {
          text: "Usually, yes. With average interest rates of 16-24%, credit card debt is expensive and offers no asset growth. It's one of the first debts most financial experts recommend eliminating.",
          responses: [
            { text: "What if I can't pay it all at once?", next: 21 },
            { text: "I'll make paying that off a priority!", next: "end" }
          ]
        },
        {
          text: "The Snowball Method is great for many people! The psychological boost from eliminating entire debts can help maintain motivation for the entire debt payoff journey.",
          responses: [
            { text: "I think that approach would work for me.", next: "end" }
          ]
        },
        {
          text: "The Avalanche Method is mathematically optimal. If you have the discipline to stick with it even when progress feels slow at first, you'll save the most in interest.",
          responses: [
            { text: "I like optimizing my approach.", next: "end" }
          ]
        },
        {
          text: "Dramatic difference! On a 5,000 coin debt at 18% interest with a 100 coin minimum payment, adding just 50 extra coins monthly cuts repayoff time from 93 months to 30 months and saves 2,400 coins in interest!",
          responses: [
            { text: "That's incredible motivation to pay extra!", next: "end" }
          ]
        },
        {
          text: "Lenders typically want a debt-to-income ratio under 36%, with housing costs under 28%. Lower is generally better for financial flexibility and stress reduction.",
          responses: [
            { text: "I'll keep my debt ratios in mind.", next: "end" }
          ]
        },
        {
          text: "Exactly! Low utilization shows responsible credit use. Ideally, keep credit card balances below 30% of your limits, and ideally pay in full monthly to avoid interest.",
          responses: [
            { text: "Good to know, thanks!", next: "end" }
          ]
        },
        {
          text: "Yes, reducing debt helps your score by lowering utilization. But don't close old accounts after paying them off - the length of credit history also matters.",
          responses: [
            { text: "I didn't know that about keeping accounts open.", next: "end" }
          ]
        },
        {
          text: "Generally, anything above 10% is worth scrutinizing, and above 15-20% should typically be prioritized for payoff. The higher the rate, the more urgently it should be addressed.",
          responses: [
            { text: "That helps me prioritize which debts to tackle first.", next: "end" }
          ]
        },
        {
          text: "Create a plan! Pay at least the minimum on all debts, then put extra money toward either highest-interest debt (Avalanche) or smallest balance (Snowball). Consistent progress is key.",
          responses: [
            { text: "I'll develop a debt payoff plan.", next: "end" }
          ],
          onEnd: () => {
            if (debt > 0) {
              setGameText("With your new knowledge about debt management, you can create a plan to pay off your " + debt + " coins of debt efficiently.");
            } else {
              setGameText("Now you understand debt management strategies for the future. Avoiding high-interest debt is a key part of financial success.");
            }
          }
        }
      ]
    }
  };

  // Initialize game
  useEffect(() => {
    // Any initialization code here
    
    // Add town exits to retirement and debt centers
    const updatedTown = {...locations.town};
    updatedTown.exits.retirementCenter = "Visit Retirement Center";
    updatedTown.exits.debtCounseling = "Visit Debt Counseling Center";
    locations.town = updatedTown;
    
    // Set up daily income/expense cycle
    const gameTimer = setInterval(() => {
      advanceDay();
    }, 60000); // Advance one day every minute (for demonstration purposes)
    
    return () => clearInterval(gameTimer);
  }, []);

  // Function to advance the game day
  const advanceDay = () => {
    // Apply income if player has a job
    if (gameFlags.hasJob) {
      setMoney(money + income);
      
      // Apply expenses
      let totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
      setMoney(prevMoney => Math.max(0, prevMoney - totalExpenses));
      
      // Apply investment returns if any
      if (investments.length > 0) {
        const totalReturns = investments.reduce((total, investment) => {
          // Simple daily return (equivalent to about 7% annually)
          const dailyReturn = investment.amount * 0.0002;
          return total + dailyReturn;
        }, 0);
        
        if (totalReturns > 0) {
          // Update investments with new values
          setInvestments(investments.map(investment => ({
            ...investment,
            currentValue: investment.currentValue + (investment.amount * 0.0002)
          })));
          
          setBankBalance(bankBalance + totalReturns);
        }
      }
      
      // Apply interest to debt if any
      if (debt > 0) {
        // Simple daily interest (equivalent to about 18% annually)
        const dailyInterest = debt * 0.0005;
        setDebt(debt + dailyInterest);
      }
      
      // Apply interest to bank balance if any
      if (bankBalance > 0) {
        // Simple daily interest (equivalent to about 1% annually)
        const dailyInterest = bankBalance * 0.00003;
        setBankBalance(bankBalance + dailyInterest);
      }
    }
    
    // Advance the game day
    setGameDay(gameDay + 1);
    
    // Random events based on day
    if (gameDay % 7 === 0) { // Weekly events
      // Random financial event
      const events = [
        "You found 5 coins on the ground! (+5 coins)",
        "Your utility bill was higher than expected. (-3 coins)",
        "A friend treated you to lunch today!",
        "You received a small bonus at work! (+10 coins)"
      ];
      
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setGameText(randomEvent);
      
      if (randomEvent.includes("+5")) {
        setMoney(money + 5);
      } else if (randomEvent.includes("+10")) {
        setMoney(money + 10);
      } else if (randomEvent.includes("-3")) {
        setMoney(Math.max(0, money - 3));
      }
    }
    
    // Check win condition
    checkFinancialFreedom();
  };

  // Check if player has achieved financial freedom
  const checkFinancialFreedom = () => {
    // Financial freedom conditions:
    // 1. Has emergency fund (savings >= 3 months of expenses)
    // 2. Has investments generating passive income
    // 3. Has retirement plan
    // 4. No debt
    
    const monthlyExpenses = expenses.reduce((total, expense) => total + expense.amount, 0) * 30;
    const hasEmergencyFund = bankBalance >= monthlyExpenses * 3;
    
    const hasPassiveIncome = investments.length > 0 && 
      investments.reduce((total, investment) => total + (investment.amount * 0.0002 * 30), 0) >= monthlyExpenses * 0.5;
    
    if (hasEmergencyFund && hasPassiveIncome && gameFlags.hasRetirementPlan && debt === 0) {
      setGameFlags({...gameFlags, completedFinancialFreedom: true});
      setGameText("Congratulations! You've achieved Financial Freedom! You have an adequate emergency fund, investments generating passive income, a retirement plan, and no debt. You've successfully escaped Financial Island with your newfound financial wisdom!");
    }
  };

  // Game actions
  const moveToLocation = (locationId) => {
    setCurrentLocation(locationId);
    setGameText(locations[locationId].description);
    setSelectedItem(null);
  };

  const addToInventory = (item) => {
    setInventory([...inventory, item]);
  };

  const selectVerb = (verb) => {
    setVerbSelected(verb);
    setSelectedItem(null);
    setGameText(`${verb.charAt(0).toUpperCase() + verb.slice(1)} what?`);
  };

  const selectInventoryItem = (item) => {
    if (verbSelected === 'use') {
      setSelectedItem(item);
      setGameText(`Use ${item.name} with what?`);
    } else {
      // Directly interact with the item
      handleInteraction(item, verbSelected);
    }
  };

  const startDialogue = (characterId) => {
    setDialogueActive(true);
    setCurrentDialogue({
      character: dialogues[characterId].character,
      portrait: dialogues[characterId].portrait,
      lines: dialogues[characterId].lines,
      currentLine: 0
    });
    return "Starting conversation...";
  };

  const selectDialogueResponse = (responseIndex) => {
    const response = currentDialogue.lines[currentDialogue.currentLine].responses[responseIndex];
    
    if (response.next === "end") {
      // End dialogue
      const onEnd = currentDialogue.lines[currentDialogue.currentLine].onEnd;
      if (onEnd) onEnd();
      setDialogueActive(false);
    } else {
      // Move to next dialogue line
      setCurrentDialogue({
        ...currentDialogue,
        currentLine: response.next
      });
    }
  };

  const handleInteraction = (target, verb) => {
    let result;
    
    // Handle inventory item interactions
    if (target.id && inventory.find(item => item.id === target.id)) {
      if (verb === 'look' && target.interaction && target.interaction.look) {
        result = typeof target.interaction.look === 'function' ? target.interaction.look() : target.interaction.look;
      } else if (verb === 'use' && !selectedItem) {
        if (target.interaction && target.interaction.use) {
          result = typeof target.interaction.use === 'function' ? target.interaction.use() : target.interaction.use;
        } else {
          selectInventoryItem(target);
          return;
        }
      } else {
        result = "I can't do that with this item.";
      }
    } 
    // Handle hotspot interactions
    else if (target.interaction) {
      if (verb === 'use' && selectedItem) {
        // Using an inventory item with a hotspot
        if (target.interaction.use) {
          result = typeof target.interaction.use === 'function' 
            ? target.interaction.use(selectedItem) 
            : target.interaction.use;
        } else {
          result = `I can't use ${selectedItem.name} with that.`;
        }
        setSelectedItem(null);
      } else if (target.interaction[verb]) {
        // Standard verb interaction
        result = typeof target.interaction[verb] === 'function' 
          ? target.interaction[verb]() 
          : target.interaction[verb];
      } else {
        result = `I can't ${verb} that.`;
      }
    } else {
      result = `I can't ${verb} that.`;
    }
    
    setGameText(result);
  };

  const handleHotspotClick = (hotspot) => {
    if (verbSelected === 'walk') {
      setGameText(`Walking to ${hotspot.name}...`);
    } else {
      handleInteraction(hotspot, verbSelected);
    }
  };

  const openBankingScreen = () => {
    // This would open a banking interface for deposits and withdrawals
    // For demonstration purposes, we'll use a simple alert
    setGameText("Banking screen opened. You can deposit or withdraw money here.");
  };

  const openInvestmentScreen = () => {
    // This would open an investment interface
    // For demonstration purposes, we'll use a simple alert
    setGameText("Investment screen opened. You can buy index funds, stocks, or bonds here.");
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const toggleFinancialDashboard = () => {
    setShowFinancialDashboard(!showFinancialDashboard);
  };

  const handleFinancialQuiz = (quizId, answerIndex) => {
    const quiz = financialQuizzes[quizId];
    const currentQuestion = quiz.currentQuestion || 0;
    
    if (answerIndex === quiz.questions[currentQuestion].correctAnswer) {
      // Correct answer
      if (currentQuestion === quiz.questions.length - 1) {
        // Last question - completed quiz
        quiz.reward();
        setShowFinancialQuizModal(false);
        setCurrentQuiz(null);
      } else {
        // Move to next question
        quiz.currentQuestion = currentQuestion + 1;
        setFinancialQuizzes({...financialQuizzes, [quizId]: quiz});
      }
    } else {
      // Incorrect answer
      setGameText("That's not quite right. Try again!");
    }
  };

  // Deposit money to bank
  const depositMoney = (amount) => {
    if (amount > money) {
      setGameText("You don't have that much money to deposit.");
      return;
    }
    
    setBankBalance(bankBalance + amount);
    setMoney(money - amount);
    setGameText(`You deposited ${amount} coins into your savings account.`);
  };

  // Withdraw money from bank
  const withdrawMoney = (amount) => {
    if (amount > bankBalance) {
      setGameText("You don't have that much money in your account.");
      return;
    }
    
    setBankBalance(bankBalance - amount);
    setMoney(money + amount);
    setGameText(`You withdrew ${amount} coins from your savings account.`);
  };

  // Make investment
  const makeInvestment = (type, amount) => {
    if (amount > money) {
      setGameText("You don't have enough money for this investment.");
      return;
    }
    
    let newInvestment = {
      id: investments.length + 1,
      type: type,
      amount: amount,
      currentValue: amount,
      purchaseDay: gameDay
    };
    
    setInvestments([...investments, newInvestment]);
    setMoney(money - amount);
    setGameText(`You invested ${amount} coins in ${type}!`);
  };

  // Make debt payment
  const makeDebtPayment = (amount) => {
    if (amount > money) {
      setGameText("You don't have enough money to make this payment.");
      return;
    }
    
    if (amount > debt) {
      amount = debt; // Don't overpay
    }
    
    setDebt(debt - amount);
    setMoney(money - amount);
    setGameText(`You made a ${amount} coin payment toward your debt!`);
    
    if (debt - amount <= 0) {
      setGameFlags({...gameFlags, hasPaidDebt: true});
      setGameText("Congratulations! You've paid off all your debt!");
    }
  };

  // Take on debt (credit)
  const borrowMoney = (amount) => {
    setDebt(debt + amount);
    setMoney(money + amount);
    setGameText(`You borrowed ${amount} coins. Your total debt is now ${debt + amount} coins.`);
  };

  // Open retirement account
  const openRetirementAccount = () => {
    if (money < 100) {
      setGameText("You need at least 100 coins to open a retirement account.");
      return;
    }
    
    setMoney(money - 100);
    setGameFlags({...gameFlags, hasRetirementPlan: true});
    setGameText("Congratulations! You've opened a retirement account with an initial 100 coin deposit. You're now on track for long-term financial security!");
  };

  // Render financial quiz modal
  const renderFinancialQuizModal = () => {
    if (!showFinancialQuizModal || !currentQuiz) return null;
    
    const quiz = financialQuizzes[currentQuiz];
    const currentQuestion = quiz.currentQuestion || 0;
    const question = quiz.questions[currentQuestion];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4">
        <div className="bg-blue-900 border-2 border-yellow-500 rounded-lg p-6 w-full max-w-2xl">
          <h2 className="text-yellow-500 text-xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-white mb-6">{quiz.description}</p>
          
          <div className="mb-6">
            <h3 className="text-white font-bold mb-3">Question {currentQuestion + 1} of {quiz.questions.length}</h3>
            <p className="text-white text-lg mb-4">{question.question}</p>
            
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button 
                  key={index}
                  onClick={() => handleFinancialQuiz(currentQuiz, index)}
                  className="bg-purple-800 hover:bg-purple-700 text-white w-full py-2 px-4 rounded text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setShowFinancialQuizModal(false)}
            className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Cancel Quiz
          </button>
        </div>
      </div>
    );
  };

  // Render financial dashboard
  const renderFinancialDashboard = () => {
    if (!showFinancialDashboard) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4">
        <div className="bg-blue-900 border-2 border-yellow-500 rounded-lg p-6 w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-yellow-500 text-2xl font-bold">Financial Dashboard</h2>
            <button 
              onClick={toggleFinancialDashboard}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-4">Financial Status</h3>
              <div className="space-y-4">
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Cash:</span>
                    <span className="text-white font-bold">{money.toFixed(2)} coins</span>
                  </div>
                </div>
                
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Bank Balance:</span>
                    <span className="text-white font-bold">{bankBalance.toFixed(2)} coins</span>
                  </div>
                </div>
                
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Debt:</span>
                    <span className="text-red-400 font-bold">{debt.toFixed(2)} coins</span>
                  </div>
                </div>
                
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Credit Score:</span>
                    <span className={`font-bold ${creditScore >= 670 ? 'text-green-400' : creditScore >= 580 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {creditScore}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Income and Expenses */}
              <h3 className="text-xl font-semibold text-purple-300 mt-6 mb-4">Income & Expenses</h3>
              <div className="bg-blue-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Daily Income:</span>
                  <span className="text-green-400 font-bold">{income.toFixed(2)} coins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Daily Expenses:</span>
                  <span className="text-red-400 font-bold">
                    {expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)} coins
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-4">Financial Progress</h3>
              <div className="space-y-4">
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Emergency Fund:</span>
                    <span className={`font-bold ${gameFlags.hasEmergencyFund ? 'text-green-400' : 'text-yellow-400'}`}>
                      {gameFlags.hasEmergencyFund ? 'Established' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (bankBalance / (expenses.reduce((total, expense) => total + expense.amount, 0) * 90)) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Goal: 3 months of expenses</p>
                </div>
                
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Budget:</span>
                    <span className={`font-bold ${gameFlags.hasBudget ? 'text-green-400' : 'text-yellow-400'}`}>
                      {gameFlags.hasBudget ? 'Created' : 'Not Created'}
                    </span>
                  </div>
                  {gameFlags.hasBudget && budget && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300">Needs (50%):</span>
                        <span className="text-white">{budget.needs.toFixed(2)} coins</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-300">Wants (30%):</span>
                        <span className="text-white">{budget.wants.toFixed(2)} coins</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-300">Savings (20%):</span>
                        <span className="text-white">{budget.savings.toFixed(2)} coins</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white">Investments:</span>
                    <span className={`font-bold ${investments.length > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {investments.length > 0 ? `${investments.length} Investments` : 'None Yet'}
                    </span>
                  </div>
                  {investments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {investments.map((investment, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-blue-300">{investment.type}:</span>
                          <span className="text-white">{investment.currentValue.toFixed(2)} coins</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Financial Freedom:</span>
                    <span className={`font-bold ${gameFlags.completedFinancialFreedom ? 'text-green-400' : 'text-yellow-400'}`}>
                      {gameFlags.completedFinancialFreedom ? 'Achieved!' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Banking Actions</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => depositMoney(10)}
                  disabled={money < 10}
                  className={`px-3 py-1 rounded ${money < 10 ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}
                >
                  Deposit 10
                </button>
                <button 
                  onClick={() => withdrawMoney(10)}
                  disabled={bankBalance < 10}
                  className={`px-3 py-1 rounded ${bankBalance < 10 ? 'bg-gray-700 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600'}`}
                >
                  Withdraw 10
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Debt Actions</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => makeDebtPayment(10)}
                  disabled={money < 10 || debt === 0}
                  className={`px-3 py-1 rounded ${money < 10 || debt === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}
                >
                  Pay Debt 10
                </button>
                <button 
                  onClick={() => borrowMoney(50)}
                  disabled={!gameFlags.hasCreditKnowledge}
                  className={`px-3 py-1 rounded ${!gameFlags.hasCreditKnowledge ? 'bg-gray-700 cursor-not-allowed' : 'bg-yellow-700 hover:bg-yellow-600'}`}
                >
                  Borrow 50
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render tutorial
  const tutorialContent = [
    "Welcome to Financial Island! In this educational adventure, you'll learn real financial skills while exploring an interactive world.",
    "Use the VERB buttons below to interact with the world. Select a verb, then click on an object or person in the scene.",
    "For example, select 'Look' then click on a character to examine them, or 'Talk' to have a conversation.",
    "You'll need to manage your money wisely. Earn income, create a budget, save for emergencies, invest for the future, and manage debt responsibly.",
    "Explore the island to find books and resources that teach financial concepts. Take quizzes to demonstrate your knowledge and unlock new opportunities.",
    "Your goal is to achieve financial freedom - having emergency savings, investments that generate passive income, a retirement plan, and no debt.",
    "Good luck on your financial journey!"
  ];

  // Render game
  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Tutorial overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-blue-900 border-2 border-yellow-500 rounded-lg p-6 max-w-2xl">
            <h2 className="text-yellow-500 text-2xl font-bold mb-4">Financial Island Adventure</h2>
            <div className="text-white space-y-4">
              {tutorialContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <button 
              onClick={closeTutorial} 
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded"
            >
              Start Your Financial Journey
            </button>
          </div>
        </div>
      )}
      
      {/* Dialogue overlay */}
      {dialogueActive && currentDialogue && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-end justify-center p-4">
          <div className="bg-blue-900 border-2 border-yellow-500 rounded-lg p-4 w-full max-w-3xl mb-20">
            <div className="flex mb-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg mr-4 flex-shrink-0">
                {/* Character portrait would go here */}
                <div className={`w-full h-full ${currentDialogue.portrait || 'bg-gray-600'} rounded-lg`}></div>
              </div>
              <div>
                <h3 className="text-yellow-500 text-lg font-bold">{currentDialogue.character}</h3>
                <p className="text-white">{currentDialogue.lines[currentDialogue.currentLine].text}</p>
              </div>
            </div>
            <div className="space-y-2">
              {currentDialogue.lines[currentDialogue.currentLine].responses.map((response, index) => (
                <button 
                  key={index} 
                  onClick={() => selectDialogueResponse(index)}
                  className="bg-blue-800 hover:bg-blue-700 text-white w-full py-1 px-3 rounded text-left"
                >
                  {response.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Financial Quiz Modal */}
      {renderFinancialQuizModal()}
      
      {/* Financial Dashboard */}
      {renderFinancialDashboard()}
      
      {/* Main game screen */}
      <div className="flex-grow relative">
        {/* Location background */}
        <div className={`w-full h-full ${locations[currentLocation].backgroundImage || 'bg-blue-900'} relative`}>
          {/* Location name */}
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-yellow-500 p-2 text-center font-bold">
            {locations[currentLocation].name}
          </div>
          
          {/* Financial status bar */}
          <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white p-2 text-right">
            <div className="flex items-center">
              <span className="text-yellow-500 font-bold mr-2">Coins:</span>
              <span>{money.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 font-bold mr-2">Bank:</span>
              <span>{bankBalance.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 font-bold mr-2">Debt:</span>
              <span>{debt.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 font-bold mr-2">Day:</span>
              <span>{gameDay}</span>
            </div>
          </div>
          
          {/* Hotspots */}
          {locations[currentLocation].hotspots
            .filter(hotspot => hotspot.visible !== false)
            .map(hotspot => (
              <div 
                key={hotspot.id}
                onClick={() => handleHotspotClick(hotspot)}
                className="absolute cursor-pointer hover:border-2 hover:border-yellow-500 rounded"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`
                }}
              >
                {/* Invisible but interactive element */}
              </div>
            ))}
        </div>
      </div>
      
      {/* Game UI */}
      <div className="bg-blue-900 border-t-2 border-yellow-500">
        {/* Text display */}
        <div className="bg-black m-2 p-2 text-green-400 h-16 overflow-y-auto">
          {gameText}
        </div>
        
        {/* Verb buttons, inventory, and dashboard button */}
        <div className="flex p-2">
          {/* Verb buttons */}
          <div className="grid grid-cols-3 gap-1 mr-4">
            {['walk', 'look', 'take', 'use', 'talk', 'read'].map(verb => (
              <button 
                key={verb}
                onClick={() => selectVerb(verb)}
                className={`px-3 py-1 rounded ${verbSelected === verb ? 'bg-yellow-500 text-black font-bold' : 'bg-blue-800 text-white'}`}
              >
                {verb.charAt(0).toUpperCase() + verb.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Inventory */}
          <div className="flex-grow bg-black rounded p-1 flex flex-wrap gap-1 overflow-x-auto">
            {inventory.map((item, index) => (
              <div 
                key={index}
                onClick={() => selectInventoryItem(item)}
                className={`w-16 h-16 bg-gray-800 rounded flex items-center justify-center cursor-pointer hover:bg-gray-700 ${selectedItem === item ? 'border-2 border-yellow-500' : ''}`}
              >
                <span className="text-white text-xs text-center p-1">{item.name}</span>
              </div>
            ))}
          </div>
          
          {/* Dashboard button */}
          <button
            onClick={toggleFinancialDashboard}
            className="ml-2 px-3 bg-green-700 hover:bg-green-600 text-white rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 1v10h10V4H5z" clipRule="evenodd" />
              <path d="M6 7h8v1H6V7zm0 3h8v1H6v-1zm0 3h4v1H6v-1z" />
            </svg>
            Dashboard
          </button>
        </div>
        
        {/* Location exits */}
        <div className="flex justify-center pb-2 px-2">
          {Object.entries(locations[currentLocation].exits).map(([locationId, description]) => (
            <button
              key={locationId}
              onClick={() => moveToLocation(locationId)}
              className="mx-1 px-3 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded"
            >
              {description}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialIslandAdventure;