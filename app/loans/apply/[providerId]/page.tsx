'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Clock, Upload, FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from 'framer-motion';
import SparklesBackground from "@/components/ui/SparklesBackground";

interface LoanInfo {
  amount: number;
  term: number;
  interestRate: number;
  monthlyPayment: number;
  processingFee: number;
  totalAmount: number;
  standardizedAmount: number;
  standardizedTerm: number;
  standardizedRate: number;
}

interface LoanData {
  loanInfo: LoanInfo;
}

interface VerificationStatus {
  verified: boolean;
}

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  verified?: boolean;
}

export default function LoanApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId as string;
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [approvalStatus, setApprovalStatus] = useState('processing');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);

  useEffect(() => {
    // In a real app, fetch this from an API
    // For demo, use localStorage to get data from previous step
    const loadLoanData = () => {
      try {
        const storedData = localStorage.getItem('loanApplicationData');
        if (storedData) {
          setLoanData(JSON.parse(storedData));
          
          // Check if verification was done from localStorage
          const verificationInfo = localStorage.getItem('documentVerificationResult');
          if (verificationInfo) {
            setVerificationStatus(JSON.parse(verificationInfo));
          } else {
            // Default to unverified if no data
            setVerificationStatus({ verified: false });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading loan data:', error);
        setLoading(false);
      }
    };

    loadLoanData();

    // Simulate approval process steps
    const stepTimer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        // For demo, randomly decide approval status
        const outcomes = ['approved', 'rejected', 'pending'];
        setApprovalStatus(outcomes[Math.floor(Math.random() * outcomes.length)]);
      }
    }, 1500);

    return () => clearTimeout(stepTimer);
  }, [currentStep, providerId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusMessage = () => {
    switch (approvalStatus) {
      case 'approved':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: 'Loan Approved!',
          message: 'Congratulations! Your loan application has been approved.',
          color: 'from-green-500/20 to-green-700/20'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: 'Application Rejected',
          message: 'We regret to inform you that your loan application has been rejected at this time.',
          color: 'from-red-500/20 to-red-700/20'
        };
      case 'pending':
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: 'Under Review',
          message: 'Your application is under review by our loan officers. We will notify you of the decision soon.',
          color: 'from-yellow-500/20 to-yellow-700/20'
        };
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-blue-500" />,
          title: 'Processing Application',
          message: 'We are processing your application. Please wait...',
          color: 'from-blue-500/20 to-blue-700/20'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-blue-400 flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          Processing loan application...
        </div>
      </div>
    );
  }

  const { icon, title, message, color } = getStatusMessage();

  return (
    <main className="min-h-screen bg-black relative pb-20">
      <SparklesBackground />
      
      <div className="container mx-auto px-4 pt-8 flex flex-col items-center min-h-screen">
        <nav className="self-start mb-12">
          <Link href={`/loans/apply/${providerId}`} className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Application
          </Link>
        </nav>
        
        <motion.div 
          className="max-w-3xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/[0.03] backdrop-blur-sm border-0 overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Loan Application Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Application reference: {providerId.slice(0, 8).toUpperCase()}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {approvalStatus === 'processing' ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Processing application</span>
                      <span>{currentStep}/4 steps</span>
                    </div>
                    <Progress value={currentStep * 25} className="h-2 bg-gray-800" />
                  </div>
                  
                  <div className="space-y-4">
                    <StepItem 
                      icon={<ShieldCheck className="w-5 h-5" />}
                      title="Document Verification"
                      description="Verifying your identity documents"
                      status={currentStep >= 1 ? 'complete' : 'pending'}
                      verified={verificationStatus?.verified}
                    />
                    
                    <StepItem 
                      icon={<Upload className="w-5 h-5" />}
                      title="Application Processing"
                      description="Processing your loan application details"
                      status={currentStep >= 2 ? 'complete' : 'pending'}
                      verified={true}
                    />
                    
                    <StepItem 
                      icon={<FileText className="w-5 h-5" />}
                      title="Credit Assessment"
                      description="Analyzing your credit history and loan eligibility"
                      status={currentStep >= 3 ? 'complete' : 'pending'}
                      verified={true}
                    />
                    
                    <StepItem 
                      icon={<CheckCircle className="w-5 h-5" />}
                      title="Final Decision"
                      description="Making a decision on your loan application"
                      status={currentStep >= 4 ? 'complete' : 'pending'}
                      verified={true}
                    />
                  </div>
                  
                  <div className="bg-blue-500/10 rounded-lg p-4 text-center text-blue-300 animate-pulse">
                    Please wait while we process your application...
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className={`p-8 rounded-lg bg-gradient-to-br ${color} flex flex-col items-center text-center`}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {icon}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mt-4">{title}</h2>
                    <p className="text-white/70 mt-2 max-w-md">{message}</p>
                  </div>
                  
                  {loanData && (
                    <div>
                      <h3 className="text-xl font-medium text-white mb-4">Loan Details</h3>
                      <div className="bg-white/5 rounded-lg p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Loan Amount</div>
                            <div className="text-white font-medium">{formatCurrency(loanData.loanInfo.amount)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Loan Term</div>
                            <div className="text-white font-medium">{loanData.loanInfo.term} months</div>
                          </div>
                        </div>
                        
                        <Separator className="bg-white/10" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Interest Rate</div>
                            <div className="text-white font-medium">{loanData.loanInfo.interestRate}% p.a.</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Monthly Payment</div>
                            <div className="text-white font-medium">{formatCurrency(loanData.loanInfo.monthlyPayment)}</div>
                          </div>
                        </div>
                        
                        <Separator className="bg-white/10" />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Processing Fee</div>
                            <div className="text-white font-medium">{formatCurrency(loanData.loanInfo.processingFee)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Total Amount Payable</div>
                            <div className="text-white font-medium">{formatCurrency(loanData.loanInfo.totalAmount)}</div>
                          </div>
                        </div>
                        
                        <Separator className="bg-white/10" />
                        
                        <div>
                          <div className="text-gray-400 text-sm">Document Verification Status</div>
                          <div className="flex items-center mt-1">
                            {verificationStatus?.verified ? (
                              <div className="flex items-center text-green-400">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <span>Documents Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-yellow-400">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                <span>Verification Pending</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-4">
                    {approvalStatus === 'approved' && (
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 py-6"
                        onClick={() => router.push('/loans/disbursement')}
                      >
                        Proceed to Disbursement
                      </Button>
                    )}
                    
                    {approvalStatus === 'rejected' && (
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 py-6"
                        onClick={() => router.push('/loans')}
                      >
                        Apply for Another Loan
                      </Button>
                    )}
                    
                    {approvalStatus === 'pending' && (
                      <Button 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 py-6"
                        onClick={() => router.push('/loans/tracker')}
                      >
                        Track Application Status
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="border-white/10 text-gray-300 hover:bg-white/5"
                      onClick={() => router.push('/loans')}
                    >
                      Back to Loans
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

// Step Item Component
const StepItem: React.FC<StepItemProps> = ({ icon, title, description, status, verified }) => {
  return (
    <div className="flex gap-4">
      <div className={`rounded-full p-2 ${
        status === 'complete' 
          ? verified === false
            ? 'bg-yellow-500/20 text-yellow-400' 
            : 'bg-green-500/20 text-green-400'
          : 'bg-blue-500/20 text-blue-400'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">{title}</h3>
          {status === 'complete' ? (
            verified === false ? (
              <span className="text-yellow-400 text-sm flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Needs Review
              </span>
            ) : (
              <span className="text-green-400 text-sm flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete
              </span>
            )
          ) : (
            <span className="text-blue-400 text-sm flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};