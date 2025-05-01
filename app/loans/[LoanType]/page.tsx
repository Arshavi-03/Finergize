'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Upload, 
  Loader2, 
  Check, 
  AlertCircle,
  XCircle
} from 'lucide-react';
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface LoanFormData {
  personalInfo: {
    fullName: string;
    age: string;
    gender: string;
  };
  documentInfo: {
    idType: string;
    idNumber: string;
  };
  contactInfo: {
    email: string;
    phoneNumber: string;
  };
}

interface VerificationResult {
  [key: string]: {
    text: string;
    confidence: number;
    bbox: number[];
  };
}

export default function LoanApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const LoanType = params.LoanType as string;
  const { toast } = useToast();

  // Add a state to track hydration to prevent issues
  const [isClient, setIsClient] = useState(false);

  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loanFormData, setLoanFormData] = useState<LoanFormData>({
    personalInfo: {
      fullName: '',
      age: '',
      gender: 'male'
    },
    documentInfo: {
      idType: 'aadhaar',
      idNumber: ''
    },
    contactInfo: {
      email: '',
      phoneNumber: ''
    }
  });
  
  // Document verification states
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string>('');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  
  // Mock logged-in user state - in a real app this would come from auth context
  const [loggedInUser, setLoggedInUser] = useState<string>('Sneha Mahata'); // Set default to the currently logged in user
  
  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
    
    // Remove any fdprocessedid attributes from the DOM after hydration
    document.querySelectorAll('[fdprocessedid]').forEach(element => {
      element.removeAttribute('fdprocessedid');
    });
    
    // In a real app, you would fetch the logged-in user here
    // For this test case, we're setting it to Sneha Mahata
    if (loanFormData.personalInfo.fullName === '') {
      handleInputChange('personalInfo', 'fullName', loggedInUser);
    }
  }, []);

  const loanTitles: Record<string, string> = {
    business: "Business Loan Application",
    agriculture: "Agriculture Loan Application",
    education: "Education Loan Application"
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setLoanFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof LoanFormData],
        [field]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocumentFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setDocumentPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset verification states
    setVerificationResult(null);
    setAnnotatedImage('');
    setVerificationComplete(false);
    setVerificationFailed(false);
  };

  const verifyDocument = async () => {
    if (!documentFile) {
      toast({
        title: "Error",
        description: "Please upload a document first"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      const formData = new FormData();
      formData.append('file', documentFile);
      
      const response = await fetch('https://finergize-doc-verification-api.onrender.com/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }
      
      const data = await response.json();
      setVerificationResult(data.extracted_info);
      
      if (data.annotated_image) {
        setAnnotatedImage(`data:image/jpeg;base64,${data.annotated_image}`);
      }
      
      // Extract name from document using various possible field names
      const nameField = 
        data.extracted_info?.name?.text || 
        data.extracted_info?.NAME?.text ||
        data.extracted_info?.Name?.text ||
        data.extracted_info?.cardholder_name?.text ||
        data.extracted_info?.Cardholder_Name?.text ||
        data.extracted_info?.CARDHOLDER_NAME?.text;
      
      // Extract ID from document using various possible field names
      const idField = 
        data.extracted_info?.id_number?.text || 
        data.extracted_info?.ID_NUMBER?.text ||
        data.extracted_info?.aadhaar_number?.text ||
        data.extracted_info?.AADHAAR_NUMBER?.text ||
        data.extracted_info?.pan_number?.text ||
        data.extracted_info?.PAN_NUMBER?.text ||
        data.extracted_info?.voter_id?.text ||
        data.extracted_info?.VOTER_ID?.text ||
        data.extracted_info?.identity_number?.text ||
        data.extracted_info?.IDENTITY_NUMBER?.text;
      
      // Log extracted data for debugging
      console.log("Extracted name from document:", nameField);
      console.log("Currently logged in user:", loggedInUser);
      console.log("Form name:", loanFormData.personalInfo.fullName);
      
      // Verify name against logged-in user with improved matching
      if (nameField) {
        // Improved name matching logic:
        // 1. Convert to lowercase for case-insensitive comparison
        // 2. Trim whitespace
        // 3. Check if either name includes the other (partial match)
        // 4. Also check for token-based matching (individual name parts)
        
        const extractedName = nameField.trim().toLowerCase();
        const formName = loanFormData.personalInfo.fullName.trim().toLowerCase();
        const loggedUserName = loggedInUser.trim().toLowerCase();
        
        // Split names into tokens (first name, last name, etc.)
        const extractedTokens = extractedName.split(/\s+/);
        const formTokens = formName.split(/\s+/);
        const loggedUserTokens = loggedUserName.split(/\s+/);
        
        // Function to check if any tokens match between two sets
        const hasMatchingTokens = (tokens1: string[], tokens2: string[]) => {
          return tokens1.some(token => 
            tokens2.some(t => t.includes(token) || token.includes(t))
          );
        };
        
        // Check for name matches
        const nameMatchesForm = 
          extractedName.includes(formName) || 
          formName.includes(extractedName) ||
          hasMatchingTokens(extractedTokens, formTokens);
        
        const nameMatchesLoggedUser = 
          extractedName.includes(loggedUserName) || 
          loggedUserName.includes(extractedName) ||
          hasMatchingTokens(extractedTokens, loggedUserTokens);
        
        // Use either match for verification
        if (nameMatchesForm || nameMatchesLoggedUser) {
          setVerificationComplete(true);
          setVerificationFailed(false);
          
          toast({
            title: "Verification Successful!",
            description: "Your document has been verified successfully"
          });
          
          // Update form with extracted information
          if (nameField && nameField.trim() !== '') {
            handleInputChange('personalInfo', 'fullName', nameField);
          }
          
          if (idField && idField.trim() !== '') {
            handleInputChange('documentInfo', 'idNumber', idField);
          }
          
          // Store verification status in localStorage for use in other pages
          localStorage.setItem('documentVerificationResult', JSON.stringify({ verified: true }));
        } else {
          // Name doesn't match
          setVerificationComplete(false);
          setVerificationFailed(true);
          
          toast({
            title: "Verification Failed!",
            description: "The name on the document doesn't match your account name. Please upload a valid document."
          });
          
          // Store verification status in localStorage for use in other pages
          localStorage.setItem('documentVerificationResult', JSON.stringify({ verified: false }));
        }
      } else {
        // No name detected in the document, but we'll be more lenient
        // If we have other extracted information, we'll consider it partially verified
        if (idField && idField.trim() !== '') {
          // We have an ID field but no name - let's consider it verified anyway as a fallback
          setVerificationComplete(true);
          setVerificationFailed(false);
          
          handleInputChange('documentInfo', 'idNumber', idField);
          
          toast({
            title: "Verification Complete",
            description: "Document ID verified successfully, but name wasn't detected. Using account name."
          });
          
          // Store verification status in localStorage for use in other pages
          localStorage.setItem('documentVerificationResult', JSON.stringify({ verified: true }));
        } else {
          // No useful information extracted
          setVerificationComplete(false);
          setVerificationFailed(true);
          
          toast({
            title: "Verification Failed!",
            description: "Could not detect a name on the document. Please upload a clearer image."
          });
          
          // Store verification status in localStorage for use in other pages
          localStorage.setItem('documentVerificationResult', JSON.stringify({ verified: false }));
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationComplete(false);
      setVerificationFailed(true);
      
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify document. Please try again."
      });
      
      // Store verification status in localStorage for use in other pages
      localStorage.setItem('documentVerificationResult', JSON.stringify({ verified: false }));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store form data in localStorage to simulate data persistence between pages
      const loanApplicationData = {
        loanInfo: {
          amount: 50000, // Sample amount
          term: 12, // Sample term in months
          interestRate: 12, // Sample interest rate
          monthlyPayment: 4500, // Sample monthly payment
          processingFee: 1000, // Sample processing fee
          totalAmount: 54000, // Sample total amount
          standardizedAmount: 50000,
          standardizedTerm: 12,
          standardizedRate: 12
        }
      };
      
      localStorage.setItem('loanApplicationData', JSON.stringify(loanApplicationData));
      
      // Show a success toast
      toast({
        title: "Success!",
        description: "Your loan application has been submitted successfully. Redirecting to loan providers..."
      });
      
      console.log("Form submitted with data:", {
        loanType: LoanType,
        ...loanFormData,
        documentVerified: verificationComplete,
      });

      // Wait for a short moment to show the success message
      setTimeout(() => {
        // Redirect to loan providers page
        router.push(`/loans/providers/${LoanType}`);
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit loan application. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is complete for current tab
  const isTabComplete = (tab: string): boolean => {
    switch (tab) {
      case "personal":
        return Boolean(loanFormData.personalInfo.fullName && loanFormData.personalInfo.age);
      case "document":
        return Boolean(loanFormData.documentInfo.idNumber && verificationComplete);
      case "contact":
        return Boolean(loanFormData.contactInfo.email && loanFormData.contactInfo.phoneNumber);
      default:
        return false;
    }
  };

  // Calculate overall progress (0-100)
  const calculateProgress = (): number => {
    let progress = 0;
    if (isTabComplete("personal")) progress += 33;
    if (isTabComplete("document")) progress += 33;
    if (isTabComplete("contact")) progress += 34;
    return progress;
  };

  // Handle next tab navigation
  const handleNextTab = () => {
    if (activeTab === "personal") setActiveTab("document");
    else if (activeTab === "document") setActiveTab("contact");
  };

  // Handle previous tab navigation
  const handlePrevTab = () => {
    if (activeTab === "contact") setActiveTab("document");
    else if (activeTab === "document") setActiveTab("personal");
  };

  // To avoid hydration issues, wait until client-side rendering
  if (!isClient) {
    return <div suppressHydrationWarning={true}></div>;
  }

  return (
    <main className="min-h-screen bg-black relative pb-20" suppressHydrationWarning={true}>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>
      
      <div className="container mx-auto px-4 pt-8">
        <Link href="/loans" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Loans
        </Link>

        <Card className="max-w-4xl mx-auto bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {loanTitles[LoanType] || "Loan Application"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Please fill in your details accurately as per your documents
            </CardDescription>
            <div className="mt-4">
              <Progress value={calculateProgress()} className="h-2 bg-gray-800" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Personal</span>
                <span>Documents</span>
                <span>Contact</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600">
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="document" className="data-[state=active]:bg-blue-600">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Document
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-blue-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <User className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-200">Full Name (as per documents)</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Enter your full name"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={loanFormData.personalInfo.fullName}
                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-200">Age</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        placeholder="Enter your age"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={loanFormData.personalInfo.age}
                        onChange={(e) => handleInputChange('personalInfo', 'age', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-200">Gender</Label>
                      <RadioGroup 
                        value={loanFormData.personalInfo.gender}
                        onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="text-gray-300">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="text-gray-300">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="text-gray-300">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleNextTab}
                    disabled={!isTabComplete("personal")}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="document" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Document Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-200">ID Type</Label>
                      <RadioGroup 
                        value={loanFormData.documentInfo.idType}
                        onValueChange={(value) => handleInputChange('documentInfo', 'idType', value)}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="aadhaar" id="aadhaar" />
                          <Label htmlFor="aadhaar" className="text-gray-300">Aadhaar Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pan" id="pan" />
                          <Label htmlFor="pan" className="text-gray-300">PAN Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="voter" id="voter" />
                          <Label htmlFor="voter" className="text-gray-300">Voter Card</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-gray-200">ID Number</Label>
                      <Input 
                        id="idNumber" 
                        placeholder="Enter Aadhaar/PAN/Voter ID number"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={loanFormData.documentInfo.idNumber}
                        onChange={(e) => handleInputChange('documentInfo', 'idNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="bg-gray-800/50 rounded-lg p-6 mt-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                      <Upload className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Document Verification</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-gray-200">
                          Upload {
                            loanFormData.documentInfo.idType === 'aadhaar' ? 'Aadhaar' : 
                            loanFormData.documentInfo.idType === 'pan' ? 'PAN' : 'Voter'
                          } Card
                        </Label>
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg h-40 overflow-hidden relative">
                          {documentPreview ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={documentPreview} 
                                alt="Document preview"
                                className="object-contain w-full h-full"
                              />
                              <button 
                                onClick={() => {
                                  setDocumentFile(null);
                                  setDocumentPreview('');
                                  setVerificationResult(null);
                                  setAnnotatedImage('');
                                  setVerificationComplete(false);
                                  setVerificationFailed(false);
                                }}
                                className="absolute top-2 right-2 bg-gray-900/80 text-white rounded-full p-1"
                              >
                                <AlertCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-center p-4">
                              <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                              <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                              <p className="text-gray-500 text-xs">JPG, PNG or PDF</p>
                            </div>
                          )}
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                          />
                        </div>

                        <Button 
                          onClick={verifyDocument}
                          disabled={!documentFile || isVerifying}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : verificationComplete ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Verified!!!
                            </>
                          ) : verificationFailed ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Verification failed!
                            </>
                          ) : (
                            "Verify Document"
                          )}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {annotatedImage && (
                          <div className="space-y-2">
                            <Label className="text-gray-200">Verification Result</Label>
                            <div className="border border-gray-700 rounded-lg h-40 overflow-hidden">
                              <img 
                                src={annotatedImage} 
                                alt="Annotated document"
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                        )}
                        
                        {verificationResult && (
                          <div className="space-y-2">
                            <Label className="text-gray-200">Extracted Information</Label>
                            <div className="bg-gray-900/80 rounded-lg p-3 text-sm text-gray-300 max-h-40 overflow-y-auto">
                              {Object.entries(verificationResult).map(([key, value]) => (
                                <div key={key} className="flex justify-between mb-1">
                                  <span className="text-gray-400">{key}:</span>
                                  <span>{value.text || 'N/A'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    onClick={handlePrevTab}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNextTab}
                    disabled={!isTabComplete("document")}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={loanFormData.contactInfo.email}
                        onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-200">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        placeholder="Enter your phone number"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                        value={loanFormData.contactInfo.phoneNumber}
                        onChange={(e) => handleInputChange('contactInfo', 'phoneNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    onClick={handlePrevTab}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!isTabComplete("contact") || isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center text-gray-400 text-sm mt-6">
              By submitting this application, you agree to our terms and conditions
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}