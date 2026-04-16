'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch", 
  "Japanese", "Hindi", "Arabic", "Russian", "Chinese (Simplified)", "Chinese (Traditional)",
  "Korean", "Turkish", "Polish", "Swedish", "Danish", "Norwegian", "Finnish"
];

// Expanded BISAC-style categories
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

// Extracted UI Components to prevent re-mounting
const InputLabel = ({ children, required = false, helpText, extra }: { children: React.ReactNode, required?: boolean, helpText?: string, extra?: React.ReactNode }) => (
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
    style={{ 
      width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', 
      border: '1px solid var(--border-medium)', fontSize: '0.95rem',
      ...props.style
    }} 
  />
);

const SelectField = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select 
    {...props} 
    style={{ 
      width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', 
      border: '1px solid var(--border-medium)', fontSize: '0.95rem', background: 'white',
      ...props.style
    }} 
  >
    {props.children}
  </select>
);

const SelectionBox = ({ label, active, onClick, extra }: { label: string, active: boolean, onClick: () => void, extra?: React.ReactNode }) => (
  <div onClick={onClick} style={{ 
    width: '100%', border: active ? '2px solid var(--primary)' : '1px solid var(--border-medium)', 
    background: active ? 'var(--surface-light)' : 'white', borderRadius: '8px', padding: '1rem', 
    fontWeight: active ? 700 : 500, textAlign: 'center', cursor: 'pointer', transition: 'all 0.1s'
  }}>
    {label}
    {extra && <div style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: '4px', color: 'var(--text-dim)' }}>{extra}</div>}
  </div>
);

const trimSizes = [
  { label: "5 x 8 in", sub: "12.7 x 20.32 cm" },
  { label: "5.06 x 7.81 in", sub: "12.85 x 19.84 cm" },
  { label: "5.25 x 8 in", sub: "13.34 x 20.32 cm" },
  { label: "5.5 x 8.5 in", sub: "13.97 x 21.59 cm" },
  { label: "6 x 9 in", sub: "15.24 x 22.86 cm" },
  { label: "6.14 x 9.21 in", sub: "15.6 x 23.39 cm" },
  { label: "7 x 10 in", sub: "17.78 x 25.4 cm" },
  { label: "8.5 x 11 in", sub: "21.59 x 27.94 cm" }
];

