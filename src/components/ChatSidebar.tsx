'use client';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="w-full h-screen soff p-4 text-gray-200 bg-gray-700">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex max-h-screen pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn('rounded-lg p-3 text-slate-300 flex items-center', {
                'bg-gray-900 text-white': chat.id === chatId,
                'hover:text-white': chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.documentName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
