'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { XMarkIcon, PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Category, Visibility } from './../types/posts';
import { createPost } from '@/services/posts';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreateLocal?: (payload: {
    content: string; category?: Category; visibility?: Visibility; media?: File[]; groupId?: string;
  }) => Promise<void> | void;
};

type Step = 'pick' | 'compose';

const categories: Category[] = ['academic','social','announcement','event','general'];
const visibilities: Visibility[] = ['public','followers','private'];

export default function CreatePostModal({ open, onClose }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<Step>('pick');
  const [activeIdx, setActiveIdx] = useState(0);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setFiles([]); setCaption(''); setCategory('general'); setVisibility('public'); setGroupId('');
      setStep('pick'); setActiveIdx(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && step === 'compose') setActiveIdx(i => Math.min(i + 1, files.length - 1));
      if (e.key === 'ArrowLeft'  && step === 'compose') setActiveIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step, files.length]);

  const onPick = () => inputRef.current?.click();
  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const allowed = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
    const arr = Array.from(list).filter(f => allowed.includes(f.type) && f.size <= 5*1024*1024);
    if (!arr.length) { setError('Invalid image type or file too large'); return; }
    setFiles([arr[0]]);
    setStep('compose');
  };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  const activeFile = files[activeIdx];
  const activeURL = useMemo(() => (activeFile ? URL.createObjectURL(activeFile) : ''), [activeFile]);
  const canShare = files.length > 0 && caption.length <= 2200 && !uploading;

  const share = async () => {
    if (!canShare) return;
    setUploading(true);
    setError(null);
    try {
      const post = await createPost(files[0], caption || undefined);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fg_post_created', { detail: post }));
      }
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[900px] max-w-[95vw] rounded-2xl bg-[#1e1e1e] border border-gray-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-center relative py-3 border-b border-gray-800">
          <h3 className="text-white font-semibold">Create new post</h3>
          <button onClick={onClose} className="absolute right-3 top-2.5 p-2 rounded hover:bg-gray-800" aria-label="Close">
            <XMarkIcon className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Body */}
        {step === 'pick' && (
          <div className="p-10 flex flex-col items-center justify-center min-h-[420px]"
               onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
            <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
              <PhotoIcon className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-lg text-white mb-2">Drag photos and videos here</p>
            <button onClick={onPick} className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium">
              Select from computer
            </button>
            <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.webp" hidden onChange={(e)=>handleFiles(e.target.files)} />
          </div>
        )}

        {step === 'compose' && (
          <div className="grid grid-cols-12">
            {/* Preview */}
            <div className="col-span-7 bg-black relative min-h-[520px]">
              {files.length > 1 && (
                <>
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                          onClick={()=>setActiveIdx(i=>Math.max(i-1,0))} aria-label="Previous">
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                  </button>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                          onClick={()=>setActiveIdx(i=>Math.min(i+1,files.length-1))} aria-label="Next">
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
              <div className="absolute inset-0">
                <img src={activeURL} alt="preview" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Compose */}
            <div className="col-span-5 border-l border-gray-800 p-4 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img src="/images/portrait-avatar.png" alt="me" className="w-8 h-8 rounded-full" />
                <div className="text-sm font-semibold">_muhib_ali_</div>
              </div>

              <label className="text-xs text-gray-400 mb-1">Write a caption</label>
              <textarea value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Write something..."
                className="bg-transparent border border-gray-800 rounded-lg p-3 text-sm h-36 resize-none outline-none focus:border-gray-600"
                maxLength={2200} />
              <div className="text-right text-[11px] text-gray-500 mt-1">{caption.length}/2200</div>
              {error && <div className="mt-2 text-xs text-red-400">{error}</div>}

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1">Category</label>
                  <select value={category} onChange={e=>setCategory(e.target.value as Category)}
                          className="w-full bg-transparent border border-gray-800 rounded-lg p-2.5 text-sm">
                    {categories.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1">Visibility</label>
                  <select value={visibility} onChange={e=>setVisibility(e.target.value as Visibility)}
                          className="w-full bg-transparent border border-gray-800 rounded-lg p-2.5 text-sm">
                    {visibilities.map(v => <option key={v} value={v} className="bg-black">{v}</option>)}
                  </select>
                </div>
              </div>

              <label className="text-xs text-gray-400 mt-3 mb-1">Post to group (optional)</label>
              <input value={groupId} onChange={e=>setGroupId(e.target.value)} placeholder="Group ID"
                className="bg-transparent border border-gray-800 rounded-lg p-2.5 text-sm w-full" />

              <div className="mt-auto flex items-center justify-between pt-4">
                <button onClick={()=>{ setStep('pick'); setFiles([]); }} className="text-gray-300 hover:text-white text-sm">Start over</button>
                <div className="space-x-2">
                  <button onClick={onClose} className="text-gray-300 hover:text-white text-sm px-3 py-1.5">Cancel</button>
                  <button disabled={!canShare} onClick={share}
                          className={`px-4 py-1.5 rounded-md text-sm font-semibold ${
                            canShare ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          }`}>
                    {uploading ? 'Sharing…' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
