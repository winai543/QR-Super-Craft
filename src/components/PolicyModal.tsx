import React from 'react';
import { motion } from 'motion/react';
import { X, Shield, FileText, Mail, Globe, Lock, Eye, Scale, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'contact';
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield className="w-6 h-6 text-green-600" />,
      sections: [
        {
          title: '1. Information We Collect',
          text: 'We do not collect any personal data when you generate a static QR code. Our tool processes your input locally or via secure API calls to generate the image. If you upload a logo, it is processed only for the purpose of creating your QR code and is not stored on our servers permanently.'
        },
        {
          title: '2. Cookies and Tracking',
          text: 'We use essential cookies to ensure the website functions correctly. We may also use third-party analytics (like Google Analytics) and advertising cookies (like Google AdSense) to improve our service and show relevant ads.'
        },
        {
          title: '3. Data Security',
          text: 'We implement a variety of security measures to maintain the safety of your information. However, please remember that no method of transmission over the internet is 100% secure.'
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      icon: <Scale className="w-6 h-6 text-indigo-600" />,
      sections: [
        {
          title: '1. Acceptance of Terms',
          text: 'By using QR Super Craft, you agree to comply with and be bound by these terms. If you do not agree, please do not use our service.'
        },
        {
          title: '2. Use License',
          text: 'You are granted a non-exclusive license to generate QR codes for both personal and commercial use. You may not use our service for any illegal activities or to generate malicious content.'
        },
        {
          title: '3. Disclaimer',
          text: 'The materials on QR Super Craft are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability.'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      icon: <Mail className="w-6 h-6 text-amber-600" />,
      sections: [
        {
          title: 'Get in Touch',
          text: 'Have questions or feedback? We would love to hear from you. Our team is dedicated to providing the best QR generation experience for SMEs.'
        },
        {
          title: 'Email Support',
          text: 'You can reach us at: support@qrsupercraft.com. We typically respond within 24-48 business hours.'
        },
        {
          title: 'Business Inquiries',
          text: 'For partnership or business inquiries, please contact: business@qrsupercraft.com'
        }
      ]
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
              {content.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-200">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8">
          {content.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed pl-3.5 border-l border-gray-100">
                {section.text}
              </p>
            </div>
          ))}
          
          {type === 'privacy' && (
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Eye className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-700 leading-relaxed">
                We value your privacy. This policy is updated regularly to comply with international data protection standards (GDPR, CCPA).
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} className="bg-gray-900 hover:bg-black text-white px-8 rounded-xl">
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyModal;
