'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch",
  "Japanese", "Hindi", "Arabic", "Russian", "Chinese (Simplified)", "Chinese (Traditional)",
  "Korean", "Turkish", "Polish", "Swedish", "Danish", "Norwegian", "Finnish"
];

const categoryTree: Record<string, string[]> = {
  "Art & Architecture": ["General Art", "History", "Photography", "Design", "Architecture"],
  "Biography & Autobiography": ["General", "Historical", "Personal Memoirs", "Political"],
  "Business & Economics": ["Careers", "Finance", "Management", "Marketing", "Personal Finance"],
  "Computers & Technology": ["Programming", "Cybersecurity", "Data Science", "Hardware", "Software"],
  "Cookbooks & Food": ["Baking", "Dietary", "Regional & Ethnic", "Quick & Easy"],
  "Education & Teaching": ["Methods", "Special Education", "Homeschooling", "Test Prep"],
  "Fiction": ["Action & Adventure", "Contemporary", "Fantasy", "Historical", "Horror", "Mystery & Thriller", "Romance", "Science Fiction", "Women's Fiction"],
  "Health & Fitness": ["Diet", "Exercise", "Mental Health", "Alternative Medicine"],
  "History": ["Ancient", "Medieval", "Modern", "Military", "World"],
  "Juvenile Fiction (Kids)": ["Animals", "Fairy Tales", "Sci-Fi", "Social Issues", "Sports", "Young Adult"],
  "Philosophy & Religion": ["Ethics", "Eastern", "Spiritual", "Theology"],
  "Science & Math": ["Biology", "Chemistry", "Physics", "Astronomy", "Mathematics"],
  "Self-Help": ["Motivational", "Personal Growth", "Stress Management"],
  "Sports & Outdoors": ["Coaching", "Extreme Sports", "Team Sports", "Water Sports"],
  "Travel": ["Guidebooks", "Essays & Travelogues", "Specialty Travel"]
};

// --- Reusable UI Components (defined OUTSIDE component to prevent re-mount) ---

const InputLabel = ({ children, required = false, helpText, extra }: {
  children: React.ReactNode; required?: boolean; helpText?: string; extra?: React.ReactNode;
}) => (
  <div style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
    <div>
      <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
        {children} {required && <span style={{ color: 'var(--error)' }}>*</span>}
      </label>
      {helpText && <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{helpText}</p>}
    </div>
    {extra && <div>{extra}</div>}
  </div>
);

const InputField = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.95rem', ...props.style }}
  />
);

const SelectField = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.95rem', background: 'white', ...props.style }}
  >
    {props.children}
  </select>
);

// --- Main Page ---

