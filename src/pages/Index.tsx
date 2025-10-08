import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Translations } from '@/lib/translations';
import { useSettings } from '@/lib/settings-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslations } from '@/hooks/useTranslations';

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

// FAQ Data
const faqData = [
  {
    question: 'איך האפליקציה מנתחת את התוכן שלי?',
    answer:
      'האפליקציה משתמשת בבינה מלאכותית מתקדמת לניתוח וידאו, תמונות ושמע. היא מזהה צבעים, תאורה, מוזיקה, טקסט, רגשות ועוד רכיבים רבים כדי להבין את המסר והסגנון של התוכן שלך.',
  },
  {
    question: 'האם הנתונים שלי מאובטחים?',
    answer:
      'כן, אנו משתמשים בהצפנה מתקדמת ברמת בנקים להגנה על הנתונים שלך. כל התוכן מאוחסן בשרתים מאובטחים ואף אחד לא יכול לגשת אליו מלבדך.',
  },
  {
    question: 'כמה זמן לוקח לקבל המלצות?',
    answer:
      'הניתוח והמלצות מתקבלות תוך 2-5 דקות ממועד העלאת התוכן, תלוי באורך ובמורכבות של הקובץ.',
  },
  {
    question: 'אילו פלטפורמות נתמכות?',
    answer:
      'כרגע אנו תומכים בפייסבוק, אינסטגרם, גוגל וטיקטוק. בקרוב נוסיף תמיכה בטוויטר ופלטפורמות נוספות.',
  },
  {
    question: 'האם יש ניסיון חינם?',
    answer:
      'כן! אתה יכול לנתח עד 3 קבצים חינם לפני שתחליט אם להירשם למנוי. לא נדרשים פרטי כרטיס אשראי.',
  },
  {
    question: 'איך אני יכול לבטל את המנוי?',
    answer:
      'ניתן לבטל את המנוי בכל עת דרך הגדרות החשבון. הביטול יכנס לתוקף בסוף התקופה ששולמה.',
  },
  {
    question: 'האם האפליקציה עובדת על כל המכשירים?',
    answer:
      'כן, האפליקציה עובדת על מחשבים, טאבלטים וסמארטפונים עם כל הדפדפנים המודרניים.',
  },
  {
    question: 'איך יוצרים קשר לתמיכה?',
    answer:
      "ניתן ליצור קשר דרך המייל support@lookatme.ai או דרך הצ'אט בתוך האפליקציה. אנו זמינים 24/7.",
  },
];

