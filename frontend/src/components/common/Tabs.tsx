import React, { useState } from 'react';
import { Activity, Map, Settings, PieChart, Package, Image } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(
    tabs.findIndex((tab) => tab.id === activeTab)
  );

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

   React.useEffect(() => {
     const index = tabs.findIndex((tab) => tab.id === activeTab);
     setActiveIndex(index);

     const container = document.getElementById('tabs-container');
     const tabButtons = container?.querySelectorAll('[data-tab-index]');

     if (tabButtons && index >= 0) {
       const activeButton = tabButtons[index] as HTMLElement;
       setIndicatorStyle({
         left: activeButton.offsetLeft,
         width: activeButton.offsetWidth,
       });
     }
   }, [activeTab, tabs]);

  return (
    <div id="tabs-container" className="relative">
      <nav className="flex space-x-2 border-b border-slate-700 pb-1">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            data-tab-index={index}
            onClick={() => {
              onTabChange(tab.id);
              setActiveIndex(index);
            }}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
      <div
        className="absolute bottom-0 h-1 bg-indigo-500 rounded-full transition-all duration-300 ease-out"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  );
}
