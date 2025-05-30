import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Store, Tractor, GraduationCap, Clock, Percent, FileText, ArrowRight, Users, Wallet, ChartBar } from 'lucide-react';
import Link from "next/link";

export default function LoansPage() {
  const loanTypes = [
    {
      icon: <Store className="w-12 h-12 text-blue-500/80" />,
      title: "Business Loans",
      description: "Grow your small business or start a new venture",
      amount: "Upto ₹50,00,000",
      duration: "6-24 months",
      interest: "12% p.a.",
      gradient: "from-blue-500/20 via-transparent to-transparent",
      slug: "business"
    },
    {
      icon: <Tractor className="w-12 h-12 text-green-500/80" />,
      title: "Agriculture Loans",
      description: "Finance for crops, equipment, and farm expansion",
      amount: "Upto ₹50,00,000",
      duration: "3-12 months",
      interest: "10% p.a.",
      gradient: "from-green-500/20 via-transparent to-transparent",
      slug: "agriculture"
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-purple-500/80" />,
      title: "Education Loans",
      description: "Support your children's education and skill development",
      amount: "Upto ₹50,00,000",
      duration: "12-36 months",
      interest: "11% p.a.",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      slug: "education"
    }
  ];

  const features = [
    {
      icon: <Clock className="h-6 w-6 text-blue-400" />,
      title: "Quick Disbursement",
      description: "Get funds within 48 hours of approval",
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <Percent className="h-6 w-6 text-green-400" />,
      title: "Low Interest Rates",
      description: "Competitive rates with flexible repayment terms",
      gradient: "from-green-500/20 via-transparent to-transparent"
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-400" />,
      title: "Minimal Documentation and process",
      description: "Simple paperwork with Aadhaar-based KYC",
      gradient: "from-purple-500/20 via-transparent to-transparent"
    }
  ];

  const requirements = [
    {
      icon: <Users className="h-6 w-6 text-indigo-400" />,
      title: "Group Membership",
      description: "Be part of a Finergise savings group for 4+ months",
      gradient: "from-indigo-500/20 via-transparent to-transparent"
    },
    {
      icon: <Wallet className="h-6 w-6 text-pink-400" />,
      title: "Savings History",
      description: "Regular savings record in your group account",
      gradient: "from-pink-500/20 via-transparent to-transparent"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-amber-400" />,
      title: "Identity Proof",
      description: "Valid Aadhaar, PAN, or Voter ID card and basic KYC documents",
      gradient: "from-amber-500/20 via-transparent to-transparent"
    }
  ];

  return (
    <main className="min-h-screen bg-black relative">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link href="/loans/tracker">
          <Button 
            className="group relative px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg group-hover:blur-xl transition-all duration-300"></span>
            <div className="relative flex items-center gap-2">
              <ChartBar className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">Track & Schedule Loan</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
        </Link>
      </div>

      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text leading-[1.3] py-2">
              Micro Loans
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Quick, affordable loans to help you achieve your goals
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Available Loan Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loanTypes.map((loan, index) => (
              <Card key={index} className="group bg-gray-900/50 border-gray-800 hover:border-gray-700">
                <CardHeader>
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${loan.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {loan.icon}
                  </div>
                  <CardTitle className="text-white text-2xl">{loan.title}</CardTitle>
                  <CardDescription className="text-gray-400">{loan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Amount:</span> {loan.amount}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Duration:</span> {loan.duration}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Interest:</span> {loan.interest}
                    </p>
                  </div>
                  <Link href={`/loans/${loan.slug}`}>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Apply Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Choose Our Loans?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Eligibility Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${requirement.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {requirement.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{requirement.title}</h3>
                    <p className="text-gray-400 text-sm">{requirement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join our community savings groups to become eligible for quick and affordable loans.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/check-eligibility">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                  Check Eligibility <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/savings">
                <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  Join Savings Group
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}