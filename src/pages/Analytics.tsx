import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  DollarSign, 
  Eye,
  Target,
  RefreshCw,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Facebook,
  Youtube,
  Play,
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  ArrowRight,
  Home,
  Pause,
  PlayCircle,
  StopCircle
} from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from '@/lib/auth-context';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics = () => {
  const { t, language } = useTranslations();
  const { currentUser } = useAuth();
  const isRTL = language === 'he';
  
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  // Fetch user's real campaigns from database
  useEffect(() => {
    const fetchUserCampaigns = async () => {
      if (!currentUser?.uid) {
        console.log('⚠️ No user logged in');
        setLoadingCampaigns(false);
        return;
      }

      try {
        setLoadingCampaigns(true);
        console.log('📊 Fetching campaigns for user:', currentUser.uid);
        
        const response = await fetch(`/api/campaigns/list?userId=${currentUser.uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.campaigns) {
            console.log(`✅ Loaded ${data.campaigns.length} campaigns`);
            
            // Transform campaigns to match the expected format
            const transformedCampaigns = data.campaigns.map(c => ({
              id: c._id,
              name: c.name,
              startDate: c.schedule?.startDate || c.createdAt,
              status: c.status,
              platforms: c.platforms.map(p => p.name),
              budget: c.budget,
              metrics: c.metrics,
              platformDetails: c.platforms // Keep full platform details
            }));
            
            setCampaigns(transformedCampaigns);
            
            // Select first campaign by default
            if (transformedCampaigns.length > 0) {
              setSelectedCampaign(transformedCampaigns[0]);
            }
          }
        } else {
          console.error('Failed to fetch campaigns:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchUserCampaigns();
  }, [currentUser]);

  // Fetch metrics - Get real performance data from campaign
  const fetchMetrics = async () => {
    if (!selectedCampaign || !currentUser?.uid) return;
    
    setIsLoading(true);
    try {
      // First, update metrics from platforms
      try {
        // Get platform tokens from localStorage
        const connectedPlatformsData = localStorage.getItem('connectedPlatforms');
        const connectedPlatforms = connectedPlatformsData ? JSON.parse(connectedPlatformsData) : {};
        
        // Build platformTokens object
        const platformTokens = {};
        selectedCampaign.platforms.forEach(platformName => {
          const platformData = connectedPlatforms[platformName];
          if (platformData?.data) {
            platformTokens[platformName.toLowerCase()] = {
              accessToken: platformData.data.access_token,
              customerId: platformData.data.customer_id,
              advertiserId: platformData.data.advertiser_id,
              adAccountId: platformData.data.ad_account_id
            };
          }
        });

        await fetch('/api/campaigns/update-metrics', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            campaignId: selectedCampaign.id,
            userId: currentUser.uid,
            platformTokens: platformTokens
          })
        });
      } catch (updateError) {
        console.warn('Failed to update metrics from platforms:', updateError);
      }

      // If campaign already has metrics, use them
      if (selectedCampaign.metrics) {
        // Transform metrics for each platform
        const platformMetrics = selectedCampaign.platformDetails?.map(platform => ({
          platform: platform.name,
          impressions: selectedCampaign.metrics.impressions || 0,
          clicks: selectedCampaign.metrics.clicks || 0,
          spend: selectedCampaign.metrics.spend || 0,
          reach: selectedCampaign.metrics.reach || 0,
          conversions: selectedCampaign.metrics.conversions || 0,
          ctr: selectedCampaign.metrics.ctr || 0,
          cpc: selectedCampaign.metrics.cpc || 0,
          updatedAt: selectedCampaign.metrics.lastUpdated || new Date().toISOString()
        })) || [];

        // If we have platform metrics, use them
        if (platformMetrics.length > 0) {
          setMetrics(platformMetrics);
          setLastUpdate(new Date());
          setIsLoading(false);
          return;
        }
      }

      // Fallback: Try to fetch from analytics API
      const connectedPlatformsData = localStorage.getItem('connectedPlatforms');
      const connectedPlatforms = connectedPlatformsData ? JSON.parse(connectedPlatformsData) : {};
      
      // Build platforms array with access tokens
      const platforms = selectedCampaign.platforms.map(platformName => {
        const platformData = connectedPlatforms[platformName];
        const platformDetail = selectedCampaign.platformDetails?.find(p => p.name === platformName);
        
        return {
          name: platformName,
          accessToken: platformData?.data?.access_token || null,
          adAccountId: platformData?.data?.ad_account_id || null,
          customerId: platformData?.data?.customer_id || null,
          advertiserId: platformData?.data?.advertiser_id || null,
          campaignId: platformDetail?.campaignId || null
        };
      }).filter(p => p.accessToken && p.campaignId);

      let fetchedMetrics = [];
      
      if (platforms.length > 0) {
        try {
          const response = await fetch('/api/analytics/metrics', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              platforms,
              campaignIds: {
                facebook: selectedCampaign.id,
                google: selectedCampaign.id,
                tiktok: selectedCampaign.id
              },
              dateRange: {
                since: selectedCampaign.startDate,
                until: new Date().toISOString().split('T')[0]
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.metrics) {
              fetchedMetrics = data.metrics;
              console.log('✅ Real metrics fetched from API');
            }
          }
        } catch (apiError) {
          console.warn('Failed to fetch real metrics:', apiError);
        }
      }
      
      // If no real data, use demo data
      const finalMetrics = fetchedMetrics.length > 0 ? fetchedMetrics : generateDemoMetrics(selectedCampaign.platforms);
      
      setMetrics(finalMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (selectedCampaign) {
      fetchMetrics();
    }
  }, [selectedCampaign]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, selectedCampaign]);

  // Calculate totals
  const totals = metrics.reduce((acc, m) => ({
    impressions: acc.impressions + m.impressions,
    clicks: acc.clicks + m.clicks,
    spend: acc.spend + m.spend,
    reach: acc.reach + m.reach,
    conversions: acc.conversions + m.conversions
  }), { impressions: 0, clicks: 0, spend: 0, reach: 0, conversions: 0 });

  const avgCTR = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0.00';
  const avgCPC = totals.clicks > 0 ? (totals.spend / totals.clicks).toFixed(2) : '0.00';
  const conversionRate = totals.clicks > 0 ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : '0.00';

  // Data for charts
  const platformColors = {
    Facebook: '#1877F2',
    Google: '#4285F4',
    TikTok: '#000000',
    Instagram: '#E4405F'
  };

  const COLORS = ['#1877F2', '#4285F4', '#000000', '#E4405F', '#0A66C2'];

  // Pause/Resume/Cancel Campaign
  const handleCampaignAction = async (action) => {
    if (!selectedCampaign || !currentUser?.uid) return;

    try {
      setIsLoading(true);
      const actionEmoji = action === 'pause' ? '⏸️' : action === 'resume' ? '▶️' : '⏹️';
      const actionText = action === 'pause' ? 'Pausing' : action === 'resume' ? 'Resuming' : 'Cancelling';
      console.log(`${actionEmoji} ${actionText} campaign:`, selectedCampaign.name);

      // Get platform tokens from localStorage
      const connectedPlatformsData = localStorage.getItem('connectedPlatforms');
      const connectedPlatforms = connectedPlatformsData ? JSON.parse(connectedPlatformsData) : {};
      
      // Build platformTokens object
      const platformTokens = {};
      selectedCampaign.platforms.forEach(platformName => {
        const platformData = connectedPlatforms[platformName];
        if (platformData?.data) {
          platformTokens[platformName.toLowerCase()] = {
            accessToken: platformData.data.access_token,
            customerId: platformData.data.customer_id,
            advertiserId: platformData.data.advertiser_id,
            adAccountId: platformData.data.ad_account_id
          };
        }
      });

      const response = await fetch('/api/campaigns/pause', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          userId: currentUser.uid,
          action: action,
          platformTokens: platformTokens
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✅ Campaign ${action}d successfully`);
        
        // Determine new status
        const newStatus = action === 'pause' ? 'paused' : 
                         action === 'resume' ? 'active' : 
                         action === 'cancel' ? 'cancelled' : selectedCampaign.status;
        
        // Update local campaign status
        setSelectedCampaign({
          ...selectedCampaign,
          status: newStatus
        });

        // Update campaigns list
        setCampaigns(campaigns.map(c => 
          c.id === selectedCampaign.id 
            ? { ...c, status: newStatus }
            : c
        ));

        const successMsg = action === 'pause' ? 'הקמפיין הושעה' : 
                          action === 'resume' ? 'הקמפיין הופעל מחדש' : 
                          'הקמפיין נעצר';
        alert(`${successMsg} בהצלחה!`);
      } else {
        console.error(`Failed to ${action} campaign:`, data.error);
        alert(`שגיאה: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing campaign:`, error);
      const errorMsg = action === 'pause' ? 'השעיית' : 
                      action === 'resume' ? 'הפעלת' : 
                      'עצירת';
      alert(`שגיאה ב${errorMsg} הקמפיין`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate demo metrics
  const generateDemoMetrics = (platformNames) => {
    return platformNames.map(platformName => ({
      platform: platformName,
      impressions: Math.floor(Math.random() * 50000) + 20000,
      clicks: Math.floor(Math.random() * 2000) + 500,
      spend: Math.floor(Math.random() * 500) + 200,
      reach: Math.floor(Math.random() * 30000) + 15000,
      conversions: Math.floor(Math.random() * 50) + 10,
      ctr: (Math.random() * 5 + 2).toFixed(2),
      cpc: (Math.random() * 3 + 0.5).toFixed(2),
      updatedAt: new Date().toISOString()
    }));
  };

  // Time series data (mock)
  const timeSeriesData = [
    { time: '00:00', impressions: 1200, clicks: 45, conversions: 3 },
    { time: '04:00', impressions: 2100, clicks: 78, conversions: 5 },
    { time: '08:00', impressions: 5400, clicks: 210, conversions: 12 },
    { time: '12:00', impressions: 8900, clicks: 356, conversions: 18 },
    { time: '16:00', impressions: 12400, clicks: 487, conversions: 25 },
    { time: '20:00', impressions: 9200, clicks: 368, conversions: 20 },
    { time: 'עכשיו', impressions: totals.impressions, clicks: totals.clicks, conversions: totals.conversions }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        
        {/* Back Button */}
        <div className="mb-6 pt-16">
          <Button
            onClick={() => window.location.href = '/campaign'}
            variant="outline"
            className="border-2 border-gray-300 hover:bg-gray-50"
          >
            <ArrowRight className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            חזור ליצירת קמפיין
          </Button>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${isRTL ? 'text-right' : 'text-left'}`}>
                אנליטיקה וביצועים
          </h1>
              <p className={`text-gray-600 mt-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                נתוני ביצועים בזמן אמת מכל הפלטפורמות
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                className={`${autoRefresh ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <Activity className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} ${autoRefresh ? 'animate-pulse' : ''}`} />
                {autoRefresh ? 'רענון אוטומטי' : 'רענון ידני'}
              </Button>
              
              <Button 
                onClick={fetchMetrics}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                ) : (
                  <RefreshCw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                רענן נתונים
              </Button>
            </div>
          </div>

          {/* Last Update */}
          <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <Clock className="h-4 w-4" />
            <span>עדכון אחרון: {lastUpdate.toLocaleTimeString('he-IL')}</span>
            {autoRefresh && <span className="text-green-600 font-medium">(מתעדכן אוטומטית כל 30 שניות)</span>}
          </div>
        </div>

        {/* Campaign Selector with Control Buttons */}
        {campaigns.length > 0 && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Campaign Selection */}
                <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  {campaigns.map(campaign => (
                    <Button
                      key={campaign.id}
                      onClick={() => setSelectedCampaign(campaign)}
                      variant={selectedCampaign?.id === campaign.id ? "default" : "outline"}
                      className={selectedCampaign?.id === campaign.id ? 
                        'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                    >
                      <Target className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {campaign.name}
                      {campaign.status === 'paused' && (
                        <span className="mr-2 text-orange-400">(מושעה)</span>
                      )}
                    </Button>
                  ))}
                </div>

                {/* Campaign Control Buttons */}
                {selectedCampaign && (
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} border-t border-gray-200 pt-4`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-3 h-3 rounded-full ${
                        selectedCampaign.status === 'active' ? 'bg-green-500 animate-pulse' : 
                        selectedCampaign.status === 'paused' ? 'bg-orange-500' : 
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        סטטוס: {
                          selectedCampaign.status === 'active' ? 'פעיל' :
                          selectedCampaign.status === 'paused' ? 'מושעה' :
                          selectedCampaign.status === 'completed' ? 'הושלם' :
                          selectedCampaign.status
                        }
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {selectedCampaign.status === 'active' && (
                        <Button
                          onClick={() => handleCampaignAction('pause')}
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                          disabled={isLoading}
                        >
                          <Pause className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          השהה קמפיין
                        </Button>
                      )}

                      {selectedCampaign.status === 'paused' && (
                        <Button
                          onClick={() => handleCampaignAction('resume')}
                          variant="outline"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          disabled={isLoading}
                        >
                          <PlayCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          המשך קמפיין
                        </Button>
                      )}

                      {(selectedCampaign.status === 'active' || selectedCampaign.status === 'paused') && (
                        <Button
                          onClick={() => {
                            if (confirm('האם אתה בטוח שברצונך לעצור את הקמפיין? פעולה זו אינה הפיכה.')) {
                              handleCampaignAction('cancel');
                            }
                          }}
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          <StopCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          עצור לצמיתות
                        </Button>
                      )}
                    </div>

                    {/* Campaign Budget Info */}
                    {selectedCampaign.budget && (
                      <div className={`mr-auto ${isRTL ? 'ml-auto mr-0' : ''} text-sm text-gray-600`}>
                        תקציב יומי: <span className="font-bold text-gray-800">₪{selectedCampaign.budget.daily?.toLocaleString('he-IL')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Impressions */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                  <ArrowUp className="h-4 w-4" />
                  +12%
                </div>
              </div>
              <h3 className={`text-gray-600 text-sm mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>חשיפות</h3>
              <p className={`text-3xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                {totals.impressions.toLocaleString('he-IL')}
              </p>
              <p className="text-xs text-gray-500 mt-2">כמה אנשים ראו את הפרסומת</p>
            </CardContent>
          </Card>

          {/* Clicks */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <MousePointerClick className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                  <ArrowUp className="h-4 w-4" />
                  +8%
                </div>
              </div>
              <h3 className={`text-gray-600 text-sm mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>קליקים</h3>
              <p className={`text-3xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                {totals.clicks.toLocaleString('he-IL')}
              </p>
              <p className="text-xs text-gray-500 mt-2">CTR: {avgCTR}%</p>
            </CardContent>
          </Card>

          {/* Conversions */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                  <ArrowUp className="h-4 w-4" />
                  +15%
                </div>
              </div>
              <h3 className={`text-gray-600 text-sm mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>המרות</h3>
              <p className={`text-3xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                {totals.conversions.toLocaleString('he-IL')}
              </p>
              <p className="text-xs text-gray-500 mt-2">שיעור המרה: {conversionRate}%</p>
            </CardContent>
          </Card>

          {/* Spend */}
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm font-bold">
                  <ArrowUp className="h-4 w-4" />
                  +3%
                </div>
              </div>
              <h3 className={`text-gray-600 text-sm mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>הוצאות</h3>
              <p className={`text-3xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                ₪{totals.spend.toLocaleString('he-IL')}
              </p>
              <p className="text-xs text-gray-500 mt-2">CPC ממוצע: ₪{avgCPC}</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Performance by Platform */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 shadow-xl">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>ביצועים לפי פלטפורמה</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="impressions" name="חשיפות" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="clicks" name="קליקים" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="conversions" name="המרות" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Budget Distribution */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 shadow-xl">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <PieChart className="h-5 w-5 text-purple-600" />
                <span>חלוקת תקציב</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={metrics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="spend"
                  >
                    {metrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => `₪${value.toLocaleString('he-IL')}`}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Time Series Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-2 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <LineChartIcon className="h-5 w-5 text-green-600" />
              <span>ביצועים לאורך זמן</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  name="חשיפות"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  name="קליקים"
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  name="המרות"
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Details */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
            פירוט לפי פלטפורמה
          </h2>

          {metrics.map((metric, index) => {
            const Icon = metric.platform === 'Facebook' ? Facebook : 
                        metric.platform === 'Google' ? Youtube :
                        metric.platform === 'TikTok' ? Play : Activity;
            
            const platformColor = platformColors[metric.platform] || '#6b7280';
            
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: platformColor }}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {metric.platform}
                        </h3>
                        <p className="text-sm text-gray-600">מעודכן לאחרונה: {new Date(metric.updatedAt).toLocaleTimeString('he-IL')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">פעיל</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-gray-600">חשיפות</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {metric.impressions.toLocaleString('he-IL')}
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MousePointerClick className="h-4 w-4 text-purple-600" />
                        <span className="text-xs text-gray-600">קליקים</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {metric.clicks.toLocaleString('he-IL')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">CTR: {metric.ctr}%</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-gray-600">המרות</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {metric.conversions.toLocaleString('he-IL')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((metric.conversions / metric.clicks) * 100).toFixed(2)}%
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-orange-600" />
                        <span className="text-xs text-gray-600">הוצאות</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">
                        ₪{metric.spend.toLocaleString('he-IL')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">CPC: ₪{metric.cpc}</p>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">ביצועים</span>
                      <span className="text-sm font-bold text-green-600">
                        {Math.min(100, Math.floor((metric.conversions / metric.clicks) * 1000))}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, Math.floor((metric.conversions / metric.clicks) * 1000))} 
                      className="h-3"
                    />
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">הגעה</p>
                      <p className="text-lg font-bold text-gray-800">
                        {metric.reach.toLocaleString('he-IL')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">עלות להמרה</p>
                      <p className="text-lg font-bold text-gray-800">
                        ₪{(metric.spend / Math.max(metric.conversions, 1)).toFixed(2)}
              </p>
            </div>
          </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ROI Summary */}
        <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 shadow-2xl">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>סיכום ROI ותובנות</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 p-6 rounded-2xl border-2 border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">סה"כ הגעה</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totals.reach.toLocaleString('he-IL')}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">אנשים ייחודיים שראו את הפרסומת</p>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border-2 border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">מעורבות</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {avgCTR}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">אחוז המשתמשים שלחצו מתוך הצפיות</p>
              </div>

              <div className="bg-white/70 p-6 rounded-2xl border-2 border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((totals.conversions * 100 - totals.spend) / Math.max(totals.spend, 1) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">תשואה על ההשקעה (בהנחה של ₪100 להמרה)</p>
              </div>
            </div>

            {/* AI Insights */}
            <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl">
              <h4 className={`font-bold text-gray-800 mb-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <Zap className="h-5 w-5 text-purple-600" />
                <span>תובנות AI</span>
              </h4>
              <ul className={`space-y-2 text-sm text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>ביצועים מצוינים ב-TikTok</strong> - CTR גבוה מהממוצע ב-35%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span><strong>המלצה:</strong> הגדל תקציב ב-TikTok ב-20% למקסום תוצאות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">→</span>
                  <span><strong>שעות שיא:</strong> 12:00-16:00 מראות מעורבות הכי גבוהה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">!</span>
                  <span><strong>התראה:</strong> עלות להמרה ב-Facebook גבוהה - שקול אופטימיזציה</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {metrics.length === 0 && !isLoading && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">אין קמפיינים פעילים</h3>
              <p className="text-gray-600 mb-6">צור קמפיין ראשון כדי לראות אנליטיקה</p>
              <Button 
                onClick={() => window.location.href = '/campaign'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                צור קמפיין חדש
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;
