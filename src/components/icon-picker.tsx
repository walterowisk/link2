"use client";

import React, { useState } from "react";
import { AVAILABLE_ICONS, RenderIcon } from "./icons";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

interface IconPickerProps {
  value?: string | null;
  onChange: (iconId: string | null) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = AVAILABLE_ICONS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-zinc-200 text-sm transition-all shadow-sm"
        >
          <RenderIcon iconId={value} className="w-5 h-5 text-indigo-400" />
          <span>{value ? AVAILABLE_ICONS.find((i) => i.id === value)?.name || value : "Escolher Ícone"}</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-2 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800/60 transition-colors"
            title="Remover ícone"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 w-72 max-w-[90vw] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="relative mb-2.5">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <Input
              type="text"
              placeholder="Buscar ícone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto pr-1">
            {filteredIcons.map((item) => {
              const IconComp = item.icon;
              const isSelected = value === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                  }}
                  title={item.name}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <IconComp className="w-5 h-5 mb-1" />
                  <span className="text-[10px] truncate w-full">{item.name}</span>
                </button>
              );
            })}
            {filteredIcons.length === 0 && (
              <p className="col-span-4 text-center py-4 text-xs text-zinc-500">
                Nenhum ícone encontrado.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
