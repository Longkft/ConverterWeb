'use client';

import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Settings, 
  UploadCloud, 
  Download, 
  Check, 
  Terminal, 
  Gamepad2,
  User,
  Calendar,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const NETWORKS = [
  { id: 'facebook', name: 'Facebook (Meta)', abb: 'FB', zip: true },
  { id: 'google', name: 'Google Ads', abb: 'GG', zip: true },
  { id: 'ironsource', name: 'IronSource', abb: 'IS', zip: false },
  { id: 'applovin', name: 'AppLovin', abb: 'AL', zip: false },
  { id: 'unityads', name: 'Unity Ads', abb: 'UN', zip: false },
  { id: 'mintegral', name: 'Mintegral', abb: 'MT', zip: true },
  { id: 'tiktok', name: 'TikTok', abb: 'TT', zip: true },
  { id: 'vungle', name: 'Vungle', abb: 'VG', zip: false },
  { id: 'aarki', name: 'Aarki', abb: 'AK', zip: false },
  { id: 'adcolony', name: 'AdColony', abb: 'AC', zip: false },
  { id: 'appreciate', name: 'Appreciate', abb: 'AP', zip: true },
  { id: 'dv360', name: 'Display & Video 360', abb: 'DV', zip: true },
  { id: 'liftoff', name: 'Liftoff', abb: 'LO', zip: true },
  { id: 'moloco', name: 'Moloco', abb: 'ML', zip: false },
  { id: 'remerge', name: 'Remerge', abb: 'RM', zip: true },
  { id: 'tencent', name: 'Tencent', abb: 'TC', zip: true },
  { id: 'mraid', name: 'MRAID (Generic)', abb: 'MR', zip: false },
  { id: 'adikteev', name: 'Adikteev', abb: 'AT', zip: false },
  { id: 'bigabid', name: 'BigaBid', abb: 'BB', zip: false },
  { id: 'fbgaming', name: 'Facebook Gaming', abb: 'FG', zip: true },
  { id: 'gam', name: 'Google Ad Manager', abb: 'GM', zip: true },
  { id: 'inmobi', name: 'InMobi', abb: 'IM', zip: false },
  { id: 'snapchat', name: 'Snapchat', abb: 'SC', zip: false },
  { id: 'youappi', name: 'YouAppi', abb: 'YA', zip: false }
];

