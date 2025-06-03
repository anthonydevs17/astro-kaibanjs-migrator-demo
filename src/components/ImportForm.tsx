import { useState, useEffect } from 'react';
import { z } from 'zod';
import blogMigrationTeam from '../teams/blog-migration-team';
import React from 'react';
import {
  Bot,
  Loader2,
  Brain,
  Wrench,
  AlertCircle,
  Cpu,
  Flame,
  Settings,
  Eye,
  EyeOff,
  Key,
  MessageSquare,
  X,
  Activity,
  ExternalLink,
  Terminal,
  ChevronRight,
  ChevronDown,
  Clock,
  DollarSign
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useApiKeyStore } from '../teams/apiKeyStore';

interface Tool {
  name: string;
  logo?: string;
  website?: string;
}

interface AgentCardProps {
  name: string;
  role: string;
  status: string;
  llmConfig?: {
    model: string;
  };
  tools?: Tool[];
}

export function AgentCard({
  name,
  role,
  status,
  llmConfig,
  tools
}: AgentCardProps) {
  const isWorking =
    status !== 'INITIAL' &&
    status !== 'FINAL_ANSWER' &&
    status !== 'TASK_COMPLETED';

  const getStatusDetails = () => {
    switch (status) {
      case 'THINKING':
      case 'THOUGHT':
        return {
          icon: <Brain className='w-4 h-4' />,
          label: 'Thinking',
          color: 'text-purple-500',
          bg: 'bg-purple-50'
        };
      case 'EXECUTING_ACTION':
      case 'USING_TOOL':
        return {
          icon: <Wrench className='w-4 h-4' />,
          label: 'Using Tool',
          color: 'text-amber-500',
          bg: 'bg-amber-50'
        };
      case 'OBSERVATION':
        return {
          icon: <Loader2 className='w-4 h-4 animate-spin' />,
          label: 'Processing',
          color: 'text-blue-500',
          bg: 'bg-blue-50'
        };
      case 'FINAL_ANSWER':
      case 'TASK_COMPLETED':
        return {
          icon: <Bot className='w-4 h-4' />,
          label: 'Completed',
          color: 'text-green-500',
          bg: 'bg-green-50'
        };
      case 'MAX_ITERATIONS_ERROR':
      case 'AGENTIC_LOOP_ERROR':
      case 'WEIRD_LLM_OUTPUT':
        return {
          icon: <AlertCircle className='w-4 h-4' />,
          label: 'Error',
          color: 'text-red-500',
          bg: 'bg-red-50'
        };
      default:
        return {
          icon: <Bot className='w-4 h-4' />,
          label: 'Idle',
          color: 'text-gray-400',
          bg: 'bg-gray-50'
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <div
      className={`relative bg-white rounded-lg p-4 shadow-sm border transition-all duration-300 ${
        isWorking
          ? 'border-blue-400 ring-2 ring-blue-100 transform scale-102 -translate-y-1'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {isWorking && (
        <div className='absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r animate-pulse' />
      )}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-lg ${
              isWorking ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            <Bot
              className={`w-5 h-5 ${
                isWorking ? 'text-blue-500' : 'text-gray-400'
              }`}
            />
          </div>
          <div>
            <h5
              className={`font-semibold ${
                isWorking ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {name}
            </h5>
            <p className='text-sm text-gray-600'>{role}</p>
            <div className='flex flex-col gap-1 mt-2'>
              {llmConfig?.model && (
                <div className='flex items-center gap-1.5'>
                  <Cpu className='w-3 h-3 text-gray-400' />
                  <span className='text-xs text-gray-500'>
                    {llmConfig.model}
                  </span>
                </div>
              )}
              {tools?.map((tool, index) => (
                <div key={index} className='flex items-center gap-1.5'>
                  {tool.name === 'JinaUrlToMarkdown' ? (
                    <div className='flex items-center gap-1.5'>
                      <Flame className='w-3 h-3 text-orange-500' />
                      <a
                        href='https://jina.ai'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-orange-500 hover:text-orange-600 font-medium'
                      >
                        Jina
                      </a>
                    </div>
                  ) : (
                    <span className='text-xs text-gray-500'>{tool.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusDetails.bg}`}
        >
          {statusDetails.icon}
          <span className={`text-sm font-medium ${statusDetails.color}`}>
            {statusDetails.label}
          </span>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <div
          className={`w-2 h-2 rounded-full ${
            isWorking
              ? 'bg-blue-500 animate-pulse'
              : status === 'TASK_COMPLETED' || status === 'FINAL_ANSWER'
              ? 'bg-green-500'
              : status.includes('ERROR')
              ? 'bg-red-500'
              : 'bg-gray-300'
          }`}
        />
        <span
          className={`text-sm ${
            isWorking ? 'text-blue-500 font-medium' : 'text-gray-500'
          }`}
        >
          {status
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ')}
        </span>
      </div>
    </div>
  );
}

export function ApiSettings() {
  const { apiKeys, setApiKey } = useApiKeyStore(state => ({
    apiKeys: state.apiKeys,
    setApiKey: state.setApiKey
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showJina, setShowJina] = useState(false);

  useEffect(() => {
    const openaiKey = localStorage.getItem('openaiApiKey');
    const jinaKey = localStorage.getItem('jinaApiKey');

    if (openaiKey) setApiKey('openai', openaiKey);
    if (jinaKey) setApiKey('jina', jinaKey);
  }, []);

  const handleChange = (name: string, value: string) => {
    setApiKey(name, value);
    localStorage.setItem(
      name === 'openai' ? 'openaiApiKey' : 'jinaApiKey',
      value
    );
  };

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-xl'
      >
        <div className='flex items-center gap-3'>
          <Settings className='w-5 h-5 text-gray-400' />
          <span className='font-medium text-gray-900'>API Settings</span>
        </div>
        <div
          className={`transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <svg
            className='w-5 h-5 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className='px-6 pb-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              OpenAI API Key
            </label>
            <div className='relative'>
              <input
                type={showOpenAI ? 'text' : 'password'}
                value={apiKeys.openai || ''}
                onChange={e => handleChange('openai', e.target.value)}
                placeholder='sk-...'
                className='w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
              />
              <Key className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <button
                type='button'
                onClick={() => setShowOpenAI(!showOpenAI)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showOpenAI ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
            <p className='mt-1 text-xs text-gray-500'>
              Get your API key from{' '}
              <a
                href='https://platform.openai.com/api-keys'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:text-blue-600'
              >
                OpenAI's dashboard
              </a>
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Jina API Key
            </label>
            <div className='relative'>
              <input
                type={showJina ? 'text' : 'password'}
                value={apiKeys.jina || ''}
                onChange={e => handleChange('jina', e.target.value)}
                placeholder='fc-...'
                className='w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
              />
              <Key className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <button
                type='button'
                onClick={() => setShowJina(!showJina)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showJina ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
            <p className='mt-1 text-xs text-gray-500'>
              Get your API key from{' '}
              <a
                href='https://jina.ai'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:text-blue-600'
              >
                Jina's dashboard.
              </a>
              Optional, can leave blank if you don't have one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// import { MessageSquare, X, Activity } from 'lucide-react';

interface TaskCardProps {
  title: string;
  status: string;
  agent?: any;
  task?: {
    id: string;
    result?: any;
    description?: string;
  };
}

export function TaskCard({ title, status, agent, task }: TaskCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isActive = status === 'DOING';
  const isBlocked = status === 'BLOCKED';
  const isRevising = status === 'REVISE';
  const isDone = status === 'DONE';
  const agentStatus = agent?.status || 'IDLE';

  const getStatusDetails = () => {
    switch (status) {
      case 'BLOCKED':
        return {
          icon: <AlertCircle className='w-4 h-4' />,
          label: 'Blocked',
          color: 'text-amber-500',
          bg: 'bg-amber-50'
        };
      case 'REVISE':
        return {
          icon: <MessageSquare className='w-4 h-4' />,
          label: 'Revising',
          color: 'text-purple-500',
          bg: 'bg-purple-50'
        };
      case 'DOING':
        return {
          icon: <Loader2 className='w-4 h-4 animate-spin' />,
          label: 'Doing',
          color: 'text-blue-500',
          bg: 'bg-blue-50'
        };
      case 'DONE':
        return {
          icon: <Bot className='w-4 h-4' />,
          label: 'Completed',
          color: 'text-green-500',
          bg: 'bg-green-50'
        };
      default:
        return {
          icon: <Bot className='w-4 h-4' />,
          label: 'Todo',
          color: 'text-gray-400',
          bg: 'bg-gray-50'
        };
    }
  };

  const getAgentStatusDetails = () => {
    switch (agentStatus) {
      case 'THINKING':
      case 'THOUGHT':
        return {
          icon: <Brain className='w-4 h-4' />,
          label: 'Thinking',
          color: 'text-purple-500',
          bg: 'bg-purple-50'
        };
      case 'EXECUTING_ACTION':
      case 'USING_TOOL':
        return {
          icon: <Wrench className='w-4 h-4' />,
          label: 'Using Tool',
          color: 'text-amber-500',
          bg: 'bg-amber-50'
        };
      case 'OBSERVATION':
        return {
          icon: <Activity className='w-4 h-4' />,
          label: 'Processing',
          color: 'text-blue-500',
          bg: 'bg-blue-50'
        };
      default:
        return {
          icon: <Bot className='w-4 h-4' />,
          label: 'Idle',
          color: 'text-gray-400',
          bg: 'bg-gray-50'
        };
    }
  };

  const statusDetails = getStatusDetails();
  const agentStatusDetails = getAgentStatusDetails();

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className={`relative bg-white rounded-lg shadow-sm border transition-all duration-300 cursor-pointer ${
          isActive
            ? 'border-blue-400 ring-2 ring-blue-100'
            : isBlocked
            ? 'border-amber-400 ring-2 ring-amber-100'
            : isRevising
            ? 'border-purple-400 ring-2 ring-purple-100'
            : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between mb-2'>
            <h5
              className={`font-medium ${
                isActive
                  ? 'text-blue-600'
                  : isBlocked
                  ? 'text-amber-600'
                  : isRevising
                  ? 'text-purple-600'
                  : 'text-gray-900'
              }`}
            >
              {title}
            </h5>
            <div
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusDetails.bg} ${statusDetails.color}`}
            >
              <div className='flex items-center gap-1.5'>
                {statusDetails.icon}
                {statusDetails.label}
              </div>
            </div>
          </div>

          {agent && (
            <div className='mt-3 pt-3 border-t border-gray-100'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Bot
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-blue-500'
                        : isBlocked
                        ? 'text-amber-500'
                        : isRevising
                        ? 'text-purple-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    {agent.name}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${agentStatusDetails.bg} ${agentStatusDetails.color}`}
                >
                  {agentStatusDetails.icon}
                  {agentStatusDetails.label}
                </div>
              </div>
            </div>
          )}

          <div className='mt-2 text-xs text-gray-500'>
            Click to view details
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showDetails && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden'>
            <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
              <div>
                <h5 className='font-semibold text-lg text-gray-900'>{title}</h5>
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-1 mt-2 rounded-full text-xs ${statusDetails.bg} ${statusDetails.color}`}
                >
                  {statusDetails.icon}
                  {statusDetails.label}
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className='p-1 hover:bg-gray-100 rounded-full transition-colors'
              >
                <X className='w-5 h-5 text-gray-500' />
              </button>
            </div>

            <div className='p-4 overflow-auto max-h-[calc(80vh-4rem)]'>
              {/* Task Description */}
              {task?.description && (
                <div className='mb-6'>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Description
                  </h4>
                  <p className='text-gray-600 text-sm whitespace-pre-wrap'>
                    {task.description}
                  </p>
                </div>
              )}

              {/* Agent Details */}
              {agent && (
                <div className='mb-6'>
                  <h4 className='font-medium text-gray-900 mb-3'>
                    Agent Information
                  </h4>
                  <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Bot className='w-5 h-5 text-gray-400' />
                        <span className='font-medium text-gray-900'>
                          {agent.name}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${agentStatusDetails.bg} ${agentStatusDetails.color}`}
                      >
                        {agentStatusDetails.icon}
                        {agentStatusDetails.label}
                      </div>
                    </div>

                    <div>
                      <h5 className='text-sm font-medium text-gray-700 mb-1'>
                        Role
                      </h5>
                      <p className='text-sm text-gray-600'>{agent.role}</p>
                    </div>

                    {agent.background && (
                      <div>
                        <h5 className='text-sm font-medium text-gray-700 mb-1'>
                          Background
                        </h5>
                        <p className='text-sm text-gray-600'>
                          {agent.background}
                        </p>
                      </div>
                    )}

                    {agent.goal && (
                      <div>
                        <h5 className='text-sm font-medium text-gray-700 mb-1'>
                          Goal
                        </h5>
                        <p className='text-sm text-gray-600'>{agent.goal}</p>
                      </div>
                    )}

                    {agent.llmConfig?.model && (
                      <div className='flex items-center gap-2'>
                        <Cpu className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {agent.llmConfig.model}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Task Result */}
              {isDone && task?.result && (
                <div>
                  <h4 className='font-medium text-gray-900 mb-2'>
                    Task Result
                  </h4>
                  <pre className='whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg'>
                    {typeof task.result === 'string'
                      ? task.result
                      : JSON.stringify(task.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// import { ExternalLink } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  website?: string;
  icon?: React.ReactNode;
}

export function ToolCard({ name, description, website, icon }: ToolCardProps) {
  return (
    <div className='bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='p-2 rounded-lg bg-orange-50'>
          {icon || <Flame className='w-5 h-5 text-orange-500' />}
        </div>
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <h5 className='font-semibold text-gray-900'>{name}</h5>
            {website && (
              <a
                href={website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
              </a>
            )}
          </div>
        </div>
      </div>
      <p className='text-sm text-gray-600 leading-relaxed'>{description}</p>
    </div>
  );
}

// import { Terminal, ChevronRight, ChevronDown } from 'lucide-react';

interface WorkflowLog {
  logType: 'AgentStatusUpdate' | 'TaskStatusUpdate' | 'WorkflowStatusUpdate';
  logDescription: string;
  timestamp: number;
  metadata?: any;
}

interface WorkflowLogsProps {
  logs: WorkflowLog[];
}

export function WorkflowLogs({ logs }: WorkflowLogsProps) {
  const [showMetadata, setShowMetadata] = useState(false);
  const [feedback, setFeedback] = useState('');
  const latestLog = logs[logs.length - 1];

  if (!latestLog) return null;

  const hasMetadata =
    latestLog.metadata && Object.keys(latestLog.metadata).length > 0;
  const isTaskBlocked = latestLog.metadata?.taskStatus === 'BLOCKED';
  const taskId = latestLog.metadata?.taskId;

  const handleFeedbackSubmit = async () => {
    if (!taskId || !feedback.trim()) return;

    try {
      await blogMigrationTeam.provideFeedback(taskId, feedback);
      setFeedback('');
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  };

  return (
    <div className='bg-gray-900 rounded-xl p-4 text-gray-200 font-mono text-sm'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <Terminal className='w-4 h-4' />
          <span className='font-medium'>System Activity</span>
        </div>
        {isTaskBlocked && (
          <span className='px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs'>
            Task Blocked
          </span>
        )}
      </div>

      <div className='bg-gray-800 rounded-lg p-3'>
        <div className='flex items-start gap-2'>
          <span className='text-blue-400'>→</span>
          <p className='leading-relaxed break-words'>
            {latestLog.logDescription}
          </p>
        </div>

        {hasMetadata && (
          <div className='mt-3 border-t border-gray-700 pt-3'>
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className='flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors'
            >
              {showMetadata ? (
                <ChevronDown className='w-4 h-4' />
              ) : (
                <ChevronRight className='w-4 h-4' />
              )}
              <span className='text-xs'>Details</span>
            </button>
            {showMetadata && (
              <pre className='mt-2 p-2 bg-gray-900 rounded text-xs overflow-x-auto'>
                {JSON.stringify(latestLog.metadata, null, 2)}
              </pre>
            )}
          </div>
        )}

        <div className='mt-2 text-xs text-gray-400'>
          {new Date(latestLog.timestamp).toLocaleTimeString()}
        </div>

        {isTaskBlocked && taskId && (
          <div className='mt-4 border-t border-gray-700 pt-4'>
            <div className='flex items-center gap-2 mb-2'>
              <MessageSquare className='w-4 h-4 text-amber-400' />
              <span className='text-amber-300'>Feedback Required</span>
            </div>
            <div className='space-y-3'>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder='Provide your feedback to help the agent...'
                className='w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors resize-none'
                rows={3}
              />
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedback.trim()}
                className='w-full px-4 py-2 bg-amber-500 text-gray-900 rounded-lg font-medium hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// import { Clock, DollarSign } from 'lucide-react';

interface WorkflowStatsProps {
  stats: {
    duration: number;
    totalTokenCount: number;
    totalCost: number;
  };
}

export function WorkflowStats({ stats }: WorkflowStatsProps) {
  return (
    <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
      <h4 className='text-xl font-semibold text-gray-900 mb-4'>
        Workflow Statistics
      </h4>
      <div className='space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-50 rounded-lg'>
            <Clock className='w-5 h-5 text-blue-500' />
          </div>
          <div>
            <p className='text-sm text-gray-600'>Duration</p>
            <p className='font-semibold text-gray-900'>
              {stats.duration.toFixed(2)}s
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='p-2 bg-purple-50 rounded-lg'>
            <Cpu className='w-5 h-5 text-purple-500' />
          </div>
          <div>
            <p className='text-sm text-gray-600'>Total Tokens</p>
            <p className='font-semibold text-gray-900'>
              {stats.totalTokenCount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div className='p-2 bg-green-50 rounded-lg'>
            <DollarSign className='w-5 h-5 text-green-500' />
          </div>
          <div>
            <p className='text-sm text-gray-600'>Total Cost</p>
            <p className='font-semibold text-gray-900'>
              ${stats.totalCost.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// URL validation schema
const urlSchema = z.string().url('Please enter a valid URL');

interface MarkdownEditorProps {
  content: string;
  onChange?: (content: string) => void;
  url: string;
}

function removeFrontmatter(md: string) {
  return md.replace(/^---[\s\S]*?---\s*/, '');
}

function getSlugFromUrl(url: string): string {
  // Elimina cualquier '/' al final de la URL
  const cleanUrl = url.replace(/\/+$/, '');
  // Toma el último segmento después de dividir por '/'
  const segments = cleanUrl.split('/');
  let slug = segments.pop() || '';
  // Si el slug está vacío, intenta con el segmento anterior
  if (!slug && segments.length > 0) {
    slug = segments.pop() || '';
  }
  // Si sigue vacío, usa 'untitled'
  if (!slug) return 'untitled';
  // Normaliza el slug
  return slug.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  url
}) => {
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    // Generate slug from URL using the new function
    const slug = getSlugFromUrl(url);

    const blob = new Blob([content], { type: 'text/markdown' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className='border rounded-md p-4 bg-gray-50'>
      <div className='flex justify-end gap-2 mb-2'>
        <button
          onClick={() => setPreview(!preview)}
          className='px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors'
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
        <button
          onClick={handleCopy}
          className='px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors'
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className='px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors'
        >
          Download
        </button>
      </div>
      {preview ? (
        <div className='prose max-w-none bg-white p-4 rounded-md border'>
          <ReactMarkdown>{removeFrontmatter(content)}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={e => onChange?.(e.target.value)}
          className='w-full h-96 p-2 font-mono text-sm border rounded-md'
          placeholder='Edit your markdown content here...'
        />
      )}
    </div>
  );
};

interface ImportFormProps {
  schema: string;
}

export const ImportForm: React.FC<ImportFormProps> = ({ schema }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [workflowStats, setWorkflowStats] = useState<{
    duration: number;
    totalTokenCount: number;
    totalCost: number;
  } | null>(null);

  const useTeamStore = blogMigrationTeam.useStore();
  const {
    tasks,
    workflowLogs,
    teamWorkflowStatus,
    workflowResult,
    agents,
    setEnv,
    env
  } = useTeamStore(state => ({
    agents: state.agents,
    tasks: state.tasks,
    teamWorkflowStatus: state.teamWorkflowStatus,
    workflowResult: state.workflowResult,
    workflowLogs: state.workflowLogs,
    setEnv: state.setEnv,
    env: state.env
  }));

  const { apiKeys } = useApiKeyStore(state => ({
    apiKeys: state.apiKeys
  }));
  // Load API keys from localStorage on component mount
  useEffect(() => {
    console.log({ apiKeys2: useApiKeyStore.getState().apiKeys });
    setEnv({
      ...env,
      OPENAI_API_KEY: apiKeys.openai,
      JINA_API_KEY: apiKeys.jina
    });
  }, [apiKeys]);

  const validateUrl = (url: string) => {
    try {
      urlSchema.parse(url);
      setError('');
      return true;
    } catch (err) {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    setIsLoading(true);

    try {
      const { apiKeys } = useApiKeyStore.getState();
      const output = await blogMigrationTeam.start({
        url,
        schema,
        openaiKey: apiKeys.openai,
        jinaKey: apiKeys.jina
      });
      setResult(output.result as string);

      if (output.status === 'FINISHED' && output.stats) {
        const { costDetails, llmUsageStats, duration } = output.stats;
        setWorkflowStats({
          duration,
          totalTokenCount:
            (llmUsageStats?.inputTokens || 0) +
            (llmUsageStats?.outputTokens || 0),
          totalCost: costDetails?.totalCost || 0
        });
      }
    } catch (err) {
      setError('Failed to import: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12'>
      {/* Columna principal */}
      <div className='lg:col-span-2 space-y-8'>
        {/* Formulario de importación */}
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-xl shadow p-6 space-y-4'
        >
          <label className='block text-sm font-medium mb-1' htmlFor='url'>
            Blog Post URL
          </label>
          <input
            id='url'
            type='url'
            value={url}
            onChange={e => setUrl(e.target.value)}
            className='w-full border rounded px-3 py-2'
            placeholder='https://...'
            required
          />
          <button
            type='submit'
            className='w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition'
            disabled={isLoading}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                d='M5 12h14M12 5l7 7-7 7'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Import Post
          </button>
        </form>

        {/* System Activity */}
        {workflowLogs?.length > 0 && teamWorkflowStatus === 'RUNNING' && (
          <WorkflowLogs logs={workflowLogs} />
        )}

        {/* Resultado importado */}
        {result && (
          <div className='bg-white rounded-xl shadow p-6'>
            <MarkdownEditor content={result} onChange={setResult} url={url} />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className='space-y-6'>
        {/* API Settings */}
        <ApiSettings />

        {/* Jina Tools usando ToolCard */}
        <ToolCard
          name='Jina Tools'
          website='https://jina.ai'
          description='Helps to crawl data from any website and convert it in markdown.'
          icon={
            <img
              src='https://jina.ai/icons/favicon-128x128.png'
              alt='Jina Tools'
              className='w-6 h-6 rounded'
            />
          }
        />

        {/* Workflow Statistics */}
        {workflowStats && <WorkflowStats stats={workflowStats} />}

        {/* Task Board */}
        <div className='bg-white rounded-xl shadow p-6'>
          <div className='font-semibold text-lg mb-4'>Task Board</div>
          <div className='space-y-4'>
            {tasks.map((task, idx) => (
              <TaskCard
                key={task.id || idx}
                title={task.title}
                status={task.status}
                agent={task.agent}
                task={task}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