export default function PublishEbook() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 — Details
  const [language, setLanguage] = useState('English');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [authorFirst, setAuthorFirst] = useState('');
  const [authorLast, setAuthorLast] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<{main: string, sub: string}[]>([]);
  const [tempMainCat, setTempMainCat] = useState('Select category...');
  const [tempSubCat, setTempSubCat] = useState('Select subcategory...');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [publicationDate, setPublicationDate] = useState('');

  // Step 2 — Content
  const [epubName, setEpubName] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [drmEnabled, setDrmEnabled] = useState(true);

  // Step 3 — Pricing
  const [listPrice, setListPrice] = useState('');
  const [royaltyPlan, setRoyaltyPlan] = useState<'70' | '35'>('70');

  const royalty = listPrice
    ? (Number(listPrice) * (royaltyPlan === '70' ? 0.7 : 0.35)).toFixed(2)
    : '0.00';

  const handleEpubUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setEpubName(e.target.files[0].name);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCoverPreview(URL.createObjectURL(e.target.files[0]));
  };

  const addCategory = () => {
    if (tempMainCat === 'Select category...' || tempSubCat === 'Select subcategory...') return;
    if (categories.length >= 3) return;
    if (categories.some(c => c.main === tempMainCat && c.sub === tempSubCat)) return;
    setCategories([...categories, { main: tempMainCat, sub: tempSubCat }]);
    setTempMainCat('Select category...');
    setTempSubCat('Select subcategory...');
  };

  const removeCategory = (i: number) => {
    const next = [...categories];
    next.splice(i, 1);
    setCategories(next);
  };

  const handlePublish = () => {
    const newBook = {
      id: Date.now().toString(),
      title: title || 'Untitled eBook',
      author: `${authorFirst} ${authorLast}`.trim() || 'Unknown Author',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      price: listPrice || '0.00',
      asin: 'EB' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'In Review',
      format: 'eBook'
    };
    const existing = JSON.parse(localStorage.getItem('kdp_books') || '[]');
    localStorage.setItem('kdp_books', JSON.stringify([newBook, ...existing]));
    router.push('/dashboard');
  };

  const steps = [
    { num: 1, label: 'eBook Details' },
    { num: 2, label: 'eBook Content' },
    { num: 3, label: 'Rights & Pricing' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/dashboard/create">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to Create
          </span>
        </Link>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>eBook Details</h1>
        <p style={{ color: 'var(--text-muted)' }}>Publish your digital eBook to reach readers on all e-reader devices globally.</p>
      </div>

      {/* Progress Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-medium)' }}>
        {steps.map((s) => {
          const isActive = step === s.num;
          const isPast = step > s.num;
          return (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              style={{
                padding: '1rem 2rem',
                borderBottom: isActive ? '3px solid var(--primary-darker)' : '3px solid transparent',
                color: isActive ? 'var(--primary-darker)' : isPast ? 'var(--text-main)' : 'var(--text-dim)',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isActive ? 'var(--primary-surface)' : 'transparent',
                borderTopLeftRadius: '8px', borderTopRightRadius: '8px',
              }}
            >
              {isPast && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>

        {/* ── STEP 1: eBook Details ── */}
        {step === 1 && (
          <div>
            {/* Language */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ maxWidth: '400px' }}>
                <InputLabel required helpText="Choose the primary language your eBook is written in.">Language</InputLabel>
                <SelectField value={language} onChange={e => setLanguage(e.target.value)}>
                  {languages.map(l => <option key={l}>{l}</option>)}
                </SelectField>
              </div>
            </div>

            {/* Title */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required helpText="Your title must exactly match the title on your cover file.">eBook Title</InputLabel>
              <div style={{ maxWidth: '800px', marginBottom: '1.5rem' }}>
                <InputField type="text" placeholder="Enter your eBook title" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <InputLabel helpText="Optional subtitle shown below your title.">Subtitle (Optional)</InputLabel>
              <div style={{ maxWidth: '800px' }}>
                <InputField type="text" placeholder="Enter subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
              </div>
            </div>

            {/* Author */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required>Primary Author</InputLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr', gap: '1rem', maxWidth: '800px' }}>
                <InputField placeholder="Prefix" />
                <InputField placeholder="First name" value={authorFirst} onChange={e => setAuthorFirst(e.target.value)} />
                <InputField placeholder="Last name" value={authorLast} onChange={e => setAuthorLast(e.target.value)} />
                <InputField placeholder="Suffix" />
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel
                required
                helpText="This description will appear on your eBook product page."
                extra={<span style={{ fontSize: '0.8rem', fontWeight: 600, color: description.length >= 4000 ? 'var(--error)' : 'var(--text-dim)' }}>{description.length} / 4000</span>}
              >
                Description
              </InputLabel>
              <textarea
                rows={8}
                placeholder="Enter your eBook description here..."
                value={description}
                maxLength={4000}
                onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', maxWidth: '800px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            {/* Categories */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required helpText="Add up to 3 categories. More categories = more discoverability.">Categories</InputLabel>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {categories.map((cat, index) => (
                  <div key={index} style={{ padding: '0.5rem 1rem', background: 'var(--primary-surface)', border: '1px solid var(--primary)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-darker)' }}>
                    {cat.main} {`>`} {cat.sub}
                    <button onClick={() => removeCategory(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-darker)', display: 'flex', padding: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
              {categories.length < 3 ? (
                <div style={{ display: 'flex', gap: '1rem', maxWidth: '800px', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>Main Category</label>
                    <SelectField value={tempMainCat} onChange={e => { setTempMainCat(e.target.value); setTempSubCat('Select subcategory...'); }}>
                      <option>Select category...</option>
                      {Object.keys(categoryTree).map(cat => <option key={cat}>{cat}</option>)}
                    </SelectField>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>Subcategory</label>
                    <SelectField value={tempSubCat} onChange={e => setTempSubCat(e.target.value)} disabled={tempMainCat === 'Select category...'}>
                      <option>Select subcategory...</option>
                      {tempMainCat !== 'Select category...' && categoryTree[tempMainCat]?.map(sub => <option key={sub}>{sub}</option>)}
                    </SelectField>
                  </div>
                  <button
                    onClick={addCategory}
                    disabled={tempMainCat === 'Select category...' || tempSubCat === 'Select subcategory...'}
                    style={{ padding: '0.8rem 1.5rem', background: 'var(--text-main)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: (tempMainCat === 'Select category...' || tempSubCat === 'Select subcategory...') ? 0.5 : 1 }}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>Maximum of 3 categories reached.</p>
              )}
            </div>

            {/* Publishing Rights */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required>Publishing Rights</InputLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <input type="radio" name="rights" defaultChecked /> I own the copyright and I hold necessary publishing rights.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <input type="radio" name="rights" /> This is a public domain work.
                </label>
              </div>
            </div>

            {/* Keywords */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel helpText="Add up to 7 keywords to help readers discover your eBook. Press Enter or comma to add.">
                Keywords <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 500 }}>({keywords.length}/7)</span>
              </InputLabel>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: keywords.length > 0 ? '1rem' : '0' }}>
                {keywords.map((kw, idx) => (
                  <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.35rem 0.8rem', background: '#f1f5f9', border: '1px solid var(--border-medium)', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {kw}
                    <button onClick={() => setKeywords(keywords.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#94a3b8' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </span>
                ))}
              </div>
              {keywords.length < 7 && (
                <div style={{ display: 'flex', gap: '0.8rem', maxWidth: '600px' }}>
                  <InputField
                    type="text"
                    placeholder="e.g. romance novel, historical fiction ..."
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyDown={e => {
                      if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
                        e.preventDefault();
                        const kw = keywordInput.trim().replace(/,$/, '');
                        if (kw && !keywords.includes(kw) && keywords.length < 7) {
                          setKeywords([...keywords, kw]);
                          setKeywordInput('');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const kw = keywordInput.trim();
                      if (kw && !keywords.includes(kw) && keywords.length < 7) {
                        setKeywords([...keywords, kw]);
                        setKeywordInput('');
                      }
                    }}
                    style={{ padding: '0.8rem 1.2rem', background: 'var(--text-main)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Add
                  </button>
                </div>
              )}
              {keywords.length >= 7 && <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Maximum of 7 keywords reached.</p>}
            </div>

            {/* Publication Date */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ maxWidth: '360px' }}>
                <InputLabel helpText="Leave blank to publish immediately upon approval. Set a future date to pre-schedule.">Publication Date</InputLabel>
                <InputField
                  type="date"
                  value={publicationDate}
                  onChange={e => setPublicationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {publicationDate && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--primary-darker)', fontWeight: 600, marginTop: '0.5rem' }}>
                    📅 Scheduled for: {new Date(publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button style={{ padding: '0.8rem 2rem', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save as Draft</button>
              <button onClick={() => setStep(2)} style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#451a03', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Save and Continue</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: eBook Content ── */}
        {step === 2 && (
          <div>
            <div style={{ padding: '2rem 3rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>eBook Content</h2>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* EPUB Upload */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manuscript File</h3>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Upload eBook File</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Accepted formats: <strong>EPUB</strong>, MOBI, PDF, DOC, DOCX, HTML, RTF, TXT<br />
                    <span style={{ fontSize: '0.8rem' }}>Maximum file size: 650 MB</span>
                  </p>
                  <label style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    <input type="file" accept=".epub,.mobi,.pdf,.doc,.docx,.html,.rtf,.txt" style={{ display: 'none' }} onChange={handleEpubUpload} />
                    {epubName ? 'Replace File' : 'Browse Files'}
                  </label>
                  {epubName && (
                    <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {epubName}
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Upload */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Cover Image</h3>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Upload Cover Image</h4>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Minimum: <strong>1600 x 2560 px</strong> (JPG or TIFF). Ideal ratio: 1:1.6<br />
                      <span style={{ fontSize: '0.8rem' }}>Maximum size: 50 MB</span>
                    </p>
                    <label style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="file" accept=".jpg,.jpeg,.tif,.tiff" style={{ display: 'none' }} onChange={handleCoverUpload} />
                      {coverPreview ? 'Replace Cover' : 'Upload Cover Image'}
                    </label>
                    {coverPreview && <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginTop: '1rem' }}>✓ Cover uploaded successfully</p>}
                  </div>
                  {coverPreview && (
                    <div style={{ width: '100px', flexShrink: 0 }}>
                      <img src={coverPreview} alt="Cover preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* DRM */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>DRM Settings</h3>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Digital Rights Management (DRM) helps prevent unauthorized copying of your eBook. Once enabled, it cannot be changed after publishing.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { value: true, label: 'Enable DRM', desc: 'Recommended. Prevents readers from copying, printing, or sharing your eBook.' },
                      { value: false, label: 'Disable DRM', desc: 'Your eBook can be freely copied and distributed without restriction.' }
                    ].map(opt => (
                      <label key={String(opt.value)} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1rem 1.5rem', background: drmEnabled === opt.value ? 'var(--surface-light)' : '#f8fafc', border: drmEnabled === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer' }}>
                        <input type="radio" name="drm" checked={drmEnabled === opt.value} onChange={() => setDrmEnabled(opt.value)} style={{ marginTop: '3px' }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{opt.label}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '2px' }}>{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Content */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Content</h3>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Disclose whether AI tools were used in creating your content.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { name: 'ai_gen', label: 'AI-generated content', desc: 'Text, images or translations created entirely by an AI tool.' },
                      { name: 'ai_assist', label: 'AI-assisted content', desc: 'Content you wrote but refined, edited, or brainstormed using AI.' },
                    ].map(item => (
                      <div key={item.name} style={{ background: '#f8fafc', padding: '1.2rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{item.label}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>{item.desc}</div>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}><input type="radio" name={item.name} /> Yes</label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.9rem' }}><input type="radio" name={item.name} defaultChecked /> No</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} style={{ padding: '0.8rem 2rem', background: 'transparent', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>{`< Back`}</button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.8rem 2rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save as Draft</button>
                <button onClick={() => setStep(3)} style={{ padding: '0.8rem 2rem', background: 'var(--primary-darker)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Save and Continue</button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Rights & Pricing ── */}
        {step === 3 && (
          <div>
            <div style={{ padding: '2rem 3rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Rights & Pricing</h2>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* Royalty Plan */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Royalty Plan</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    {
                      val: '70' as const,
                      title: '70% Royalty',
                      desc: 'Best for eBooks priced between $2.99 – $9.99. You earn 70% of your list price per sale.',
                      badge: 'Recommended'
                    },
                    {
                      val: '35' as const,
                      title: '35% Royalty',
                      desc: 'For eBooks priced below $2.99 or above $9.99. Available for all territories.',
                      badge: null
                    }
                  ].map(plan => (
                    <label key={plan.val} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '1.2rem 1.5rem', background: royaltyPlan === plan.val ? 'var(--surface-light)' : '#f8fafc', border: royaltyPlan === plan.val ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer' }}>
                      <input type="radio" name="royalty" checked={royaltyPlan === plan.val} onChange={() => setRoyaltyPlan(plan.val)} style={{ marginTop: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{plan.title}</span>
                          {plan.badge && <span style={{ padding: '0.2rem 0.6rem', background: 'var(--success)', color: 'white', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700 }}>{plan.badge}</span>}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>{plan.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* List Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>List Price</h3>
                <div>
                  <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '500px' }}>
                    <InputLabel required>List Price (USD)</InputLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dim)' }}>$</span>
                      <InputField type="number" placeholder="Enter price (e.g. 4.99)" value={listPrice} onChange={e => setListPrice(e.target.value)} style={{ maxWidth: '200px' }} />
                    </div>

                    {listPrice && Number(listPrice) > 0 && (
                      <>
                        {royaltyPlan === '70' && (Number(listPrice) < 2.99 || Number(listPrice) > 9.99) && (
                          <div style={{ padding: '0.8rem 1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                            ⚠ The 70% royalty plan requires a price between $2.99 and $9.99. Consider adjusting or switching to the 35% plan.
                          </div>
                        )}
                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>List Price</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>${Number(listPrice).toFixed(2)}</span>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Your Royalty ({royaltyPlan}%)</span>
                            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>${royalty}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button style={{ padding: '0.8rem 2rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Save as Draft</button>
              <button
                onClick={handlePublish}
                style={{ padding: '0.8rem 3rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#451a03', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer' }}
              >
                Publish Your eBook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