// FAQ Modal Component
const FAQModal = ({ isOpen, onClose, openFAQItem, setOpenFAQItem }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>שאלות נפוצות</h2>
          <Button variant='ghost' onClick={onClose} className='p-2'>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <div className='p-6 overflow-y-auto max-h-[60vh] text-right' dir='rtl'>
          <div className='space-y-4'>
            {faqData.map((item, index) => (
              <Card key={index} className='border border-gray-200'>
                <CardContent className='p-0'>
                  <Button
                    variant='ghost'
                    className='w-full p-6 text-right justify-between h-auto'
                    onClick={() =>
                      setOpenFAQItem(openFAQItem === index ? null : index)
                    }
                  >
                    <span className='font-medium text-gray-800'>
                      {item.question}
                    </span>
                    {openFAQItem === index ? (
                      <ChevronUp className='h-5 w-5' />
                    ) : (
                      <ChevronDown className='h-5 w-5' />
                    )}
                  </Button>
                  {openFAQItem === index && (
                    <div className='px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100'>
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

// Help Modal Component
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl max-w-5xl max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>מרכז עזרה</h2>
          <Button variant='ghost' onClick={onClose} className='p-2'>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <div className='p-6 overflow-y-auto max-h-[60vh] text-right' dir='rtl'>
          <div className='grid md:grid-cols-2 gap-6'>
            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-6 text-center'>
                <CloudUpload className='h-12 w-12 text-blue-600 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  העלאת קבצים
                </h3>
                <p className='text-gray-600 text-sm'>
                  למד איך להעלות וידאו, תמונות ושמע לניתוח
                </p>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-6 text-center'>
                <Brain className='h-12 w-12 text-purple-600 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  הבנת התוצאות
                </h3>
                <p className='text-gray-600 text-sm'>
                  איך לפרש את ההמלצות וליישם אותן
                </p>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-6 text-center'>
                <Target className='h-12 w-12 text-green-600 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  קהל יעד
                </h3>
                <p className='text-gray-600 text-sm'>
                  איך לזהות ולהגיע לקהל הנכון
                </p>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-6 text-center'>
                <Rocket className='h-12 w-12 text-red-600 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  שיגור קמפיינים
                </h3>
                <p className='text-gray-600 text-sm'>
                  מהעלאה ועד פרסום בפלטפורמות
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='mt-8 bg-blue-50 p-6 rounded-xl'>
            <h3 className='text-lg font-bold text-blue-800 mb-3'>
              זקוק לעזרה נוספת?
            </h3>
            <p className='text-blue-700 mb-4'>הצוות שלנו זמין 24/7 לעזור לך</p>
            <div className='flex space-x-4'>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                <MessageSquare className='h-4 w-4 ml-2' />
                צ'אט חי
              </Button>
              <Button
                variant='outline'
                className='border-blue-600 text-blue-600'
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

// Terms Modal Component
const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>תנאי שימוש</h2>
          <Button variant='ghost' onClick={onClose} className='p-2'>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <div className='p-6 overflow-y-auto max-h-[60vh] text-right' dir='rtl'>
          <div className='space-y-6 text-gray-700 leading-relaxed'>
            <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6'>
              <p className='text-blue-800 text-sm'>
                <strong>תאריך עדכון אחרון:</strong> 1 בינואר 2025 |{' '}
                <strong>תאריך תחילת תוקף:</strong> 1 בינואר 2025
              </p>
            </div>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                1. הגדרות ומונחים
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>"החברה"</strong> - Look At Me Ltd.
                </p>
                <p>
                  <strong>"השירות"</strong> - פלטפורמת Look At Me לניתוח תוכן
                  באמצעות בינה מלאכותית
                </p>
                <p>
                  <strong>"המשתמש"</strong> - כל אדם או גוף המשתמש בשירות
                </p>
                <p>
                  <strong>"התוכן"</strong> - כל חומר דיגיטלי המועלה לשירות
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                2. קבלת התנאים
              </h3>
              <p>
                השימוש בשירות מהווה הסכמה מלאה לתנאים אלו. אם אינך מסכים לתנאים,
                נא הפסק את השימוש בשירות מיידית.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                3. תיאור השירות
              </h3>
              <p>
                Look At Me מספקת פלטפורמה מבוססת בינה מלאכותית לניתוח תוכן
                דיגיטלי ויצירת קמפיינים שיווקיים. השירות כולל:
              </p>
              <ul className='list-disc pr-6 mt-2 space-y-1'>
                <li>ניתוח אוטומטי של תמונות, וידאו ותוכן טקסטואלי</li>
                <li>יצירת המלצות שיווקיות מותאמות אישית</li>
                <li>אופטימיזציה לפלטפורמות שיווק שונות</li>
                <li>דוחות ואנליטיקות מתקדמות</li>
              </ul>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                4. זכויות ואחריות המשתמש
              </h3>
              <div className='space-y-3'>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    4.1 התחייבויות המשתמש:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>מתן מידע מדויק ומעודכן</li>
                    <li>שמירה על סודיות פרטי החשבון</li>
                    <li>שימוש בשירות בהתאם לחוק ולתנאים אלו</li>
                    <li>אחריות מלאה לתוכן המועלה לשירות</li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    4.2 איסורי שימוש:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>העלאת תוכן פוגעני, לא חוקי או מפר זכויות יוצרים</li>
                    <li>ניסיון לפרוץ או לפגוע במערכת</li>
                    <li>שימוש אוטומטי או בוטים ללא אישור</li>
                    <li>העברת החשבון לצד שלישי ללא אישור</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                5. תנאי התשלום
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>5.1</strong> התעריפים מפורסמים באתר ועשויים להשתנות
                  בהודעה מוקדמת של 30 יום.
                </p>
                <p>
                  <strong>5.2</strong> התשלום מתבצע מראש לכל תקופת מנוי.
                </p>
                <p>
                  <strong>5.3</strong> ביטול מנוי יכנס לתוקף בתום התקופה ששולמה.
                </p>
                <p>
                  <strong>5.4</strong> אין החזר כספי למנויים שבוטלו באמצע
                  התקופה.
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                6. זכויות יוצרים וקניין רוחני
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>6.1</strong> כל הזכויות בשירות שמורות לחברה.
                </p>
                <p>
                  <strong>6.2</strong> המשתמש מעניק רישיון לחברה לעיבוד התוכן
                  לצורך מתן השירות.
                </p>
                <p>
                  <strong>6.3</strong> התוצרים שנוצרים על ידי הבינה המלאכותית
                  שייכים למשתמש.
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                7. הגבלת אחריות
              </h3>
              <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
                <p className='text-yellow-800 text-sm'>
                  <strong>הודעה חשובה:</strong> השירות מסופק "כמו שהוא" ללא
                  אחריות מכל סוג. החברה לא תהיה אחראית לנזקים עקיפים, תוצאתיים
                  או מיוחדים.
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                8. סיום השירות
              </h3>
              <p>
                החברה רשאית להפסיק את השירות או לחסום משתמש בהודעה מוקדמת של 30
                יום או מיידית במקרה של הפרת התנאים.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                9. שינוי תנאים
              </h3>
              <p>
                החברה רשאית לשנות תנאים אלו בהודעה מוקדמת של 30 יום. המשך השימוש
                לאחר השינוי מהווה הסכמה לתנאים החדשים.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                10. דין חל וסמכות שיפוט
              </h3>
              <p>
                תנאים אלו כפופים לחוקי מדינת ישראל. סמכות השיפוט הבלעדית נתונה
                לבתי המשפט בתל אביב.
              </p>
            </section>

            <section className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                יצירת קשר
              </h3>
              <p>לשאלות בנוגע לתנאים אלו, אנא צור קשר דרך האתר.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Privacy Modal Component
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>מדיניות פרטיות</h2>
          <Button variant='ghost' onClick={onClose} className='p-2'>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <div className='p-6 overflow-y-auto max-h-[60vh] text-right' dir='rtl'>
          <div className='space-y-6 text-gray-700 leading-relaxed'>
            <div className='bg-green-50 p-4 rounded-lg border border-green-200 mb-6'>
              <p className='text-green-800 text-sm'>
                <strong>תאריך עדכון אחרון:</strong> 1 בינואר 2025 |{' '}
                <strong>תוקף:</strong> החל מיום השימוש הראשון
              </p>
            </div>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                1. מבוא והתחייבות
              </h3>
              <p>
                Look At Me Ltd. ("החברה", "אנחנו") מחויבת להגנה על פרטיותך
                ולשקיפות מלאה בטיפול במידע האישי שלך. מדיניות זו מפרטת כיצד אנו
                אוספים, משתמשים ומגינים על המידע שלך בהתאם לחוק הגנת הפרטיות
                התשמ"א-1981 ולתקנות GDPR.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                2. מידע שאנו אוספים
              </h3>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    2.1 מידע זיהוי אישי:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>שם מלא, כתובת אימייל ומספר טלפון</li>
                    <li>פרטי תשלום (מעובדים באמצעות ספקי תשלום מאובטחים)</li>
                    <li>כתובת IP ומידע דפדפן</li>
                    <li>העדפות שפה ואזור גיאוגרפי</li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    2.2 מידע טכני ושימוש:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>קובצי לוג ונתוני גישה לשירות</li>
                    <li>מידע על הדרך בה אתה משתמש בשירות</li>
                    <li>העדפות מותאמות אישית</li>
                    <li>נתוני ביצועים ושיפור השירות</li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800'>
                    2.3 תוכן שהועלה:
                  </h4>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>תמונות, וידאו וקבצי מדיה לניתוח</li>
                    <li>טקסטים ותיאורים</li>
                    <li>מטא-דאטה של קבצים</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                3. מטרות השימוש במידע
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>3.1</strong> מתן השירות וניתוח התוכן באמצעות בינה
                  מלאכותית
                </p>
                <p>
                  <strong>3.2</strong> יצירת המלצות שיווקיות מותאמות אישית
                </p>
                <p>
                  <strong>3.3</strong> שיפור והתאמה של השירות לצרכיך
                </p>
                <p>
                  <strong>3.4</strong> תמיכה טכנית ושירות לקוחות
                </p>
                <p>
                  <strong>3.5</strong> עמידה בדרישות חוקיות ומיסוי
                </p>
                <p>
                  <strong>3.6</strong> מניעת הונאות ואבטחת המערכת
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                4. שיתוף מידע עם צדדים שלישיים
              </h3>
              <div className='bg-red-50 p-4 rounded-lg border border-red-200 mb-4'>
                <p className='text-red-800 text-sm'>
                  <strong>התחייבות:</strong> אנו לא מוכרים או משתפים את המידע
                  האישי שלך למטרות שיווקיות של צדדים שלישיים.
                </p>
              </div>
              <div className='space-y-2'>
                <p>
                  <strong>4.1 ספקי שירות מאושרים:</strong> רק ספקים מוכרים
                  ומאובטחים לצורכי תפעול השירות
                </p>
                <p>
                  <strong>4.2 מקרי חובה חוקית:</strong> כאשר נדרש על פי דין או
                  צו בית משפט
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                5. אבטחת מידע ואמצעי הגנה
              </h3>
              <div className='space-y-3'>
                <div className='bg-blue-50 p-3 rounded-lg'>
                  <p className='text-blue-800 text-sm'>
                    🔒 <strong>אבטחה מתקדמת:</strong> הצפנה ברמה גבוהה ואמצעי
                    אבטחה מתקדמים
                  </p>
                </div>
                <div className='space-y-2'>
                  <p>
                    <strong>5.1 אמצעי הגנה טכניים:</strong>
                  </p>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>הצפנה מלאה של נתונים במנוחה ובתנועה</li>
                    <li>אימות דו-שלבי לחשבונות משתמשים</li>
                    <li>מוניטורינג אבטחה 24/7</li>
                    <li>גיבויים אוטומטיים מוצפנים</li>
                    <li>בדיקות חדירה תקופתיות</li>
                  </ul>
                  <p>
                    <strong>5.2 אמצעי הגנה ארגוניים:</strong>
                  </p>
                  <ul className='list-disc pr-6 mt-1 space-y-1'>
                    <li>הדרכות אבטחה לכל העובדים</li>
                    <li>גישה למידע על בסיס "צריך לדעת"</li>
                    <li>הסכמי סודיות עם כל הגורמים הרלוונטיים</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                6. זכויותיך במידע האישי
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>6.1 זכות עיון:</strong> לקבל עותק של המידע האישי שלך
                </p>
                <p>
                  <strong>6.2 זכות תיקון:</strong> לתקן מידע שגוי או לא מדויק
                </p>
                <p>
                  <strong>6.3 זכות מחיקה:</strong> למחוק את חשבונך ואת המידע
                  האישי
                </p>
                <p>
                  <strong>6.4 זכות הגבלה:</strong> להגביל עיבוד המידע במקרים
                  מסוימים
                </p>
                <p>
                  <strong>6.5 זכות העברה:</strong> לקבל את המידע בפורמט ניתן
                  להעברה
                </p>
                <p>
                  <strong>6.6 זכות התנגדות:</strong> להתנגד לעיבוד המידע למטרות
                  מסוימות
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                7. קובצי Cookie ונתוני מעקב
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>7.1 סוגי קובצים בשימוש:</strong>
                </p>
                <ul className='list-disc pr-6 mt-1 space-y-1'>
                  <li>
                    <strong>חיוניים:</strong> נדרשים לתפקוד השירות
                  </li>
                  <li>
                    <strong>פונקציונליים:</strong> שומרים העדפות משתמש
                  </li>
                  <li>
                    <strong>אנליטיים:</strong> עוזרים לשפר את השירות
                  </li>
                </ul>
                <p>
                  <strong>7.2</strong> תוכל לנהל העדפות קובצים בהגדרות הדפדפן
                  שלך
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                8. שמירת מידע ומחיקה
              </h3>
              <div className='space-y-2'>
                <p>
                  <strong>8.1</strong> מידע החשבון נשמר כל עוד החשבון פעיל
                </p>
                <p>
                  <strong>8.2</strong> תוכן שהועלה נמחק תוך 30 יום ממחיקת החשבון
                </p>
                <p>
                  <strong>8.3</strong> נתוני תשלום נשמרים 7 שנים לצורכי מיסוי
                </p>
                <p>
                  <strong>8.4</strong> לוגים טכניים נשמרים עד 12 חודשים
                </p>
              </div>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                9. העברת מידע בינלאומית
              </h3>
              <p>
                השירות מופעל על תשתיות מאובטחות. במקרים בהם נדרשת העברת מידע
                בינלאומית, היא מתבצעת תחת אמצעי הגנה מתאימים ובהתאם לדרישות
                החוק.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                10. שינויים במדיניות
              </h3>
              <p>
                במקרה של שינויים מהותיים במדיניות, נודיע לך באימייל ונבקש הסכמה
                חדשה במידת הצורך. שינויים קלים יפורסמו באתר בהודעה מוקדמת.
              </p>
            </section>

            <section>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                11. תלונות ופניות
              </h3>
              <div className='bg-purple-50 p-4 rounded-lg border border-purple-200'>
                <p className='text-purple-800 text-sm'>
                  לתלונות או פניות בנושא הגנת פרטיות, אנא צור קשר דרך האתר.
                  זכותך להגיש תלונה לרשות הגנת הפרטיות.
                </p>
              </div>
            </section>

            <section className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>
                פרטי יצירת קשר
              </h3>
              <p className='text-sm text-gray-600'>
                לפניות בנושא הגנת פרטיות, אנא צור קשר דרך האתר.
              </p>
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

  // Function to navigate to auth page
  const navigateToAuth = () => {
    window.location.href = '/auth';
  };

  // Function to navigate to campaign creation (requires auth)
  const navigateToCampaign = () => {
    alert('יש ליצור חשבון תחילה כדי לגשת ליצירת קמפיינים');
    window.location.href = '/auth';
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
      {/* Enhanced Header */}
      <header
        className='fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300'
        id='header'
      >
        <div className='container max-w-6xl mx-auto px-6'>
          <div className='bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 px-6 py-4 transition-all duration-300'>
            <div className='flex items-center justify-between'>
              {/* Enhanced Logo */}
              <div className='flex items-center space-x-3 group cursor-pointer'>
                <div className='w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105'>
                  <span className='text-white font-bold text-lg z-10'>L</span>
                </div>
                <div className='group-hover:translate-x-1 transition-transform duration-300'>
                  <span className='text-xl font-bold text-gray-900'>
                    LOOK AT ME
                  </span>
                  <div className='text-xs text-gray-500 mt-0.5 font-medium'>
                    AI Marketing Platform
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <nav className='hidden md:flex items-center space-x-6'>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                >
                  {t('features')}
                </Button>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                  onClick={scrollToPricing}
                >
                  {t('pricing')}
                </Button>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                  onClick={() => setShowHelp(true)}
                >
                  {t('help')}
                </Button>
                <Button
                  variant='ghost'
                  className='text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm'
                  onClick={() => setShowFAQ(true)}
                >
                  {t('faq')}
                </Button>

                {/* Language Dropdown */}
                <div className='relative language-dropdown'>
                  <Button
                    variant='ghost'
                    className='flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2.5 shadow-sm border border-gray-200/50 hover:bg-white/90 transition-all duration-200'
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  >
                    <Globe className='h-4 w-4 text-blue-600' />
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

                <Button
                  variant='outline'
                  className='text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 px-5 py-2.5 border font-medium text-sm'
                  onClick={navigateToAuth}
                >
                  {t('signIn')}
                </Button>
                <Button
                  className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm'
                  onClick={navigateToCampaign}
                >
                  {t('startCampaign')}
                </Button>
              </nav>

              {/* Mobile menu button */}
              <div className='md:hidden flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-blue-600 border-blue-600 hover:bg-blue-50 rounded-lg'
                  onClick={navigateToAuth}
                >
                  {t('signIn')}
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className='md:hidden mt-4 border-t border-gray-200 pt-4'>
              <div className='space-y-2'>
                <Button variant='ghost' className='w-full text-right'>
                  {t('features')}
                </Button>
                <Button
                  variant='ghost'
                  className='w-full text-right'
                  onClick={scrollToPricing}
                >
                  {t('pricing')}
                </Button>
                <Button
                  variant='ghost'
                  className='w-full text-right'
                  onClick={() => setShowHelp(true)}
                >
                  {t('help')}
                </Button>
                <Button
                  variant='ghost'
                  className='w-full text-right'
                  onClick={() => setShowFAQ(true)}
                >
                  {t('faq')}
                </Button>

                {/* Mobile Language Switcher */}
                <div className='flex items-center justify-center space-x-2 pt-4 border-t border-gray-200'>
                  <span className='text-sm text-gray-600 font-medium'>
                    {t('language')}:
                  </span>
                  <button
                    onClick={() => changeLanguage('hebrew')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isRTL
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    
                  </button>
                  <button
                    onClick={() => changeLanguage('english')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      !isRTL
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section + 4 חוזקות מרכזיות - באותו סקשן */}
      <section className='pt-32 pb-24 px-4 relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-slate-50'>
        <div className='container max-w-7xl mx-auto'>
          {/* Hero Content */}
          <div className='text-center mb-20'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight'>
              {t('heroTitle')}
            </h1>

            <p className='text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed'>
              {t('heroSubtitle')}
            </p>

            {/* Enhanced CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-6 justify-center mb-20'>
              <Button
                size='lg'
                className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 relative overflow-hidden group'
                onClick={navigateToAuth}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                <span className='relative z-10 flex items-center'>
                  <Users className='ml-3 h-6 w-6' />
                  {t('createAccount')}
                </span>
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-12 py-6 text-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 bg-white/90 backdrop-blur-sm'
                onClick={navigateToCampaign}
              >
                <span className='relative z-10 flex items-center'>
                  <Rocket className='ml-3 h-6 w-6' />
                  {t('createAccount')}
                </span>
              </Button>
            </div>
          </div>

          <div className='grid lg:grid-cols-2 gap-8'>
            {appStrengths.map((strength, index) => (
              <Card
                key={index}
                className='group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 bg-white/95 backdrop-blur-sm'
              >
                <CardContent className='p-8 relative z-10'>
                  <div className='flex items-start space-x-6'>
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${strength.gradient} rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                    >
                      <div className='absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                      <strength.icon className='h-10 w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300'>
                        {strength.title}
                      </h3>
                      <p className='text-gray-600 leading-relaxed text-lg'>
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

      {/* הבעיה - למה צריך את זה */}
      <section className='py-20 px-4 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50'>
        <div className='container max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-red-100 to-orange-100 text-red-800 px-6 py-3 rounded-full text-sm font-bold border border-red-200 shadow-lg mb-6'>
              <AlertTriangle className='h-5 w-5' />
              <span>{t('problems')}</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-6'>
              {t('problemsTitle')}
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              {t('problemsSubtitle')}
            </p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
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
                <CardContent className='p-8'>
                  <div className='flex items-start space-x-4'>
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${problem.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <problem.icon className='h-8 w-8 text-white' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-xl font-bold text-gray-800 mb-3'>
                        {problem.title}
                      </h3>
                      <p className='text-gray-600 leading-relaxed'>
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

      {/* איך זה עובד - 3 צעדים פשוטים */}
      <section className='py-20 px-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50'>
        <div className='container max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-bold border border-blue-200 shadow-lg mb-6'>
              <Lightbulb className='h-5 w-5' />
              <span>{t('howItWorks')}</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-6'>
              {t('howItWorksTitle')}
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-12 relative'>
            {/* Connection Lines */}
            <div className='hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2'></div>
            <div className='hidden lg:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-y-1/2'></div>

            {/* Steps section */}
            {[
              {
                number: '01',
                title: 'מעלים תוכן',
                description: 'וידאו, תמונה או שמע - פשוט כמו לשלוח הודעה',
                icon: CloudUpload,
                details: ['וידאו HD', 'תמונות איכותיות', 'קבצי שמע נתמכים'],
                gradient: 'from-blue-500 to-purple-500',
              },
              {
                number: '02',
                title: 'AI מנתח הכל',
                description: 'מזהה את המסר, בודק סגנון, קהל מתאים ותקציב מומלץ',
                icon: Brain,
                details: ['ניתוח ויזואלי', 'זיהוי קהל יעד', 'אסטרטגיה חכמה'],
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                number: '03',
                title: 'מקבלים תוכנית פעולה מלאה',
                description: 'כולל שיגור מיידי לקמפיין כשמחוברים לפלטפורמות',
                icon: Rocket,
                details: ['תוכנית מלאה', 'שיגור ישיר', 'מעקב תוצאות'],
                gradient: 'from-pink-500 to-red-500',
              },
            ].map((step, index) => (
              <div key={index} className='text-center relative group'>
                <div className='relative mb-8'>
                  <div
                    className={`w-24 h-24 bg-gradient-to-r ${step.gradient} rounded-3xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                  ></div>

                  {/* Floating Icon */}
                  <div className='absolute -top-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110'>
                    <step.icon className='h-6 w-6 text-purple-600' />
                  </div>
                </div>

                <h3 className='text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300'>
                  {step.title}
                </h3>
                <p className='text-gray-600 leading-relaxed text-lg mb-6'>
                  {step.description}
                </p>

                {/* Step Details Card */}
                <Card className='max-w-sm mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2'>
                  <CardContent className='p-4'>
                    <div className='space-y-2'>
                      {step.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className='flex items-center justify-center space-x-2 text-sm text-gray-600'
                        >
                          <CheckCircle className='h-4 w-4 text-green-500' />
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

      {/* Pricing Section - עמוד מחירים */}
      <section
        id='pricing'
        className='py-20 px-4 bg-gradient-to-r from-white via-blue-50 to-purple-50'
      >
        <div className='container max-w-6xl mx-auto text-center'>
          <div className='mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-6'>
              בחר את החבילה המתאימה לך
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              התחל בחינם ועדכן כשאתה מוכן. כל החבילות כוללות את כל התכונות
              הבסיסיות
            </p>
          </div>

          {/* Pricing Cards */}
          <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
            {/* Monthly Plan */}
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden'>
              <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'></div>

              <div className='mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  חבילה חודשית
                </h3>
                <p className='text-gray-600'>גמישות מקסימלית עם ביטול בכל עת</p>
              </div>

              <div className='mb-8'>
                <div className='text-4xl font-bold text-gray-900 mb-2'>₪60</div>
                <div className='text-gray-500'>לחודש</div>
              </div>

              <ul className='text-right space-y-4 mb-8'>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    כל התכונות הבסיסיות
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>קמפיינים ללא הגבלה</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>ניתוח מתקדם</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>תמיכה טכנית</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
              </ul>

              <Button
                size='lg'
                className='w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                onClick={navigateToAuth}
              >
                התחל עכשיו
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden'>
              <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'></div>

              <div className='mb-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  חבילה שנתית
                </h3>
                <p className='text-gray-600'>חסכון של ₪120 בשנה</p>
              </div>

              <div className='mb-8'>
                <div className='text-4xl font-bold text-gray-900 mb-2'>
                  ₪600
                </div>
                <div className='text-gray-500'>לשנה</div>
                <div className='text-sm text-green-600 font-medium mt-1'>
                  חסכון של 17%
                </div>
              </div>

              <ul className='text-right space-y-4 mb-8'>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    כל התכונות מהחבילה החודשית
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>
                    תכונות מתקדמות בלעדיות
                  </span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>תמיכה מועדפת</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
                <li className='flex items-center justify-end'>
                  <span className='text-gray-700 ml-3'>עדכונים מוקדמים</span>
                  <div className='w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </li>
              </ul>

              <Button
                size='lg'
                className='w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                onClick={navigateToAuth}
              >
                בחר חבילה שנתית
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className='bg-gray-50 py-12 px-6'>
        <div className='container max-w-6xl mx-auto text-center'>
          {/* Logo and Description */}
          <div className='mb-8'>
            <div className='flex items-center justify-center space-x-3 mb-4'>
              <div className='w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>L</span>
              </div>
              <span className='text-2xl font-bold text-gray-900'>
                Look At Me
              </span>
            </div>
            <p className='text-gray-600 leading-relaxed text-sm max-w-lg mx-auto'>
              פלטפורמת שיווק עם ניתוח תוכן מתקדם של בינה מלאכותית ושליחת
              קמפיינים אוטומטית לכל הפלטפורמות
            </p>
          </div>

          {/* Navigation Links - One Line */}
          <div className='flex flex-wrap items-center justify-center gap-8 text-sm mb-8'>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={navigateToCampaign}
            >
              יצירת קמפיין
            </Button>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={() => setShowFAQ(true)}
            >
              שאלות נפוצות
            </Button>
            <a
              href='#'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              צור קשר
            </a>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={() => setShowPrivacy(true)}
            >
              מדיניות פרטיות
            </Button>
            <Button
              variant='link'
              className='text-gray-600 hover:text-gray-900 p-0 h-auto'
              onClick={() => setShowTerms(true)}
            >
              תנאי שירות
            </Button>
          </div>

          {/* Copyright */}
          <div className='text-xs text-gray-500'>
            © 2025 Look At Me Inc. כל הזכויות שמורות.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FAQModal
        isOpen={showFAQ}
        onClose={() => setShowFAQ(false)}
        openFAQItem={openFAQItem}
        setOpenFAQItem={setOpenFAQItem}
      />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
};

export default Index;
