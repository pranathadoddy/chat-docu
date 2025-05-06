import { cn } from '@/lib/utils';
import { Message } from 'ai/react';
import { Loader2 } from 'lucide-react';
import React from 'react';

type Props = {
  messages: Message[];
  isLoading?: boolean;
  status: 'submitted' | 'streaming' | 'ready' | 'error';
};

const MessageList = ({ messages, isLoading, status }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  console.log('status', status);
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn('flex', {
              'justify-end pl-10': message.role === 'user',
              'justify-start pr-10': message.role === 'assistant',
            })}
          >
            <div
              className={cn(
                'rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10',
                {
                  'bg-blue-600 text-white': message.role === 'user',
                }
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}

      {status === 'streaming' ||
        (status === 'submitted' && (
          <div className="flex justify-start pr-10">
            <div className="rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default MessageList;
