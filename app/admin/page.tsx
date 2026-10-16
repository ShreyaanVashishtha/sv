'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  WebsiteData,
  Project,
  SkillCategory,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  Social,
  Metric,
  NavLink,
  PhotoItem,
  PhotographySettings,
} from '@/types/content';
import {
  Shield,
  Save,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  AlertCircle,
  FileText,
  Briefcase,
  Layers,
  Settings,
  Share2,
  Lock,
  Download,
  Upload,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Award,
  Eye,
  Code,
  Sliders,
  Type,
  Terminal,
  MessageSquare,
  Compass,
  Inbox,
  Mail,
  Reply,
  RefreshCw,
  Check,
  Clock,
  Globe,
  Database,
  KeyRound,
  Fingerprint,
  Search,
  Camera,
} from 'lucide-react';

interface InboxMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WebsiteData | null>(null);
  const [rawJsonText, setRawJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [hasRegisteredBiometrics, setHasRegisteredBiometrics] = useState(false);
  const [biometricsStatus, setBiometricsStatus] = useState('');
  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'navigation'
    | 'headings'
    | 'projects'
    | 'skills'
    | 'experience'
    | 'education'
    | 'certifications'
    | 'terminal'
    | 'contact'
    | 'inbox'
    | 'photography'
    | 'flow'
    | 'socials'
    | 'footer'
    | 'settings'
    | 'rawjson'
    | 'backup'
  >('profile');
  const [syncingPexels, setSyncingPexels] = useState(false);
  const [pexelsSyncStatus, setPexelsSyncStatus] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: '',
  });

  useEffect(() => {
    checkAuthAndLoad();
    checkBiometricsStatus();
  }, []);

  const getAuthHeaders = (extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...extra };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sv7_admin_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const getRpId = () => {
    if (typeof window === 'undefined') return 'localhost';
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'localhost';
    if (hostname.endsWith('sv7.dev')) return 'sv7.dev';
    return hostname;
  };

  const checkBiometricsStatus = async () => {
    try {
      const res = await fetch('/api/auth/biometrics');
      if (res.ok) {
        const json = await res.json();
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('sv7_biometric_id') : null;
        setHasRegisteredBiometrics(!!json.isConfigured || !!storedId);
      }
    } catch {
      // ignore
    }
  };

  const handleRegisterBiometrics = async () => {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      alert('Touch ID / Biometric authentication is not supported on this device/browser.');
      return;
    }
    setLoading(true);
    setBiometricsStatus('Scanning Touch ID / fingerprint sensor...');
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array([115, 118, 55, 95, 97, 100, 109, 105, 110]); // 'sv7_admin'

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'sv7.dev Admin Console',
            id: getRpId(),
          },
          user: {
            id: userId,
            name: 'admin@sv7.dev',
            displayName: 'sv7.dev Administrator',
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },
            { alg: -257, type: 'public-key' },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            residentKey: 'preferred',
          },
          timeout: 60000,
        },
      })) as PublicKeyCredential;

      if (!credential || !credential.id) {
        throw new Error('No credential generated');
      }

      const res = await fetch('/api/auth/biometrics/register', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ credentialId: credential.id }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        localStorage.setItem('sv7_biometric_id', credential.id);
        setHasRegisteredBiometrics(true);
        setBiometricsStatus('Fingerprint registered successfully! You can now log in with Touch ID.');
        setTimeout(() => setBiometricsStatus(''), 5000);
      } else {
        setBiometricsStatus(json.error || 'Failed to save biometric passkey.');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setBiometricsStatus('Touch ID registration cancelled.');
      } else {
        setBiometricsStatus(err.message || 'Touch ID setup encountered an error.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    setLoginError('');
    try {
      if (typeof window === 'undefined' || !window.PublicKeyCredential) {
        setLoginError('Biometric passkeys are not supported on this browser.');
        return;
      }

      const statusRes = await fetch('/api/auth/biometrics');
      const { credentialIds } = await statusRes.json();
      const storedId = localStorage.getItem('sv7_biometric_id');
      const allowIds =
        credentialIds && credentialIds.length > 0
          ? credentialIds
          : storedId
          ? [storedId]
          : [];

      if (allowIds.length === 0) {
        setLoginError(
          'No fingerprint registered yet. Please log in with your Master Passkey first, then click "Register Fingerprint" in Site Settings.'
        );
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const assertion = (await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: getRpId(),
          userVerification: 'required',
          timeout: 60000,
        },
      })) as PublicKeyCredential;

      if (!assertion || !assertion.id) {
        throw new Error('Biometric verification cancelled');
      }

      const verifyRes = await fetch('/api/auth/biometrics/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credentialId: assertion.id }),
      });

      const verifyJson = await verifyRes.json();
      if (verifyRes.ok && verifyJson.success) {
        if (verifyJson.token) {
          localStorage.setItem('sv7_admin_token', verifyJson.token);
        }
        setIsAuthenticated(true);
        setPasswordInput('');
        fetchContent();
        fetchMessages();
      } else {
        setLoginError(verifyJson.error || 'Biometric authentication failed.');
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setLoginError('Touch ID verification cancelled or timed out.');
      } else {
        setLoginError(err.message || 'Biometric verification failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearBiometrics = async () => {
    if (!confirm('Remove all registered biometric passkeys for this console?')) return;
    try {
      const res = await fetch('/api/auth/biometrics', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        localStorage.removeItem('sv7_biometric_id');
        setHasRegisteredBiometrics(false);
        setBiometricsStatus('Biometric passkeys removed.');
        setTimeout(() => setBiometricsStatus(''), 4000);
      }
    } catch {
      alert('Failed to remove biometric passkeys');
    }
  };

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch('/api/auth', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const authJson = await authRes.json();

      if (authJson.authenticated) {
        setIsAuthenticated(true);
        fetchContent();
        fetchMessages();
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        setIsDatabaseConnected(!!json.isDatabaseConnected);
        setData(json);
        setRawJsonText(JSON.stringify(json, null, 2));
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error('Failed to load content', e);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/contact', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (e) {
      console.error('Failed to delete message', e);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, read: true } : null));
        }
      }
    } catch (e) {
      console.error('Failed to mark message as read', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ passkey: passwordInput }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (json.token && typeof window !== 'undefined') {
          localStorage.setItem('sv7_admin_token', json.token);
        }
        setIsAuthenticated(true);
        setPasswordInput('');
        fetchContent();
        fetchMessages();
      } else {
        setLoginError(json.error || 'Invalid master passkey');
      }
    } catch (e) {
      setLoginError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sv7_admin_token');
      }
      await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
      setIsAuthenticated(false);
      setData(null);
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  const handleSave = async (overrideData?: WebsiteData) => {
    const payload = overrideData || data;
    if (!payload) return;
    setLoading(true);
    setSaveStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsDatabaseConnected(!!json.isDatabaseConnected);
        setSaveStatus({
          type: 'success',
          message: json.isDatabaseConnected
            ? 'Saved to Cloud Database (Instantly Live Globally)!'
            : 'All changes saved and live!',
        });
        setRawJsonText(JSON.stringify(payload, null, 2));
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 4000);
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setLoginError('Session expired or unauthorized. Please re-enter your master passkey.');
        }
        setSaveStatus({ type: 'error', message: json.error || 'Failed to save changes.' });
      }
    } catch (e) {
      setSaveStatus({ type: 'error', message: 'Network error saving content.' });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setData(parsed);
      setJsonError('');
      handleSave(parsed);
      alert('Raw JSON applied and saved successfully!');
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleSyncPexels = async () => {
    if (!data) return;
    setSyncingPexels(true);
    setPexelsSyncStatus('Connecting to Pexels and fetching photography portfolio...');
    try {
      const res = await fetch('/api/photography/sync', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          pexelsApiKey: data.photographySettings?.pexelsApiKey,
          pexelsProfileUrl: data.photographySettings?.pexelsProfileUrl,
          pexelsUsername: data.photographySettings?.pexelsUsername,
          pexelsCollectionId: data.photographySettings?.pexelsCollectionId,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                photos: result.photos,
                photographySettings: {
                  ...prev.photographySettings,
                  ...result.photographySettings,
                },
              }
            : prev
        );
        setPexelsSyncStatus(result.message || `Successfully synced ${result.count} photos!`);
      } else {
        setPexelsSyncStatus(`Sync error: ${result.error || 'Failed to sync with Pexels'}`);
      }
    } catch (err: any) {
      setPexelsSyncStatus(`Network error: ${err?.message || 'Sync failed'}`);
    } finally {
      setSyncingPexels(false);
    }
  };

  const handleAddManualPhoto = () => {
    if (!data) return;
    const cleanUrl = newPhotoUrl.trim();
    if (!cleanUrl) return;

    const pexelsIdMatch = cleanUrl.match(/pexels\.com\/photo\/[^\/]*?(\d+)/i) || cleanUrl.match(/photos\/(\d+)/i);
    const id = pexelsIdMatch ? pexelsIdMatch[1] : String(Date.now());

    const isDirectImage = cleanUrl.startsWith('http') && (cleanUrl.includes('.jpeg') || cleanUrl.includes('.jpg') || cleanUrl.includes('.png') || cleanUrl.includes('images.pexels.com'));

    const displayUrl = isDirectImage
      ? cleanUrl
      : pexelsIdMatch
      ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`
      : cleanUrl;

    const newPhoto: PhotoItem = {
      id,
      title: `Pexels Capture #${id}`,
      description: '',
      category: 'Aerospace & Aviation',
      src: {
        original: displayUrl,
        large2x: displayUrl,
        large: displayUrl,
        medium: displayUrl,
        small: displayUrl,
      },
      width: 4000,
      height: 3000,
      url: pexelsIdMatch ? `https://www.pexels.com/photo/${id}/` : cleanUrl,
      photographer: data.profile?.name || 'Shreyaan Vashishtha',
      photographerUrl: data.photographySettings?.pexelsProfileUrl || 'https://www.pexels.com/@shreyaan-vashishtha',
      camera: 'Sony Alpha 7 IV',
      lens: 'FE 24-70mm f/2.8 GM',
      focalLength: '50mm',
      aperture: 'f/2.8',
      shutterSpeed: '1/500s',
      iso: '100',
      featured: false,
    };

    setData({
      ...data,
      photos: [newPhoto, ...(data.photos || [])],
    });
    setNewPhotoUrl('');
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    if (!data || !data.photos) return;
    const newPhotos = [...data.photos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;
    setData({
      ...data,
      photos: newPhotos,
    });
  };

  const handleDeletePhoto = (index: number) => {
    if (!data || !data.photos) return;
    const updated = data.photos.filter((_, i) => i !== index);
    setData({
      ...data,
      photos: updated,
    });
  };

  // Section Order reordering
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!data || !data.settings.sectionOrder) return;
    const newOrder = [...data.settings.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setData({
      ...data,
      settings: { ...data.settings, sectionOrder: newOrder },
    });
  };

  // Project reordering
  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newProjects = [...data.projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;
    setData({ ...data, projects: newProjects });
  };

  const handleExportBackup = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `sv7-content-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.projects) {
          setData(parsed);
          setRawJsonText(JSON.stringify(parsed, null, 2));
          alert('Backup loaded into editor! Click "Save All Changes" to make it live.');
        } else {
          alert('Invalid JSON structure: missing profile or projects fields.');
        }
      } catch (err) {
        alert('Failed to parse uploaded JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono text-xs text-zinc-500">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 bg-mesh">
        <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-900/70 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center mb-4 shadow-sm">
              <KeyRound className="w-5 h-5 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">sv7.dev Master Admin</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Authenticate via Biometric Passkey or Master Key.
            </p>
          </div>

          {/* FINGERPRINT / TOUCH ID FAST UNLOCK */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700/80 hover:to-zinc-800 text-white font-medium text-xs py-3.5 px-4 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all shadow-lg flex items-center justify-between disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    Sign in with Fingerprint
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                      Touch ID
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Instant biometric hardware unlock
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 group-hover:text-emerald-400 transition-colors">
                Tap →
              </span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-zinc-900/90 px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider relative">
              Or Master Passkey
            </span>
            <div className="border-t border-white/10 w-full"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-zinc-400 uppercase">
                  Master Passkey
                </label>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  &apos;admin&apos; Disabled
                </span>
              </div>
              <input
                type="password"
                placeholder="Enter master passkey..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 text-sm font-mono transition-colors"
                required
                autoFocus
              />
            </div>

            {loginError && (
              <div className="flex items-start gap-2.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl font-mono leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold text-xs py-3 rounded-xl hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{loading ? 'Verifying Passkey...' : 'Authenticate with Passkey'}</span>
            </button>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
              <Link href="/" className="hover:text-zinc-300 flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Homepage</span>
              </Link>
              <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Passkey Protected</span>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono text-xs text-zinc-500">
        Loading configuration...
      </div>
    );
  }

  // Safe accessor helper objects
  const settings = data.settings;
  const header = settings.header || {
    logoBadge: 'sv7',
    brandTitle: 'sv7.dev',
    badgeSubtitle: 'HKUST Astrix',
    navLinks: [],
    ctaText: 'Get in Touch',
    ctaHref: '#contact',
    resumeButtonText: 'Resume / CV',
    showResumeButton: true,
  };
  const hero = settings.hero || {
    statusBadgePrefix: 'Status',
    exploreButtonText: 'Explore Work',
    exploreButtonHref: '#projects',
    copyEmailText: 'Copy email',
    showAvatar: false,
    avatarUrl: '',
  };
  const headings = settings.headings || {
    projectsEyebrow: 'Selected Works',
    projectsTitle: 'Featured Projects & Systems',
    projectsSubtitle: '',
    skillsEyebrow: 'Core Capabilities',
    skillsTitle: 'Engineering Stack & Disciplines',
    skillsSubtitle: '',
    experienceEyebrow: 'Track Record',
    experienceTitle: 'Experience & Milestones',
    experienceSubtitle: '',
    educationEyebrow: 'Academic Background',
    educationTitle: 'Education & Honors',
    educationSubtitle: '',
    certificationsEyebrow: 'Standardized Credentials',
    certificationsTitle: 'Standardized Exams & Certifications',
    contactEyebrow: 'Initiate Contact',
    contactTitle: "Let's Build Something Meaningful",
    contactSubtitle: '',
  };
  const terminal = settings.terminal || {
    windowTitle: 'bash — sv7.dev',
    commandPrompt: 'curl -s https://sv7.dev/api/content | jq .profile',
    customOutput: '',
    copyButtonText: 'Copy',
    copiedText: 'Copied',
    expandText: 'View payload preview',
    collapseText: 'Hide response preview',
  };
  const contact = settings.contact || {
    formTitle: 'Send a Direct Dispatch',
    subjectLabel: 'Subject / Topic',
    subjectPlaceholder: '',
    messageLabel: 'Brief Overview',
    messagePlaceholder: '',
    submitButtonText: 'Compose in Email Client',
    directTitle: 'Direct Inquiries',
    responseDisclaimer: '',
    copyAddressText: 'Copy Address',
  };
  const footer = settings.footer || {
    copyrightName: 'Shreyaan Vashishtha',
    footerNote: '',
    customLinks: [],
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const navItems = [
    { id: 'profile', label: 'Profile & Bio', icon: FileText },
    { id: 'navigation', label: 'Header & Nav', icon: Compass },
    { id: 'headings', label: 'Section Headings', icon: Type },
    { id: 'projects', label: `Projects (${data.projects.length})`, icon: Briefcase },
    { id: 'skills', label: `Skills (${data.skills.length})`, icon: Layers },
    { id: 'experience', label: `Experience (${data.experience.length})`, icon: Sparkles },
    { id: 'education', label: `Education (${data.education?.length || 0})`, icon: GraduationCap },
    { id: 'certifications', label: `Certifications (${data.certifications?.length || 0})`, icon: Award },
    { id: 'terminal', label: 'Terminal Widget', icon: Terminal },
    { id: 'contact', label: 'Contact Settings', icon: MessageSquare },
    {
      id: 'inbox',
      label: 'Inquiries Inbox',
      icon: Inbox,
      badge: unreadCount > 0 ? `${unreadCount} new` : messages.length > 0 ? `${messages.length}` : undefined,
    },
    {
      id: 'photography',
      label: `Photography (${data.photos?.length || 0})`,
      icon: Camera,
      badge: data.photos?.length ? `${data.photos.length}` : undefined,
    },
    { id: 'flow', label: 'Section Flow & Toggles', icon: Eye },
    { id: 'socials', label: 'Social Channels', icon: Share2 },
    { id: 'footer', label: 'Footer & Links', icon: Sliders },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'rawjson', label: 'Raw JSON Editor', icon: Code },
    { id: 'backup', label: 'Backup & Restore', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-white selection:text-black">
      {/* Top Header Bar */}
      <header className="glass-nav sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-mono font-bold text-xs flex items-center justify-center">
            sv7
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Granular Control Studio
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                Full CMS
              </span>
              {isDatabaseConnected ? (
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cloud DB Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-full">
                  <Database className="w-2.5 h-2.5 text-zinc-500" />
                  File Storage
                </span>
              )}
            </h1>
          </div>
        </div>

        {saveStatus.message && (
          <div
            className={`hidden md:flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full font-mono transition-all animate-fadeIn ${
              saveStatus.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {saveStatus.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all bg-zinc-900/60"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => handleSave()}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-4 py-1.5 rounded-lg hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-white/5 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  active
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      active
                        ? 'bg-black text-white'
                        : item.badge.includes('new')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Editor Panel */}
        <main className="flex-1 min-w-0">
          {/* TAB: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
                <h2 className="text-base font-bold text-white mb-2">Core Profile Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, name: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Handle / Slug</label>
                    <input
                      type="text"
                      value={data.profile.handle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, handle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Professional Headline</label>
                  <input
                    type="text"
                    value={data.profile.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, title: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Tagline / Mission</label>
                  <textarea
                    rows={2}
                    value={data.profile.tagline}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Primary Contact Email</label>
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, email: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Location</label>
                    <input
                      type="text"
                      value={data.profile.location}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: { ...data.profile, location: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                    />
                  </div>
                </div>

                {/* Avatar Controls */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Profile Photo / Avatar</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={hero.showAvatar}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              hero: { ...hero, showAvatar: e.target.checked },
                            },
                          })
                        }
                        className="w-4 h-4 rounded accent-white"
                      />
                      <span>Show Avatar in Hero</span>
                    </label>
                  </div>

                  <input
                    type="url"
                    value={hero.avatarUrl || data.profile.avatar || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, avatar: e.target.value },
                        settings: {
                          ...data.settings,
                          hero: { ...hero, avatarUrl: e.target.value },
                        },
                      })
                    }
                    placeholder="https://images.unsplash.com/... or image URL"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                {/* Bio Paragraphs */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-zinc-400 uppercase">
                      Detailed Bio Paragraphs
                    </label>
                    <button
                      onClick={() =>
                        setData({
                          ...data,
                          profile: {
                            ...data.profile,
                            bio: [...data.profile.bio, 'New bio paragraph...'],
                          },
                        })
                      }
                      className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.profile.bio.map((paragraph, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={paragraph}
                          onChange={(e) => {
                            const newBio = [...data.profile.bio];
                            newBio[pIdx] = e.target.value;
                            setData({
                              ...data,
                              profile: { ...data.profile, bio: newBio },
                            });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white resize-none"
                        />
                        <button
                          onClick={() => {
                            const newBio = [...data.profile.bio];
                            newBio.splice(pIdx, 1);
                            setData({
                              ...data,
                              profile: { ...data.profile, bio: newBio },
                            });
                          }}
                          className="p-1.5 text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Beacon & Hero Buttons */}
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
                <h2 className="text-base font-bold text-white mb-2">Live Availability Beacon & Hero Buttons</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={data.profile.status.available}
                        onChange={(e) =>
                          setData({
                            ...data,
                            profile: {
                              ...data.profile,
                              status: { ...data.profile.status, available: e.target.checked },
                            },
                          })
                        }
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <span>Active Beacon (Pulsing)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Badge Category Label
                    </label>
                    <input
                      type="text"
                      value={hero.statusBadgePrefix || 'Status'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            hero: { ...hero, statusBadgePrefix: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                      placeholder="Status / Notice / Focus"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Status Message
                    </label>
                    <input
                      type="text"
                      value={data.profile.status.text}
                      onChange={(e) =>
                        setData({
                          ...data,
                          profile: {
                            ...data.profile,
                            status: { ...data.profile.status, text: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={hero.exploreButtonText || 'Explore Work'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            hero: { ...hero, exploreButtonText: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Primary CTA Target
                    </label>
                    <input
                      type="text"
                      value={hero.exploreButtonHref || '#projects'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            hero: { ...hero, exploreButtonHref: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Copy Email Button Text
                    </label>
                    <input
                      type="text"
                      value={hero.copyEmailText || 'Copy email'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            hero: { ...hero, copyEmailText: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Metrics Editor */}
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">Metrics Counters Row</h2>
                    <p className="text-xs text-zinc-400">Add, edit, or remove statistical highlight cards.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newMetric: Metric = { label: 'New Metric', value: '100%' };
                      setData({
                        ...data,
                        profile: { ...data.profile, metrics: [...data.profile.metrics, newMetric] },
                      });
                    }}
                    className="flex items-center gap-1 text-xs bg-white text-black font-semibold px-3 py-1.5 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.profile.metrics.map((metric, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-2 relative group">
                      <button
                        onClick={() => {
                          const updated = [...data.profile.metrics];
                          updated.splice(i, 1);
                          setData({
                            ...data,
                            profile: { ...data.profile, metrics: updated },
                          });
                        }}
                        className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-rose-400"
                        title="Delete Metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase">Value</label>
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => {
                            const newMetrics = [...data.profile.metrics];
                            newMetrics[i].value = e.target.value;
                            setData({
                              ...data,
                              profile: { ...data.profile, metrics: newMetrics },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-sm font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase">Label</label>
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => {
                            const newMetrics = [...data.profile.metrics];
                            newMetrics[i].label = e.target.value;
                            setData({
                              ...data,
                              profile: { ...data.profile, metrics: newMetrics },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: HEADER & NAVIGATION */}
          {activeTab === 'navigation' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Header & Navigation Customizer</h2>
                <p className="text-xs text-zinc-400">
                  Configure your logo badge, navigation links, header button text, and resume toggle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Logo Monogram</label>
                  <input
                    type="text"
                    value={header.logoBadge}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          header: { ...header, logoBadge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono"
                    placeholder="sv7"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Brand Title</label>
                  <input
                    type="text"
                    value={header.brandTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          header: { ...header, brandTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                    placeholder="sv7.dev"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Sub-Brand Beacon Text</label>
                  <input
                    type="text"
                    value={header.badgeSubtitle || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          header: { ...header, badgeSubtitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                    placeholder="HKUST Astrix"
                  />
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase font-mono">Header Action Buttons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Right CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={header.ctaText}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            header: { ...header, ctaText: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Right CTA Target Href
                    </label>
                    <input
                      type="text"
                      value={header.ctaHref}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            header: { ...header, ctaHref: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={header.showResumeButton !== false}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              header: { ...header, showResumeButton: e.target.checked },
                            },
                          })
                        }
                        className="w-4 h-4 rounded accent-white"
                      />
                      <span>Show Resume / CV Button</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Resume Button Label
                    </label>
                    <input
                      type="text"
                      value={header.resumeButtonText || 'Resume / CV'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            header: { ...header, resumeButtonText: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Links list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase">
                    Navigation Menu Items
                  </span>
                  <button
                    onClick={() => {
                      const updated = [
                        ...(header.navLinks || []),
                        { name: 'New Link', href: '#section', enabled: true },
                      ];
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          header: { ...header, navLinks: updated },
                        },
                      });
                    }}
                    className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Nav Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(header.navLinks || []).map((link, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={link.enabled !== false}
                        onChange={(e) => {
                          const updated = [...(header.navLinks || [])];
                          updated[lIdx].enabled = e.target.checked;
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              header: { ...header, navLinks: updated },
                            },
                          });
                        }}
                        className="w-4 h-4 rounded accent-white"
                        title="Enable/Disable link"
                      />
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => {
                          const updated = [...(header.navLinks || [])];
                          updated[lIdx].name = e.target.value;
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              header: { ...header, navLinks: updated },
                            },
                          });
                        }}
                        className="w-36 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                        placeholder="Link Name"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const updated = [...(header.navLinks || [])];
                          updated[lIdx].href = e.target.value;
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              header: { ...header, navLinks: updated },
                            },
                          });
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                        placeholder="#projects or https://..."
                      />
                      <button
                        onClick={() => {
                          const updated = [...(header.navLinks || [])];
                          updated.splice(lIdx, 1);
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              header: { ...header, navLinks: updated },
                            },
                          });
                        }}
                        className="p-1.5 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECTION HEADINGS */}
          {activeTab === 'headings' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Section Titles & Eyebrows</h2>
                <p className="text-xs text-zinc-400">
                  Full control over the headline, eyebrow badge, and subtitle text for each homepage section.
                </p>
              </div>

              {[
                {
                  key: 'projects',
                  name: 'Projects Section',
                  eyebrow: 'projectsEyebrow',
                  title: 'projectsTitle',
                  subtitle: 'projectsSubtitle',
                },
                {
                  key: 'skills',
                  name: 'Skills Section',
                  eyebrow: 'skillsEyebrow',
                  title: 'skillsTitle',
                  subtitle: 'skillsSubtitle',
                },
                {
                  key: 'experience',
                  name: 'Experience Section',
                  eyebrow: 'experienceEyebrow',
                  title: 'experienceTitle',
                  subtitle: 'experienceSubtitle',
                },
                {
                  key: 'education',
                  name: 'Education Section',
                  eyebrow: 'educationEyebrow',
                  title: 'educationTitle',
                  subtitle: 'educationSubtitle',
                },
                {
                  key: 'contact',
                  name: 'Contact Section',
                  eyebrow: 'contactEyebrow',
                  title: 'contactTitle',
                  subtitle: 'contactSubtitle',
                },
              ].map((sec) => (
                <div key={sec.key} className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase font-mono">{sec.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Eyebrow Badge Text
                      </label>
                      <input
                        type="text"
                        value={(headings as any)[sec.eyebrow] || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              headings: {
                                ...headings,
                                [sec.eyebrow]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Main Section Title
                      </label>
                      <input
                        type="text"
                        value={(headings as any)[sec.title] || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              headings: {
                                ...headings,
                                [sec.title]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Subtitle / Section Intro
                    </label>
                    <textarea
                      rows={2}
                      value={(headings as any)[sec.subtitle] || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            headings: {
                              ...headings,
                              [sec.subtitle]: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Project Showcase</h2>
                  <p className="text-xs text-zinc-400">Add, edit, reorder, or delete engineering projects.</p>
                </div>
                <button
                  onClick={() => {
                    const newProj: Project = {
                      id: `proj-${Date.now()}`,
                      title: 'New Engineering System',
                      category: 'Aerospace & Systems',
                      description: 'Project summary and engineering design focus.',
                      longDescription: 'Technical details, aerodynamic models, and mechanism design.',
                      featured: false,
                      tags: ['SolidWorks', 'Python'],
                      demoUrl: 'https://sv7.dev',
                      githubUrl: 'https://github.com',
                    };
                    setData({ ...data, projects: [newProj, ...data.projects] });
                  }}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4 transition-all"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-500">#{index + 1}</span>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[index].title = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/40 focus:outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveProject(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveProject(index, 'down')}
                          disabled={index === data.projects.length - 1}
                          className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this project?')) {
                              setData({
                                ...data,
                                projects: data.projects.filter((p) => p.id !== project.id),
                              });
                            }
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 ml-2"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={project.category}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[index].category = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 pb-2">
                          <input
                            type="checkbox"
                            checked={project.featured}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[index].featured = e.target.checked;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-4 h-4 rounded accent-amber-400"
                          />
                          <span>Mark as Featured Project</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Short Summary (Card View)
                      </label>
                      <textarea
                        rows={2}
                        value={project.description}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[index].description = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Architecture & Engineering Notes (Modal View)
                      </label>
                      <textarea
                        rows={2}
                        value={project.longDescription || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[index].longDescription = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white resize-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Live Demo / Documentation Link
                        </label>
                        <input
                          type="url"
                          value={project.demoUrl || ''}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[index].demoUrl = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={project.githubUrl || ''}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[index].githubUrl = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={project.tags ? project.tags.join(', ') : ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[index].tags = e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean);
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Skills Matrix & Categories</h2>
                  <p className="text-xs text-zinc-400">Configure engineering disciplines and proficiency levels.</p>
                </div>
                <button
                  onClick={() => {
                    const newCat: SkillCategory = {
                      category: 'New Domain',
                      items: [{ name: 'Skill item', level: 'Proficient' }],
                    };
                    setData({ ...data, skills: [...data.skills, newCat] });
                  }}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.skills.map((categoryGroup, catIdx) => (
                  <div
                    key={catIdx}
                    className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <input
                        type="text"
                        value={categoryGroup.category}
                        onChange={(e) => {
                          const updated = [...data.skills];
                          updated[catIdx].category = e.target.value;
                          setData({ ...data, skills: updated });
                        }}
                        className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = [...data.skills];
                            updated[catIdx].items.push({ name: 'New Skill', level: 'Proficient' });
                            setData({ ...data, skills: updated });
                          }}
                          className="flex items-center gap-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg border border-white/10"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Skill</span>
                        </button>
                        <button
                          onClick={() => {
                            const updated = [...data.skills];
                            updated.splice(catIdx, 1);
                            setData({ ...data, skills: updated });
                          }}
                          className="p-1 text-zinc-500 hover:text-rose-400"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryGroup.items.map((skill, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-white/5"
                        >
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[catIdx].items[itemIdx].name = e.target.value;
                              setData({ ...data, skills: updated });
                            }}
                            className="flex-1 px-2 py-1 bg-transparent text-xs text-white focus:outline-none"
                            placeholder="Skill name"
                          />
                          <input
                            type="text"
                            value={skill.level || ''}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[catIdx].items[itemIdx].level = e.target.value;
                              setData({ ...data, skills: updated });
                            }}
                            className="w-28 px-2 py-1 bg-zinc-900 border border-white/5 rounded text-[11px] font-mono text-zinc-400 focus:outline-none"
                            placeholder="Level / Domain"
                          />
                          <button
                            onClick={() => {
                              const updated = [...data.skills];
                              updated[catIdx].items.splice(itemIdx, 1);
                              setData({ ...data, skills: updated });
                            }}
                            className="p-1 text-zinc-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Experience & Career Track</h2>
                  <p className="text-xs text-zinc-400">Manage rocketry teams, tutoring, and leadership roles.</p>
                </div>
                <button
                  onClick={() => {
                    const newExp: ExperienceItem = {
                      id: `exp-${Date.now()}`,
                      role: 'Junior Engineer',
                      company: 'Organization',
                      period: '2026 — Present',
                      description: 'Role overview and contributions.',
                      highlights: ['Achievement 1', 'Achievement 2'],
                    };
                    setData({ ...data, experience: [newExp, ...data.experience] });
                  }}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.experience.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[index].role = e.target.value;
                            setData({ ...data, experience: updated });
                          }}
                          className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:outline-none"
                        />
                        <span className="text-xs text-zinc-500">at</span>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => {
                            const updated = [...data.experience];
                            updated[index].company = e.target.value;
                            setData({ ...data, experience: updated });
                          }}
                          className="text-sm font-semibold text-zinc-300 bg-transparent border-b border-transparent hover:border-white/20 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Delete this role?')) {
                            setData({
                              ...data,
                              experience: data.experience.filter((e) => e.id !== item.id),
                            });
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Period / Timeline
                      </label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[index].period = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Role Summary
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[index].description = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Highlights & Contributions (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={item.highlights ? item.highlights.join('\n') : ''}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[index].highlights = e.target.value
                            .split('\n')
                            .filter(Boolean);
                          setData({ ...data, experience: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Education & Degrees</h2>
                  <p className="text-xs text-zinc-400">Manage undergraduate programs and secondary diplomas.</p>
                </div>
                <button
                  onClick={() => {
                    const newEdu: EducationItem = {
                      id: `edu-${Date.now()}`,
                      degree: 'Degree Program',
                      institution: 'University / School',
                      period: '2025 — 2029',
                      location: 'Hong Kong',
                      score: '',
                      highlights: ['Key course or focus'],
                    };
                    setData({
                      ...data,
                      education: [newEdu, ...(data.education || [])],
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.education?.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <input
                        type="text"
                        value={item.degree}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[index].degree = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        placeholder="Degree Title"
                        className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:outline-none flex-1"
                      />
                      <button
                        onClick={() => {
                          if (confirm('Delete this education entry?')) {
                            setData({
                              ...data,
                              education: data.education.filter((e) => e.id !== item.id),
                            });
                          }
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 ml-2"
                        title="Delete Degree"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Institution / School
                        </label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[index].institution = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Timeline / Dates
                        </label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[index].period = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={item.location || ''}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[index].location = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Score / Status Badge
                        </label>
                        <input
                          type="text"
                          value={item.score || ''}
                          onChange={(e) => {
                            const updated = [...data.education];
                            updated[index].score = e.target.value;
                            setData({ ...data, education: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Key Subjects & Coursework Highlights (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={item.highlights ? item.highlights.join('\n') : ''}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[index].highlights = e.target.value
                            .split('\n')
                            .filter(Boolean);
                          setData({ ...data, education: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Certifications & Standardized Exams</h2>
                  <p className="text-xs text-zinc-400">Manage IELTS, GCSE, MYP, and professional credentials.</p>
                </div>
                <button
                  onClick={() => {
                    const newCert: CertificationItem = {
                      id: `cert-${Date.now()}`,
                      title: 'Certificate Name',
                      issuer: 'Issuer Organization',
                      date: '2026',
                      score: '',
                      details: '',
                    };
                    setData({
                      ...data,
                      certifications: [newCert, ...(data.certifications || [])],
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certificate</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.certifications?.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[index].title = e.target.value;
                          setData({ ...data, certifications: updated });
                        }}
                        className="font-bold text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:outline-none flex-1"
                      />
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            certifications: data.certifications.filter((c) => c.id !== cert.id),
                          });
                        }}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/5 ml-2"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Issuer
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[index].issuer = e.target.value;
                            setData({ ...data, certifications: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[index].date = e.target.value;
                            setData({ ...data, certifications: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                          Score / Result
                        </label>
                        <input
                          type="text"
                          value={cert.score || ''}
                          onChange={(e) => {
                            const updated = [...data.certifications];
                            updated[index].score = e.target.value;
                            setData({ ...data, certifications: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Sub-scores / Breakdown Details
                      </label>
                      <input
                        type="text"
                        value={cert.details || ''}
                        onChange={(e) => {
                          const updated = [...data.certifications];
                          updated[index].details = e.target.value;
                          setData({ ...data, certifications: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TERMINAL WIDGET */}
          {activeTab === 'terminal' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Interactive CLI Terminal Widget</h2>
                <p className="text-xs text-zinc-400">
                  Customize the terminal window title, command prompt, copy feedback, and payload preview.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Window Title</label>
                  <input
                    type="text"
                    value={terminal.windowTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          terminal: { ...terminal, windowTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Command Prompt</label>
                  <input
                    type="text"
                    value={terminal.commandPrompt}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          terminal: { ...terminal, commandPrompt: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Copy Button Label</label>
                  <input
                    type="text"
                    value={terminal.copyButtonText}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          terminal: { ...terminal, copyButtonText: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Copied Feedback Text</label>
                  <input
                    type="text"
                    value={terminal.copiedText}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          terminal: { ...terminal, copiedText: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                  Custom Terminal Output Payload (JSON / Plaintext)
                </label>
                <textarea
                  rows={8}
                  value={terminal.customOutput}
                  onChange={(e) =>
                    setData({
                      ...data,
                      settings: {
                        ...data.settings,
                        terminal: { ...terminal, customOutput: e.target.value },
                      },
                    })
                  }
                  className="w-full p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs text-zinc-300 font-mono leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB: CONTACT & FORM */}
          {activeTab === 'contact' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Contact Dispatch & Form Labels</h2>
                <p className="text-xs text-zinc-400">
                  Granularly edit every field label, input placeholder, and button text on the contact section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Form Header Title</label>
                  <input
                    type="text"
                    value={contact.formTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, formTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Submit Button Label</label>
                  <input
                    type="text"
                    value={contact.submitButtonText}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, submitButtonText: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Subject Field Label</label>
                  <input
                    type="text"
                    value={contact.subjectLabel}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, subjectLabel: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Subject Placeholder</label>
                  <input
                    type="text"
                    value={contact.subjectPlaceholder}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, subjectPlaceholder: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Message Field Label</label>
                  <input
                    type="text"
                    value={contact.messageLabel}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, messageLabel: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Message Placeholder</label>
                  <input
                    type="text"
                    value={contact.messagePlaceholder}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, messagePlaceholder: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Direct Inquiries Card Title</label>
                  <input
                    type="text"
                    value={contact.directTitle}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, directTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Response Time Note</label>
                  <input
                    type="text"
                    value={contact.responseDisclaimer}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          contact: { ...contact, responseDisclaimer: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              {/* CLOUDFLARE EMAIL PRIVACY SHIELD SETTINGS */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Cloudflare Email Privacy & Anti-Scraping Shield</h3>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-white block">
                        Hide Personal Email From Web Scrapers
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        When enabled, your private email is never rendered in public HTML or mailto links. Visitors use the on-site dispatch form, keeping you 100% spam-free.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={contact.hideEmailAddress !== false}
                        onChange={(e) => {
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              contact: {
                                ...contact,
                                hideEmailAddress: e.target.checked,
                              },
                            },
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-black"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Notification Alert Email (Where you receive inquiries)
                      </label>
                      <input
                        type="email"
                        placeholder="your-personal@gmail.com"
                        value={contact.notificationEmail || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              contact: { ...contact, notificationEmail: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-zinc-500 block mt-1">
                        Requires <code className="text-zinc-300">RESEND_API_KEY</code> in Vercel for automated email alerts.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                        Public Display Alias (Never reveals real email)
                      </label>
                      <input
                        type="text"
                        placeholder="contact@sv7.dev"
                        value={contact.publicDisplayEmail || 'contact@sv7.dev'}
                        onChange={(e) =>
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              contact: { ...contact, publicDisplayEmail: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      Optional Instant Webhook (Discord / Slack / Telegram)
                    </label>
                    <input
                      type="text"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={contact.webhookUrl || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          settings: {
                            ...data.settings,
                            contact: { ...contact, webhookUrl: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                    />
                  </div>

                  {/* Cloudflare Routing Quick Info */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-zinc-300 space-y-1.5">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Cloudflare Email Routing Protection</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      With Cloudflare Email Routing enabled for <strong>sv7.dev</strong>, all incoming emails sent to <code className="text-zinc-200">contact@sv7.dev</code> are forwarded to your personal Gmail inbox seamlessly. Neither scrapers nor public crawlers can ever see your real address in DNS or webpage code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-zinc-300" />
                      <span>Inquiries Inbox & Visitor Dispatches</span>
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Messages received directly from your sv7.dev contact form. Private, spam-protected, and stored securely.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchMessages}
                      disabled={loadingMessages}
                      className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all bg-zinc-900/60"
                      title="Refresh messages"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 border border-white/5 px-2.5 py-1 rounded-lg">
                      Total: {messages.length} ({unreadCount} new)
                    </span>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                    <Inbox className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-zinc-300 mb-1">No Inquiries Received Yet</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      When visitors send a dispatch through the contact form on sv7.dev, you will see their message right here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Message List */}
                    <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                      {messages.map((msg) => {
                        const isSelected = selectedMessage?.id === msg.id;
                        return (
                          <div
                            key={msg.id}
                            onClick={() => {
                              setSelectedMessage(msg);
                              if (!msg.read) {
                                handleMarkRead(msg.id);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-zinc-800/80 border-white/30 shadow-md'
                                : msg.read
                                ? 'bg-zinc-950/50 border-white/5 hover:border-white/10 hover:bg-zinc-950'
                                : 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-white truncate max-w-[150px]">
                                {msg.name}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {!msg.read && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                                )}
                                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs font-medium text-zinc-200 truncate mb-1">
                              {msg.subject}
                            </p>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Message Viewer */}
                    <div className="lg:col-span-7">
                      {selectedMessage ? (
                        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-5 h-full flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
                              <div>
                                <h3 className="text-sm font-bold text-white">
                                  {selectedMessage.subject}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                                  <span>From:</span>
                                  <span className="text-white font-medium">{selectedMessage.name}</span>
                                  <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="text-zinc-400 hover:text-white underline font-mono text-[11px]"
                                  >
                                    &lt;{selectedMessage.email}&gt;
                                  </a>
                                </div>
                              </div>
                              <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                                {new Date(selectedMessage.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 text-xs text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap selection:bg-white selection:text-black">
                              {selectedMessage.message}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                                  'Re: ' + selectedMessage.subject
                                )}`}
                                className="flex items-center gap-1.5 text-xs font-semibold bg-white text-black px-3.5 py-1.5 rounded-lg hover:bg-zinc-200 transition-all shadow-sm"
                              >
                                <Reply className="w-3.5 h-3.5" />
                                <span>Reply to {selectedMessage.name}</span>
                              </a>

                              {!selectedMessage.read && (
                                <button
                                  onClick={() => handleMarkRead(selectedMessage.id)}
                                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Mark Read</span>
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-all"
                              title="Delete dispatch"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-zinc-950/40 border border-dashed border-white/10">
                          <Mail className="w-8 h-8 text-zinc-600 mb-2" />
                          <p className="text-xs font-medium text-zinc-400">
                            Select an inquiry on the left to read and reply.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PHOTOGRAPHY & PEXELS */}
          {activeTab === 'photography' && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h2 className="text-base font-bold text-white">Photography &amp; Pexels Synchronization</h2>
                      <p className="text-xs text-zinc-400">
                        Showcase your photography gallery at <code className="text-zinc-200">/photography</code> and auto-pull from Pexels.com.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="/photography"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all shadow-sm"
                    >
                      <span>Preview Live Gallery</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Pexels Integration Config Box */}
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                        Pexels Account Integration
                      </h3>
                    </div>
                    <a
                      href="https://www.pexels.com/api/new/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Get Free Pexels API Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                        Pexels Profile URL
                      </label>
                      <input
                        type="text"
                        value={data.photographySettings?.pexelsProfileUrl || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            photographySettings: {
                              ...data.photographySettings,
                              title: data.photographySettings?.title || 'Visual Archive & Photography',
                              subtitle: data.photographySettings?.subtitle || '',
                              pexelsProfileUrl: e.target.value,
                            },
                          })
                        }
                        placeholder="https://www.pexels.com/@your-username"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                        Pexels Username / Handle
                      </label>
                      <input
                        type="text"
                        value={data.photographySettings?.pexelsUsername || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            photographySettings: {
                              ...data.photographySettings,
                              title: data.photographySettings?.title || 'Visual Archive & Photography',
                              subtitle: data.photographySettings?.subtitle || '',
                              pexelsUsername: e.target.value,
                            },
                          })
                        }
                        placeholder="your-username"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                        Pexels API Key (Free)
                      </label>
                      <input
                        type="password"
                        value={data.photographySettings?.pexelsApiKey || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            photographySettings: {
                              ...data.photographySettings,
                              title: data.photographySettings?.title || 'Visual Archive & Photography',
                              subtitle: data.photographySettings?.subtitle || '',
                              pexelsApiKey: e.target.value,
                            },
                          })
                        }
                        placeholder="Paste your Pexels API key (or set PEXELS_API_KEY in Vercel)..."
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        Get your API key instantly in 30 seconds at pexels.com/api/new.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                        Pexels Collection Link or ID
                      </label>
                      <input
                        type="text"
                        value={data.photographySettings?.pexelsCollectionId || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            photographySettings: {
                              ...data.photographySettings,
                              title: data.photographySettings?.title || 'Visual Archive & Photography',
                              subtitle: data.photographySettings?.subtitle || '',
                              pexelsCollectionId: e.target.value,
                            },
                          })
                        }
                        placeholder="https://www.pexels.com/collections/... or collection ID"
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">
                        Paste the full link to your Pexels collection (or leave blank to sync all collections in your account).
                      </span>
                    </div>
                  </div>

                  {/* Sync Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleSyncPexels}
                      disabled={syncingPexels}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all disabled:opacity-50 shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingPexels ? 'animate-spin' : ''}`} />
                      <span>{syncingPexels ? 'Pulling from Pexels...' : 'Pull & Sync Photos from Pexels Now'}</span>
                    </button>

                    {pexelsSyncStatus && (
                      <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                        {pexelsSyncStatus}
                      </div>
                    )}
                  </div>
                </div>

                {/* Page Presentation Settings */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    Gallery Presentation Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={data.photographySettings?.title || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            photographySettings: {
                              ...data.photographySettings,
                              title: e.target.value,
                              subtitle: data.photographySettings?.subtitle || '',
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={data.photographySettings?.subtitle || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            photographySettings: {
                              ...data.photographySettings,
                              title: data.photographySettings?.title || 'Visual Archive & Photography',
                              subtitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                      Curator Bio / Artist Statement
                    </label>
                    <textarea
                      rows={2}
                      value={data.photographySettings?.bio || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          photographySettings: {
                            ...data.photographySettings,
                            title: data.photographySettings?.title || 'Visual Archive & Photography',
                            subtitle: data.photographySettings?.subtitle || '',
                            bio: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* PHOTOS CURATION & REORDER LIST */}
              <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Curated Photographs ({data.photos?.length || 0})
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Reorder, categorize, or fine-tune captions and camera EXIF information.
                    </p>
                  </div>

                  {/* Quick Add photo input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Paste Pexels photo URL or ID..."
                      className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white min-w-[220px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualPhoto}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Frame</span>
                    </button>
                  </div>
                </div>

                {/* Photos List */}
                {(!data.photos || data.photos.length === 0) ? (
                  <div className="text-center py-12 text-xs text-zinc-500 font-mono">
                    No photographs in the archive yet. Click &quot;Pull &amp; Sync Photos from Pexels Now&quot; above to import your library.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.photos.map((photo, idx) => (
                      <div
                        key={photo.id || idx}
                        className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Thumbnail */}
                        <div className="w-full md:w-36 h-28 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.src?.small || photo.src?.medium || photo.src?.original}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          {photo.featured && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold font-mono uppercase">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Editable details */}
                        <div className="flex-1 space-y-3 w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                                Title / Headline
                              </label>
                              <input
                                type="text"
                                value={photo.title}
                                onChange={(e) => {
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = { ...photo, title: e.target.value };
                                  setData({ ...data, photos: updated });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white font-medium"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                                Category
                              </label>
                              <select
                                value={photo.category || 'Aerospace & Aviation'}
                                onChange={(e) => {
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = { ...photo, category: e.target.value };
                                  setData({ ...data, photos: updated });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
                              >
                                <option value="Aerospace & Aviation">Aerospace &amp; Aviation</option>
                                <option value="Architecture & Geometry">Architecture &amp; Geometry</option>
                                <option value="Urban & Nocturne">Urban &amp; Nocturne</option>
                                <option value="Nature & Textures">Nature &amp; Textures</option>
                              </select>
                            </div>
                          </div>

                          {/* Camera & EXIF details */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div>
                              <label className="block text-[9px] font-mono text-zinc-500 uppercase">Camera</label>
                              <input
                                type="text"
                                value={photo.camera || ''}
                                onChange={(e) => {
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = { ...photo, camera: e.target.value };
                                  setData({ ...data, photos: updated });
                                }}
                                placeholder="Sony Alpha 7 IV"
                                className="w-full px-2 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[11px] text-zinc-200"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-zinc-500 uppercase">Lens</label>
                              <input
                                type="text"
                                value={photo.lens || ''}
                                onChange={(e) => {
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = { ...photo, lens: e.target.value };
                                  setData({ ...data, photos: updated });
                                }}
                                placeholder="FE 24-70mm"
                                className="w-full px-2 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[11px] text-zinc-200"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-zinc-500 uppercase">Aperture / Shutter</label>
                              <input
                                type="text"
                                value={`${photo.aperture || 'f/2.8'} • ${photo.shutterSpeed || '1/500s'}`}
                                onChange={(e) => {
                                  const parts = e.target.value.split('•').map((s) => s.trim());
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = {
                                    ...photo,
                                    aperture: parts[0] || photo.aperture,
                                    shutterSpeed: parts[1] || photo.shutterSpeed,
                                  };
                                  setData({ ...data, photos: updated });
                                }}
                                className="w-full px-2 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[11px] text-zinc-200 font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-zinc-500 uppercase">Location</label>
                              <input
                                type="text"
                                value={photo.location || ''}
                                onChange={(e) => {
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = { ...photo, location: e.target.value };
                                  setData({ ...data, photos: updated });
                                }}
                                placeholder="Hong Kong SAR"
                                className="w-full px-2 py-1 rounded-lg bg-zinc-900 border border-white/10 text-[11px] text-zinc-200"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-400 hover:text-white">
                              <input
                                type="checkbox"
                                checked={Boolean(photo.featured)}
                                onChange={(e) => {
                                  const updated = [...(data.photos || [])];
                                  updated[idx] = { ...photo, featured: e.target.checked };
                                  setData({ ...data, photos: updated });
                                }}
                                className="w-3.5 h-3.5 rounded accent-white"
                              />
                              <span>Feature on hero cover</span>
                            </label>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                                title="Move Earlier"
                              >
                                <MoveUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(idx, 'down')}
                                disabled={idx === (data.photos?.length || 0) - 1}
                                className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                                title="Move Later"
                              >
                                <MoveDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(idx)}
                                className="p-1 text-zinc-500 hover:text-rose-400 ml-2"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SECTION FLOW & TOGGLES */}
          {activeTab === 'flow' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Homepage Flow & Order</h2>
                <p className="text-xs text-zinc-400">
                  Reorder which sections appear first, second, or third, and toggle their visibility.
                </p>
              </div>

              {/* Section Visibility Toggles */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">Section Visibility Toggles</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'heroMetrics', label: 'Hero Metrics Counters' },
                    { key: 'projects', label: 'Selected Works & Projects' },
                    { key: 'skills', label: 'Technical Capabilities Matrix' },
                    { key: 'experience', label: 'Experience & Milestones' },
                    { key: 'education', label: 'Education & Academics' },
                    { key: 'certifications', label: 'Certifications & Honors' },
                    { key: 'terminalCard', label: 'Interactive Terminal CLI' },
                    { key: 'contact', label: 'Contact & Inquiries' },
                  ].map((sec) => (
                    <div
                      key={sec.key}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-between"
                    >
                      <span className="text-xs font-medium text-white">{sec.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(settings.sectionVisibility as any)?.[sec.key] !== false}
                          onChange={(e) => {
                            setData({
                              ...data,
                              settings: {
                                ...data.settings,
                                sectionVisibility: {
                                  ...data.settings.sectionVisibility,
                                  [sec.key]: e.target.checked,
                                },
                              },
                            });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-black"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Sequence Order */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  Homepage Section Vertical Sequence (Drag / Up & Down)
                </span>
                <div className="space-y-2">
                  {(settings.sectionOrder || ['projects', 'skills', 'experience', 'education', 'terminalCard', 'contact']).map(
                    (secKey, idx, arr) => (
                      <div
                        key={secKey}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-500">#{idx + 1}</span>
                          <span className="text-xs font-semibold text-white capitalize">
                            {secKey.replace('Card', ' CLI')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === arr.length - 1}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SOCIALS */}
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Social Channels & Links</h2>
                  <p className="text-xs text-zinc-400">Manage external profiles, LinkedIn, and contact channels.</p>
                </div>
                <button
                  onClick={() => {
                    const newSocial: Social = { name: 'New Link', url: 'https://', icon: 'link' };
                    setData({ ...data, socials: [...data.socials, newSocial] });
                  }}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-3 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.socials.map((social, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-white/10"
                  >
                    <input
                      type="text"
                      value={social.name}
                      onChange={(e) => {
                        const updated = [...data.socials];
                        updated[idx].name = e.target.value;
                        setData({ ...data, socials: updated });
                      }}
                      className="w-36 px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-white"
                      placeholder="Platform"
                    />
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => {
                        const updated = [...data.socials];
                        updated[idx].url = e.target.value;
                        setData({ ...data, socials: updated });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-white font-mono"
                      placeholder="https://..."
                    />
                    <button
                      onClick={() => {
                        const updated = [...data.socials];
                        updated.splice(idx, 1);
                        setData({ ...data, socials: updated });
                      }}
                      className="p-1.5 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FOOTER & CUSTOM LINKS */}
          {activeTab === 'footer' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Footer Configuration & Custom Links</h2>
                <p className="text-xs text-zinc-400">
                  Manage footer copyright holder name, credit disclaimer, and custom external links.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Copyright Holder</label>
                  <input
                    type="text"
                    value={footer.copyrightName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          footer: { ...footer, copyrightName: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">Footer Tagline</label>
                  <input
                    type="text"
                    value={footer.footerNote}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          footerNote: e.target.value,
                          footer: { ...footer, footerNote: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              {/* Custom Footer Links */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase">Custom Footer Links</span>
                  <button
                    onClick={() => {
                      const updated = [...(footer.customLinks || []), { name: 'Privacy', url: '/privacy' }];
                      setData({
                        ...data,
                        settings: {
                          ...data.settings,
                          footer: { ...footer, customLinks: updated },
                        },
                      });
                    }}
                    className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(footer.customLinks || []).map((link, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-white/5">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => {
                          const updated = [...(footer.customLinks || [])];
                          updated[fIdx].name = e.target.value;
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              footer: { ...footer, customLinks: updated },
                            },
                          });
                        }}
                        className="w-32 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...(footer.customLinks || [])];
                          updated[fIdx].url = e.target.value;
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              footer: { ...footer, customLinks: updated },
                            },
                          });
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => {
                          const updated = [...(footer.customLinks || [])];
                          updated.splice(fIdx, 1);
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              footer: { ...footer, customLinks: updated },
                            },
                          });
                        }}
                        className="p-1 text-zinc-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">SEO &amp; Social Link Previews</h2>
                    <p className="text-xs text-zinc-400">
                      Fine-tune search engine ranking, rich link unfurls, and Google crawler indexing.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full font-bold">
                  Auto-Synced with sitemap.xml &amp; robots.txt
                </span>
              </div>

              {/* LIVE PREVIEW CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Google Search Result Preview */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider pb-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Search className="w-3.5 h-3.5 text-sky-400" />
                      Google Search Result Preview
                    </span>
                    <span className="text-[10px] text-zinc-500">Google SERP</span>
                  </div>

                  <div className="pt-2 space-y-1 font-sans">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="w-4 h-4 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                        sv
                      </div>
                      <span className="text-zinc-300 text-xs">
                        {data.settings.canonicalUrl || 'https://sv7.dev'}
                      </span>
                      <span className="text-zinc-600">&rsaquo;</span>
                      <span className="text-zinc-500 text-xs">portfolio</span>
                    </div>

                    <h3 className="text-sm font-medium text-sky-400 hover:underline cursor-pointer line-clamp-1 leading-snug">
                      {data.settings.metaTitle || 'sv7.dev — Engineering & Systems'}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {data.settings.metaDescription ||
                        'Official portfolio and systems engineering showcase of Shreyaan Vashishtha.'}
                    </p>
                  </div>
                </div>

                {/* Social Card Preview */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider pb-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                      Social Media Card Preview
                    </span>
                    <span className="text-[10px] text-zinc-500">X / iMessage / Discord</span>
                  </div>

                  <div className="pt-2 rounded-xl overflow-hidden border border-white/10 bg-zinc-900/80">
                    {data.settings.ogImageUrl ? (
                      <div className="h-32 w-full bg-zinc-950 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={data.settings.ogImageUrl}
                          alt="Social preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-3.5 flex flex-col justify-between border-b border-white/5 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {data.settings.siteName || 'sv7.dev'}
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                            HKUST Astrix
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-white tracking-tight">
                            {data.profile?.name || 'Shreyaan Vashishtha'}
                          </div>
                          <div className="text-[11px] text-sky-400 font-medium line-clamp-1">
                            {data.profile?.title || 'Mechanical & Aerospace Engineering'}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {['Descent Control', 'SolidWorks CAD', 'Python'].map((pill) => (
                            <span
                              key={pill}
                              className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-zinc-300"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 bg-zinc-900 space-y-0.5">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        {(data.settings.canonicalUrl || 'https://sv7.dev').replace(/^https?:\/\//, '')}
                      </div>
                      <div className="text-xs font-semibold text-white line-clamp-1">
                        {data.settings.metaTitle || 'sv7.dev'}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-1">
                        {data.settings.metaDescription || ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* INPUT FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                    Site Brand Name
                  </label>
                  <input
                    type="text"
                    value={data.settings.siteName}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, siteName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                    placeholder="sv7.dev"
                  />
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Displays in title template and Knowledge Graph
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                    Canonical Base URL
                  </label>
                  <input
                    type="text"
                    value={data.settings.canonicalUrl || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, canonicalUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono"
                    placeholder="https://sv7.dev"
                  />
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Used for sitemap.xml, robots.txt, and canonical tags
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">
                    SEO Title Tag
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      (data.settings.metaTitle || '').length > 60
                        ? 'text-amber-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {(data.settings.metaTitle || '').length} / 60 chars (ideal: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={data.settings.metaTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      settings: { ...data.settings, metaTitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">
                    SEO Meta Description
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      (data.settings.metaDescription || '').length > 160
                        ? 'text-amber-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {(data.settings.metaDescription || '').length} / 160 chars (ideal: 140-160)
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={data.settings.metaDescription}
                  onChange={(e) =>
                    setData({
                      ...data,
                      settings: { ...data.settings, metaDescription: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white resize-none"
                />
              </div>

              {/* KEYWORDS MANAGER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-zinc-400 uppercase">
                    Search Engine Keywords &amp; Topics
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {(data.settings.keywords || []).length} keywords
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-zinc-950 border border-white/10 min-h-[48px] items-center">
                  {(data.settings.keywords || []).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200 border border-white/10 font-sans"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.settings.keywords || []).filter((_, i) => i !== idx);
                          setData({
                            ...data,
                            settings: { ...data.settings, keywords: updated },
                          });
                        }}
                        className="text-zinc-400 hover:text-rose-400 text-sm leading-none"
                        title="Remove keyword"
                      >
                        &times;
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    placeholder="Add keyword (press Enter or comma)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim().replace(/,/g, '');
                        if (val && !(data.settings.keywords || []).includes(val)) {
                          setData({
                            ...data,
                            settings: {
                              ...data.settings,
                              keywords: [...(data.settings.keywords || []), val],
                            },
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 min-w-[200px] bg-transparent text-xs text-white placeholder-zinc-500 outline-none px-2 py-1"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Keywords are embedded into HTML meta tags and Schema.org metadata for search indexing.
                </p>
              </div>

              {/* TWITTER HANDLE & SOCIAL IMAGE OVERRIDE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                    Twitter / X Creator Handle
                  </label>
                  <input
                    type="text"
                    value={data.settings.twitterHandle || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, twitterHandle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono"
                    placeholder="@shreyaanv"
                  />
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Used for twitter:creator and twitter:site cards
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                    Resume / CV File Path
                  </label>
                  <input
                    type="text"
                    value={data.settings.cvUrl || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        settings: { ...data.settings, cvUrl: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono"
                    placeholder="/CV-Shreyaan-Vashishtha.pdf"
                  />
                  <span className="text-[11px] text-zinc-500 mt-0.5 block">
                    Target link for the Header &amp; Hero CV buttons
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase">
                  Custom Social Sharing Image URL (Optional Override)
                </label>
                <input
                  type="text"
                  value={data.settings.ogImageUrl || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      settings: { ...data.settings, ogImageUrl: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono"
                  placeholder="https://... (leave empty to use dynamic Next.js card)"
                />
                <span className="text-[11px] text-zinc-500 mt-0.5 block">
                  Leave blank to automatically use the high-resolution dynamic dark-mode card generated by <code className="text-zinc-300">/opengraph-image</code>.
                </span>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <label className="block text-xs font-mono text-zinc-300 uppercase font-semibold">
                      Master Passkey Security
                    </label>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    &apos;admin&apos; Disabled
                  </span>
                </div>
                <input
                  type="text"
                  value={data.settings.adminPasskey || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      settings: {
                        ...data.settings,
                        adminPasskey: e.target.value,
                        adminPassword: e.target.value,
                      },
                    })
                  }
                  placeholder="Enter new master passkey (e.g. sv7-passkey-2026)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white font-mono focus:border-emerald-500/50"
                />
                <div className="text-[11px] text-zinc-400 leading-relaxed space-y-1">
                  <p>
                    The default password <code className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">&apos;admin&apos;</code> is permanently disabled and rejected for your security.
                  </p>
                  <p>
                    Set your custom passkey above and click <strong>Save All Changes</strong>. You can also permanently enforce it in Vercel using the <code className="text-zinc-200 bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10 font-mono">ADMIN_PASSKEY</code> environment variable.
                  </p>
                </div>
              </div>

              {/* BIOMETRIC / TOUCH ID PASSKEY CARD */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <label className="block text-xs font-mono text-zinc-300 uppercase font-semibold">
                      Biometric Passkey (Touch ID / Fingerprint)
                    </label>
                  </div>
                  {hasRegisteredBiometrics ? (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Touch ID Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 border border-white/10 px-2 py-0.5 rounded-full">
                      Not Configured
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Register your device&apos;s fingerprint sensor (Apple Touch ID, Android Biometrics, or Windows Hello) to sign in to this admin console with a single tap.
                </p>

                {biometricsStatus && (
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                    {biometricsStatus}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRegisterBiometrics}
                    disabled={loading}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Fingerprint className="w-3.5 h-3.5 text-zinc-900" />
                    <span>{hasRegisteredBiometrics ? 'Add / Re-register This Device' : 'Register Fingerprint / Touch ID'}</span>
                  </button>

                  {hasRegisteredBiometrics && (
                    <button
                      type="button"
                      onClick={handleClearBiometrics}
                      disabled={loading}
                      className="text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2.5 rounded-xl border border-rose-500/20 transition-all"
                    >
                      Remove Biometrics
                    </button>
                  )}
                </div>
              </div>

              {/* CLOUD DATABASE INTEGRATION CARD */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Instant Cloud Database (Free Vercel KV)</h3>
                  </div>
                  {isDatabaseConnected ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Connected &amp; Live
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                      Not Connected (Using Local File)
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Connect a free cloud database to make your website <strong>100% editable from anywhere with instant global updates</strong> (no git commits required).
                  </p>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold block">
                      Quick 1-Click Setup in Vercel:
                    </span>
                    <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                      <li>Go to your <strong>Vercel Dashboard</strong> and click your <strong>sv7</strong> project.</li>
                      <li>Click the <strong>Storage</strong> tab at the top &rarr; click <strong>Create Database</strong>.</li>
                      <li>Select <strong>KV</strong> (free tier: 30,000 commands/day).</li>
                      <li>Click <strong>Create</strong>, then click <strong>Connect to Project</strong>.</li>
                    </ol>
                    <p className="text-[11px] text-emerald-400/90 pt-1">
                      That&apos;s it! Vercel automatically links the credentials. Edits in this panel will be live to every visitor within 10 milliseconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RAW JSON EDITOR */}
          {activeTab === 'rawjson' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">Direct Raw JSON Configuration</h2>
                  <p className="text-xs text-zinc-400">
                    Live raw JSON editor. Edit or paste configuration directly with syntax checking.
                  </p>
                </div>
                <button
                  onClick={handleApplyRawJson}
                  className="flex items-center gap-1.5 text-xs bg-white text-black font-semibold px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Apply & Save JSON</span>
                </button>
              </div>

              {jsonError && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <textarea
                rows={24}
                value={rawJsonText}
                onChange={(e) => {
                  setRawJsonText(e.target.value);
                  setJsonError('');
                }}
                className="w-full p-4 rounded-2xl bg-zinc-950 border border-white/10 text-xs text-zinc-200 font-mono focus:outline-none focus:border-white/30 resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}

          {/* TAB: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Data Storage & Portability</h2>
                <p className="text-xs text-zinc-400">
                  Export snapshot backups or restore from an uploaded JSON file anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Export Snapshot</h3>
                  <p className="text-xs text-zinc-400">
                    Download the entire site configuration as a clean, portable JSON file.
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 bg-zinc-800 text-zinc-200 hover:text-white px-4 py-2 rounded-xl text-xs font-medium border border-white/10 hover:bg-zinc-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-white/5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Restore from Backup</h3>
                  <p className="text-xs text-zinc-400">
                    Upload a previously exported JSON file to populate all editor fields.
                  </p>
                  <label className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-200 hover:text-white px-4 py-2 rounded-xl text-xs font-medium border border-white/10 hover:bg-zinc-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Choose JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
