import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Translations } from '@/lib/translations';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslations } from '@/hooks/useTranslations';
import { useAuth } from '@/lib/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';

import {
  ArrowRight,
  Bot,
  Target,
  TrendingUp,
  Users,
  Play,
  BarChart3,
  Brain,
  Sparkles,
  Zap,
  Eye,
  Shield,
  Rocket,
  Globe,
  Camera,
  Volume2,
  Facebook,
  Instagram,
  Linkedin,
  CheckCircle,
  Star,
  Heart,
  Wifi,
  Lock,
  Settings,
  Award,
  Layers,
  Smartphone,
  Monitor,
  Headphones,
  MousePointer,
  Palette,
  Code,
  Database,
  CloudUpload,
  AlertTriangle,
  Clock,
  DollarSign,
  Search,
  BarChart,
  MessageSquare,
  Lightbulb,
  Cpu,
  Image,
  Mic,
  X,
  FileText,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  User,
  Bell,
  CreditCard,
  Download,
  Upload,
  HelpCircle,
  ChevronRight,
  LogOut,
  Edit,
  Save,
  Trash2,
  Share2,
  Languages,
  Accessibility,
  Moon,
  Sun,
  Volume,
  VolumeX,
  RotateCcw,
  Crown,
  Gift,
  Bookmark,
  History,
  Folder,
  Archive,
  Filter,
  SortAsc,
  Calendar,
  Clock3,
  TrendingDown,
  Activity,
  PieChart,
  BarChart2,
  LineChart,
  Info,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Plus,
  Minus,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Menu,
} from 'lucide-react';

// FAQ Data - using translations
const getFaqData = (t: (key: string) => string) => [
  {
    question: t('faqQuestion1'),
    answer: t('faqAnswer1'),
  },
  {
    question: t('faqQuestion2'),
    answer: t('faqAnswer2'),
  },
  {
    question: t('faqQuestion3'),
    answer: t('faqAnswer3'),
  },
  {
    question: t('faqQuestion4'),
    answer: t('faqAnswer4'),
  },
  {
    question: t('faqQuestion5'),
    answer: t('faqAnswer5'),
  },
  {
    question: t('faqQuestion6'),
    answer: t('faqAnswer6'),
  },
  {
    question: t('faqQuestion7'),
    answer: t('faqAnswer7'),
  },
];

