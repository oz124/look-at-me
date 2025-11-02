import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Chrome, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerUser, loginUser, loginWithGoogle, loginWithFacebook } from "@/lib/firebase-auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await loginUser(formData.email, formData.password);
        toast({
          title: "🎉 התחברת בהצלחה!",
          description: "ברוך השב! אתה מועבר לדף יצירת הקמפיין",
        });
      } else {
        // Register
        if (!formData.name.trim()) {
          throw new Error("נא להזין שם מלא");
        }
        await registerUser(formData.email, formData.password, formData.name, formData.phone);
        toast({
          title: "🎉 החשבון נוצר בהצלחה!",
          description: "נשלח אליך מייל אימות. ברוך הבא למערכת!",
        });
      }
      
      // Redirect to campaign page
      setTimeout(() => {
        navigate("/campaign");
      }, 1000);
      
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "❌ שגיאה",
        description: error.message || "משהו השתבש. נסה שוב",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    
    try {
      if (provider === "Google") {
        await loginWithGoogle();
        toast({
          title: "🎉 התחברת בהצלחה!",
          description: "ברוך השב! אתה מועבר לדף יצירת הקמפיין",
        });
        
        setTimeout(() => {
          navigate("/campaign");
        }, 1000);
      } else if (provider === "Facebook") {
        await loginWithFacebook();
        toast({
          title: "🎉 התחברת בהצלחה!",
          description: "ברוך השב! אתה מועבר לדף יצירת הקמפיין",
        });
        
        setTimeout(() => {
          navigate("/campaign");
        }, 1000);
      }
    } catch (error: any) {
      console.error('Social auth error:', error);
      toast({
        title: "❌ שגיאה",
        description: error.message || "משהו השתבש. נסה שוב",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-right block">שם מלא</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="הכנס את שמך המלא" 
                        required 
                        className="pr-10 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-right block">טלפון (אופציונלי)</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        type="tel" 
                        placeholder="050-1234567" 
                        className="pr-10 text-right"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">אימייל</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" 
                    placeholder="example@email.com" 
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
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password" 
                    placeholder="מינימום 6 תווים" 
                    required 
                    minLength={6}
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