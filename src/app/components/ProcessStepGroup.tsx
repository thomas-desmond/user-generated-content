'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import { ArchitectureDiagram } from './ArchitectureDiagram';

export interface UploadStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface StepGroup {
  id: string;
  title: string;
  description: string;
  steps: UploadStep[];
  isCollapsed: boolean;
  architectureDiagram?: {
    title: string;
    imagePath?: string; // Path to PNG diagram
    fallbackText?: string[]; // Fallback text for when PNG not available
  };
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProcessStepGroupProps {
  group: StepGroup;
  onToggleCollapse: (groupId: string) => void;
  showArchitecture: boolean;
  onToggleArchitecture: () => void;
}

export function ProcessStepGroup({ 
  group, 
  onToggleCollapse, 
  showArchitecture, 
  onToggleArchitecture 
}: ProcessStepGroupProps) {
  const getStepIcon = (step: UploadStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getGroupStatusIcon = () => {
    const completedSteps = group.steps.filter(step => step.status === 'completed').length;
    const totalSteps = group.steps.length;
    const hasActiveStep = group.steps.some(step => step.status === 'active');
    const hasErrorStep = group.steps.some(step => step.status === 'error');

    if (hasErrorStep) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (hasActiveStep) {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    if (completedSteps === totalSteps && totalSteps > 0) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  const getGroupStatusText = () => {
    const completedSteps = group.steps.filter(step => step.status === 'completed').length;
    const totalSteps = group.steps.length;
    const hasActiveStep = group.steps.some(step => step.status === 'active');
    const hasErrorStep = group.steps.some(step => step.status === 'error');

    if (hasErrorStep) return 'error';
    if (hasActiveStep) return `${completedSteps}/${totalSteps} active`;
    if (completedSteps === totalSteps && totalSteps > 0) return `${completedSteps}/${totalSteps} completed`;
    return 'pending';
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg mb-4">
      {/* Group Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => onToggleCollapse(group.id)}
      >
        <div className="flex items-center space-x-3">
          {group.isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
          {getGroupStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {group.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {group.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {getGroupStatusText()}
          </span>
          {group.architectureDiagram && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchitecture();
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showArchitecture ? 'Hide' : 'Show'} Architecture
            </button>
          )}
        </div>
      </div>

      {/* Group Content */}
      {!group.isCollapsed && (
        <div className="px-4 pb-4">
          {/* Architecture Diagram */}
          {showArchitecture && group.architectureDiagram && (
            <div className="mb-4">
              <ArchitectureDiagram 
                title={group.architectureDiagram.title}
                imagePath={group.architectureDiagram.imagePath}
                fallbackText={group.architectureDiagram.fallbackText}
              />
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3 ml-8">
            {group.steps.map((step) => (
              <div key={step.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                  {step.status === 'active' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
