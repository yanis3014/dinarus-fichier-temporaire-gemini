'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  prefix?: string;
}

export default function StatCard({ title, value, change, icon, prefix = '' }: StatCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  const isPositive = change >= 0;
    return (
    <div className="admin-card overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-dinary-turquoise/40">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{prefix}{formattedValue}</p>
        </div>
        <div className="p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center mt-6">
        <div className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${
          isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        } transition-all duration-300 hover:shadow-md`}>
          {isPositive ? (
            <ArrowUpRight size={14} className="mr-1" />
          ) : (
            <ArrowDownRight size={14} className="mr-1" />
          )}
          {Math.abs(change)}%
        </div>
        <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
      </div>
      
      {/* Mini chart line as visual indicator */}
      <div className="mt-4">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ 
              width: `${Math.min(Math.abs(change) * 3, 100)}%`,
              transition: 'width 1s ease-in-out'
            }}
          ></div>
        </div>
        {/* Small sparkline dots */}
        <div className="flex justify-between items-center mt-1.5">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-1 rounded-full ${
                i < Math.ceil(Math.min(Math.abs(change) * 0.2, 5)) 
                ? (isPositive ? 'bg-green-500' : 'bg-red-500') 
                : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}