// FAQ Modal Component - Mobile Responsive
const FAQModal = ({ isOpen, onClose, openFAQItem, setOpenFAQItem, t }) => {
  if (!isOpen) return null;
  
  const faqData = getFaqData(t);

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'>
      <div className='bg-white rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] md:max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800'>{t('faq')}</h2>
          <Button variant='ghost' onClick={onClose} className='p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg'>
            <X className='h-5 w-5 md:h-6 md:w-6' />
          </Button>
        </div>
        <div className='p-4 sm:p-6 overflow-y-auto max-h-[70vh] md:max-h-[60vh] text-right' dir='rtl'>
          <div className='space-y-3 md:space-y-4'>
            {faqData.map((item, index) => (
              <Card key={index} className='border border-gray-200'>
                <CardContent className='p-0'>
                  <Button
                    variant='ghost'
                    className='w-full p-4 sm:p-5 md:p-6 text-right justify-between h-auto'
                    onClick={() =>
                      setOpenFAQItem(openFAQItem === index ? null : index)
                    }
                  >
                    <span className='font-medium text-gray-800 text-sm sm:text-base text-right flex-1'>
                      {item.question}
                    </span>
                    {openFAQItem === index ? (
                      <ChevronUp className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mr-2' />
                    ) : (
                      <ChevronDown className='h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mr-2' />
                    )}
                  </Button>
                  {openFAQItem === index && (
                    <div className='px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-gray-600 leading-relaxed border-t border-gray-100 text-sm sm:text-base'>
                      {item.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Modal Component - Mobile Responsive
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'>
      <div className='bg-white rounded-xl md:rounded-2xl max-w-5xl w-full max-h-[90vh] md:max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800'>מרכז עזרה</h2>
          <Button variant='ghost' onClick={onClose} className='p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg'>
            <X className='h-5 w-5 md:h-6 md:w-6' />
          </Button>
        </div>
        <div className='p-4 sm:p-6 overflow-y-auto max-h-[70vh] md:max-h-[60vh] text-right' dir='rtl'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-4 sm:p-5 md:p-6 text-center'>
                <CloudUpload className='h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 md:mb-4' />
                <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-2'>
                  העלאת קבצים
                </h3>
                <p className='text-gray-600 text-xs sm:text-sm'>
                  למד איך להעלות וידאו, תמונות ושמע לניתוח
                </p>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-4 sm:p-5 md:p-6 text-center'>
                <Brain className='h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mx-auto mb-3 md:mb-4' />
                <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-2'>
                  הבנת התוצאות
                </h3>
                <p className='text-gray-600 text-xs sm:text-sm'>
                  איך לפרש את ההמלצות וליישם אותן
                </p>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-4 sm:p-5 md:p-6 text-center'>
                <Target className='h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 md:mb-4' />
                <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-2'>
                  קהל יעד
                </h3>
                <p className='text-gray-600 text-xs sm:text-sm'>
                  איך לזהות ולהגיע לקהל הנכון
                </p>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-4 sm:p-5 md:p-6 text-center'>
                <Rocket className='h-10 w-10 sm:h-12 sm:w-12 text-red-600 mx-auto mb-3 md:mb-4' />
                <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-2'>
                  שיגור קמפיינים
                </h3>
                <p className='text-gray-600 text-xs sm:text-sm'>
                  מהעלאה ועד פרסום בפלטפורמות
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='mt-6 md:mt-8 bg-blue-50 p-4 sm:p-5 md:p-6 rounded-xl'>
            <h3 className='text-base sm:text-lg font-bold text-blue-800 mb-2 md:mb-3'>
              זקוק לעזרה נוספת?
            </h3>
            <p className='text-sm sm:text-base text-blue-700 mb-3 md:mb-4'>הצוות שלנו זמין 24/7 לעזור לך</p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
              <Button className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm sm:text-base'>
                <MessageSquare className='h-4 w-4 ml-2' />
                צ'אט חי
              </Button>
              <Button
                variant='outline'
                className='w-full sm:w-auto border-blue-600 text-blue-600 text-sm sm:text-base'
              >
                <Mail className='h-4 w-4 ml-2' />
                שלח מייל
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terms Modal Component - Mobile Responsive
const TermsModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'>
      <div className='bg-white rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] md:max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800'>{t('termsOfService')}</h2>
          <Button variant='ghost' onClick={onClose} className='p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg'>
            <X className='h-5 w-5 md:h-6 md:w-6' />
          </Button>
        </div>
        <div className='p-4 sm:p-6 overflow-y-auto max-h-[70vh] md:max-h-[60vh] text-right' dir='rtl'>
          <div className='space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base'>
            <div className='bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200 mb-4 md:mb-6'>
              <p className='text-blue-800 text-xs sm:text-sm'>
                <strong>תאריך עדכון אחרון:</strong> 1 בינואר 2025
              </p>
            </div>

            <section>
              <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-2 md:mb-3'>
                תנאי שירות
              </h3>
              <p className='mb-4'>
                תנאי שירות אלה, כפי שיעודכנו מעת לעת, ("התנאים") מהווים הסכם מחייב מבחינה משפטית בין Look At Me Ltd., חברה ישראלית, או במידה שמוגדר בטופס הזמנה, הסניף הרלוונטי שלה ("אנחנו", "שלנו", "אנו", "החברה" ו"טופס ההזמנה", בהתאמה) לבין המשתמש המקבל תנאים אלה ("הלקוח"). תנאים אלה מסדירים את האופן שבו הלקוח ומשתמשיו (כפי שמוגדר להלן) רשאים להשתמש ולגשת לפלטפורמת השיווק החכמה המונעת בינה מלאכותית של החברה הזמינה דרך האתר של החברה או כל שירותים אחרים המוצעים דרך הפלטפורמה ("הפלטפורמה" ו"האתר" בהתאמה), הניתנים במודל מנוי Software-as-a-Service.
              </p>
              
              <p className='mb-4'>
                השימוש בפלטפורמה על ידי הלקוח מהווה קבלה של תנאים אלה. אם משתמש מקבל את התנאים בשם ישות אחרת, עליו להיות בעל הסמכות לקבל תנאים אלה בשמה.
              </p>
              
              <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4'>
                <p className='text-yellow-800 text-sm'>
                  <strong>הערה:</strong> תנאים אלה מכילים הוראה ליישוב סכסוכים ובוררות, כולל ויתור על תביעה ייצוגית המשפיע על זכויותיך תחת תנאים אלה ובקשר לסכסוכים שעלולים להיות לך עם החברה. אתה רשאי לבחור שלא להשתתף בבוררות האישית המחייבת כפי שמפורט להלן.
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                הפלטפורמה; זכות גישה ושימוש
              </h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    זכות שימוש
                  </h4>
                  <p>
                    בכפוף לעמידת הלקוח בתנאים ובתנאים הכלולים בתנאים אלה, החברה, במהלך תקופת המנוי הרלוונטית (כפי שמוגדר להלן), מעניקה בזה ללקוח ולמשתמשיו, אם חל, זכות מוגבלת, לא בלעדית ולא ניתנת להעברה לגשת ולהשתמש בפלטפורמה בהתאם לתיעוד והמדריכים החלים ("מסמכי החברה") ובכל מקרה אך ורק לשימוש עסקי פנימי של הלקוח ולא לספק שירותים לכל אדם או ישות אחרת.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    שינוי או הפסקת הפלטפורמה
                  </h4>
                  <p>
                    החברה רשאית לשנות או לעדכן את הפלטפורמה והאתר (וכל שירותים הניתנים בהם) בכל עת, כולל, ללא הגבלה, זמינות כל תכונה, תוכן או מסד נתונים, ורשאית להטיל מגבלות או הגבלות על תכונות ושירותים מסוימים או להפסיק כל חלק או כל חלק מהפלטפורמה או האתר עם או בלי הודעה מוקדמת.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    שימוש ומגבלות אשראי
                  </h4>
                  <p>
                    השימוש של הלקוח בפלטפורמה עשוי להיות כפוף למגבלות שימוש, כולל מספר מקסימלי של משתמשים ומספר מקסימלי של הודעות ואשראי אינטגרציה, בהתאם לתוכנית המנוי שנבחרה על ידי הלקוח בדף המחירים או בטופס ההזמנה. החברה רשאית לשנות מגבלות כאלה מעת לעת על ידי הודעה או עדכון לדף המחירים.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                משתמשים, חשבונות והתחייבויות הלקוח
              </h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    משתמשים וחשבונות
                  </h4>
                  <p className='mb-3'>
                    על מנת להשתמש בפלטפורמה, הלקוח חייב לרשום וליצור חשבון ("חשבון"), עבור כל משתמש מורשה ומיועד על ידי הלקוח כמשתמש בפלטפורמה תחת חשבון הלקוח (כל אחד, "משתמש"). משתמשים חייבים להיות בני לפחות שלוש עשרה (13) שנים, או שש עשרה (16) שנים אם אתה אדם באיחוד האירופי (EU), או הגיל המינימלי הנדרש בסמכות השיפוט של הלקוח להשתמש או להסכים לשימוש בפלטפורמה.
                  </p>
                  
                  <p className='mb-3'>
                    הלקוח אחראי לספק לחברה מידע רישום מדויק, מלא ומעודכן עבור כל משתמש. הלקוח י: (א) לא יאפשר לאף אחד מלבד משתמשים לגשת ולהשתמש בחשבון; (ב) לא ירשום חשבון באמצעים אוטומטיים; (ג) ישמור ויוודא שמשתמשים שומרים על כל פרטי החשבון ואמצעי הגישה מאובטחים בכל עת; (ד) יוודא שפרטי הכניסה לכל משתמש יכולים לשמש רק על ידי אותו משתמש, ושמספר אנשים לא יכולים לחלוק את אותם פרטי כניסה; ו-(ה) יודיע לחברה בכתב מיד אם הלקוח מודע לכל גישה או שימוש לא מורשה בחשבון הלקוח.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    שיתוף פעולה
                  </h4>
                  <p>
                    הלקוח יספק לחברה את כל שיתוף הפעולה הסביר בקשר לתנאים אלה, ויעמוד באופן יעיל ובזמן, ויהיה אחראי ואשם לעמידת המשתמשים בתנאים אלה ובכל החוקים והתקנות החלים.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    אחריות לנתוני הלקוח
                  </h4>
                  <p>
                    הלקוח מייצג ומתחייב כי (א) הוא הבעלים או יש לו את כל הרישיונות, זכויות, הסכמות, אישורים, הרשאות, כוח וסמכות הנדרשים להעניק לחברה את הזכות והרישיון תחת הסעיף "רישיון לנתוני הלקוח" ולשתף את נתוני הלקוח עם הפלטפורמה, ללא הפרה או הפרה של זכויות יוצרים, זכויות פרטיות, זכויות פרסום, סימני מסחר או כל חוזי, קניין רוחני או קנייני אחר של צד שלישי כלשהו.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                מנוי; תשלומים
              </h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    אגרות
                  </h4>
                  <p>
                    בתמורה למנוי, זכויות הלקוח והתחייבויות החברה כאן, הלקוח ישלם לחברה את האגרות החלות בהתבסס על התוכנית שנבחרה ("האגרות"). אלא אם כן מצוין במפורש אחרת, האגרות נאמרות בדולרים אמריקאיים. הלקוח מסמיך בזה את החברה, ישירות או דרך שירותי עיבוד התשלומים של החברה או הסוכן או השוק החלים, לחייב את האגרות דרך אמצעי התשלום שנבחר על ידי הלקוח, עבור כל תקופת חידוש. האגרות אינן ניתנות לביטול ואינן ניתנות להחזר.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    מסים
                  </h4>
                  <p>
                    האגרות אינן כוללות כל מס (כולל, ללא הגבלה, מס ערך מוסף, מס מכירות, מס שימוש, אקסייז, מס סחורות ושירותים, וכו'), היטלים או מכס, למעט מס הכנסה המוטל על החברה. החברה תחייב מס על גבי האגרות אם החברה נדרשת מבחינה חוקית לעשות כן.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    תנאי תשלום
                  </h4>
                  <p>
                    בכפוף לכל הוראות תשלום לפי שימוש או כל דבר הסותר בטופס ההזמנה, האגרות המפורטות בכל טופס הזמנה הן סופיות. אלא אם כן נקבע אחרת בטופס ההזמנה, האגרות ישולמו שנתית או חודשית (כפי שנקבע בטופס ההזמנה), מראש, עם קבלת חשבונית על ידי חיוב אמצעי התשלום המאושר של הלקוח בתחילת כל תקופת מנוי.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                קניין רוחני וזכות שימוש
              </h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    קניין רוחני של החברה
                  </h4>
                  <p>
                    בין החברה ללקוח, כל הזכות, התואר והעניין בפלטפורמה, האתר ומסמכי החברה, כולל, ללא הגבלה, כל שירותים, תוכן, חומרים, תוכנה, ידע, קבצי נתונים, תיעוד, קוד, SDK, API, עיצוב, טקסט, מדיה, מתודולוגיות, יצירות אמנות, שמות, לוגואים, סימני מסחר וסימני שירות (למעט נתוני הלקוח), כל הטכנולוגיה הקשורה או הבסיסית וכל עדכונים, גרסאות חדשות, שינויים, שיפורים, פיתוחים או נגזרות שלהם (מלבד תוצר שנוצר), הם הרכוש הבלעדי של החברה ומעניקי הרישיון שלה.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    תוצר שנוצר ונתוני קלט
                  </h4>
                  <p>
                    בכפוף לבעלות החברה כפי שמתואר לעיל בסעיף "קניין רוחני של החברה", בין החברה ללקוח, במידה שזכויות כאלה קיימות תחת החוק החל, הלקוח הוא הבעלים של כל הזכויות, התואר והעניין בתוכנה ויישומים שנוצרו על ידי הפלטפורמה ("תוצר שנוצר") הנובעים מהנחיות או נתוני לקוח שהלקוח משתף עם הפלטפורמה למטרות יצירת התוצר שנוצר ("נתוני קלט"). החברה מוותרת על כל הזכויות, התואר והעניינים שיכולים להיות לה בתוצר שנוצר, ללא מתן כל ייצוג או אחריות לגבי אופי זכויות כאלה.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    שימוש מוגבל
                  </h4>
                  <p>
                    הלקוח ומשתמשיו לא רשאים, ולא רשאים להרשות או לסייע לאחרים: (א) להשתמש בפלטפורמה, באתר, בתוצר שנוצר או במסמכי החברה בניגוד למדיניות השימוש האחראי; (ב) להעתיק, לשנות, לשנות, לתרגם, לחקות, ליצור יצירות נגזרות בהתבסס על, או לשכפל את הפלטפורמה, האתר ומסמכי החברה; (ג) לעקוף כל אמצעים שהחברה עשויה להשתמש בהם כדי למנוע או להגביל גישה לפלטפורמה או לאתר.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                אחריות והגבלת אחריות
              </h3>
              
              <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4'>
                <p className='text-yellow-800 text-sm'>
                  <strong>הודעה חשובה:</strong> החברה לא מתחייבת, לא מתחייבת או לא מבטיחה שהפלטפורמה תספק את צרכי הלקוח או תהיה אופטימלית בנסיבות. הפלטפורמה, האתר, מסמכי החברה וכל תוצר שנוצר מסופקים על בסיס "כמו שהם" ו"כמו שזמינים" ו"עם כל הפגמים", וללא אחריות, ערבויות או ייצוגים מכל סוג.
                </p>
              </div>
              
              <p className='mb-4'>
                החברה לא מתחייבת שהשימוש בפלטפורמה יהיה ללא הפרעה, ללא שגיאות, בזמן, מאובטח או ללא פגיעויות, או יעמוד בדרישות או ציפיות הספציפיות של הלקוח, שפגמים יתגלו או יתוקנו, או שהפעולה תהיה ללא וירוסים, באגים, תוכנות זדוניות, רכיבים מזיקים או מגבלות תוכנה.
              </p>
              
              <p className='mb-4'>
                הלקוח אחראי באופן בלעדי לנתוני הלקוח, נתוני הקלט וכל נתונים שמשתמשי הקצה שלו משתפים עם התוצר שנוצר, ויש להעריך את הדיוק, הפונקציונליות והאבטחה של התוצר שנוצר בכל מקרה, כולל על ידי ביצוע סקירה אנושית במידת הצורך.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                תקופה וסיום
              </h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    תקופת מנוי
                  </h4>
                  <p>
                    הפלטפורמה מסופקת על בסיס מנוי לתקופה שנבחרה על ידי הלקוח ("המנוי" ו"תקופת המנוי").
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    חידוש אוטומטי
                  </h4>
                  <p>
                    המנוי של הלקוח יחודש אוטומטית, ואמצעי התשלום של הלקוח יחויב עבור חידוש כזה, כברירת מחדל ללא הודעה מוקדמת על החידוש ללקוח, אלא אם כן בוטל על ידי החברה או הלקוח לפחות 30 יום לפני פקיעתו.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    סיום על ידי החברה
                  </h4>
                  <p>
                    החברה רשאית לסיים או להשעות את השימוש והגישה של הלקוח לפלטפורמה (או כל חלק ממנה) מיידית, ללא הודעה מוקדמת או אחריות, מכל סיבה, כולל האירועים הבאים: (א) החברה מאמינה, לפי שיקול דעתה הבלעדי, שהלקוח או כל צד שלישי משתמש בפלטפורמה באופן שעלול להטיל סיכון אבטחה, עלול לגרום נזק לחברה או לכל צד שלישי, ו/או עלול ליצור כל אחריות לחברה או לכל צד שלישי.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    סיום על ידי הלקוח
                  </h4>
                  <p>
                    הלקוח רשאי לסיים את המנוי שלו לפלטפורמה על ידי (א) כיבוי חידוש אוטומטי בהגדרות החשבון, או (ב) הגשת בקשת סיום על ידי יצירת קשר עם תמיכת Look At Me. הסיום ייכנס לתוקף בסוף תקופת המנוי הנוכחית ולא יפגע בהתחייבות הלקוח לשלם את האגרות החלות עבור תקופת המנוי.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                שונות
              </h3>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    תיקונים
                  </h4>
                  <p>
                    החברה רשאית לשנות את התנאים מעת לעת, ושינוי כזה ייכנס לתוקף בתאריך שבו הוא מפורסם באתר או משותף עם הלקוח על ידי הודעה בפלטפורמה. הלקוח אחראי לבדוק את האתר והפלטפורמה באופן קבוע עבור שינויים כאלה.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    דין חל וסמכות שיפוט
                  </h4>
                  <p>
                    תנאים אלה וביצועם יוסדרו על ידי חוקי מדינת ישראל, ללא התחשבות בהוראות דיני קונפליקט שיגרמו ליישום חוקי כל סמכות שיפוט אחרת. הצדדים כאן מסכימים לסמכות השיפוט האישית הבלעדית ולמקום של בתי המשפט המוסמכים הממוקמים בתל אביב, ישראל.
                  </p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    הסכם מלא
                  </h4>
                  <p>
                    תנאים אלה וטופסי ההזמנה (והתנאים, ההסכמים והמדיניות האחרים המוזכרים או מקושרים כאן) מהווים את ההסכם המלא בין הצדדים כאן ביחס לנושא זה ומחליפים את כל ההבנות הקודמות של צדדים כאלה ביחס לכך.
                  </p>
                </div>
              </div>
            </section>

            <section className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                יצירת קשר
              </h3>
              <p>לכל שאלה או שאילתה בנוגע לתנאים אלה או לפלטפורמה בכלל, אנא אל תהסס ליצור איתנו קשר דרך מערכת התמיכה שלנו או בכתובת: marketing@lookatme.site</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy Modal Component - Mobile Responsive
const PrivacyModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4'>
      <div className='bg-white rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] md:max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-200'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800'>{t('privacyPolicy')}</h2>
          <Button variant='ghost' onClick={onClose} className='p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg'>
            <X className='h-5 w-5 md:h-6 md:w-6' />
          </Button>
        </div>
        <div className='p-4 sm:p-6 overflow-y-auto max-h-[70vh] md:max-h-[60vh] text-right' dir='rtl'>
          <div className='space-y-4 md:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base'>
            <div className='bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 mb-4 md:mb-6'>
              <p className='text-green-800 text-xs sm:text-sm'>
                <strong>תאריך עדכון אחרון:</strong> 1 בינואר 2025 |{' '}
                <strong>תוקף:</strong> החל מיום השימוש הראשון
              </p>
            </div>

            <section>
              <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-2 md:mb-3'>
                מבוא ועדכונים
              </h3>
              <p>
                מדיניות פרטיות זו מפרטת כיצד Look At Me Ltd. וסניפיה ("Look At Me", "אנחנו", "שלנו" או "אנו") מעבדים מידע אישי (כפי שמוגדר להלן) הנאסף, בין היתר, דרך האתר שלנו או פלטפורמת השיווק החכמה המונעת בינה מלאכותית שלנו ("האתר" ו"הפלטפורמה" בהתאמה).
              </p>
              <p className='mt-3'>
                פרטי החברה:
              </p>
              <div className='bg-gray-50 p-3 rounded-lg mt-2'>
                <p><strong>Look At Me Ltd.</strong></p>
                <p>marketing@lookatme.site</p>
              </div>
              <p className='mt-3'>
                אנו עשויים לעדכן את מדיניות הפרטיות שלנו מעת לעת על ידי פרסום המדיניות החדשה בדף זה ועדכון תאריך "העדכון האחרון". אנו מעודדים אותך לבקר בדף זה באופן קבוע כדי לבדוק שינויים.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                איזה מידע אנו אוספים
              </h3>
              <p className='mb-4'>
                אנו עשויים לאסוף מידע אישי אודותיך, כלקוח או משתמש בפלטפורמה או באתר שלנו ("אתה"), כלומר כל מידע הקשור לאדם טבעי מזוהה או ניתן לזיהוי או "נתונים אישיים", "מידע אישי" או "מידע מזהה אישית" כפי שמוגדר אחרת תחת חוקי הפרטיות החלים ("מידע אישי"):
              </p>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    עבור משתמשי האתר:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>מידע אישי שאתה מספק לנו מרצון כגון כתובת האימייל שלך, למשל כאשר אתה מתקשר איתנו דרך האפשרות 'צור קשר' באתר, או נרשם לעדכונים או רשימת תפוצה</li>
                    <li>פרטי חיבור ספציפיים ומידע שעשוי לזהות אותך, כגון כתובת ה-IP שלך, נתוני לוג ושימוש וסוג מכשיר מדויק ומיקום</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    עבור משתמשי הפלטפורמה:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>פרטי חשבון: שם מלא, כתובת אימייל, מספר טלפון ופרטי תשלום</li>
                    <li>תוכן מדיה: תמונות, וידאו וקבצי שמע המועלים לניתוח AI</li>
                    <li>נתוני קמפיינים: מטרות שיווק, תקציבים, קהל יעד ופרמטרים של קמפיינים</li>
                    <li>נתוני ביצועים: סטטיסטיקות קמפיינים, תוצאות וניתוחים</li>
                    <li>העדפות משתמש: הגדרות שפה, אזור גיאוגרפי והעדפות אישיות</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                איך Look At Me משתמשת במידע
              </h3>
              <p className='mb-4'>
                אנו משתמשים במידע באופן המתואר במדיניות פרטיות זו. בנוסף למטרות המפורטות כאן, המידע שאנו אוספים, שעשוי לכלול את המידע האישי שלך, עשוי לשמש אותנו למטרות הבאות:
              </p>
              
              <ul className='list-disc pr-6 space-y-2'>
                <li>להגיב לשאלות ובקשות מלקוחות ומשתמשים שלנו, או לספק לך מידע נוסף על הפלטפורמה, המוצרים והשירותים שלנו, וכן לספק לך תמיכה</li>
                <li>לספק ללקוחות ומשתמשים שלנו גישה ושימוש בפלטפורמה, כולל תמיכה בקשר לכך</li>
                <li>לנתח תוכן מדיה (תמונות, וידאו ושמע) באמצעות בינה מלאכותית מתקדמת</li>
                <li>ליצור המלצות שיווקיות מותאמות אישית וקמפיינים אוטומטיים</li>
                <li>להעלות ולפרסם קמפיינים בפלטפורמות שונות (פייסבוק, גוגל, טיקטוק)</li>
                <li>לחקור ולפתור סכסוכים בקשר לשימוש בפלטפורמה ובאתר שלנו</li>
                <li>לזהות ולמנוע פעילות הונאה ובלתי חוקית או כל סוג אחר של פעילות שעלולה לסכן או להשפיע לרעה על הפלטפורמה</li>
                <li>לשפר את הביצועים של האתר והפלטפורמה</li>
                <li>לפתח מוצרים ושירותים חדשים על ידי ביצוע אנליטיקס או מחקר</li>
              </ul>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                עם מי אנו משתפים את המידע ולשם מה
              </h3>
              <div className='bg-red-50 p-4 rounded-lg border border-red-200 mb-4'>
                <p className='text-red-800 text-sm'>
                  <strong>התחייבות:</strong> אנו לא משכירים או מוכרים כל מידע אישי.
                </p>
              </div>
              
              <p className='mb-4'>אנו עשויים לשתף מידע אישי עם הנמענים הבאים:</p>
              
              <ul className='list-disc pr-6 space-y-2'>
                <li>ספקי שירות צד שלישי שלנו המעורבים במתן שירותים בקשר לפלטפורמה, האתר או שליחת תקשורת שיווקית (האחרון,כמתך)</li>
                <li>החברות הבנות והחברות הקשורות שלנו</li>
                <li>רואי חשבון או יועצים לעסק של Look At Me</li>
                <li>כל קונים פוטנציאליים, מלווים או משקיעים ב-Look At Me</li>
                <li>פלטפורמות מדיה חברתית (פייסבוק, גוגל, טיקטוק) לצורך פרסום קמפיינים</li>
                <li>ספקי AI (OpenAI) לצורך ניתוח תוכן</li>
              </ul>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                איך אנו מגינים על המידע שלך
              </h3>
              <p className='mb-4'>
                אנו מיישמים אמצעים טכניים, מנהליים וארגוניים סבירים מסחרית שנועדו להגן על המידע האישי שלך מפני אובדן, שימוש לרעה וגישה, חשיפה, שינוי או הרס לא מורשית, כולל הצפנה ומערכות ניהול משתמשים מאובטחות. עם זאת, עלינו לציין שאין שיטת העברה דרך האינטרנט או אחסון אלקטרוני שהיא 100% מאובטחת או נטולת שגיאות. לכן, עליך לנקוט זהירות מיוחדת בהחלטה איזה מידע אתה מספק לפלטפורמה.
              </p>
              
              <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4'>
                <p className='text-blue-800 text-sm'>
                  🔒 <strong>אבטחה מתקדמת:</strong> הצפנה ברמה גבוהה ואמצעי אבטחה מתקדמים
                </p>
              </div>
              
              <ul className='list-disc pr-6 space-y-2'>
                <li>הצפנה מלאה של נתונים במנוחה ובתנועה</li>
                <li>אימות מאובטח וניהול הרשאות</li>
                <li>מוניטורינג אבטחה 24/7</li>
                <li>גיבויים אוטומטיים מוצפנים</li>
                <li>בדיקות אבטחה תקופתיות</li>
                <li>הגנה מפני התקפות סייבר</li>
              </ul>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                זכויות הפרטיות שלך
              </h3>
              <p className='mb-4'>
                סמכויות שיפוט מסוימות מספקות לנושאי נתונים זכויות סטטוטוריות מסוימות למידע האישי שלהם. בכפוף לפטורים המסופקים על ידי החוק, ועם זיהוי נכון, ייתכן שיש לך זכות לפעולות מסוימות למידע האישי שלך כגון:
              </p>
              
              <ul className='list-disc pr-6 space-y-2'>
                <li><strong>זכות לאמת את המידע האישי שלך</strong> (לגשת, למחוק, לשנות או לעדכן כל מידע אישי הקשור אליך. למשל, אם אתה מאמין שהמידע האישי שלך שגוי, אתה יכול לבקש לתקן או למחוק אותו)</li>
                <li><strong>זכות לבקש שנמחק מידע אישי אודותיך</strong> (בכפוף לכל התחייבות חוקית אחרת שעלולה לדרוש מאיתנו לשמור על המידע הזה)</li>
                <li><strong>זכות להתנגד לעיבוד המידע האישי שלך</strong> כאשר הבסיס החוקי שלנו הוא אינטרס לגיטימי או שיווק ישיר</li>
                <li><strong>זכות להגביל אותנו מעיבוד מידע אישי הנוגע אליך</strong> (למשל, אתה יכול לבקש שנפסיק להשתמש או לשתף את המידע האישי שלך עם ספקי שירות צד שלישי)</li>
                <li><strong>זכות לייצא מידע אישי בפורמט נייד</strong></li>
              </ul>
              
              <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4'>
                <p className='text-yellow-800 text-sm'>
                  <strong>למימוש זכויותיך:</strong> אם ברצונך לממש כל אחת מהזכויות הללו, אנא צור איתנו קשר בכתובת: marketing@lookatme.site
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                טכנולוגיות מעקב צד שלישי
              </h3>
              <p className='mb-4'>
                אנו משתמשים בקובצי Cookie וטכנולוגיות אחרות בשירותים שלנו, כולל כאשר אתה מבקר באתר שלנו או ניגש לפלטפורמה שלנו. "Cookie" הוא פיסת מידע קטנה שאתר מקצה למכשיר שלך בזמן שאתה צופה באתר. קובצי Cookie מועילים מאוד ויכולים לשמש למטרות שונות. מטרות אלה כוללות לאפשר לך לנווט בין דפים ביעילות, לאפשר הפעלה אוטומטית של תכונות מסוימות, לזכור את ההעדפות שלך ולהפוך את האינטראקציה בינך לבין הפלטפורמה שלנו למהירה וקלה יותר.
              </p>
              
              <p className='mb-4'>
                האתר שלנו משתמש בקובצי Cookie כדי לספק לך שירותים, לאפשר את השימוש שלך בפלטפורמה, לזהות אותך לביקורים חוזרים (למשל, לאפשר לנו לאחסן את ההעדפות שלך לכניסה הבאה), ולנטר ולנתח את הגישה שלך לאינטרנט.
              </p>
              
              <p className='mb-4'>
                אנו גם משתמשים בכלי הנקרא Google Analytics כדי לאסוף מידע על השימוש שלך בפלטפורמה ובאתר. שירות צד שלישי זה אוסף מידע כגון כמה פעמים משתמשים ניגשים לפלטפורמה או לאתר, באילו דפים הם מבקרים כשהם עושים זאת, וכו'. אנו משתמשים במידע שאנו מקבלים מכלים אלה רק כדי לשפר את האתר והפלטפורמה שלנו.
              </p>
              
              <div className='bg-orange-50 p-4 rounded-lg border border-orange-200'>
                <p className='text-orange-800 text-sm'>
                  <strong>ניהול קובצי Cookie:</strong> אתה יכול להסיר את קובצי Cookie על ידי ביצוע ההוראות של העדפות המכשיר שלך. תוכל למצוא מידע נוסף על קובצי Cookie ב-www.allaboutcookies.org; עם זאת, אם תבחר להשבית קובצי Cookie, חלק מהתכונות של השירות שלנו עלולות לא לפעול כראוי והחוויה המקוונת שלך עלולה להיות מוגבלת.
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                כמה זמן אנו שומרים את המידע
              </h3>
              <p className='mb-4'>
                אנו שומרים את המידע שאנו אוספים ממך כל עוד זה נחוץ בהתבסס על המטרה שלשמה הוא נאסף ובהתחשב בעמידה בהתחייבויות החוקיות שלנו, פתרון סכסוכים ואכיפת הזכויות שלנו. תקופות השמירה ייקבעו תוך התחשבות בסוג המידע שנאסף ובמטרה שלשמה הוא נאסף, תוך התחשבות בדרישות החלות על המצב ובצורך להשמיד מידע מיושן ולא בשימוש בזמן הסביר המוקדם ביותר.
              </p>
              
              <ul className='list-disc pr-6 space-y-2'>
                <li><strong>מידע חשבון:</strong> נשמר כל עוד החשבון פעיל</li>
                <li><strong>תוכן מדיה:</strong> נמחק תוך 30 יום ממחיקת החשבון</li>
                <li><strong>נתוני תשלום:</strong> נשמרים 7 שנים לצורכי מיסוי וחוק</li>
                <li><strong>לוגים טכניים:</strong> נשמרים עד 12 חודשים</li>
                <li><strong>נתוני קמפיינים:</strong> נשמרים כל עוד החשבון פעיל</li>
                <li><strong>נתוני אנליטיקס:</strong> נשמרים עד 24 חודשים</li>
              </ul>
              
              <p className='mt-4'>
                אנו עשויים לתקן, להשלים או להסיר מידע לא שלם או לא מדויק, בכל עת ולפי שיקול דעתנו. אנו עשויים לשמור רשומות המכילות את המידע האישי שלך, תקשורת וכל דבר אחר כנדרש על ידי חוקים ותקנות חלים.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                העברה בינלאומית
              </h3>
              <p>
                מכיוון ש-Look At Me פועלת גלובלית, ייתכן שיהיה צורך עבורנו להעביר מידע, כולל מידע אישי, למדינות אחרות מאשר המדינה שבה המידע נאסף. במקרים אלה, נעביר את הנתונים שלך בהתאם להוראות חוק הפרטיות החלים שנועדו להגן על עיבוד המידע האישי שלך.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                שינויים במדיניות
              </h3>
              <p>
                במקרה של שינויים מהותיים במדיניות, נודיע לך באימייל ונבקש הסכמה חדשה במידת הצורך. שינויים קלים יפורסמו באתר בהודעה מוקדמת.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                תלונות ופניות
              </h3>
              <p className='mb-4'>
                אם ברצונך להעלות תלונה על איך טיפלנו במידע האישי שלך, אנא צור איתנו קשר ישירות בכתובת: marketing@lookatme.site
              </p>
              
              <p className='mb-4'>
                אם אינך מרוצה מהתגובה שלנו או מאמין שאנו אוספים או מעבדים את המידע האישי שלך שלא בהתאם לחוקים, אתה רשאי לבחור להגיש תלונה לרשות הגנת הפרטיות הרלוונטית.
              </p>
              
              <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
                <p className='text-purple-800 text-sm'>
                  <strong>יצירת קשר:</strong> לכל שאלה או בקשה בנושא מדיניות פרטיות זו, אנא צור איתנו קשר בכתובת: marketing@lookatme.site
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const { settings } = useSettings();
  const { t, changeLanguage, isRTL } = useTranslations();
  const { currentUser } = useAuth();
  useTheme(); // Apply theme settings
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredProblem, setHoveredProblem] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [openFAQItem, setOpenFAQItem] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get user display name
  const getUserDisplayName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'משתמש';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('connectedPlatforms');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to navigate to auth page
  const navigateToAuth = () => {
    window.location.href = '/auth';
  };

  // Function to navigate to campaign creation (requires auth)
  const navigateToCampaign = () => {
    if (currentUser) {
      window.location.href = '/campaign';
    } else {
      alert(t('requireAccountMessage'));
      window.location.href = '/auth';
    }
  };

  // Function to scroll to pricing section
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to close language menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = event => {
      if (showLanguageMenu && !event.target.closest('.language-dropdown')) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  // Problems section data
  const problems = [
    {
      icon: Search,
      title: t('problem1Title'),
      description: t('problem1Description'),
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Clock,
      title: t('problem2Title'),
      description: t('problem2Description'),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: AlertTriangle,
      title: t('problem3Title'),
      description: t('problem3Description'),
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: DollarSign,
      title: t('problem4Title'),
      description: t('problem4Description'),
      gradient: 'from-red-500 to-purple-500',
    },
  ];

  // Benefits section data
  const benefits = [
    {
      icon: Eye,
      title: t('benefit1Title'),
      description: t('benefit1Description'),
      tech: t('benefit1Tech'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: t('benefit2Title'),
      description: t('benefit2Description'),
      tech: t('benefit2Tech'),
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      icon: Zap,
      title: t('benefit3Title'),
      description: t('benefit3Description'),
      tech: t('benefit3Tech'),
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: TrendingUp,
      title: t('benefit4Title'),
      description: t('benefit4Description'),
      tech: t('benefit4Tech'),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Rocket,
      title: t('benefit5Title'),
      description: t('benefit5Description'),
      tech: t('benefit5Tech'),
      gradient: 'from-pink-500 to-purple-500',
    },
  ];

  // App strengths - 4 main advantages
  const appStrengths = [
    {
      icon: Brain,
      title: t('strength1Title'),
      description: t('strength1Description'),
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      icon: Zap,
      title: t('strength2Title'),
      description: t('strength2Description'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: t('strength3Title'),
      description: t('strength3Description'),
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Globe,
      title: 'הפלטפורמות הכי פופולריות',
      description:
        'תמיכה מלאה בפייסבוק, אינסטגרם, גוגל וטיקטוק עם ניתוח מותאם לכל פלטפורמה',
      gradient: 'from-blue-500 to-purple-500',
    },
  ];

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden'
      dir={settings.direction}
    >
      {/* Enhanced Header - Mobile Responsive */}
      <header
        className='fixed top-0 left-0 right-0 z-50 py-2 md:py-4 transition-all duration-300'
        id='header'
      >
        <div className='container max-w-6xl mx-auto px-3 md:px-6'>
          <div className='bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg border border-gray-100 px-3 md:px-6 py-3 md:py-4 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              {/* Enhanced Logo - Mobile Responsive */}
              <div className='flex items-center space-x-2 md:space-x-3 group cursor-pointer'>
                <div className='w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-md relative overflow-hidden group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105'>
                  <span className='text-white font-bold text-base md:text-lg z-10'>L</span>
                </div>
                <div className='group-hover:translate-x-1 transition-transform duration-300'>
                  <span className='text-base md:text-xl font-bold text-gray-900'>
                    LOOK AT ME
                  </span>
                  <div className='hidden sm:block text-xs text-gray-500 mt-0.5 font-medium'>
                    AI Marketing Platform
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation - Desktop Only */}
              <nav className='hidden lg:flex items-center gap-4 xl:gap-8'>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 xl:px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                  onClick={scrollToPricing}
                >
                  {t('pricing')}
                </Button>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 xl:px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                  onClick={() => setShowHelp(true)}
                >
                  {t('help')}
                </Button>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 xl:px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                  onClick={() => setShowFAQ(true)}
                >
                  {t('faq')}
                </Button>

                {/* Language Dropdown - Desktop */}
                <div className='relative language-dropdown hidden lg:block'>
                  <Button
                    variant='ghost'
                    className='flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 xl:p-2.5 shadow-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-200'
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  >
                    <Globe className='h-3.5 w-3.5 xl:h-4 xl:w-4 text-blue-600' />
                    <span className='text-sm font-medium text-gray-700'>
                      {isRTL ? 'ע' : 'EN'}
                    </span>
                    <ChevronDown className='h-3 w-3 text-gray-500' />
                  </Button>

                  {/* Dropdown Menu */}
                  {showLanguageMenu && (
                    <div className='absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50'>
                      <button
                        onClick={() => {
                          changeLanguage('hebrew');
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-sm font-medium text-right transition-all duration-200 hover:bg-blue-50 ${
                          isRTL ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        עברית
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('english');
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-sm font-medium text-right transition-all duration-200 hover:bg-blue-50 ${
                          !isRTL ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>

                {currentUser ? (
                  <>
                    <span className='hidden xl:flex text-gray-700 px-4 py-2.5 font-medium text-sm'>
                      שלום, {getUserDisplayName()}
                    </span>
                    <Button
                      variant='outline'
                      className='hidden xl:flex text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 px-4 xl:px-5 py-2.5 border font-medium text-sm'
                      onClick={handleLogout}
                    >
                      התנתק
                    </Button>
                    <Button
                      className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 xl:px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm'
                      onClick={navigateToCampaign}
                    >
                      {t('startCampaign')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant='outline'
                      className='hidden xl:flex text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 px-4 xl:px-5 py-2.5 border font-medium text-sm'
                      onClick={navigateToAuth}
                    >
                      {t('signIn')}
                    </Button>
                    <Button
                      className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 xl:px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm'
                      onClick={navigateToCampaign}
                    >
                      {t('startCampaign')}
                    </Button>
                  </>
                )}
              </nav>

              {/* Mobile menu button - Improved */}
              <div className='lg:hidden flex items-center space-x-2'>
                {currentUser ? (
                  <>
                    <span className='text-xs md:text-sm text-gray-700 font-medium'>
                      {getUserDisplayName()}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 border-red-600 hover:bg-red-50 rounded-lg text-xs md:text-sm px-2 md:px-3'
                      onClick={handleLogout}
                    >
                      התנתק
                    </Button>
                  </>
                ) : (
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-blue-600 border-blue-600 hover:bg-blue-50 rounded-lg text-xs md:text-sm px-2 md:px-3'
                    onClick={navigateToAuth}
                  >
                    {t('signIn')}
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-2'
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu className='h-5 w-5 md:h-6 md:w-6' />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu - Improved Responsive */}
          {showMobileMenu && (
            <div className='lg:hidden mt-3 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4'>
              <div className='space-y-2'>
                <Button 
                  variant='ghost' 
                  className='w-full text-right justify-end text-base py-3 hover:bg-blue-50 hover:text-blue-600'
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                >
                  {t('features')}
                </Button>
                <Button
                  variant='ghost'
                  className='w-full text-right justify-end text-base py-3 hover:bg-blue-50 hover:text-blue-600'
                  onClick={() => {
                    scrollToPricing();
                    setShowMobileMenu(false);
                  }}
                >
                  {t('pricing')}
                </Button>
                <Button
                  variant='ghost'
                  className='w-full text-right justify-end text-base py-3 hover:bg-blue-50 hover:text-blue-600'
                  onClick={() => {
                    setShowHelp(true);
                    setShowMobileMenu(false);
                  }}
                >
                  {t('help')}
                </Button>
                <Button
                  variant='ghost'
                  className='w-full text-right justify-end text-base py-3 hover:bg-blue-50 hover:text-blue-600'
                  onClick={() => {
                    setShowFAQ(true);
                    setShowMobileMenu(false);
                  }}
                >
                  {t('faq')}
                </Button>

                {/* Mobile Language Switcher - Enhanced */}
                <div className='flex items-center justify-center space-x-3 pt-4 border-t border-gray-200 mt-4'>
                  <span className='text-sm text-gray-600 font-medium'>
                    {t('language')}:
                  </span>
                  <button
                    onClick={() => {
                      changeLanguage('hebrew');
                      setShowMobileMenu(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-w-[60px] ${
                      isRTL
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                    }`}
                  >
                    עב
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('english');
                      setShowMobileMenu(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-w-[60px] ${
                      !isRTL
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Mobile CTA Button */}
                <div className='pt-4'>
                  <Button
                    size='lg'
                    className='w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 text-base rounded-xl shadow-lg'
                    onClick={() => {
                      navigateToCampaign();
                      setShowMobileMenu(false);
                    }}
                  >
                    {t('startCampaign')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section + 4 חוזקות מרכזיות - Mobile Responsive */}
      <section className='pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-24 px-3 sm:px-4 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-slate-50'>
        <div className='container max-w-7xl mx-auto'>
          {/* Hero Content - Mobile Optimized */}
          <div className='text-center mb-12 md:mb-20'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 md:mb-8 leading-tight px-2'>
              {t('heroTitle')}
            </h1>

            <p className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4'>
              {t('heroSubtitle')}
            </p>

            {/* Enhanced CTA Buttons - Mobile Responsive */}
            <div className='flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12 md:mb-20 px-4'>
              <Button
                size='lg'
                className='w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 sm:px-10 md:px-12 py-4 md:py-6 text-base md:text-lg lg:text-xl rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 md:hover:scale-110 hover:-translate-y-1 relative overflow-hidden group'
                onClick={navigateToAuth}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                <span className='relative z-10 flex items-center justify-center'>
                  <Users className='ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6' />
                  {t('createAccount')}
                </span>
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 sm:px-10 md:px-12 py-4 md:py-6 text-base md:text-lg lg:text-xl rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 md:hover:scale-110 hover:-translate-y-1 bg-white/90 backdrop-blur-sm'
                onClick={navigateToCampaign}
              >
                <span className='relative z-10 flex items-center justify-center'>
                  <Rocket className='ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6' />
                  {t('startCampaign')}
                </span>
              </Button>
            </div>
          </div>

          {/* Strengths Grid - Mobile Responsive */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8'>
            {appStrengths.map((strength, index) => (
              <Card
                key={index}
                className='group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 bg-white/95 backdrop-blur-sm'
              >
                <CardContent className='p-4 sm:p-6 md:p-8 relative z-10'>
                  <div className='flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6'>
                    <div
                      className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-r ${strength.gradient} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden mx-auto sm:mx-0 flex-shrink-0`}
                    >
                      <div className='absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                      <strength.icon className='h-8 w-8 md:h-10 md:w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300' />
                    </div>
                    <div className='flex-1 text-center sm:text-right'>
                      <h3 className='text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 group-hover:text-blue-600 transition-colors duration-300'>
                        {strength.title}
                      </h3>
                      <p className='text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed'>
                        {strength.description}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Subtle Background Effects */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${strength.gradient} opacity-0 group-hover:opacity-3 transition-opacity duration-700`}
                ></div>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-pink-50/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>

                {/* Elegant Border Glow */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${strength.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl scale-110`}
                ></div>

                {/* Floating Accent */}
                <div
                  className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${strength.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:animate-pulse`}
                ></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* הבעיה - למה צריך את זה - Mobile Responsive */}
      <section className='py-12 md:py-20 px-3 sm:px-4 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50'>
        <div className='container max-w-7xl mx-auto'>
          <div className='text-center mb-10 md:mb-16'>
            <div className='inline-flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold border border-red-200 shadow-lg mb-4 md:mb-6'>
              <AlertTriangle className='h-4 w-4 md:h-5 md:w-5' />
              <span>{t('problems')}</span>
            </div>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 px-4'>
              {t('problemsTitle')}
            </h2>
            <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4'>
              {t('problemsSubtitle')}
            </p>
          </div>

          {/* Problems Grid - Mobile Responsive */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8'>
            {problems.map((problem, index) => (
              <Card
                key={index}
                className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${
                  hoveredProblem === index
                    ? 'bg-gradient-to-br from-red-50 to-orange-50'
                    : 'bg-white/80 backdrop-blur-sm'
                }`}
                onMouseEnter={() => setHoveredProblem(index)}
                onMouseLeave={() => setHoveredProblem(null)}
              >
                <CardContent className='p-4 sm:p-6 md:p-8'>
                  <div className='flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8'>
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${problem.gradient} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0 flex-shrink-0`}
                    >
                      <problem.icon className='h-7 w-7 sm:h-8 sm:w-8 text-white' />
                    </div>
                    <div className='flex-1 text-center sm:text-right'>
                      <h3 className='text-lg sm:text-xl font-bold text-gray-800 mb-2 md:mb-3'>
                        {problem.title}
                      </h3>
                      <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className='absolute inset-0 bg-gradient-to-r from-red-50/0 via-orange-50/0 to-yellow-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* איך זה עובד - 3 צעדים פשוטים - Mobile Responsive */}
      <section className='py-12 md:py-20 px-3 sm:px-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50'>
        <div className='container max-w-7xl mx-auto'>
          <div className='text-center mb-10 md:mb-16'>
            <div className='inline-flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold border border-blue-200 shadow-lg mb-4 md:mb-6'>
              <Lightbulb className='h-4 w-4 md:h-5 md:w-5' />
              <span>{t('howItWorks')}</span>
            </div>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 px-4'>
              {t('howItWorksTitle')}
            </h2>
            <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4'>
              {t('howItWorksSubtitle')}
            </p>
          </div>

          {/* Steps Grid - Mobile Responsive */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 relative'>
            {/* Connection Lines - Desktop Only */}
            <div className='hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2'></div>
            <div className='hidden lg:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-y-1/2'></div>

            {/* Steps section - Mobile Optimized */}
            {[
              {
                number: '01',
                title: t('step1Title'),
                description: t('step1Subtitle'),
                icon: CloudUpload,
                details: [t('step1Feature1'), t('step1Feature2'), t('step1Feature3')],
                gradient: 'from-blue-500 to-purple-500',
              },
              {
                number: '02',
                title: t('step2Title'),
                description: t('step2Subtitle'),
                icon: Brain,
                details: [t('step2Feature1'), t('step2Feature2'), t('step2Feature3')],
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                number: '03',
                title: t('step3Title'),
                description: t('step3Subtitle'),
                icon: Rocket,
                details: [t('step3Feature1'), t('step3Feature2'), t('step3Feature3')],
                gradient: 'from-pink-500 to-red-500',
              },
            ].map((step, index) => (
              <div key={index} className='text-center relative group'>
                <div className='relative mb-6 md:mb-8'>
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r ${step.gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-white text-2xl sm:text-3xl font-bold shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                  ></div>

                  {/* Floating Icon - Hidden on very small screens */}
                  <div className='hidden sm:flex absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-lg items-center justify-center transform transition-all duration-500 group-hover:scale-110'>
                    <step.icon className='h-5 w-5 md:h-6 md:w-6 text-purple-600' />
                  </div>
                </div>

                <h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-purple-600 transition-colors duration-300 px-2'>
                  {step.title}
                </h3>
                <p className='text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6 px-4'>
                  {step.description}
                </p>

                {/* Step Details Card - Mobile Optimized */}
                <Card className='max-w-sm mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2'>
                  <CardContent className='p-3 sm:p-4'>
                    <div className='space-y-2'>
                      {step.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className='flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-600'
                        >
                          <CheckCircle className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0' />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - עמוד מחירים - Mobile Responsive */}
      <section
        id='pricing'
        className='py-12 md:py-20 px-3 sm:px-4 bg-gradient-to-r from-white via-blue-50 to-purple-50'
      >
        <div className='container max-w-6xl mx-auto text-center'>
          <div className='mb-10 md:mb-16'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 px-4'>
              {t('pricingTitle')}
            </h2>
            <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4'>
              {t('pricingSubtitle')}
            </p>
          </div>

          {/* Pricing Cards - Mobile Responsive - 3 Plans */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 max-w-7xl mx-auto items-stretch'>
            {/* Free Plan - Mobile Responsive */}
            <div className='bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden flex flex-col h-full'>
              <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 to-teal-500'></div>

              <div className='mb-6'>
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                  {t('freePlan')}
                </h3>
                <p className='text-sm md:text-base text-gray-600'>{t('freePlanDescription')}</p>
              </div>

              <div className='mb-6 md:mb-8'>
                <div className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>{t('freePrice')}</div>
                <div className='text-sm md:text-base text-gray-500'>{t('limited3Analyses')}</div>
              </div>

              <ul className='text-right space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow'>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    {t('freeFeature1')}
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('freeFeature2')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('freeFeature3')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('freeFeature4')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
              </ul>

              <Button
                size='lg'
                className='w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 md:py-4 text-base md:text-lg rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-auto'
                onClick={navigateToAuth}
              >
                {t('startNow')}
              </Button>
            </div>

            {/* Regular Plan - Mobile Responsive */}
            <div className='bg-white rounded-2xl md:rounded-3xl shadow-2xl border-2 border-blue-500 p-6 md:p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden flex flex-col h-full'>
              <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'></div>
              
              {/* Most Popular Badge */}
              <div className='absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                {t('mostPopular')}
              </div>

              <div className='mb-6 mt-4'>
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                  {t('regularPlan')}
                </h3>
                <p className='text-sm md:text-base text-gray-600'>{t('regularPlanDescription')}</p>
              </div>

              <div className='mb-6 md:mb-8'>
                <div className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>{t('regularPrice')}</div>
                <div className='text-sm md:text-base text-gray-500'>{t('limited30Analyses')}</div>
              </div>

              <ul className='text-right space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow'>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    {t('regularFeature1')}
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('regularFeature2')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('regularFeature3')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('regularFeature4')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
              </ul>

              <Button
                size='lg'
                className='w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-3 md:py-4 text-base md:text-lg rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-auto'
                onClick={navigateToAuth}
              >
                {t('choosePlan')}
              </Button>
            </div>

            {/* Unlimited Plan - Mobile Responsive */}
            <div className='bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden flex flex-col h-full'>
              <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'></div>

              <div className='mb-6'>
                <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                  {t('unlimitedPlan')}
                </h3>
                <p className='text-sm md:text-base text-gray-600'>{t('unlimitedPlanDescription')}</p>
              </div>

              <div className='mb-6 md:mb-8'>
                <div className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                  {t('unlimitedPrice')}
                </div>
                <div className='text-sm md:text-base text-gray-500'>{t('unlimitedAnalyses')}</div>
              </div>

              <ul className='text-right space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow'>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    {t('unlimitedFeature1')}
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    {t('unlimitedFeature2')}
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('unlimitedFeature3')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>{t('unlimitedFeature4')}</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
              </ul>

              <Button
                size='lg'
                className='w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white py-3 md:py-4 text-base md:text-lg rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-auto'
                onClick={navigateToAuth}
              >
                {t('choosePlan')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer - Mobile Responsive */}
      <footer className='bg-gray-50 py-8 md:py-12 px-4 md:px-6'>
        <div className='container max-w-6xl mx-auto text-center'>
          {/* Logo and Description - Mobile Optimized */}
          <div className='mb-6 md:mb-8'>
            <div className='flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4'>
              <div className='w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center'>
                <span className='text-white font-bold text-base md:text-lg'>L</span>
              </div>
              <span className='text-xl md:text-2xl font-bold text-gray-900'>
                Look At Me
              </span>
            </div>
            <p className='text-gray-600 leading-relaxed text-xs sm:text-sm max-w-lg mx-auto px-4'>
              {t('footerDescription')}
            </p>
          </div>

          {/* Navigation Links - Mobile Responsive */}
          <div className='flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm mb-6 md:mb-8'>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={navigateToCampaign}
            >
              {t('createCampaign')}
            </Button>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={() => setShowFAQ(true)}
            >
              {t('faq')}
            </Button>
            <a
              href='#'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              {t('contact')}
            </a>
            <a 
              href="/privacy-policy" 
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              {t('privacyPolicy')}
            </a>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={() => setShowTerms(true)}
            >
              {t('termsOfService')}
            </Button>
          </div>

          {/* Copyright - Mobile Responsive */}
          <div className='text-xs sm:text-sm text-gray-500 px-4'>
            {t('allRightsReserved')}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FAQModal
        isOpen={showFAQ}
        onClose={() => setShowFAQ(false)}
        openFAQItem={openFAQItem}
        setOpenFAQItem={setOpenFAQItem}
        t={t}
      />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} t={t} />
      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        t={t}
      />
    </div>
  );
};

export default Index;