export default function Home() {
  // Input configuration states
  const [gameName, setGameName] = useState('');
  const [paName, setPaName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [dateCode, setDateCode] = useState('');
  
  // Link overriding states
  const [overrideLinks, setOverrideLinks] = useState(false);
  const [androidLink, setAndroidLink] = useState('');
  const [iosLink, setIosLink] = useState('');

  // Selected networks state
  const [selectedNetworkIds, setSelectedNetworkIds] = useState(
    NETWORKS.map(net => net.id)
  );

  // File upload states
  const [uploadedHtmlContent, setUploadedHtmlContent] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedFileSize, setUploadedFileSize] = useState(null);
  
  // Drag states
  const [isDragging, setIsDragging] = useState(false);

  // Log states
  const [logs, setLogs] = useState(['Waiting for file...']);
  const [showLogs, setShowLogs] = useState(false);

  // Processing state
  const [isConverting, setIsConverting] = useState(false);

  const fileInputRef = useRef(null);
  const logEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Set date code on component mount
  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    setDateCode(`${dd}${mm}${yy}`);
  }, []);

  const addLog = (msg) => {
    setShowLogs(true);
    setLogs((prev) => [...prev, msg]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.html')) {
      alert('Please select a valid HTML file.');
      return;
    }

    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / 1024 / 1024).toFixed(2));

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedHtmlContent(e.target.result);
      addLog(`File loaded successfully: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const toggleSelectAll = () => {
    if (selectedNetworkIds.length === NETWORKS.length) {
      setSelectedNetworkIds([]);
    } else {
      setSelectedNetworkIds(NETWORKS.map(n => n.id));
    }
  };

  const toggleNetwork = (id) => {
    setSelectedNetworkIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConvert = async () => {
    if (!uploadedHtmlContent) return;

    const game = gameName.trim() || 'Game';
    const pa = paName.trim() || 'PA';
    const creator = creatorName.trim() || 'Creator';
    const date = dateCode.trim() || '000000';

    const selectedNetworks = NETWORKS.filter(n => selectedNetworkIds.includes(n.id));

    if (selectedNetworks.length === 0) {
      alert('Please select at least one network!');
      return;
    }

    setIsConverting(true);
    addLog(`--- Starting Conversion ---`);
    const zip = new JSZip();
    const zipPromises = [];

    try {
      selectedNetworks.forEach(net => {
        addLog(`Processing ${net.name}...`);
        let newContent = uploadedHtmlContent;

        // 0. Remove the Luna Remote Debugging script (console.re wrapper)
        newContent = newContent.replace(
          /<script>\(\(\)\s*=>\s*\{\s*let\s+[a-zA-Z_]\s*=\s*window\.insertYourRemoteDebuggingTokenHere[\s\S]*?\}\)\(\)<\/script>/g, 
          ''
        );

        // 0.1 Remove all external tracking, debugging, and CDN URLs (EXCEPT Play Store / App Store links).
        newContent = newContent.replace(
          /https?:\/\/(?!(play\.google\.com|itunes\.apple\.com|apps\.apple\.com))[a-zA-Z0-9\.\-\/\?\&\=\_]+/gi, 
          ''
        );

        // 0.2 Find and remove the last two <script> tags unconditionally
        const scriptMatches = newContent.match(/<script[^>]*>[\s\S]*?<\/script>/ig);
        if (scriptMatches && scriptMatches.length >= 2) {
          const lastScript = scriptMatches[scriptMatches.length - 1];
          const secondToLastScript = scriptMatches[scriptMatches.length - 2];

          const lastIdx = newContent.lastIndexOf(lastScript);
          if (lastIdx !== -1) {
            newContent = newContent.substring(0, lastIdx) + newContent.substring(lastIdx + lastScript.length);
          }

          const secondLastIdx = newContent.lastIndexOf(secondToLastScript);
          if (secondLastIdx !== -1) {
            newContent = newContent.substring(0, secondLastIdx) + newContent.substring(secondLastIdx + secondToLastScript.length);
          }
        }

        // 1. Replace targetPlatform
        newContent = newContent.replace(/targetPlatform:\s*"[^"]+"/g, `targetPlatform:"${net.id}"`);

        // 3. Add extra requirements & specific scripts based on network
        let extraScripts = "";

        switch (net.id) {
          // =============== MRAID NETWORKS ===============
          case 'applovin':
          case 'ironsource':
          case 'unityads':
          case 'adcolony':
          case 'vungle':
          case 'aarki':
          case 'mraid':
          case 'adikteev':
          case 'bigabid':
          case 'inmobi':
          case 'snapchat':
          case 'youappi':
            extraScripts = `
<script>!function () { var n = !1, e = !1; function t() { return mraid.isViewable() && "hidden" !== mraid.getState() } function a() { n ? t() && e ? (window.dispatchEvent(new Event("luna:resume")), e = !1) : t() || e || (window.dispatchEvent(new Event("luna:pause")), e = !0) : t() && (window.dispatchEvent(new Event("luna:start")), n = !0) } function i() { } function d(n) { window.dispatchEvent(new Event(n ? "luna:unsafe:unmute" : "luna:unsafe:mute")) } var r = function () { "undefined" != typeof mraid ? (mraid.removeEventListener("ready", r), mraid.addEventListener("viewableChange", a), mraid.addEventListener("stateChange", a), mraid.addEventListener("orientationchange", i), mraid.addEventListener("audioVolumeChange", d), a()) : window.dispatchEvent(new Event("luna:start")) }; window.addEventListener("luna:build", (function () { window.pi.logLoaded(), "undefined" != typeof mraid ? "loading" === mraid.getState() ? mraid.addEventListener("ready", r) : r() : window.dispatchEvent(new Event("luna:start")) })) }()</script>
<script>window.addEventListener("luna:build", (function () { Bridge.ready((function () { Luna.Unity.Playable.InstallFullGame = function (n, i) { window.pi.logCta(), n = n || window.$environment.packageConfig.iosLink, i = i || window.$environment.packageConfig.androidLink; const o = /iphone|ipad|ipod|macintosh/i.test(window.navigator.userAgent.toLowerCase()) ? n : i; "undefined" != typeof mraid ? mraid.open(o) : (console.warn("Mraid is not defined"), window.open(o, "_blank")) } })) }))</script>`;
            break;

          // =============== GOOGLE / EXIT API NETWORKS ===============
          case 'google':
          case 'dv360':
          case 'gam':
            if (!newContent.includes('name="ad.size"')) {
              newContent = newContent.replace('</head>', '<meta name="ad.size" content="width=320,height=480">\n</head>');
            }
            extraScripts = `
<script>window.addEventListener("luna:build", (function () { window.pi.logLoaded(), window.dispatchEvent(new Event("luna:start")) }))</script>
<script>window.addEventListener("luna:build", (() => { Bridge.ready((() => { Luna.Unity.Playable.InstallFullGame = function () { window.ExitApi.exit() } })) }))</script>`;
            break;

          // =============== MINTEGRAL ===============
          case 'mintegral':
            extraScripts = `
<script>window.gameClose = function () { window.dispatchEvent(new Event("luna:pause")) }, window.addEventListener("luna:build", (() => { Bridge.ready((() => { Luna.Unity.Playable.InstallFullGame = function () { window.pi.logCta(), window.gameEnd && window.gameEnd() ,window.install && window.install() } })) })), window.addEventListener("luna:ended", (() => { window.gameEnd && window.gameEnd() }))</script>
<script>window.addEventListener("luna:build", (() => { window.pi.logLoaded(), window.dispatchEvent(new Event("luna:unsafe:pause")), window.dispatchEvent(new Event("luna:start")) })), window.addEventListener("luna:started", (() => { window.gameReady && window.gameReady() })), window.gameStart = function () { window.dispatchEvent(new Event("luna:unsafe:resume")) }</script>`;
            break;

          // =============== TIKTOK / APP STORE APIS ===============
          case 'tiktok':
          case 'moloco':
            extraScripts = `
<script>!function(){function a(){document.hidden?(window.dispatchEvent(new Event("luna:pause")),window.dispatchEvent(new Event("luna:unsafe:mute"))):(window.dispatchEvent(new Event("luna:resume")),window.dispatchEvent(new Event("luna:unsafe:unmute")))}window.addEventListener("luna:build",(function(){window.pi.logLoaded(),window.dispatchEvent(new Event("luna:start")),document.addEventListener("visibilitychange",a)}))}()</script>
<script>window.addEventListener("luna:build", (function () { Bridge.ready((function () { Luna.Unity.Playable.InstallFullGame = function (n, i) { window.pi.logCta(), n = n || window.$environment.packageConfig.iosLink, i = i || window.$environment.packageConfig.androidLink; const o = /iphone|ipad|ipod|macintosh/i.test(window.navigator.userAgent.toLowerCase()) ? n : i; typeof window.openAppStore === "function" ? window.openAppStore() : (window.playableSDK && typeof window.playableSDK.openAppStore === "function" ? window.playableSDK.openAppStore() : (console.warn("PlayableSDK is not defined"), window.open(o, "_blank"))) } })) }))</script>`;
            break;

          // =============== STANDARD WINDOW.OPEN FALLBACK ===============
          case 'facebook':
          case 'fbgaming':
          case 'appreciate':
          case 'liftoff':
          case 'remerge':
          case 'tencent':
          default:
            extraScripts = `
<script>!function(){function a(){document.hidden?(window.dispatchEvent(new Event("luna:pause")),window.dispatchEvent(new Event("luna:unsafe:mute"))):(window.dispatchEvent(new Event("luna:resume")),window.dispatchEvent(new Event("luna:unsafe:unmute")))}window.addEventListener("luna:build",(function(){window.pi.logLoaded(),window.dispatchEvent(new Event("luna:start")),document.addEventListener("visibilitychange",a)}))}()</script>
<script>window.addEventListener("luna:build", (function () { Bridge.ready((function () { Luna.Unity.Playable.InstallFullGame = function (n, i) { window.pi.logCta(), n = n || window.$environment.packageConfig.iosLink, i = i || window.$environment.packageConfig.androidLink; const o = /iphone|ipad|ipod|macintosh/i.test(window.navigator.userAgent.toLowerCase()) ? n : i; window.open(o, "_blank"); } })) }))</script>`;
            break;
        }

        // Handle Custom Links Replacement
        if (overrideLinks) {
          const customAndroid = androidLink.trim();
          const customIos = iosLink.trim();

          if (customAndroid) {
            extraScripts = extraScripts.replace(/window\.\$environment\.packageConfig\.androidLink/g, `"${customAndroid}"`);
            newContent = newContent.replace(/androidLink\s*:\s*"[^"]*"/g, `androidLink: "${customAndroid}"`);
          }
          if (customIos) {
            extraScripts = extraScripts.replace(/window\.\$environment\.packageConfig\.iosLink/g, `"${customIos}"`);
            newContent = newContent.replace(/iosLink\s*:\s*"[^"]*"/g, `iosLink: "${customIos}"`);
          }
        }

        // Append extra scripts before closing body
        if (extraScripts !== "") {
          newContent = newContent.replace('</body>', extraScripts + '\n</body>');
        }

        // Generate Filename
        const cleanNetworkName = net.name.replace(/[^a-zA-Z0-9]/g, '');
        const baseFilename = `${cleanNetworkName}_${game}_${pa}_${creator}${date}`;

        // Add to zip structure
        if (net.zip) {
          const innerZip = new JSZip();
          innerZip.file('index.html', newContent);
          const innerZipPromise = innerZip.generateAsync({ type: "blob" }).then(blob => {
            zip.file(`${baseFilename}.zip`, blob);
            addLog(`Created ${baseFilename}.zip`);
          });
          zipPromises.push(innerZipPromise);
        } else {
          zip.file(`${baseFilename}.html`, newContent);
          addLog(`Created ${baseFilename}.html`);
        }
      });

      await Promise.all(zipPromises);

      addLog(`Zipping files... Please wait.`);
      const masterZipContent = await zip.generateAsync({ type: "blob" });

      saveAs(masterZipContent, `${game}_Playables_${date}.zip`);
      addLog(`✓ Done! Download triggered.`);

    } catch (err) {
      addLog(`❌ Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <header className="text-center space-y-2 mt-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Luna Playable Converter
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Automatically convert and optimize Luna Playable ads for multiple networks in one click.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings Panel */}
          <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Settings className="w-5 h-5 text-indigo-400" />
              <span>Naming Configuration</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-slate-500" /> Game Name
                </label>
                <input 
                  type="text" 
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="e.g. MyGame" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" /> PA Name (Level)
                </label>
                <input 
                  type="text" 
                  value={paName}
                  onChange={(e) => setPaName(e.target.value)}
                  placeholder="e.g. Lvl1" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" /> Creator Name
                </label>
                <input 
                  type="text" 
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Thanh" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date Code
                </label>
                <input 
                  type="text" 
                  value={dateCode}
                  onChange={(e) => setDateCode(e.target.value)}
                  placeholder="DDMMYY" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Custom Links */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex justify-between items-center">
                <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-300 tracking-wider cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={overrideLinks}
                    onChange={(e) => setOverrideLinks(e.target.checked)}
                    className="w-4 h-4 text-indigo-500 bg-slate-950 border-slate-800 rounded focus:ring-indigo-500 focus:ring-2 accent-indigo-500"
                  />
                  <span className="group-hover:text-white transition-colors uppercase">Override Store Links</span>
                </label>
              </div>
              
              <div className={`grid grid-cols-1 gap-3 transition-all duration-350 ${overrideLinks ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    Android Link <span className="text-slate-500 font-normal lowercase">(leave blank to keep original)</span>
                  </label>
                  <input 
                    type="text" 
                    value={androidLink}
                    onChange={(e) => setAndroidLink(e.target.value)}
                    disabled={!overrideLinks}
                    placeholder="https://play.google.com/store/apps/details?id=..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    iOS Link <span className="text-slate-500 font-normal lowercase">(leave blank to keep original)</span>
                  </label>
                  <input 
                    type="text" 
                    value={iosLink}
                    onChange={(e) => setIosLink(e.target.value)}
                    disabled={!overrideLinks}
                    placeholder="https://apps.apple.com/app/id..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Networks Selection */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Ad Networks</label>
                <button 
                  onClick={toggleSelectAll}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  {selectedNetworkIds.length === NETWORKS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {NETWORKS.map(net => {
                  const isChecked = selectedNetworkIds.includes(net.id);
                  return (
                    <label 
                      key={net.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all group relative overflow-hidden ${
                        isChecked 
                          ? 'border-indigo-500/50 bg-indigo-500/5' 
                          : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3 z-10">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => toggleNetwork(net.id)}
                          className="w-4 h-4 text-indigo-500 bg-slate-950 border-slate-800 rounded focus:ring-indigo-500 focus:ring-2 accent-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                          {net.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 z-10">
                        {net.abb}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upload & Progress Panel */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* Dropzone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`bg-slate-900/40 rounded-2xl p-8 border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden text-center ${
                isDragging 
                  ? 'border-indigo-400 bg-indigo-950/20' 
                  : uploadedHtmlContent
                    ? 'border-emerald-500/40 bg-emerald-950/5 hover:border-emerald-500/60' 
                    : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html" 
                className="hidden"
              />
              
              <div className="z-10 pointer-events-none transform group-hover:scale-105 transition-transform duration-300 space-y-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border transition-all ${
                  uploadedHtmlContent 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10'
                }`}>
                  {uploadedHtmlContent ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <UploadCloud className="w-7 h-7" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-slate-200">
                    {uploadedFileName || 'Drop Luna HTML file here'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {uploadedFileSize ? `${uploadedFileSize} MB - Ready to convert!` : 'or click to browse local files'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleConvert}
              disabled={!uploadedHtmlContent || isConverting || selectedNetworkIds.length === 0}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg select-none ${
                !uploadedHtmlContent || selectedNetworkIds.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : isConverting
                    ? 'bg-indigo-700 text-white cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isConverting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Converting Playables...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Convert & Download ZIP</span>
                </>
              )}
            </button>
            
            {/* Output Log */}
            {showLogs && (
              <div className="flex-1 flex flex-col bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-950 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Console Logs
                  </span>
                  <button 
                    onClick={() => {
                      setLogs(['Waiting for file...']);
                      setShowLogs(false);
                    }}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-semibold"
                  >
                    Clear
                  </button>
                </div>
                <div className="p-4 h-48 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 space-y-1 custom-scrollbar">
                  {logs.map((log, index) => {
                    let color = 'text-slate-300';
                    if (log.startsWith('✓')) color = 'text-emerald-400 font-semibold';
                    else if (log.startsWith('❌') || log.startsWith('Error')) color = 'text-rose-400';
                    else if (log.startsWith('---')) color = 'text-indigo-400 font-bold';
                    else if (log.startsWith('>')) color = 'text-blue-400';
                    
                    return (
                      <div key={index} className={color}>
                        {log.startsWith('>') || log.startsWith('---') || log.startsWith('✓') || log.startsWith('❌') ? '' : '> '}
                        {log}
                      </div>
                    );
                  })}
                  <div ref={logEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
