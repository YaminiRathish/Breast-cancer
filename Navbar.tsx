
import React from 'react';
import { Activity, Home, Menu, X, LogOut, Database, ShieldAlert, Mail } from 'lucide-react';
import { AppView } from './types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  unreadMailCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout, isAdmin, unreadMailCount }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: AppView.HOME, label: 'Portal', icon: Home },
    { id: AppView.DIAGNOSIS, label: 'Diagnosis', icon: Activity },
    { id: AppView.HISTORY, label: 'Database', icon: Database },
  ];

  if (isAdmin) {
    navItems.push({ id: AppView.ADMIN_PANEL, label: 'Onboarding', icon: ShieldAlert });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => setView(AppView.HOME)}>
              <div className="w-10 h-10 bg-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-200 group-hover:scale-105 transition-transform">
                X
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-xl text-slate-900 block leading-tight tracking-tighter">OncoVision</span>
                <span className="text-[10px] text-pink-600 font-black uppercase tracking-[0.2em]">Hybrid XAI Engine</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentView === item.id
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setView(AppView.MAILBOX)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
                currentView === AppView.MAILBOX
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Mail size={14} />
              Mailbox
              {unreadMailCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full animate-pulse"></span>
              )}
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-4"></div>
            
            <button 
              onClick={onLogout}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                currentView === item.id
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setView(AppView.MAILBOX);
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
              currentView === AppView.MAILBOX
                ? 'text-pink-600 bg-pink-50'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Mail size={18} />
            Mailbox
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};
