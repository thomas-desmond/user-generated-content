'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Zap, Gauge, Upload, Palette, Camera, ShoppingCart, MessageSquare, Video, Layers, ArrowRight, Database, Cpu, Bell, ListTodo, Brain } from 'lucide-react';

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
      id: 'demo',
      title: 'What This Demo Shows',
      icon: <Cpu className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            This demo showcases a complete UGC processing pipeline built entirely on Cloudflare&apos;s developer platform. 
            Upload an image and watch it flow through the entire event-driven architecture in real-time.
          </p>
          
          {/* Architecture Flow */}
          <div className="bg-gradient-to-r from-orange-50/30 to-red-50/30 border border-orange-100/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 border-b-2 border-orange-500 pb-1">Architecture Flow</h4>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <Upload className="w-4 h-4 text-orange-500" />
                <span>Upload</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <Database className="w-4 h-4 text-orange-500" />
                <span>R2</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <Bell className="w-4 h-4 text-orange-500" />
                <span>Event</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <ListTodo className="w-4 h-4 text-orange-500" />
                <span>Queue</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Workflow</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <Brain className="w-4 h-4 text-orange-500" />
                <span>AI</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                <Database className="w-4 h-4 text-orange-500" />
                <span>D1</span>
              </div>
            </div>
          </div>

          {/* Services Used */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900 text-sm">Storage & Delivery</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>R2</strong> - Object storage with pre-signed URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>D1</strong> - Serverless SQL for metadata</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900 text-sm">Processing & Compute</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>Workers</strong> - Serverless compute</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>Queues</strong> - Event batching</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>Workflows</strong> - Durable execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span><strong>Workers AI</strong> - Image analysis</span>
                </div>
              </div>
            </div>
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
              <Layers className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Single Integrated Platform</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Storage, compute, event processing, AI, and database - all native to Cloudflare. No wiring up separate services.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Gauge className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Increased Performance</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Direct uploads via pre-signed URLs and global edge delivery reduce latency for content access worldwide
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
                  Declarative configuration and native bindings. Workflows handle retry, durability, and state automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Scalability</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Workers scale to zero and up instantly. Queues batch events automatically. No capacity planning required.
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
          <p className="text-gray-700 text-sm">
            Cloudflare offers multiple approaches to UGC depending on your use case. Choose the right tool for your needs:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-100 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">Cloudflare Images</h4>
              <p className="text-sm text-gray-600 mb-2">
                Optimized image storage and delivery with automatic resizing and format optimization
              </p>
              <p className="text-xs text-gray-500 italic">
                Best for: Image-heavy apps needing automatic optimization and variants
              </p>
            </div>
            
            <div className="p-4 border border-gray-100 rounded-lg bg-white">
              <h4 className="font-semibold text-gray-900 mb-2">Cloudflare Stream</h4>
              <p className="text-sm text-gray-600 mb-2">
                Seamless video ingestion and playback with adaptive streaming
              </p>
              <p className="text-xs text-gray-500 italic">
                Best for: Video platforms needing encoding, storage, and playback
              </p>
            </div>
            
            <div className="p-4 border border-orange-100/50 bg-gradient-to-r from-orange-50/20 to-red-50/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 border-b-2 border-orange-500 pb-1">Cloudflare R2 ⭐</h4>
              <p className="text-sm text-gray-700 mb-2">
                S3-compatible object storage with native event notifications and full customization
              </p>
              <p className="text-xs text-orange-700 font-medium">
                Best for: Custom pipelines with event-driven processing (this demo)
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50/20 to-red-50/20 border border-orange-100/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 border-b-2 border-red-500 pb-1">Why R2 for This Demo?</h4>
            <p className="text-gray-700 text-sm">
              R2 provides the flexibility to build custom processing pipelines. When combined with Event Notifications, 
              Queues, and Workflows, you get a powerful event-driven architecture that can handle any content type 
              with custom business logic - from AI analysis to content moderation to format conversion.
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
          Explore how modern applications handle user-created content at scale using Cloudflare&apos;s 
          single integrated platform - combining storage, compute, event processing, AI, and database in one unified developer experience.
        </p>
      </div>

      <div className="space-y-4">
        {contexts.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <div 
              key={section.id} 
              className={`rounded-lg transition-all duration-200 ${
                isExpanded 
                  ? 'border-l-4 border-l-orange-500 border border-orange-200 bg-orange-50/30 shadow-sm' 
                  : 'border border-gray-200 bg-white hover:border-orange-200'
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors rounded-t-lg ${
                  isExpanded 
                    ? 'bg-gradient-to-r from-orange-50 to-transparent' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${isExpanded ? 'text-orange-600' : 'text-gray-500'}`}>
                    {section.icon}
                  </div>
                  <span className={`font-medium ${isExpanded ? 'text-orange-900' : 'text-gray-900'}`}>
                    {section.title}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-orange-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="pt-3 border-t border-orange-200/50">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
