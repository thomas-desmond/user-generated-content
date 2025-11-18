'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Zap, DollarSign, Gauge, Upload, Palette, Camera, ShoppingCart, MessageSquare, Video } from 'lucide-react';

interface ContextSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isExpanded?: boolean;
}

export function UGCContext() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['definition']));

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const contexts: ContextSection[] = [
    {
      id: 'definition',
      title: 'What is User-Generated Content?',
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            User-Generated Content (UGC) encompasses all content created by users within modern applications - 
            from images and videos to documents and interactive media. This content drives engagement, 
            personalization, and business value across industries.
          </p>
          
          <div className="bg-gradient-to-r from-orange-50/30 to-red-50/30  border border-orange-100/50  rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 border-b-2 border-orange-500 pb-1">Beyond Traditional Uploads:</h4>
            <p className="text-gray-700 text-sm">
              Modern UGC encompasses AI-generated images, content created in design tools, 
              collaborative documents, and any media users create or customize within applications - 
              not just traditional file uploads.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'scenarios',
      title: 'Real-World UGC Scenarios',
      icon: <Palette className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-50">
              <Upload className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">Direct Uploads</h5>
                <p className="text-sm text-gray-600">Car auction photos, social media images, profile pictures</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-50">
              <Palette className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">Created Content</h5>
                <p className="text-sm text-gray-600">AI-generated images, design tool exports, custom graphics</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-50">
              <Video className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">Media Content</h5>
                <p className="text-sm text-gray-600">Video uploads, live streams, podcast recordings</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-50">
              <ShoppingCart className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">E-commerce</h5>
                <p className="text-sm text-gray-600">Product photos, customer reviews, unboxing videos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-50">
              <MessageSquare className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">Collaborative</h5>
                <p className="text-sm text-gray-600">Shared documents, team assets, collaborative designs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-50">
              <Camera className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-gray-900">Interactive</h5>
                <p className="text-sm text-gray-600">AR filters, 3D models, interactive presentations</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'value',
      title: 'Cloudflare UGC Value Drivers',
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <DollarSign className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Reduced Costs</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Zero egress fees with R2 can save thousands monthly compared to traditional cloud storage
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Gauge className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Increased Performance</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Global edge delivery reduces latency for content access worldwide
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Reduced Complexity</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Scalable, developer-friendly APIs that integrate seamlessly with existing workflows
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Scalability</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Handle traffic spikes and growing content volumes without infrastructure concerns
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'solutions',
      title: 'Cloudflare UGC Solutions',
      icon: <Gauge className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-100 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">Cloudflare Images</h4>
              <p className="text-sm text-gray-600">
                Optimized image storage and delivery with automatic resizing and format optimization
              </p>
            </div>
            
            <div className="p-4 border border-gray-100 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">Cloudflare Stream</h4>
              <p className="text-sm text-gray-600">
                Seamless video ingestion and playback with adaptive streaming
              </p>
            </div>
            
            <div className="p-4 border border-orange-100/50  bg-gradient-to-r from-orange-50/20 to-red-50/20  rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 border-b-2 border-orange-500 pb-1">Cloudflare R2 ⭐</h4>
              <p className="text-sm text-gray-700">
                Fully customizable, S3-compatible object storage with zero egress fees (this demo)
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50/20 to-red-50/20  border border-orange-100/50  rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 border-b-2 border-red-500 pb-1">Infrastructure Flexibility:</h4>
            <p className="text-gray-700 text-sm">
              This demonstration showcases R2&apos;s secure upload pattern using pre-signed URLs. The same 
              infrastructure seamlessly supports content creation tools, AI-generated media, and collaborative 
              platforms - providing a unified foundation for all user-generated content workflows.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-50 p-6 mt-8">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F6821F] to-[#FF6633] rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            User-Generated Content Infrastructure
          </h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Explore how modern applications handle user-created content at scale with Cloudflare&apos;s 
          cost-efficient, high-performance infrastructure solutions.
        </p>
      </div>

      <div className="space-y-3">
        {contexts.map((section) => (
          <div key={section.id} className="border border-orange-50 rounded-lg bg-white">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-50/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {section.icon}
                <span className="font-medium text-gray-900">
                  {section.title}
                </span>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.has(section.id) && (
              <div className="px-4 pb-4">
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
