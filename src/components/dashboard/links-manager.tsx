"use client";

import React, { useState } from "react";
import { LinkItem } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { IconPicker } from "@/components/icon-picker";
import { RenderIcon } from "@/components/icons";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Edit2,
  Check,
  X,
  MousePointerClick,
} from "lucide-react";

interface LinksManagerProps {
  links: LinkItem[];
  onChange: (updatedLinks: LinkItem[]) => void;
  onSave?: () => void;
}

export function LinksManager({ links, onChange, onSave }: LinksManagerProps) {
  // Estado para criação de novo link
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState<string | null>(null);
  const [newOpenInNewTab, setNewOpenInNewTab] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Estado para edição inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIcon, setEditIcon] = useState<string | null>(null);
  const [editOpenInNewTab, setEditOpenInNewTab] = useState(true);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink: LinkItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `link-${Date.now()}`,
      profile_id: "",
      title: newTitle.trim(),
      url: formattedUrl,
      icon: newIcon,
      open_in_new_tab: newOpenInNewTab,
      order_index: links.length,
      is_active: true,
      clicks_count: 0,
    };

    const updated = [...links, newLink];
    onChange(updated);

    // Limpar formulário
    setNewTitle("");
    setNewUrl("");
    setNewIcon(null);
    setNewOpenInNewTab(true);
    setIsAdding(false);
  };

  const handleStartEdit = (link: LinkItem) => {
    setEditingId(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditIcon(link.icon || null);
    setEditOpenInNewTab(link.open_in_new_tab);
  };

  const handleSaveEdit = (linkId: string) => {
    let formattedUrl = editUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const updated = links.map((l) =>
      l.id === linkId
        ? {
            ...l,
            title: editTitle.trim(),
            url: formattedUrl,
            icon: editIcon,
            open_in_new_tab: editOpenInNewTab,
          }
        : l
    );
    onChange(updated);
    setEditingId(null);
  };

  const handleDelete = (linkId: string) => {
    const updated = links.filter((l) => l.id !== linkId);
    onChange(updated);
  };

  const handleToggleActive = (linkId: string, current: boolean) => {
    const updated = links.map((l) =>
      l.id === linkId ? { ...l, is_active: !current } : l
    );
    onChange(updated);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const list = [...links];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    // Reindexar
    const reindexed = list.map((item, idx) => ({ ...item, order_index: idx }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-6">
      {/* Botão de abrir modal/card para adicionar link */}
      {!isAdding ? (
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" /> Adicionar Novo Link
        </Button>
      ) : (
        <form
          onSubmit={handleAddLink}
          className="p-5 rounded-2xl bg-zinc-900 border border-indigo-500/40 shadow-xl space-y-4 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" /> Novo Botão de Link
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-zinc-400">Título do Botão</Label>
              <Input
                placeholder="Ex: Meu Instagram Oficial, Meu Portfólio, Loja..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="text-xs text-zinc-400">URL / Destino</Label>
              <Input
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-400">Ícone</Label>
                <IconPicker value={newIcon} onChange={setNewIcon} />
              </div>

              {/* Opção para abrir o link na mesma aba ou em outra aba */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                <div className="space-y-0.5">
                  <Label className="text-xs text-zinc-200 block">Abrir em nova aba</Label>
                  <span className="text-[11px] text-zinc-400 block">
                    {newOpenInNewTab ? "Sim (target=_blank)" : "Não (mesma aba)"}
                  </span>
                </div>
                <Switch
                  checked={newOpenInNewTab}
                  onCheckedChange={setNewOpenInNewTab}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
              Salvar Link
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Links Existentes */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 text-zinc-500">
            Nenhum link configurado. Clique em &ldquo;Adicionar Novo Link&rdquo; acima.
          </div>
        ) : (
          links.map((link, index) => {
            const isEditing = editingId === link.id;

            if (isEditing) {
              return (
                <div
                  key={link.id}
                  className="p-4 rounded-2xl bg-zinc-900 border border-indigo-500/50 space-y-3 shadow-lg"
                >
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Título do Link"
                  />
                  <Input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="URL"
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <IconPicker value={editIcon} onChange={setEditIcon} />

                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-zinc-300">Nova aba</Label>
                      <Switch
                        checked={editOpenInNewTab}
                        onCheckedChange={setEditOpenInNewTab}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        onClick={() => handleSaveEdit(link.id)}
                      >
                        <Check className="w-4 h-4" /> Salvar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={link.id}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                  link.is_active
                    ? "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                    : "bg-zinc-900/30 border-zinc-800/40 opacity-60"
                }`}
              >
                {/* Botões de Ordenação */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-20 hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === links.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-20 hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Ícone */}
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 text-indigo-400">
                  <RenderIcon iconId={link.icon} className="w-5 h-5" />
                </div>

                {/* Dados do Link */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-zinc-100 truncate flex items-center gap-1.5">
                    {link.title}
                    {link.open_in_new_tab ? (
                      <span
                        className="text-[10px] text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-1.5 py-0.2 rounded"
                        title="Abre em nova aba"
                      >
                        Nova Aba
                      </span>
                    ) : (
                      <span
                        className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded"
                        title="Abre na mesma aba"
                      >
                        Mesma Aba
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>

                {/* Contador de cliques */}
                <div
                  className="hidden sm:flex items-center gap-1 text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-lg"
                  title="Total de cliques neste link"
                >
                  <MousePointerClick className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{link.clicks_count || 0}</span>
                </div>

                {/* Ações (Ativar/Inativar, Editar, Deletar) */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={link.is_active}
                    onCheckedChange={() => handleToggleActive(link.id, link.is_active)}
                    title={link.is_active ? "Link visível" : "Link oculto"}
                  />

                  <button
                    type="button"
                    onClick={() => handleStartEdit(link)}
                    className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Editar link"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Excluir link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
