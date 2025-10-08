import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isLogin ? "התחברת בהצלחה!" : "החשבון נוצר בהצלחה!",
        description: "אתה מועבר לדף יצירת הקמפיין",
      });
      // In a real app, you would redirect to /campaign here
      window.location.href = "/campaign";
    }, 1500);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    toast({
      title: `התחברות דרך ${provider}`,
      description: "מעבד את הבקשה...",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "התחברת בהצלחה!",
        description: "אתה מועבר לדף יצירת הקמפיין",
      });
      window.location.href = "/campaign";
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 ml-2" />
            חזרה לדף הבית
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LOOK AT ME
          </h1>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isLogin ? "ברוך השב!" : "יצירת חשבון חדש"}
            </CardTitle>
            <p className="text-gray-600">
              {isLogin 
                ? "התחבר כדי להמשיך לניהול הקמפיינים שלך" 
                : "הצטרף אלינו והתחל לקדם את העסק שלך"
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => handleSocialAuth("Google")}
                disabled={isLoading}
                variant="outline" 
                className="w-full py-3 border-2 hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <Chrome className="h-5 w-5 ml-2 text-red-500" />
                {isLogin ? "התחבר" : "הרשם"} דרך Google
              </Button>
              
              <Button 
                onClick={() => handleSocialAuth("Facebook")}
                disabled={isLoading}
                variant="outline" 
                className="w-full py-3 border-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="w-5 h-5 ml-2 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">f</div>
                {isLogin ? "התחבר" : "הרשם"} דרך Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">או</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right block">שם מלא</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="name" 
                      placeholder="הכנס את שמך המלא" 
                      required 
                      className="pr-10 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">אימייל</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="הכנס את כתובת האימייל שלך" 
                    required 
                    className="pr-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">סיסמה</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="הכנס סיסמה" 
                    required 
                    className="pr-10"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? "טוען..." : (isLogin ? "התחבר" : "צור חשבון")}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                {isLogin 
                  ? "אין לך חשבון? הרשם כאן" 
                  : "יש לך כבר חשבון? התחבר כאן"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;