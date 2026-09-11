"use client";

/*
 * صفحة إنشاء / تعديل منشور
 * ---------------------------------------------------------------
 * الإرسال: POST {API_URL}/api/posts            (منشور جديد)
 *          PUT  {API_URL}/api/posts/:id        (تعديل ?edit=:id)
 * الهيدر:  Authorization: Bearer <token>
 * الجسم:   multipart/form-data بالحقول التالية
 *   type          code | question | tutorial | project | meme
 *   title         نص (10 – 150 حرف)
 *   content       نص (20 – 5000 حرف)
 *   tags          "react,node,css" — حتى 5 وسوم مفصولة بفواصل
 *   codeSnippet   اختياري
 *   codeLanguage  اختياري (javascript, python, …)
 *   errorCode     اختياري
 *   image         ملف اختياري (صورة، حتى 5MB)
 * الرد المتوقع: 2xx عند النجاح، و { error } أو { message } عند الفشل
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/components/AppShell";
import PostCard from "@/components/PostCard";
import TagInput from "@/components/TagInput";
import {
  IconCode,
  IconQuestion,
  IconBook,
  IconLayers,
  IconSmile,
  IconImage,
  IconAlert,
  IconUpload,
  IconX,
  IconCheck,
  IconBold,
  IconItalic,
  IconList,
  IconLink,
  IconEye,
  IconEdit,
  IconArrowLeft,
  IconSparkle,
} from "@/components/Icons";
import { composerTypes, sidebarTags, codeLanguages } from "@/data/mockData";
import { dashboardPosts } from "@/data/dashboardData";
import { API_URL, authHeaders, readError } from "@/lib/api";
import styles from "./post.module.css";

const LIMITS = {
  titleMin: 10,
  titleMax: 150,
  contentMin: 20,
  contentMax: 5000,
  codeMax: 5000,
  tags: 5,
  imageBytes: 5 * 1024 * 1024,
};

const DRAFT_KEY = "devflow:post-draft";

const typeIcons = { code: IconCode, question: IconQuestion, book: IconBook, layers: IconLayers, smile: IconSmile };

const EMPTY = {
  type: "code",
  title: "",
  content: "",
  tags: [],
  codeSnippet: "",
  codeLanguage: "javascript",
  errorCode: "",
  showCode: false,
  showError: false,
};

function validate(form, image) {
  const errors = {};
  const title = form.title.trim();
  const content = form.content.trim();

  if (!title) errors.title = "Give your post a title.";
  else if (title.length < LIMITS.titleMin) errors.title = `Title needs at least ${LIMITS.titleMin} characters.`;
  else if (title.length > LIMITS.titleMax) errors.title = `Keep the title under ${LIMITS.titleMax} characters.`;

  if (!content) errors.content = "Write something for your post.";
  else if (content.length < LIMITS.contentMin) errors.content = `Add a bit more detail (at least ${LIMITS.contentMin} characters).`;
  else if (content.length > LIMITS.contentMax) errors.content = `Content is too long (max ${LIMITS.contentMax.toLocaleString("en-US")}).`;

  if (form.showCode && !form.codeSnippet.trim()) errors.codeSnippet = "Paste your code, or remove the code block.";
  if (form.showCode && form.codeSnippet.length > LIMITS.codeMax) errors.codeSnippet = "Code is too long.";
  if (form.showError && !form.errorCode.trim()) errors.errorCode = "Paste the error, or remove the error block.";

  if (image && image.size > LIMITS.imageBytes) errors.image = "Image must be 5 MB or smaller.";
  if (image && !image.type.startsWith("image/")) errors.image = "That file isn't an image.";

  return errors;
}

function Counter({ value, max }) {
  const cls = value > max ? " over" : value > max * 0.9 ? " warn" : "";
  return (
    <span className={`counter${cls}`}>
      {value.toLocaleString("en-US")}/{max.toLocaleString("en-US")}
    </span>
  );
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p className="field-error" id={id} role="alert">
      <IconAlert width={13} height={13} />
      {children}
    </p>
  );
}

function PostEditor() {
  const user = useUser();
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const editing = editId ? dashboardPosts.find((p) => String(p.id) === editId) : null;

  const [form, setForm] = useState(() => {
    if (editing) return { ...EMPTY, type: editing.category.toLowerCase(), title: editing.title };
    const preset = params.get("type");
    return composerTypes.some((t) => t.key === preset) ? { ...EMPTY, type: preset } : EMPTY;
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [mode, setMode] = useState("write");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draftState, setDraftState] = useState(null); // null | "restored" | "saved"
  const dirtyRef = useRef(false);
  const contentRef = useRef(null);
  const fileRef = useRef(null);

  const errors = useMemo(() => validate(form, image), [form, image]);
  const show = (key) => (submitted ? errors[key] : null);

  const set = useCallback((key, value) => {
    dirtyRef.current = true;
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  /* ---------- المسودة: استرجاع + حفظ تلقائي ---------- */
  useEffect(() => {
    if (editing) return;
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved && (saved.title || saved.content)) {
        setForm((f) => ({ ...f, ...saved, type: params.get("type") || saved.type }));
        setDraftState("restored");
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editing || !dirtyRef.current) return;
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setDraftState("saved");
    }, 800);
    return () => clearTimeout(t);
  }, [form, editing]);

  // تحذير قبل مغادرة الصفحة إذا في تغييرات ما انحفظت عالسيرفر
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!dirtyRef.current || busy) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [busy]);

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setForm({ ...EMPTY, type: form.type });
    dirtyRef.current = false;
    setDraftState(null);
    setSubmitted(false);
  };

  /* ---------- الصورة ---------- */
  useEffect(() => () => imageUrl && URL.revokeObjectURL(imageUrl), [imageUrl]);

  const pickImage = (file) => {
    if (!file) return;
    dirtyRef.current = true;
    setImage(file);
    setImageUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleImage = () => {
    if (showImage) removeImage();
    setShowImage((v) => !v);
  };

  /* ---------- أدوات تنسيق المحتوى ---------- */
  const wrap = (before, after = before, placeholder = "text") => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    set("content", value.slice(0, s) + before + selected + after + value.slice(e));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };

  const bulletList = () => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(lineStart, e) || "item";
    const listed = block
      .split("\n")
      .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
      .join("\n");
    set("content", value.slice(0, lineStart) + listed + value.slice(e));
    requestAnimationFrame(() => el.focus());
  };

  // Tab داخل محرر الكود يضيف مسافتين بدل ما ينقل التركيز
  const onCodeKeyDown = (e) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end, value } = el;
    set("codeSnippet", value.slice(0, s) + "  " + value.slice(end));
    requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
  };

  /* ---------- الإرسال ---------- */
  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const keys = Object.keys(errors);
    if (keys.length) {
      setMode("write");
      toast.error("Please fix the highlighted fields.");
      requestAnimationFrame(() => document.getElementById(`f-${keys[0]}`)?.focus());
      return;
    }

    const body = new FormData();
    body.append("type", form.type);
    body.append("title", form.title.trim());
    body.append("content", form.content.trim());
    body.append("tags", form.tags.join(","));
    if (form.showCode) {
      body.append("codeSnippet", form.codeSnippet);
      body.append("codeLanguage", form.codeLanguage);
    }
    if (form.showError) body.append("errorCode", form.errorCode);
    if (image) body.append("image", image);

    setBusy(true);
    try {
      const res = await fetch(editing ? `${API_URL}/api/posts/${editing.id}` : `${API_URL}/api/posts`, {
        method: editing ? "PUT" : "POST",
        headers: authHeaders(),
        body,
      });

      if (!res.ok) {
        toast.error(await readError(res, "Couldn't publish your post."));
        return;
      }

      dirtyRef.current = false;
      localStorage.removeItem(DRAFT_KEY);
      toast.success(editing ? "Post updated" : "Post published 🎉");
      router.push("/dashboard/posts");
    } catch {
      toast.error("Can't reach the server right now. Your draft is saved.");
    } finally {
      setBusy(false);
    }
  };

  const previewPost = {
    id: "preview",
    author: { name: user.name, avatar: user.avatar },
    type: form.type,
    title: form.title.trim() || "Your title will appear here",
    body: form.content.trim() || "Start writing to see your post come to life…",
    code: form.showCode && form.codeSnippet ? { lang: form.codeLanguage, value: form.codeSnippet } : null,
    error: form.showError && form.errorCode ? form.errorCode : null,
    image: imageUrl || null,
    tags: form.tags,
    likes: 0,
    comments: 0,
  };

  const checklist = [
    { label: "Pick a post type", done: Boolean(form.type) },
    { label: "Write a clear title", done: !errors.title },
    { label: "Explain the details", done: form.content.trim().length >= LIMITS.contentMin },
    { label: "Add at least one tag", done: form.tags.length > 0 },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className={styles.page}>
      <Link href="/dashboard/posts" className="back-link">
        <IconArrowLeft width={15} height={15} /> My posts
      </Link>

      <div className="page-head">
        <div>
          <h1 className="page-title">{editing ? "Edit post" : "Create a post"}</h1>
          <p className="page-sub">Share code, ask a question, or show off what you built.</p>
        </div>
        <div className={styles.modeSwitch} role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "write"}
            className={mode === "write" ? styles.modeActive : ""}
            onClick={() => setMode("write")}
          >
            <IconEdit width={15} height={15} /> Write
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "preview"}
            className={mode === "preview" ? styles.modeActive : ""}
            onClick={() => setMode("preview")}
          >
            <IconEye width={15} height={15} /> Preview
          </button>
        </div>
      </div>

      {draftState === "restored" && (
        <div className={styles.banner} role="status">
          <IconSparkle width={16} height={16} />
          <span>We restored your unsaved draft.</span>
          <button type="button" className="link-btn" onClick={discardDraft}>
            Discard draft
          </button>
        </div>
      )}

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={submit} noValidate>
          {mode === "preview" ? (
            <div className={styles.preview}>
              <PostCard post={previewPost} preview />
            </div>
          ) : (
            <>
              {/* نوع المنشور */}
              <fieldset className={`card ${styles.section}`}>
                <legend className={styles.legend}>What are you posting?</legend>
                <div className={styles.types} role="radiogroup">
                  {composerTypes.map((t) => {
                    const Icon = typeIcons[t.icon];
                    const active = form.type === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={`${styles.typeCard} type-${t.key}${active ? ` ${styles.typeActive}` : ""}`}
                        onClick={() => set("type", t.key)}
                      >
                        <span className={styles.typeIcon}>
                          <Icon width={18} height={18} />
                        </span>
                        <span className={styles.typeLabel}>{t.label}</span>
                        <span className={styles.typeHint}>{t.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* العنوان والمحتوى */}
              <div className={`card ${styles.section}`}>
                <div className="field">
                  <label className="field-label" htmlFor="f-title">
                    Title
                    <Counter value={form.title.length} max={LIMITS.titleMax} />
                  </label>
                  <input
                    id="f-title"
                    className={`input ${styles.titleInput}`}
                    placeholder={
                      form.type === "question" ? "e.g. Why does my useEffect run twice?" : "e.g. How I fixed CORS in Express"
                    }
                    value={form.title}
                    maxLength={LIMITS.titleMax + 20}
                    onChange={(e) => set("title", e.target.value)}
                    aria-invalid={Boolean(show("title"))}
                    aria-describedby="e-title"
                    autoFocus={!editing}
                  />
                  <FieldError id="e-title">{show("title")}</FieldError>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="f-content">
                    Content
                    <Counter value={form.content.length} max={LIMITS.contentMax} />
                  </label>
                  <div className={`${styles.editor}${show("content") ? ` ${styles.editorInvalid}` : ""}`}>
                    <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
                      <button type="button" onClick={() => wrap("**")} aria-label="Bold" title="Bold">
                        <IconBold width={15} height={15} />
                      </button>
                      <button type="button" onClick={() => wrap("_")} aria-label="Italic" title="Italic">
                        <IconItalic width={15} height={15} />
                      </button>
                      <button type="button" onClick={() => wrap("`", "`", "code")} aria-label="Inline code" title="Inline code">
                        <IconCode width={15} height={15} />
                      </button>
                      <button type="button" onClick={bulletList} aria-label="Bullet list" title="Bullet list">
                        <IconList width={15} height={15} />
                      </button>
                      <button type="button" onClick={() => wrap("[", "](https://)", "link text")} aria-label="Link" title="Link">
                        <IconLink width={15} height={15} />
                      </button>
                      <span className={styles.toolbarHint}>Markdown supported</span>
                    </div>
                    <textarea
                      id="f-content"
                      ref={contentRef}
                      className={styles.editorArea}
                      rows={9}
                      placeholder={
                        form.type === "question"
                          ? "Describe what you tried, what you expected, and what actually happened…"
                          : "Write your post…"
                      }
                      value={form.content}
                      onChange={(e) => set("content", e.target.value)}
                      aria-invalid={Boolean(show("content"))}
                      aria-describedby="e-content"
                    />
                  </div>
                  <FieldError id="e-content">{show("content")}</FieldError>
                </div>
              </div>

              {/* المرفقات */}
              <div className={`card ${styles.section}`}>
                <div className={styles.attachHead}>
                  <div>
                    <h2 className={styles.legend}>Attachments</h2>
                    <p className="field-hint">Optional — add what helps people understand.</p>
                  </div>
                  <div className={styles.attachBtns}>
                    <button
                      type="button"
                      className={`${styles.attachBtn}${form.showCode ? ` ${styles.attachOn}` : ""}`}
                      aria-pressed={form.showCode}
                      onClick={() => set("showCode", !form.showCode)}
                    >
                      <IconCode width={15} height={15} /> Code
                    </button>
                    <button
                      type="button"
                      className={`${styles.attachBtn} ${styles.attachDanger}${form.showError ? ` ${styles.attachOnDanger}` : ""}`}
                      aria-pressed={form.showError}
                      onClick={() => set("showError", !form.showError)}
                    >
                      <IconAlert width={15} height={15} /> Error
                    </button>
                    <button
                      type="button"
                      className={`${styles.attachBtn}${showImage ? ` ${styles.attachOn}` : ""}`}
                      aria-pressed={showImage}
                      onClick={toggleImage}
                    >
                      <IconImage width={15} height={15} /> Image
                    </button>
                  </div>
                </div>

                {form.showCode && (
                  <div className={`field ${styles.block}`}>
                    <div className={styles.blockHead}>
                      <label className="field-label" htmlFor="f-codeSnippet">
                        Code snippet
                      </label>
                      <select
                        className={`select ${styles.langSelect}`}
                        value={form.codeLanguage}
                        onChange={(e) => set("codeLanguage", e.target.value)}
                        aria-label="Code language"
                      >
                        {codeLanguages.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <button type="button" className={styles.blockRemove} onClick={() => set("showCode", false)} aria-label="Remove code block">
                        <IconX width={14} height={14} />
                      </button>
                    </div>
                    <textarea
                      id="f-codeSnippet"
                      className={`textarea ${styles.codeArea}`}
                      rows={8}
                      spellCheck={false}
                      placeholder="// Paste your code here — Tab inserts spaces"
                      value={form.codeSnippet}
                      onChange={(e) => set("codeSnippet", e.target.value)}
                      onKeyDown={onCodeKeyDown}
                      aria-invalid={Boolean(show("codeSnippet"))}
                      aria-describedby="e-codeSnippet"
                    />
                    <FieldError id="e-codeSnippet">{show("codeSnippet")}</FieldError>
                  </div>
                )}

                {form.showError && (
                  <div className={`field ${styles.block}`}>
                    <div className={styles.blockHead}>
                      <label className="field-label" htmlFor="f-errorCode">
                        Error message / stack trace
                      </label>
                      <button type="button" className={styles.blockRemove} onClick={() => set("showError", false)} aria-label="Remove error block">
                        <IconX width={14} height={14} />
                      </button>
                    </div>
                    <textarea
                      id="f-errorCode"
                      className={`textarea ${styles.codeArea} ${styles.errorArea}`}
                      rows={4}
                      spellCheck={false}
                      placeholder="TypeError: Cannot read properties of undefined (reading 'map')"
                      value={form.errorCode}
                      onChange={(e) => set("errorCode", e.target.value)}
                      aria-invalid={Boolean(show("errorCode"))}
                      aria-describedby="e-errorCode"
                    />
                    <FieldError id="e-errorCode">{show("errorCode")}</FieldError>
                  </div>
                )}

                {showImage && (
                  <div className={`field ${styles.block}`}>
                    {imageUrl ? (
                      <div className={styles.imagePreview}>
                        <img src={imageUrl} alt="Selected upload preview" />
                        <div className={styles.imageMeta}>
                          <span>
                            {image.name} · {(image.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <div>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                              Replace
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={removeImage}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="f-image"
                        className={`${styles.dropzone}${dragging ? ` ${styles.dropActive}` : ""}`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          pickImage(e.dataTransfer.files?.[0]);
                        }}
                      >
                        <span className={styles.dropIcon}>
                          <IconUpload width={22} height={22} />
                        </span>
                        <strong>Drop an image here, or click to browse</strong>
                        <span>PNG, JPG, GIF or WebP · up to 5 MB</span>
                      </label>
                    )}
                    <input
                      id="f-image"
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => pickImage(e.target.files?.[0])}
                    />
                    <FieldError id="e-image">{errors.image}</FieldError>
                  </div>
                )}
              </div>

              {/* الوسوم */}
              <div className={`card ${styles.section}`}>
                <div className="field">
                  <label className="field-label" htmlFor="f-tags">
                    Tags
                    <span className="counter">
                      {form.tags.length}/{LIMITS.tags}
                    </span>
                  </label>
                  <TagInput
                    id="f-tags"
                    value={form.tags}
                    onChange={(tags) => set("tags", tags)}
                    suggestions={sidebarTags}
                    max={LIMITS.tags}
                    placeholder="react, node, css…"
                  />
                  <p className="field-hint">Press Enter or comma to add. Tags help people find your post.</p>
                </div>
              </div>
            </>
          )}

          <div className={styles.actions}>
            <span className={styles.autosave} aria-live="polite">
              {!editing && draftState === "saved" && (
                <>
                  <IconCheck width={13} height={13} /> Draft saved
                </>
              )}
            </span>
            <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy || Boolean(errors.image)}>
              {busy && <span className="spinner" />}
              {busy ? (editing ? "Saving…" : "Publishing…") : editing ? "Save changes" : "Publish post"}
            </button>
          </div>
        </form>

        <aside className={styles.aside} aria-label="Posting tips">
          <div className={`card ${styles.tipsCard}`}>
            <div className={styles.progressHead}>
              <strong>Ready to publish</strong>
              <span>
                {doneCount}/{checklist.length}
              </span>
            </div>
            <div className="meter-track" aria-hidden="true">
              <div className="meter-fill" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
            </div>
            <ul className={styles.checklist}>
              {checklist.map((c) => (
                <li key={c.label} className={c.done ? styles.done : ""}>
                  <span className={styles.checkDot}>{c.done && <IconCheck width={11} height={11} />}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          </div>

          <div className={`card ${styles.tipsCard}`}>
            <strong className={styles.tipsTitle}>Tips for a great post</strong>
            <ul className={styles.tips}>
              <li>Put the key question or result in the title.</li>
              <li>Share the smallest code that shows the problem.</li>
              <li>Paste errors as text — not screenshots — so people can search them.</li>
              <li>Be kind. Everyone was a beginner once.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function AddPostPage() {
  return (
    <Suspense fallback={null}>
      <PostEditor />
    </Suspense>
  );
}
