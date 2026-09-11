"use client";
import { useId, useState } from "react";
import { IconX } from "./Icons";

// إدخال وسوم كشرائح: Enter أو فاصلة للإضافة، Backspace لحذف الأخيرة
export default function TagInput({ id, value, onChange, suggestions = [], max = 5, placeholder = "Add a tag…", invalid }) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const listId = useId();

  const add = (raw) => {
    const tag = raw.trim().replace(/^#/, "").slice(0, 24);
    setDraft("");
    if (!tag || value.length >= max) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  };

  const matches = draft
    ? suggestions
        .filter((s) => s.toLowerCase().includes(draft.toLowerCase()) && !value.includes(s))
        .slice(0, 5)
    : [];

  return (
    <div className={`tag-input${focused ? " is-focused" : ""}${invalid ? " is-invalid" : ""}`}>
      {value.map((tag) => (
        <span key={tag} className="tag-chip">
          #{tag}
          <button type="button" onClick={() => remove(tag)} aria-label={`Remove tag ${tag}`}>
            <IconX width={12} height={12} />
          </button>
        </span>
      ))}

      {value.length < max ? (
        <input
          id={id}
          className="tag-input-field"
          value={draft}
          placeholder={value.length ? "Add another…" : placeholder}
          onChange={(e) => setDraft(e.target.value.replace(",", ""))}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (draft) add(draft);
          }}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-invalid={invalid || undefined}
        />
      ) : (
        <span className="tag-input-full">Max {max} tags</span>
      )}

      {focused && matches.length > 0 && (
        <ul className="tag-suggest" id={listId} role="listbox">
          {matches.map((s) => (
            <li key={s}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(s)}>
                #{s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