export default function PublishBook() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 State
  const [language, setLanguage] = useState("English");
  const [title, setTitle] = useState('');
  const [authorFirst, setAuthorFirst] = useState('');
  const [authorLast, setAuthorLast] = useState('');
  const [description, setDescription] = useState('');
  
  // Category State (up to 3 categories)
  const [categories, setCategories] = useState<{main: string, sub: string}[]>([]);
  const [tempMainCat, setTempMainCat] = useState("Select category...");
  const [tempSubCat, setTempSubCat] = useState("Select subcategory...");

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [manuscriptName, setManuscriptName] = useState<string | null>(null);
  const [inkType, setInkType] = useState('Black & white interior with white paper');
  const [trimSize, setTrimSize] = useState('6 x 9 in');
  const [bleed, setBleed] = useState('No Bleed');
  const [finish, setFinish] = useState('Matte');
  const [pageCount, setPageCount] = useState<string>('200');
  
  // Advanced Step 2 State
  const [isbnChoice, setIsbnChoice] = useState('free'); 
  const [generatedIsbn, setGeneratedIsbn] = useState<string | null>(null);
  const [customIsbn, setCustomIsbn] = useState('');
  const [imprintName, setImprintName] = useState('');

  // Step 3 State
  const [listPrice, setListPrice] = useState<string>('');

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleManuscriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManuscriptName(e.target.files[0].name);
    }
  };

  const generateEAN13 = () => {
    const prefix = "978";
    const random9 = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const core = prefix + random9;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(core[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const finalIsbn = `${core}${checkDigit}`;
    const formatted = `${finalIsbn.substring(0,3)}-${finalIsbn.substring(3,4)}-${finalIsbn.substring(4,8)}-${finalIsbn.substring(8,12)}-${finalIsbn.substring(12,13)}`;
    setGeneratedIsbn(formatted);
  };

  const calculateCost = () => {
    const pages = Number(pageCount) || 0;
    let base = 0.85;
    let perPage = 0.012;
    if (inkType.includes('color')) {
      perPage = 0.070;
    }
    return (base + (pages * perPage)).toFixed(2);
  };

  const printCost = parseFloat(calculateCost());
  const estimatedRoyalty = (listPrice !== '' && Number(listPrice) > 0) ? ((Number(listPrice) * 0.70) - printCost).toFixed(2) : '0.00';

  const addCategory = () => {
    if (tempMainCat === "Select category..." || tempSubCat === "Select subcategory...") return;
    if (categories.length >= 3) return; // limit to 3
    // Prevent duplicates
    if (categories.some(c => c.main === tempMainCat && c.sub === tempSubCat)) return;
    
    setCategories([...categories, { main: tempMainCat, sub: tempSubCat }]);
    setTempMainCat("Select category...");
    setTempSubCat("Select subcategory...");
  };

  const removeCategory = (index: number) => {
    const newCats = [...categories];
    newCats.splice(index, 1);
    setCategories(newCats);
  };

  const handlePublish = () => {
    const newBook = {
      id: Date.now().toString(),
      title: title || 'Untitled Book',
      author: `${authorFirst} ${authorLast}`.trim() || 'Unknown Author',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      price: listPrice || '0.00',
      asin: isbnChoice === 'free' && generatedIsbn ? generatedIsbn.split('-').join('') : 'B0' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'In Review' 
    };
    const existing = JSON.parse(localStorage.getItem('kdp_books') || '[]');
    localStorage.setItem('kdp_books', JSON.stringify([newBook, ...existing]));
    router.push('/dashboard');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <Link href="/dashboard/create">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to Create
            </span>
          </Link>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Paperback Details</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter the information exactly as you want it to appear in the bookstore.</p>
        </div>
      </div>

      {/* Progress Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-medium)' }}>
        {[
          { num: 1, label: 'Paperback Details' },
          { num: 2, label: 'Paperback Content' },
          { num: 3, label: 'Rights & Pricing' }
        ].map((s) => {
          const isActive = step === s.num;
          const isPast = step > s.num;
          return (
            <div 
              key={s.num} 
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
              onClick={() => setStep(s.num)}
            >
              {isPast && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              {s.label}
            </div>
          )
        })}
      </div>

      {/* Form Area */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        
        {step === 1 && (
          <div className="step-content">
            {/* Language */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ maxWidth: '400px' }}>
                <InputLabel required helpText="Choose the primary language your book is written in.">Language</InputLabel>
                <SelectField value={language} onChange={e => setLanguage(e.target.value)}>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </SelectField>
              </div>
            </div>

            {/* Book Title */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required helpText="Your title must exactly match the title on your cover and manuscript.">Book Title</InputLabel>
              <div style={{ marginBottom: '1.5rem', maxWidth: '800px' }}>
                <InputField type="text" placeholder="Enter your book title" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <InputLabel helpText="If your book has a subtitle, enter it here.">Subtitle (Optional)</InputLabel>
              <div style={{ maxWidth: '800px' }}>
                <InputField type="text" placeholder="Enter your subtitle" />
              </div>
            </div>

            {/* Author */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required helpText="The primary author or contributor.">Primary Author</InputLabel>
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
                helpText="Summarize your book. This will appear on your product detail page."
                extra={<span style={{ fontSize: '0.8rem', fontWeight: 600, color: description.length >= 4000 ? 'var(--error)' : 'var(--text-dim)' }}>{description.length} / 4000</span>}
              >
                Description
              </InputLabel>
              <textarea 
                rows={8} 
                placeholder="Enter your description here..." 
                value={description} 
                maxLength={4000}
                onChange={e => setDescription(e.target.value)} 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical', maxWidth: '800px' }}
              ></textarea>
            </div>

            {/* Primary Store Location */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required helpText="Choose the store where you expect the majority of your sales.">Primary Store Location</InputLabel>
              <div style={{ maxWidth: '300px' }}>
                <SelectField>
                  <option>Global Store (.com)</option>
                  <option>United Kingdom (.co.uk)</option>
                  <option>Canada (.ca)</option>
                  <option>Australia (.com.au)</option>
                </SelectField>
              </div>
            </div>

            {/* Categories */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel required helpText="Choose up to 3 categories that best describe your book.">Categories</InputLabel>
              
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
                    <SelectField value={tempMainCat} onChange={(e) => { setTempMainCat(e.target.value); setTempSubCat('Select subcategory...'); }}>
                      <option>Select category...</option>
                      {Object.keys(categoryTree).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </SelectField>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>Subcategory</label>
                    <SelectField value={tempSubCat} onChange={e => setTempSubCat(e.target.value)} disabled={tempMainCat === 'Select category...'}>
                      <option>Select subcategory...</option>
                      {tempMainCat !== 'Select category...' && categoryTree[tempMainCat]?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </SelectField>
                  </div>
                  <button onClick={addCategory} disabled={tempMainCat === 'Select category...' || tempSubCat === 'Select subcategory...'} style={{ padding: '0.8rem 1.5rem', background: 'var(--text-main)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: (tempMainCat === 'Select category...' || tempSubCat === 'Select subcategory...') ? 'not-allowed' : 'pointer', opacity: (tempMainCat === 'Select category...' || tempSubCat === 'Select subcategory...') ? 0.5 : 1 }}>
                    Add Category
                  </button>
                </div>
              ) : (
                 <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600 }}>Maximum of 3 categories reached.</p>
              )}
            </div>

            {/* Keywords */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
              <InputLabel helpText="Add up to 7 keywords to help readers discover your book. Press Enter or comma to add.">
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
                    placeholder="e.g. mystery thriller, suspense novel ..."
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
              <button style={{ padding: '0.8rem 2rem', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                Save as Draft
              </button>
              <button onClick={() => setStep(2)} style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#451a03', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}>
                Save and Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <div style={{ padding: '2rem 3rem', background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Paperback Content</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
              
              {/* Manuscript & Cover Upload Logic */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manuscript & Cover</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Manuscript */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                       <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Paperback Manuscript</h4>
                       <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Upload your interior file. Formats accepted: PDF, DOC, DOCX, RTF.</p>
                       <label style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                         <input type="file" accept=".pdf,.doc,.docx,.rtf" style={{ display: 'none' }} onChange={handleManuscriptUpload} />
                         {manuscriptName ? 'Replace Manuscript' : 'Browse Files'}
                       </label>
                       {manuscriptName && <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginTop: '1rem' }}>✓ {manuscriptName} uploaded successfully</p>}
                    </div>

                    {/* Cover */}
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                       <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Book Cover</h4>
                       <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Upload a print-ready PDF covering the back, spine, and front.</p>
                       <label style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                         <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleCoverUpload} />
                         {coverPreview ? 'Replace Cover' : 'Upload your Cover File'}
                       </label>
                       {coverPreview && <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, marginTop: '1rem' }}>✓ Cover design uploaded successfully</p>}
                    </div>
                 </div>
              </div>


              {/* ISBN Generation logic */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>ISBN</h3>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You can have us assign an ISBN for your book or you can add one you've already purchased. An ISBN is a unique ID retailers, libraries, and distributors use.</p>
                  
                  <div style={{ background: isbnChoice === 'free' ? 'var(--surface-light)' : '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: isbnChoice === 'free' ? '1px solid var(--border-medium)' : '1px solid var(--border)', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" value="free" checked={isbnChoice === 'free'} onChange={() => setIsbnChoice('free')} style={{ marginTop: '0.2rem' }} />
                      <div>
                        Get a free KDP Press ISBN
                        {isbnChoice === 'free' && (
                          <div style={{ marginTop: '1rem' }}>
                            {generatedIsbn ? (
                              <div style={{ padding: '1rem 1.5rem', background: 'white', borderRadius: '8px', border: '2px solid var(--success)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', display: 'inline-block' }}>
                                ISBN-13: <span style={{ color: 'var(--text-main)' }}>{generatedIsbn}</span>
                              </div>
                            ) : (
                              <button onClick={generateEAN13} style={{ padding: '0.6rem 2rem', background: 'var(--primary-darker)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>
                                Assign Free ISBN
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  <div style={{ background: isbnChoice === 'own' ? 'var(--surface-light)' : '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: isbnChoice === 'own' ? '1px solid var(--border-medium)' : '1px solid var(--border)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" value="own" checked={isbnChoice === 'own'} onChange={() => setIsbnChoice('own')} />
                      Use my own ISBN
                    </label>

                    {isbnChoice === 'own' && (
                      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                          <InputLabel required helpText="Enter your 13-digit ISBN without dashes.">ISBN Number</InputLabel>
                          <InputField placeholder="e.g. 9781234567890" value={customIsbn} onChange={e => setCustomIsbn(e.target.value)} />
                        </div>
                        <div>
                          <InputLabel required helpText="Name of the publisher/imprint associated with this ISBN.">Imprint Name</InputLabel>
                          <InputField placeholder="Publishing Co." value={imprintName} onChange={e => setImprintName(e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Print Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Print Options</h3>
                <div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ink and Paper Type</h4>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '260px' }}>
                        {['Black & white interior with cream paper', 'Black & white interior with white paper', 'Standard color interior with white paper', 'Premium color interior with white paper'].map((opt, i) => (
                          <div 
                            key={i} 
                            onClick={() => setInkType(opt)}
                            style={{ 
                              padding: '1rem', border: inkType === opt ? '2px solid var(--primary)' : '1px solid var(--border-medium)', 
                              borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: inkType === opt ? 700 : 500,
                              background: inkType === opt ? 'var(--surface-light)' : 'white'
                            }}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Trim Size</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                      {trimSizes.map(size => (
                        <SelectionBox 
                          key={size.label} 
                          label={size.label} 
                          extra={size.sub} 
                          active={trimSize === size.label} 
                          onClick={() => setTrimSize(size.label)} 
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem', maxWidth: '300px' }}>
                    <InputLabel required helpText="Estimated page count is required to calculate manufacturing print cost.">Estimated Page Count</InputLabel>
                    <InputField type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
                  </div>

                </div>
              </div>


              {/* Precise AI Content Workflow */}
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Artificial Intelligence (AI) Content</h3>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We require you to disclose if your content is AI-generated.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                       <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>AI-generated content</h4>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Text, images, or translations created by an AI-based tool. Did you use AI-generated content?</p>
                       <div style={{ display: 'flex', gap: '1rem' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><input type="radio" name="ai_gen" /> Yes</label>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><input type="radio" name="ai_gen" defaultChecked /> No</label>
                       </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                       <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>AI-assisted content</h4>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Content you created yourself but used AI tools to edit, refine, brainstorm, or error-check. Did you use AI-assisted content?</p>
                       <div style={{ display: 'flex', gap: '1rem' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><input type="radio" name="ai_assist" /> Yes</label>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><input type="radio" name="ai_assist" defaultChecked /> No</label>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setStep(1)} style={{ padding: '0.8rem 2rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                {`< Back to Details`}
              </button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ padding: '0.8rem 2rem', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                  Save as Draft
                </button>
                <button onClick={() => setStep(3)} style={{ padding: '0.8rem 2rem', background: 'var(--primary-darker)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>
                  Save and Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
           <div className="step-content">
             <div style={{ padding: '2rem' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pricing & Royalties</h2>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Set your list price. Printing costs are deducted to calculate your royalty.</p>
 
               <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '600px' }}>
                 <div style={{ marginBottom: '2.5rem' }}>
                   <InputLabel required>List Price (USD)</InputLabel>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dim)' }}>$</span>
                     <InputField type="number" placeholder="Enter your selling price" value={listPrice} onChange={(e) => setListPrice(e.target.value)} style={{ maxWidth: '300px' }} />
                   </div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                   <div>
                     <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Printing Cost (Based on {pageCount || 0} pages @ {inkType.includes('color') ? 'Premium Color' : 'B&W'})</span>
                     <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--error)' }}>${printCost.toFixed(2)}</span>
                   </div>
                   <div>
                     <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Estimated Royalty (70%)</span>
                     <span style={{ fontSize: '1.5rem', fontWeight: 800, color: Number(estimatedRoyalty) > 0 ? 'var(--success)' : 'var(--text-muted)' }}>${estimatedRoyalty}</span>
                   </div>
                 </div>
 
                 {Number(estimatedRoyalty) < 0 && (
                   <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem', fontWeight: 600 }}>
                     Error: Your list price must be high enough to cover the printing cost to earn a royalty. Minimum list price is ${(printCost / 0.7).toFixed(2)}.
                   </div>
                 )}
               </div>
             </div>
 
             <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
               <button style={{ padding: '0.8rem 2rem', background: 'white', color: 'var(--text-main)', border: '1px solid var(--border-medium)', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                 Save as Draft
               </button>
               <button disabled={Number(estimatedRoyalty) < 0} onClick={handlePublish} style={{ padding: '0.8rem 3rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#451a03', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 800, cursor: Number(estimatedRoyalty) < 0 ? 'not-allowed' : 'pointer', opacity: Number(estimatedRoyalty) < 0 ? 0.5 : 1 }}>
                 Publish Your Paperback Book
               </button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
