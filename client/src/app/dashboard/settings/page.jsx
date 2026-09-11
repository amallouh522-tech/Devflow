"use client";

/*
 * الإعدادات — واجهة فقط.
 * TODO(api): PUT /api/users/me (FormData: name, username, role, bio, skills, website, github, avatar)
 * TODO(api): PUT /api/users/me/password ({ currentPassword, newPassword })
 * TODO(api): DELETE /api/users/me
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import TagInput from "@/components/TagInput";
import ConfirmModal from "@/components/ConfirmModal";
import { IconUpload, IconGlobe, IconGithub, IconLock, IconAlert, IconCheck } from "@/components/Icons";
import { sidebarTags } from "@/data/mockData";
import { clearSession } from "@/lib/auth";
import styles from "./settings.module.css";

const BIO_MAX = 160;

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { score: Math.min(score, 4), label: labels[score] };
}

function Switch({ checked, onChange, label, hint }) {
  return (
    <div className={styles.switchRow}>
      <div>
        <span className={styles.switchLabel}>{label}</span>
        {hint && <span className="field-hint">{hint}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />
    </div>
  );
}

export default function SettingsPage() {
  const user = useUser();
  const router = useRouter();
  const fileRef = useRef(null);

  const initial = useMemo(
    () => ({
      name: user.name,
      username: user.handle.replace("@", ""),
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      website: "",
      github: "",
      notifyComments: true,
      notifyLikes: true,
      notifyFollows: false,
      weeklyDigest: true,
    }),
    [user]
  );

  const [form, setForm] = useState(initial);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const dirty = avatar !== null || JSON.stringify(form) !== JSON.stringify(initial);
  const strength = passwordStrength(pw.next);
  const pwMismatch = pw.confirm && pw.next !== pw.confirm;
  const usernameError = form.username && !/^[a-zA-Z0-9_.]{3,20}$/.test(form.username)
    ? "3–20 characters: letters, numbers, dots and underscores."
    : null;

  useEffect(() => () => avatarUrl && URL.revokeObjectURL(avatarUrl), [avatarUrl]);

  const pickAvatar = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 2 * 1024 * 1024) return toast.error("Avatar must be 2 MB or smaller.");
    setAvatar(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const discard = () => {
    setForm(initial);
    setAvatar(null);
    setAvatarUrl(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (usernameError || !form.name.trim()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    // TODO(api): استبدل هالانتظار بطلب PUT /api/users/me
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setAvatar(null);
    toast.success("Profile saved");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (strength.score < 2 || pwMismatch || !pw.current) return;
    setPwSaving(true);
    // TODO(api): PUT /api/users/me/password
    await new Promise((r) => setTimeout(r, 700));
    setPwSaving(false);
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password updated");
  };

  const deleteAccount = () => {
    // TODO(api): DELETE /api/users/me ثم امسح الجلسة
    clearSession();
    router.replace("/sign/register");
  };

  return (
    <div className={styles.page}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your public profile and account.</p>
        </div>
      </div>

      <form id="profile-form" onSubmit={save} className={styles.stack}>
        {/* الملف الشخصي */}
        <section className={`card ${styles.section}`} aria-labelledby="s-profile">
          <header className={styles.sectionHead}>
            <h2 id="s-profile">Public profile</h2>
            <p>This is how other developers see you on DevFlow.</p>
          </header>

          <div className={styles.avatarRow}>
            <Avatar name={form.name} src={avatarUrl || user.avatar} size="lg" />
            <div className={styles.avatarActions}>
              <div className={styles.avatarBtns}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}>
                  <IconUpload width={14} height={14} /> Upload new
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setAvatar(null);
                      setAvatarUrl(null);
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <span className="field-hint">Square image, at least 200×200 · max 2 MB</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => pickAvatar(e.target.files?.[0])} />
          </div>

          <div className={styles.grid}>
            <div className="field">
              <label className="field-label" htmlFor="s-name">Display name</label>
              <input id="s-name" className="input" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!form.name.trim()} />
              {!form.name.trim() && <p className="field-error"><IconAlert width={13} height={13} /> Name can&apos;t be empty.</p>}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="s-username">Username</label>
              <div className={styles.prefixInput}>
                <span>@</span>
                <input
                  id="s-username"
                  className="input"
                  value={form.username}
                  onChange={(e) => set("username", e.target.value.trim())}
                  aria-invalid={Boolean(usernameError)}
                  autoComplete="username"
                />
              </div>
              {usernameError && <p className="field-error"><IconAlert width={13} height={13} /> {usernameError}</p>}
            </div>

            <div className={`field ${styles.full}`}>
              <label className="field-label" htmlFor="s-role">Headline</label>
              <input id="s-role" className="input" placeholder="e.g. Full Stack Developer" value={form.role} onChange={(e) => set("role", e.target.value)} />
            </div>

            <div className={`field ${styles.full}`}>
              <label className="field-label" htmlFor="s-bio">
                Bio
                <span className={`counter${form.bio.length > BIO_MAX ? " over" : ""}`}>
                  {form.bio.length}/{BIO_MAX}
                </span>
              </label>
              <textarea id="s-bio" className={`textarea ${styles.bio}`} value={form.bio} maxLength={BIO_MAX} onChange={(e) => set("bio", e.target.value)} rows={3} />
            </div>

            <div className={`field ${styles.full}`}>
              <label className="field-label" htmlFor="s-skills">
                Skills <span className="optional">up to 8</span>
              </label>
              <TagInput id="s-skills" value={form.skills} onChange={(v) => set("skills", v)} suggestions={sidebarTags} max={8} placeholder="Add a skill…" />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="s-website">Website <span className="optional">optional</span></label>
              <div className={styles.iconInput}>
                <IconGlobe width={15} height={15} />
                <input id="s-website" type="url" className="input" placeholder="https://yoursite.dev" value={form.website} onChange={(e) => set("website", e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="s-github">GitHub <span className="optional">optional</span></label>
              <div className={styles.iconInput}>
                <IconGithub width={15} height={15} />
                <input id="s-github" className="input" placeholder="username" value={form.github} onChange={(e) => set("github", e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* الإشعارات */}
        <section className={`card ${styles.section}`} aria-labelledby="s-notif">
          <header className={styles.sectionHead}>
            <h2 id="s-notif">Notifications</h2>
            <p>Choose what DevFlow emails you about.</p>
          </header>
          <div className={styles.switches}>
            <Switch label="Comments on my posts" hint="When someone replies to you." checked={form.notifyComments} onChange={(v) => set("notifyComments", v)} />
            <Switch label="Likes" hint="A daily summary, never one email per like." checked={form.notifyLikes} onChange={(v) => set("notifyLikes", v)} />
            <Switch label="New followers" checked={form.notifyFollows} onChange={(v) => set("notifyFollows", v)} />
            <Switch label="Weekly digest" hint="Top posts from people you follow." checked={form.weeklyDigest} onChange={(v) => set("weeklyDigest", v)} />
          </div>
        </section>
      </form>

      {/* كلمة المرور — نموذج منفصل */}
      <form onSubmit={changePassword} className={`card ${styles.section}`} aria-labelledby="s-pw">
        <header className={styles.sectionHead}>
          <h2 id="s-pw">Password</h2>
          <p>Use at least 8 characters with a mix of letters, numbers and symbols.</p>
        </header>
        <div className={styles.grid}>
          <div className={`field ${styles.full}`}>
            <label className="field-label" htmlFor="s-pw-current">Current password</label>
            <input id="s-pw-current" type="password" className="input" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="s-pw-new">New password</label>
            <input id="s-pw-new" type="password" className="input" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            {pw.next && (
              <div className={styles.strength} data-score={strength.score}>
                <div className={styles.strengthBars}>
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={i < strength.score ? styles.on : ""} />
                  ))}
                </div>
                <span>{strength.label}</span>
              </div>
            )}
          </div>
          <div className="field">
            <label className="field-label" htmlFor="s-pw-confirm">Confirm new password</label>
            <input id="s-pw-confirm" type="password" className="input" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} aria-invalid={Boolean(pwMismatch)} />
            {pwMismatch && <p className="field-error"><IconAlert width={13} height={13} /> Passwords don&apos;t match.</p>}
            {pw.confirm && !pwMismatch && <p className={styles.match}><IconCheck width={13} height={13} /> Passwords match</p>}
          </div>
        </div>
        <div className={styles.sectionFoot}>
          <button type="submit" className="btn btn-secondary" disabled={pwSaving || !pw.current || strength.score < 2 || pwMismatch || !pw.confirm}>
            {pwSaving ? <span className="spinner" /> : <IconLock width={15} height={15} />}
            Update password
          </button>
        </div>
      </form>

      {/* منطقة الخطر */}
      <section className={`card ${styles.section} ${styles.danger}`} aria-labelledby="s-danger">
        <header className={styles.sectionHead}>
          <h2 id="s-danger">Delete account</h2>
          <p>Permanently remove your account, posts, comments and likes. This can&apos;t be undone.</p>
        </header>
        <div className={styles.sectionFoot}>
          <button type="button" className="btn btn-danger" onClick={() => setDeleteOpen(true)}>
            Delete my account
          </button>
        </div>
      </section>

      {/* شريط الحفظ يطلع بس لما يكون في تغييرات */}
      <div className={`${styles.saveBar}${dirty ? ` ${styles.saveBarOn}` : ""}`} aria-hidden={!dirty}>
        <span>You have unsaved changes</span>
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={discard} tabIndex={dirty ? 0 : -1}>
            Discard
          </button>
          <button type="submit" form="profile-form" className="btn btn-primary btn-sm" disabled={saving} tabIndex={dirty ? 0 : -1}>
            {saving && <span className="spinner" />}
            Save changes
          </button>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        title="Delete your account?"
        message="All your posts, comments and reputation will be permanently deleted. You'll be signed out immediately."
        confirmLabel="Yes, delete my account"
        onConfirm={deleteAccount}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
