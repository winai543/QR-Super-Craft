import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from 'qr-code-styling';
import { 
  Download, 
  Settings, 
  Palette, 
  Image as ImageIcon, 
  Layout, 
  Crown,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Square,
  Circle,
  Type,
  X,
  Sparkles,
  DollarSign,
  TrendingUp,
  Zap,
  Mail,
  MessageSquare,
  Phone,
  Wifi,
  User,
  Globe,
  FileText,
  Smartphone
} from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import PolicyModal from './PolicyModal';

const QRGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [qrType, setQrType] = useState<'link' | 'text' | 'vcard' | 'email' | 'sms' | 'call' | 'wifi'>('link');
  
  // Specific QR Type States
  const [vCard, setVCard] = useState({ firstName: '', lastName: '', phone: '', email: '', company: '', job: '', website: '' });
  const [emailData, setEmailData] = useState({ recipient: '', subject: '', body: '' });
  const [smsData, setSmsData] = useState({ phone: '', message: '' });
  const [callData, setCallData] = useState({ phone: '' });
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [textData, setTextData] = useState('');

  const [dotsColor, setDotsColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [dotsType, setDotsType] = useState<DotType>('square');
  const [cornersType, setCornersType] = useState<CornerSquareType>('square');
  const [cornersDotType, setCornersDotType] = useState<CornerDotType>('square');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoMargin, setLogoMargin] = useState(10);
  const [isPremium, setIsPremium] = useState(false);
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor, setGradientColor] = useState('#4f46e5');
  const [gradientRotation, setGradientRotation] = useState(0);
  const [showAdPreview, setShowAdPreview] = useState(true);
  
  // Frame states
  const [frameType, setFrameType] = useState<'none' | 'text-bottom' | 'rounded-border' | 'brackets' | 'payment-style' | 'premium-badge' | 'premium-modern' | 'premium-circle' | 'dashed-border'>('none');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [frameTextTop, setFrameTextTop] = useState('');
  const [frameTextBottom, setFrameTextBottom] = useState('');
  const [frameSubText, setFrameSubText] = useState('');
  const [frameColor, setFrameColor] = useState('#6366f1');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' | 'contact' }>({
    isOpen: false,
    type: 'privacy'
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'svg' as DrawType,
      data: url || 'https://qr-super-craft.com/placeholder',
      image: logo || undefined,
      dotsOptions: {
        color: dotsColor,
        type: dotsType,
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: logoMargin,
        imageSize: logoSize
      },
      cornersSquareOptions: {
        color: dotsColor,
        type: cornersType,
      },
      cornersDotOptions: {
        color: dotsColor,
        type: cornersDotType,
      },
      qrOptions: {
        typeNumber: 0 as TypeNumber,
        mode: 'Byte' as Mode,
        errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
      }
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = ''; // Clear previous content
      qrCode.current.append(qrRef.current);
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, []);

  // Re-append QR code when frame type changes because the ref moves to a new element
  useEffect(() => {
    if (qrCode.current && qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, [frameType]);

  useEffect(() => {
    if (!qrCode.current) return;
    
    const data = (function() {
      let result = '';
      switch (qrType) {
        case 'link': 
          result = url ? (url.startsWith('http') ? url : `https://${url}`) : '';
          break;
        case 'text': 
          result = textData;
          break;
        case 'vcard': 
          if (vCard.firstName || vCard.lastName || vCard.phone) {
            result = `BEGIN:VCARD\nVERSION:3.0\nN:${vCard.lastName};${vCard.firstName}\nFN:${vCard.firstName} ${vCard.lastName}\nORG:${vCard.company}\nTITLE:${vCard.job}\nTEL:${vCard.phone}\nEMAIL:${vCard.email}\nURL:${vCard.website}\nEND:VCARD`;
          }
          break;
        case 'email': 
          if (emailData.recipient) {
            result = `mailto:${emailData.recipient}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
          }
          break;
        case 'sms': 
          if (smsData.phone) {
            result = `smsto:${smsData.phone}:${smsData.message}`;
          }
          break;
        case 'call': 
          if (callData.phone) {
            result = `tel:${callData.phone}`;
          }
          break;
        case 'wifi': 
          if (wifiData.ssid) {
            result = `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
          }
          break;
        default: 
          result = url;
      }
      
      // Fallback placeholder if no data is provided
      return result || 'https://qr-super-craft.com/placeholder';
    })();

    // Premium feature check
    const currentDotsType = !isPremium && ['classy', 'classy-rounded', 'extra-rounded'].includes(dotsType) ? 'square' : dotsType;
    const currentCornersType = !isPremium && cornersType === 'extra-rounded' ? 'square' : cornersType;
    const currentGradient = isPremium && gradientEnabled ? {
      type: 'linear',
      rotation: gradientRotation,
      colorStops: [
        { offset: 0, color: dotsColor },
        { offset: 1, color: gradientColor }
      ]
    } : undefined;

    qrCode.current.update({
      data,
      image: logo || undefined,
      dotsOptions: {
        color: dotsColor,
        type: currentDotsType as DotType,
        gradient: currentGradient as any
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        margin: logoMargin,
        imageSize: logoSize
      },
      cornersSquareOptions: {
        color: dotsColor,
        type: currentCornersType as CornerSquareType,
      },
      cornersDotOptions: {
        color: dotsColor,
        type: cornersDotType,
      }
    });
  }, [url, qrType, textData, vCard, emailData, smsData, callData, wifiData, dotsColor, bgColor, dotsType, cornersType, cornersDotType, logo, logoSize, logoMargin, gradientEnabled, gradientColor, gradientRotation, isPremium]);

  const onDownload = async (ext: 'png' | 'svg' | 'webp') => {
    if (!qrCode.current) return;

    if (frameType === 'none') {
      onDownloadSimple(ext);
    } else {
      // Download with frame using html-to-image
      if (exportRef.current) {
        try {
          const dataUrl = ext === 'svg' ? await toSvg(exportRef.current) : await toPng(exportRef.current);
          const link = document.createElement('a');
          link.download = `qr-code-framed.${ext}`;
          link.href = dataUrl;
          link.click();
          setShowDownloadSuccess(true);
        } catch (err) {
          console.error('Export failed', err);
          // Fallback to just QR
          qrCode.current.download({ name: 'qr-code', extension: ext });
        }
      }
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const templates = [
    {
      name: 'None',
      dotsColor: '#000000',
      bgColor: '#ffffff',
      dotsType: 'square',
      cornersType: 'square',
      cornersDotType: 'square',
      frameType: 'none',
      frameColor: '#000000',
      gradientEnabled: false,
      frameText: 'SCAN ME',
      frameTextTop: '',
      frameTextBottom: '',
      frameSubText: ''
    },
    {
      name: 'QR Payment',
      dotsColor: '#000000',
      bgColor: '#ffffff',
      dotsType: 'rounded',
      cornersType: 'extra-rounded',
      cornersDotType: 'dot',
      frameType: 'payment-style',
      frameColor: '#1e3a8a',
      gradientEnabled: false,
      frameText: 'SCAN TO PAY',
      frameTextTop: '',
      frameTextBottom: 'THANK YOU!',
      frameSubText: ''
    },
    {
      name: 'Business Card',
      dotsColor: '#111827',
      bgColor: '#ffffff',
      dotsType: 'square',
      cornersType: 'square',
      cornersDotType: 'square',
      frameType: 'text-bottom',
      frameColor: '#111827',
      gradientEnabled: false,
      frameText: 'CONTACT ME'
    },
    {
      name: 'Modern Blue',
      dotsColor: '#2563eb',
      bgColor: '#ffffff',
      dotsType: 'rounded',
      cornersType: 'extra-rounded',
      cornersDotType: 'dot',
      frameType: 'rounded-border',
      frameColor: '#2563eb',
      gradientEnabled: true,
      gradientColor: '#1e40af',
      frameText: 'SCAN ME'
    },
    {
      name: 'Eco Green',
      dotsColor: '#059669',
      bgColor: '#f0fdf4',
      dotsType: 'dots',
      cornersType: 'dot',
      cornersDotType: 'dot',
      frameType: 'text-bottom',
      frameColor: '#059669',
      gradientEnabled: false,
      frameText: 'SCAN ME'
    },
    {
      name: 'Luxury Gold',
      dotsColor: '#b45309',
      bgColor: '#fffbeb',
      dotsType: 'classy',
      cornersType: 'extra-rounded',
      cornersDotType: 'square',
      frameType: 'premium-badge',
      frameColor: '#b45309',
      gradientEnabled: true,
      gradientColor: '#78350f',
      premium: true,
      frameText: 'PREMIUM'
    },
    {
      name: 'Tech Dark',
      dotsColor: '#ffffff',
      bgColor: '#0f172a',
      dotsType: 'square',
      cornersType: 'square',
      cornersDotType: 'square',
      frameType: 'brackets',
      frameColor: '#38bdf8',
      gradientEnabled: false,
      frameText: 'TECH'
    },
    {
      name: 'Sunset Glow',
      dotsColor: '#db2777',
      bgColor: '#ffffff',
      dotsType: 'extra-rounded',
      cornersType: 'extra-rounded',
      cornersDotType: 'dot',
      frameType: 'premium-modern',
      frameColor: '#db2777',
      gradientEnabled: true,
      gradientColor: '#f59e0b',
      premium: true,
      frameText: 'VIBE'
    }
  ];

  const gradientPresets = [
    { name: 'Sunset Glow', start: '#f59e0b', end: '#db2777' },
    { name: 'Ocean Breeze', start: '#3b82f6', end: '#06b6d4' },
    { name: 'Forest Canopy', start: '#10b981', end: '#064e3b' },
    { name: 'Midnight Sky', start: '#6366f1', end: '#1e1b4b' },
  ];

  const applyTemplate = (template: any) => {
    if (template.premium && !isPremium) {
      // Show premium upgrade instead or just don't apply
      return;
    }
    setDotsColor(template.dotsColor);
    setBgColor(template.bgColor);
    setDotsType(template.dotsType);
    setCornersType(template.cornersType);
    setCornersDotType(template.cornersDotType);
    setFrameType(template.frameType);
    setFrameColor(template.frameColor);
    setGradientEnabled(template.gradientEnabled);
    if (template.gradientColor) setGradientColor(template.gradientColor);
    setFrameText(template.frameText || 'SCAN ME');
    setFrameTextTop(template.frameTextTop || '');
    setFrameTextBottom(template.frameTextBottom || '');
    setFrameSubText(template.frameSubText || '');
    setShowTemplates(false);
  };

  const onDownloadSimple = (ext: 'png' | 'svg' | 'webp') => {
    if (!qrCode.current) return;
    qrCode.current.download({ name: 'qr-code', extension: ext });
    setShowDownloadSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">QR Super Craft</h1>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-100">
              SME Edition
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex text-gray-500 hover:text-gray-900"
              onClick={() => setShowTemplates(true)}
            >
              Templates
            </Button>
            <Button 
              onClick={() => setIsPremium(!isPremium)}
              variant={isPremium ? "default" : "outline"} 
              size="sm" 
              className={`gap-2 ${isPremium ? 'bg-amber-500 hover:bg-amber-600 border-none' : ''}`}
            >
              <Crown className={`w-4 h-4 ${isPremium ? 'text-white' : 'text-amber-500'}`} />
              {isPremium ? 'Premium Active' : 'Go Premium'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {!isPremium && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 w-full h-[90px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-bold text-sm"
          >
            TOP LEADERBOARD AD (728x90) - High Visibility
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-2">Design your QR Code</h2>
              <p className="text-gray-500 mb-6">Choose your destination and customize the look.</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[
                    { id: 'link', label: 'Link', icon: Globe },
                    { id: 'vcard', label: 'vCard', icon: User },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'sms', label: 'SMS', icon: MessageSquare },
                    { id: 'call', label: 'Call', icon: Phone },
                    { id: 'wifi', label: 'WiFi', icon: Wifi },
                    { id: 'text', label: 'Text', icon: FileText },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQrType(type.id as any)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1 ${qrType === type.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                  {qrType === 'link' && (
                    <div className="space-y-2">
                      <Label htmlFor="url">Website URL</Label>
                      <Input 
                        id="url" 
                        placeholder="https://your-business.com" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)}
                        className="h-12 text-lg border-gray-200 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {qrType === 'text' && (
                    <div className="space-y-2">
                      <Label htmlFor="text">Plain Text</Label>
                      <textarea 
                        id="text" 
                        placeholder="Type your message here..." 
                        value={textData} 
                        onChange={(e) => setTextData(e.target.value)}
                        className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  )}

                  {qrType === 'vcard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input value={vCard.firstName} onChange={(e) => setVCard({...vCard, firstName: e.target.value})} placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input value={vCard.lastName} onChange={(e) => setVCard({...vCard, lastName: e.target.value})} placeholder="Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input value={vCard.phone} onChange={(e) => setVCard({...vCard, phone: e.target.value})} placeholder="+1 234 567 890" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={vCard.email} onChange={(e) => setVCard({...vCard, email: e.target.value})} placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={vCard.company} onChange={(e) => setVCard({...vCard, company: e.target.value})} placeholder="Acme Inc." />
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input value={vCard.website} onChange={(e) => setVCard({...vCard, website: e.target.value})} placeholder="www.acme.com" />
                      </div>
                    </div>
                  )}

                  {qrType === 'email' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Recipient Email</Label>
                        <Input value={emailData.recipient} onChange={(e) => setEmailData({...emailData, recipient: e.target.value})} placeholder="hello@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input value={emailData.subject} onChange={(e) => setEmailData({...emailData, subject: e.target.value})} placeholder="Inquiry from QR Code" />
                      </div>
                      <div className="space-y-2">
                        <Label>Message Body</Label>
                        <textarea 
                          value={emailData.body} 
                          onChange={(e) => setEmailData({...emailData, body: e.target.value})} 
                          placeholder="Type your message..."
                          className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {qrType === 'sms' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input value={smsData.phone} onChange={(e) => setSmsData({...smsData, phone: e.target.value})} placeholder="+1 234 567 890" />
                      </div>
                      <div className="space-y-2">
                        <Label>Message</Label>
                        <textarea 
                          value={smsData.message} 
                          onChange={(e) => setSmsData({...smsData, message: e.target.value})} 
                          placeholder="Type your SMS message..."
                          className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {qrType === 'call' && (
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input value={callData.phone} onChange={(e) => setCallData({...callData, phone: e.target.value})} placeholder="+1 234 567 890" />
                    </div>
                  )}

                  {qrType === 'wifi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Network Name (SSID)</Label>
                        <Input value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} placeholder="My Home WiFi" />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <Label>Encryption</Label>
                        <Select value={wifiData.encryption} onValueChange={(val) => setWifiData({...wifiData, encryption: val})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12 bg-gray-100/50 p-1">
                <TabsTrigger value="style" className="gap-2 text-xs sm:text-sm"><Palette className="w-4 h-4" /> Style</TabsTrigger>
                <TabsTrigger value="shapes" className="gap-2 text-xs sm:text-sm"><Layout className="w-4 h-4" /> Shapes</TabsTrigger>
                <TabsTrigger value="logo" className="gap-2 text-xs sm:text-sm"><ImageIcon className="w-4 h-4" /> Logo</TabsTrigger>
                <TabsTrigger value="frames" className="gap-2 text-xs sm:text-sm"><Square className="w-4 h-4" /> Frames</TabsTrigger>
                <TabsTrigger value="premium" className="gap-2 text-xs sm:text-sm"><Crown className="w-4 h-4" /> Pro</TabsTrigger>
              </TabsList>

              <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <TabsContent value="style" className="mt-0 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-lg font-bold">Colors & Gradients</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setDotsColor('#000000');
                        setBgColor('#ffffff');
                        setGradientEnabled(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 h-8 px-2"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Reset
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Dots Color</Label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={dotsColor} 
                          onChange={(e) => setDotsColor(e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
                        />
                        <Input 
                          value={dotsColor} 
                          onChange={(e) => setDotsColor(e.target.value)}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Background Color</Label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
                        />
                        <Input 
                          value={bgColor} 
                          onChange={(e) => setBgColor(e.target.value)}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Gradient Dots</Label>
                        <p className="text-xs text-gray-500">Add a professional color transition</p>
                      </div>
                      {!isPremium ? (
                        <Tooltip>
                          <TooltipTrigger render={<div className="opacity-50 cursor-not-allowed" />}>
                            <Button variant="outline" size="sm" disabled>Enable</Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Premium Feature: Unlock gradients with Pro</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button 
                          variant={gradientEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => setGradientEnabled(!gradientEnabled)}
                        >
                          {gradientEnabled ? 'Enabled' : 'Enable'}
                        </Button>
                      )}
                    </div>
                    
                    {gradientEnabled && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="space-y-2">
                          <Label>Gradient Presets</Label>
                          <Select onValueChange={(val) => {
                            const preset = gradientPresets.find(p => p.name === val);
                            if (preset) {
                              setDotsColor(preset.start);
                              setGradientColor(preset.end);
                            }
                          }}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select a preset" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradientPresets.map(preset => (
                                <SelectItem key={preset.name} value={preset.name}>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ background: `linear-gradient(to right, ${preset.start}, ${preset.end})` }} 
                                    />
                                    {preset.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label>Secondary Color</Label>
                          <div className="flex gap-3 items-center">
                            <input 
                              type="color" 
                              value={gradientColor} 
                              onChange={(e) => setGradientColor(e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer"
                            />
                            <Input 
                              value={gradientColor} 
                              onChange={(e) => setGradientColor(e.target.value)}
                              className="font-mono text-sm bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="flex justify-between text-xs">
                            <Label>Gradient Rotation</Label>
                            <span className="font-mono text-indigo-600 font-bold">{gradientRotation}°</span>
                          </div>
                          <Slider 
                            value={[gradientRotation]} 
                            min={0} 
                            max={360} 
                            step={1} 
                            onValueChange={(val) => setGradientRotation(val[0])} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="shapes" className="mt-0 space-y-8">
                  <div className="space-y-4">
                    <Label>Dot Pattern</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {(['square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'] as DotType[]).map((type) => {
                        const isTypePremium = ['classy', 'classy-rounded', 'extra-rounded'].includes(type);
                        const isLocked = isTypePremium && !isPremium;
                        
                        return (
                          <div key={type} className="flex w-full">
                            <Tooltip>
                              <TooltipTrigger
                                onClick={() => setDotsType(type)}
                                className={`p-2 rounded-lg border-2 transition-all relative w-full h-12 flex items-center justify-center ${dotsType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                              >
                                {isLocked && <Crown className="w-2 h-2 text-amber-500 absolute top-1 right-1" />}
                                <div className="text-[10px] font-medium capitalize truncate">{type.replace('-', ' ')}</div>
                              </TooltipTrigger>
                              {isLocked && (
                                <TooltipContent>
                                  <p>Premium Style: Unlock with Pro</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Corner Square Shape</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'square', label: 'Square' },
                        { id: 'dot', label: 'Dot' },
                        { id: 'extra-rounded', label: 'Rounded', premium: true },
                      ].map((type) => {
                        const isTypePremium = type.premium;
                        const isLocked = isTypePremium && !isPremium;

                        return (
                          <div key={type.id} className="flex w-full">
                            <Tooltip>
                              <TooltipTrigger
                                onClick={() => setCornersType(type.id as CornerSquareType)}
                                className={`p-3 rounded-xl border-2 transition-all relative flex flex-col items-center justify-center gap-2 w-full h-24 ${cornersType === type.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                              >
                                {isLocked && <Crown className="w-2 h-2 text-amber-500 absolute top-1 right-1" />}
                                <div className={`w-6 h-6 border-2 ${cornersType === type.id ? 'border-indigo-600' : 'border-gray-300'} ${type.id === 'dot' ? 'rounded-full' : type.id === 'extra-rounded' ? 'rounded-md' : ''}`} />
                                <div className="text-[10px] font-bold uppercase tracking-tight">{type.label}</div>
                              </TooltipTrigger>
                              {isLocked && (
                                <TooltipContent>
                                  <p>Premium Shape: Unlock with Pro</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Corner Dot Shape</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'square', label: 'Square', icon: Square },
                        { id: 'dot', label: 'Dot', icon: CheckCircle2 },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setCornersDotType(type.id as CornerDotType)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${cornersDotType === type.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <div className={`w-8 h-8 flex items-center justify-center border-2 ${cornersDotType === type.id ? 'border-indigo-600' : 'border-gray-300'}`}>
                            <div className={`bg-current ${type.id === 'dot' ? 'w-4 h-4 rounded-full' : 'w-5 h-5'}`} style={{ color: dotsColor }} />
                          </div>
                          <div className="text-xs font-bold uppercase tracking-wider">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logo" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <Label>Brand Logo</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-400">PNG, JPG or SVG (Max. 800x800px)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    </div>
                  </div>

                  {logo && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <Label>Logo Settings</Label>
                        <Button variant="ghost" size="sm" onClick={() => setLogo(null)} className="text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Size</span>
                            <span>{Math.round(logoSize * 100)}%</span>
                          </div>
                          <Slider 
                            value={[logoSize * 100]} 
                            min={10} 
                            max={50} 
                            step={1} 
                            onValueChange={(val) => setLogoSize(val[0] / 100)} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Margin</span>
                            <span>{logoMargin}px</span>
                          </div>
                          <Slider 
                            value={[logoMargin]} 
                            min={0} 
                            max={40} 
                            step={1} 
                            onValueChange={(val) => setLogoMargin(val[0])} 
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="frames" className="mt-0 space-y-6">
                  <div className="space-y-4">
                    <Label>Frame Style</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'none', label: 'No Frame', icon: Square },
                        { id: 'text-bottom', label: 'Text Bottom', icon: Type },
                        { id: 'rounded-border', label: 'Rounded', icon: Square },
                        { id: 'brackets', label: 'Brackets', icon: Layout },
                        { id: 'payment-style', label: 'Payment', icon: DollarSign },
                        { id: 'premium-badge', label: 'Badge', icon: Crown, premium: true },
                        { id: 'premium-modern', label: 'Modern', icon: Sparkles, premium: true },
                        { id: 'premium-circle', label: 'Circle', icon: Circle, premium: true },
                        { id: 'dashed-border', label: 'Dashed', icon: Square },
                      ].map((frame) => {
                        const isLocked = frame.premium && !isPremium;

                        return (
                          <div key={frame.id} className="flex w-full">
                            <Tooltip>
                              <TooltipTrigger
                                onClick={() => setFrameType(frame.id as any)}
                                className={`p-3 rounded-xl border-2 transition-all relative flex flex-col items-center justify-center gap-2 w-full h-24 ${frameType === frame.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                              >
                                {isLocked && <Crown className="w-2 h-2 text-amber-500 absolute top-1 right-1" />}
                                <frame.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] font-medium">{frame.label}</span>
                              </TooltipTrigger>
                              {isLocked && (
                                <TooltipContent>
                                  <p>Premium Frame: Unlock with Pro</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {frameType !== 'none' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-gray-100"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="frameText">
                          {frameType === 'payment-style' ? 'Main Text' : 'Frame Text'}
                        </Label>
                        <Input 
                          id="frameText" 
                          value={frameText} 
                          onChange={(e) => setFrameText(e.target.value)}
                          placeholder={frameType === 'payment-style' ? 'SCAN TO PAY' : 'SCAN ME'}
                          maxLength={30}
                        />
                      </div>

                      {frameType === 'payment-style' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 gap-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="frameTextTop">Header Text</Label>
                            <Input 
                              id="frameTextTop" 
                              value={frameTextTop} 
                              onChange={(e) => setFrameTextTop(e.target.value)}
                              placeholder="LICERIA PAYMENTS"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="frameTextBottom">Footer Text</Label>
                            <Input 
                              id="frameTextBottom" 
                              value={frameTextBottom} 
                              onChange={(e) => setFrameTextBottom(e.target.value)}
                              placeholder="THANK YOU!"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="frameSubText">Sub-footer Text</Label>
                            <Input 
                              id="frameSubText" 
                              value={frameSubText} 
                              onChange={(e) => setFrameSubText(e.target.value)}
                              placeholder="www.yourwebsite.com"
                            />
                          </div>
                        </motion.div>
                      )}
                      <div className="space-y-2">
                        <Label>Frame Color</Label>
                        <div className="flex gap-3 items-center">
                          <input 
                            type="color" 
                            value={frameColor} 
                            onChange={(e) => setFrameColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer"
                          />
                          <Input 
                            value={frameColor} 
                            onChange={(e) => setFrameColor(e.target.value)}
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="premium" className="mt-0">
                  <div className="text-center py-8 space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-2">
                      <Crown className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Unlock Premium Designs</h3>
                      <p className="text-gray-500 max-w-sm mx-auto">Get access to custom frames, high-res exports, and advanced gradient patterns.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 text-left max-w-xs mx-auto">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Vector SVG Exports</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Custom Corner Shapes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Advanced Gradient Patterns</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Modern Glassmorphism Frames</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-lg font-bold"
                      onClick={() => setIsPremium(true)}
                    >
                      Upgrade for $9.99
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Integrated Guide Section (Fills the left space) */}
            <div className="pt-12 border-t border-gray-100 space-y-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">How to Create the Perfect QR Code</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  QR codes are essential tools for SMEs to bridge the gap between physical and digital worlds. 
                  A well-designed QR code can significantly increase engagement and trust.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                      <Globe className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">1. Choose Your Type</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Select from Link, vCard, WiFi, or SMS optimized for specific actions.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                      <Palette className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">2. Customize Style</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Match your brand colors and use gradients to stand out.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Best Practices for Scanability</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    <span><strong>Contrast:</strong> Dots should be darker than the background.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    <span><strong>Size:</strong> Minimum 2cm x 2cm for print materials.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <details className="group border-b border-gray-100 pb-3 cursor-pointer">
                    <summary className="list-none font-bold text-xs flex justify-between items-center">
                      Are these QR codes permanent?
                      <span className="group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                      Yes! These are static QR codes that work forever as long as the data remains valid.
                    </p>
                  </details>
                  <details className="group border-b border-gray-100 pb-3 cursor-pointer">
                    <summary className="list-none font-bold text-xs flex justify-between items-center">
                      Can I use my QR code for commercial use?
                      <span className="group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                      Absolutely. All QR codes generated here are free for personal and commercial use.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-3xl">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-lg flex items-center justify-between">
                  Live Preview
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex flex-col items-center">
                <div ref={exportRef} className="p-4 bg-white rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: bgColor }}>
                  <div className={`relative transition-all duration-300 ${
                    frameType === 'text-bottom' ? 'pb-12 pt-4 px-4' : 
                    frameType === 'rounded-border' ? 'p-8 border-8 rounded-[40px]' :
                    frameType === 'brackets' ? 'p-8' :
                    frameType === 'payment-style' ? 'p-0 origin-center scale-[0.7] sm:scale-[0.85] lg:scale-[0.75] xl:scale-[0.85]' :
                    frameType === 'premium-badge' ? 'p-12' :
                    frameType === 'premium-modern' ? 'p-12' : 'p-2'
                  }`}
                  style={{ 
                    borderColor: frameType === 'rounded-border' ? frameColor : 'transparent',
                    backgroundColor: frameType !== 'none' && frameType !== 'payment-style' ? bgColor : 'transparent'
                  }}>
                    {/* Payment Style Frame (Poster Style) */}
                    {frameType === 'payment-style' && (
                      <div className="w-[380px] h-[540px] flex flex-col items-center justify-between p-8 rounded-3xl overflow-hidden relative" style={{ backgroundColor: frameColor }}>
                        {/* Background Pattern (Optional) */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, white 0%, transparent 70%)` }} />
                        </div>

                        <div className="w-full flex flex-col items-center gap-1 mt-4 relative z-10">
                          {frameTextTop && (
                            <span className="text-white/90 text-[12px] font-bold uppercase tracking-[0.3em]">{frameTextTop}</span>
                          )}
                          <div className="flex flex-col items-center -space-y-2 mt-2">
                            {(frameText || 'SCAN TO PAY').split(' ').map((word, i) => (
                              <span key={i} className="text-white text-5xl font-black uppercase tracking-tighter leading-none">{word}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-3xl shadow-2xl relative z-10">
                          <div ref={qrRef} className="w-[240px] h-[240px] [&>svg]:w-full [&>svg]:h-full [&>canvas]:w-full [&>canvas]:h-full" />
                        </div>

                        <div className="w-full flex flex-col items-center gap-2 mb-4 relative z-10">
                          <span className="text-white text-3xl font-black uppercase tracking-tight">{frameTextBottom || 'THANK YOU!'}</span>
                          {frameSubText && (
                            <span className="text-white/80 text-[11px] font-medium italic tracking-wide">{frameSubText}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {frameType !== 'payment-style' && (
                      <>
                        {/* Premium Circle Frame */}
                        {frameType === 'premium-circle' && (
                          <div className="absolute inset-0 border-8 rounded-full flex items-center justify-center" style={{ borderColor: frameColor }}>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full shadow-lg z-20" style={{ backgroundColor: frameColor }}>
                              <span className="text-white text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">{frameText}</span>
                            </div>
                          </div>
                        )}

                        {/* Dashed Border Frame */}
                        {frameType === 'dashed-border' && (
                          <div className="absolute inset-0 border-4 border-dashed rounded-2xl" style={{ borderColor: frameColor }} />
                        )}

                        {/* Brackets Frame */}
                        {frameType === 'brackets' && (
                          <>
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: frameColor }} />
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: frameColor }} />
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: frameColor }} />
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: frameColor }} />
                          </>
                        )}

                        {/* Premium Badge Frame */}
                        {frameType === 'premium-badge' && (
                          <div className="absolute inset-0 border-4 border-double rounded-full" style={{ borderColor: frameColor, opacity: 0.3 }} />
                        )}

                        {/* Premium Modern Frame */}
                        {frameType === 'premium-modern' && (
                          <>
                            <div className="absolute inset-0 rounded-[32px] p-[3px]" style={{ background: `linear-gradient(135deg, ${frameColor}, transparent 50%, ${frameColor})` }}>
                              <div className="w-full h-full rounded-[29px]" style={{ backgroundColor: bgColor }} />
                            </div>
                            <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]" />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full shadow-xl z-20 flex items-center gap-2" style={{ backgroundColor: frameColor }}>
                               <Crown className="w-3 h-3 text-white" />
                               <span className="text-white text-[10px] font-black uppercase tracking-widest">{frameText}</span>
                            </div>
                            <div className="absolute -bottom-3 right-8 px-3 py-1 bg-white rounded-full shadow-md border border-gray-100 z-20 flex items-center gap-1">
                               <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: frameColor }} />
                               <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Verified QR</span>
                            </div>
                          </>
                        )}

                        <div ref={qrRef} className="w-[300px] h-[300px] relative z-10" />

                        {/* Text Bottom Frame */}
                        {frameType === 'text-bottom' && (
                          <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center">
                            <span className="font-bold tracking-widest uppercase text-sm" style={{ color: frameColor }}>{frameText}</span>
                          </div>
                        )}

                        {/* Premium Badge Text */}
                        {frameType === 'premium-badge' && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full shadow-lg z-20" style={{ backgroundColor: frameColor }}>
                            <span className="text-white text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">{frameText}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-4 mt-8">
                    <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => onDownload('png')} className="w-full h-12 gap-2 bg-gray-900 hover:bg-black">
                      <Download className="w-4 h-4" /> PNG
                    </Button>
                    {!isPremium ? (
                      <Tooltip>
                        <TooltipTrigger render={<div className="w-full" />}>
                          <Button 
                            variant="outline" 
                            className="w-full h-12 gap-2 border-gray-200 opacity-50 cursor-not-allowed"
                            disabled
                          >
                            <Download className="w-4 h-4" /> SVG <Crown className="w-3 h-3 text-amber-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Premium Export: Unlock vector SVG with Pro</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Button 
                        onClick={() => onDownload('svg')} 
                        variant="outline" 
                        className="w-full h-12 gap-2 border-gray-200"
                      >
                        <Download className="w-4 h-4" /> SVG
                      </Button>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> High Quality</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Scalable</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Print Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Settings className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Pro Tip</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Use high contrast colors for better scanability. Dark dots on light backgrounds work best for all scanners.
                </p>
              </div>
            </div>

            {!isPremium && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 w-full aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 p-6 text-center relative overflow-hidden group"
              >
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-gray-200 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest z-10">AD</div>
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                </div>
                <span className="font-bold text-sm text-gray-500">SIDEBAR RECTANGLE</span>
                <p className="text-[10px] mt-2 text-gray-400 max-w-[200px]">Promote your brand or related services here. (300x250)</p>
                <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            )}
          </div>
        </div>

        {!isPremium && (
          <div className="mt-12 w-full h-[120px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-gray-200 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest z-10">AD</div>
            <span className="font-bold text-sm text-gray-500">HORIZONTAL BANNER AD</span>
            <p className="text-[10px] mt-1 text-gray-400">High engagement placement between tool and guide. (970x90 or 728x90)</p>
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-bold tracking-tight">QR Super Craft</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <button 
              onClick={() => setPolicyModal({ isOpen: true, type: 'privacy' })}
              className="hover:text-indigo-600 transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setPolicyModal({ isOpen: true, type: 'terms' })}
              className="hover:text-indigo-600 transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setPolicyModal({ isOpen: true, type: 'contact' })}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              Contact Us
            </button>
          </div>
          <p className="text-xs text-gray-400">© 2026 QR Super Craft SME. All rights reserved.</p>
        </div>
      </footer>

      {/* Policy Modals */}
      <PolicyModal 
        isOpen={policyModal.isOpen} 
        onClose={() => setPolicyModal({ ...policyModal, isOpen: false })} 
        type={policyModal.type} 
      />

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTemplates(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Design Templates</h3>
                  <p className="text-sm text-gray-500">Pick a pre-made style to get started quickly.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowTemplates(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                {!isPremium && (
                  <div className="col-span-full mb-4 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-between text-gray-400 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-gray-200 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest z-10">AD</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-xs text-gray-500 block">IN-MODAL BANNER</span>
                        <p className="text-[10px] text-gray-400">Reach users while they browse templates.</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-[10px] h-7 px-3 border-gray-300">Learn More</Button>
                  </div>
                )}
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    disabled={template.premium && !isPremium}
                    className={`group relative p-4 rounded-2xl border-2 transition-all text-left ${
                      template.premium && !isPremium 
                        ? 'opacity-60 cursor-not-allowed border-gray-100' 
                        : 'border-gray-100 hover:border-indigo-600 hover:shadow-lg'
                    }`}
                  >
                    <div className="aspect-square rounded-xl mb-4 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: template.bgColor }}>
                      <div className="w-24 h-24 border-4 rounded-lg flex items-center justify-center" style={{ borderColor: template.dotsColor }}>
                         <div className="w-16 h-16 grid grid-cols-3 gap-1">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="bg-current rounded-sm" style={{ color: template.dotsColor }} />
                            ))}
                         </div>
                      </div>
                      {template.premium && (
                        <div className="absolute top-2 right-2 p-1 bg-amber-500 rounded-full">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{template.name}</span>
                      {template.premium && !isPremium && <span className="text-[10px] text-amber-600 font-bold">PRO</span>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <Button variant="outline" onClick={() => setShowTemplates(false)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Download Success Modal (Monetization Example) */}
      <AnimatePresence>
        {showDownloadSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadSuccess(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Download Started!</h3>
                  <p className="text-gray-500">Your custom QR code is being saved to your device.</p>
                </div>

                {/* Ad Placeholder in Modal */}
                <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>Sponsored Content</span>
                    <span className="px-1.5 py-0.5 bg-gray-200 rounded">AD</span>
                  </div>
                  <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold text-xs italic">
                    INTERSTITIAL AD / PROMOTIONAL BANNER
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Want to remove ads? Upgrade to Pro for an ad-free experience.</p>
                </div>

                <Button 
                  className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-xl"
                  onClick={() => setShowDownloadSuccess(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRGenerator;
