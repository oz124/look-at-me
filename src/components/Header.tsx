
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LOOK AT ME
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">תכונות</a>
          <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">מחירים</a>
          <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">צור קשר</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              <LogIn className="h-4 w-4 ml-2" />
              התחבר
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <UserPlus className="h-4 w-4 ml-2" />
              הרשם
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
