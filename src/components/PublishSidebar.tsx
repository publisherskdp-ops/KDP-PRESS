import React from "react";
import { User, BookOpen, DollarSign, CheckCircle2 } from "lucide-react";

interface PublishSidebarProps {
  activeSection: number;
  completedSections: boolean[];
  onSectionChange: (section: number) => void;
}

export default function PublishSidebar({
  activeSection,
  completedSections,
  onSectionChange,
}: PublishSidebarProps) {
  const sections = [
    { id: 1, label: "Author Details", icon: User },
    { id: 2, label: "Specifications & Assets", icon: BookOpen },
    { id: 3, label: "Pricing & Summary", icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 space-y-2">
      <div className="mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
          Publishing Workflow
        </h3>
        <div className="h-1 bg-gradient-to-r from-sky-500 to-transparent rounded-full" />
      </div>

      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isCompleted = completedSections[section.id - 1];

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-sky-50 border-l-4 border-l-sky-500"
                : "hover:bg-slate-50 border-l-4 border-l-transparent"
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                isActive
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                  : isCompleted
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
            </div>
            <div className="flex-1 text-left">
              <p
                className={`text-sm font-bold transition-colors ${
                  isActive ? "text-slate-900" : "text-slate-600"
                }`}
              >
                {section.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isCompleted && "Completed"}
                {isActive && "In Progress"}
                {!isCompleted && !isActive && "Pending"}
              </p>
            </div>
          </button>
        );
      })}
    </aside>
  );
}