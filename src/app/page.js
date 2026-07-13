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
  AlertCircle,
  Globe,
  ArrowRight,
  X
} from 'lucide-react';

const Instagram = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

function FadeIn({ children, delay = 0, duration = 1000 }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="transition-opacity" 
      style={{ 
        opacity: visible ? 1 : 0, 
        transitionDuration: `${duration}ms` 
      }}
    >
      {children}
    </div>
  );
}

function AnimatedHeading({ text }) {
  const charDelay = 120; // delay between character cycles for smooth waves
  const lines = text.includes('\\n') ? text.split('\\n') : text.split('\n');
  
  return (
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight text-center text-white" 
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIndex) => {
        let previousCharsCount = 0;
        for (let i = 0; i < lineIndex; i++) {
          previousCharsCount += lines[i].length;
        }

        return (
          <span key={lineIndex} className="block">
            {line.split('').map((char, charIndex) => {
              const overallIndex = previousCharsCount + charIndex;
              const delay = overallIndex * charDelay;
              const renderedChar = char === ' ' ? '\u00A0' : char;

              return (
                <span
                  key={charIndex}
                  className="char-glow-wave"
                  style={{
                    animationDelay: `${delay}ms`
                  }}
                >
                  {renderedChar}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}

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
  // --- CORE LUNA CONVERTER STATE ---
  const [gameName, setGameName] = useState('');
  const [paName, setPaName] = useState('PA');
  const [levelName, setLevelName] = useState('01');
  const [overrideLinks, setOverrideLinks] = useState(false);
  const [androidLink, setAndroidLink] = useState('');
  const [iosLink, setIosLink] = useState('');
  const [selectedNetworkIds, setSelectedNetworkIds] = useState(
    NETWORKS.map(net => net.id)
  );
  const [uploadedHtmlContent, setUploadedHtmlContent] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadedFileSize, setUploadedFileSize] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState(['Waiting for file...']);
  const [showLogs, setShowLogs] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // --- UI & MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [uploadedFilesList, setUploadedFilesList] = useState([]);

  // --- REFS ---
  const fileInputRef = useRef(null);
  const logEndRef = useRef(null);
  const videoRef = useRef(null);
  const fadeAnimRef = useRef(null);
  const fadingOutRef = useRef(false);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // No date code initialization needed

  // --- CUSTOM VIDEO JS FADE SYSTEM ---
  const startFade = (targetOpacity, duration, onComplete) => {
    // Each new fade cancels any running animation frame to prevent competing animations
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
    }
    const video = videoRef.current;
    if (!video) return;

    // Fades resume from the current opacity rather than snapping
    const startOpacity = parseFloat(video.style.opacity) || 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      video.style.opacity = currentOpacity.toFixed(4);

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(animate);
      } else {
        fadeAnimRef.current = null;
        if (onComplete) onComplete();
      }
    };
    fadeAnimRef.current = requestAnimationFrame(animate);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const timeLeft = video.duration - video.currentTime;
    // 500ms fade-out when 0.55 seconds remain before the video ends
    if (timeLeft <= 0.55 && !fadingOutRef.current) {
      fadingOutRef.current = true;
      startFade(0, 500);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    // On ended, opacity is set to 0
    video.style.opacity = '0';
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    // After 100ms the video resets to currentTime = 0, plays, and fades back in
    setTimeout(() => {
      video.currentTime = 0;
      video.play()
        .then(() => {
          fadingOutRef.current = false;
          startFade(1, 500);
        })
        .catch((err) => {
          console.error("Video loop autoplay failed:", err);
        });
    }, 100);
  };

  const handlePlay = () => {
    // 500ms requestAnimationFrame-based fade-in on load/loop start
    if (!fadingOutRef.current) {
      startFade(1, 500);
    }
  };

  // --- DRAG AND DROP HANDLERS ---
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
      if (isBatchMode) {
        processMultipleFiles(e.dataTransfer.files);
      } else {
        processFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (isBatchMode) {
        processMultipleFiles(e.target.files);
      } else {
        processFile(e.target.files[0]);
      }
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

  const processMultipleFiles = async (files) => {
    const newFiles = [];
    const promises = Array.from(files).map(file => {
      if (!file.name.toLowerCase().endsWith('.html')) {
        return Promise.resolve();
      }
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFiles.push({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            content: e.target.result
          });
          resolve();
        };
        reader.readAsText(file);
      });
    });
    await Promise.all(promises);
    if (newFiles.length > 0) {
      setUploadedFilesList(prev => [...prev, ...newFiles]);
      addLog(`Added ${newFiles.length} file(s) for batch processing.`);
    }
  };

  // --- GLOBAL DRAG AND DROP (FOR USER EXPERIENCE) ---
  const handleGlobalDragOver = (e) => {
    e.preventDefault();
    setIsGlobalDragging(true);
  };

  const handleGlobalDragLeave = () => {
    setIsGlobalDragging(false);
  };

  const handleGlobalDrop = (e) => {
    e.preventDefault();
    setIsGlobalDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      const htmlFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.html'));
      if (htmlFiles.length === 0) {
        alert('Please drop valid HTML files.');
        return;
      }
      
      setIsModalOpen(true);
      if (htmlFiles.length > 1) {
        setIsBatchMode(true);
        processMultipleFiles(htmlFiles);
      } else {
        setIsBatchMode(false);
        processFile(htmlFiles[0]);
      }
    }
  };

  // --- CORE CONVERTER LOGIC AND HELPER FUNCTIONS ---
  const addLog = (msg) => {
    setShowLogs(true);
    setLogs((prev) => [...prev, msg]);
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
    let filesToProcess = [];
    if (isBatchMode) {
      if (uploadedFilesList.length === 0) {
        alert('Please upload at least one HTML file!');
        return;
      }
      filesToProcess = uploadedFilesList;
    } else {
      if (!uploadedHtmlContent) {
        alert('Please upload a Luna HTML file!');
        return;
      }
      filesToProcess = [{
        name: uploadedFileName,
        content: uploadedHtmlContent
      }];
    }

    const game = gameName.trim() || 'Game';
    const pa = paName.trim() || 'PA';
    const level = levelName.trim() || '01';

    const selectedNetworks = NETWORKS.filter(n => selectedNetworkIds.includes(n.id));

    if (selectedNetworks.length === 0) {
      alert('Please select at least one network!');
      return;
    }

    setIsConverting(true);
    addLog(`--- Starting Conversion (Mode: ${isBatchMode ? 'Batch' : 'Single'}) ---`);

    try {
      if (isBatchMode) {
        // BATCH MODE: One ZIP per HTML file, all bundled into one master ZIP
        const masterZip = new JSZip();

        for (const fileItem of filesToProcess) {
          const fileContent = fileItem.content;
          const originalBaseName = fileItem.name.replace(/\.[^/.]+$/, "");
          
          addLog(`Creating ZIP package for ${fileItem.name}...`);
          const fileZip = new JSZip();
          const fileZipPromises = [];

          selectedNetworks.forEach(net => {
            addLog(`> Processing ${net.name} for ${fileItem.name}...`);
            let newContent = fileContent;

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

            // Generate Filename: {Tên_Mạng}_{Tên_File_HTML_Gốc}
            const cleanNetworkName = net.name.replace(/[^a-zA-Z0-9]/g, '');
            const baseFilename = `${cleanNetworkName}_${originalBaseName}`;

            // Add to inner ZIP or HTML
            if (net.zip) {
              const innerZip = new JSZip();
              innerZip.file('index.html', newContent);
              const innerZipPromise = innerZip.generateAsync({ type: "blob" }).then(blob => {
                fileZip.file(`${baseFilename}.zip`, blob);
                addLog(`  Created ${baseFilename}.zip`);
              });
              fileZipPromises.push(innerZipPromise);
            } else {
              fileZip.file(`${baseFilename}.html`, newContent);
              addLog(`  Created ${baseFilename}.html`);
            }
          });

          await Promise.all(fileZipPromises);
          addLog(`Zipping package for ${originalBaseName}...`);
          const fileZipBlob = await fileZip.generateAsync({ type: "blob" });
          masterZip.file(`${originalBaseName}.zip`, fileZipBlob);
          addLog(`✓ Packaged ${originalBaseName}.zip into master bundle.`);
        }

        addLog(`Creating master bundle package...`);
        const masterZipContent = await masterZip.generateAsync({ type: "blob" });
        saveAs(masterZipContent, 'Converted_Playables.zip');
        addLog(`✓ Done! Download triggered.`);
      } else {
        // SINGLE FILE MODE (exactly as before)
        const fileItem = filesToProcess[0];
        const zip = new JSZip();
        const zipPromises = [];

        selectedNetworks.forEach(net => {
          addLog(`Processing ${net.name}...`);
          let newContent = fileItem.content;

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
          const baseFilename = `${cleanNetworkName}_${game}_${pa}_${level}`;

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

        saveAs(masterZipContent, `${game}_${pa}_${level}.zip`);
        addLog(`✓ Done! Download triggered.`);
      } } catch (err) {
      addLog(`❌ Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div 
      className="min-h-screen bg-black overflow-hidden relative flex flex-col justify-between"
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      {/* BACKGROUND VIDEO */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        muted
        autoPlay
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* DRAG AND DROP OVERLAY NOTICE */}
      {isGlobalDragging && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-8 border-4 border-dashed border-white/20 m-4 rounded-3xl pointer-events-none transition-all">
          <div className="text-center space-y-4">
            <UploadCloud className="w-16 h-16 text-white/60 mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Drop your Luna HTML file here</h3>
            <p className="text-white/40 text-sm">To start conversion immediately</p>
          </div>
        </div>
      )}

      {/* HERO CONTENT AREA */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-6">
          {/* Floating Pill Tag */}
          <FadeIn delay={1400} duration={1000}>
            <div className="liquid-glass border border-white/20 px-5 py-2 rounded-full inline-flex items-center justify-center">
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider text-white/80 whitespace-nowrap">
                Fast. Secure. Automated.
              </span>
            </div>
          </FadeIn>

          {/* Animated Heading */}
          <AnimatedHeading text="Luna Playable\nHTML Converter." />

          {/* Subheading */}
          <FadeIn delay={800} duration={1000}>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed text-center">
              Instantly adapt and package your Luna HTML builds for all major ad networks.
            </p>
          </FadeIn>

          {/* Action Buttons */}
          <FadeIn delay={1200} duration={1000}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 w-full max-w-lg mx-auto">
              <button 
                onClick={() => {
                  setIsBatchMode(false);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-white text-black px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer text-xs sm:text-sm md:text-base"
              >
                Single File Converter
              </button>
              <button 
                onClick={() => {
                  setIsBatchMode(true);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto liquid-glass border border-white/20 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all cursor-pointer text-xs sm:text-sm md:text-base"
              >
                Batch Converter (Keep Names)
              </button>
            </div>
          </FadeIn>
        </div>
      </main>

      {/* LUNA PLAYABLE CONVERTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative liquid-glass rounded-3xl p-6 sm:p-8 max-w-4xl w-full text-white animate-fade-in-up space-y-6 shadow-2xl my-auto">
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title and Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 pr-10 sm:pr-0">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {isBatchMode ? (
                    <>
                      <UploadCloud className="w-6 h-6 text-emerald-400" />
                      <span>Batch Playable Converter</span>
                    </>
                  ) : (
                    <>
                      <Settings className="w-6 h-6 text-indigo-400" />
                      <span>Luna Playable Converter</span>
                    </>
                  )}
                </h2>
                <p className="text-white/60 text-xs mt-1">
                  {isBatchMode 
                    ? "Upload multiple HTML files; converted files will maintain their original names."
                    : "Configure settings, upload a Luna HTML file, and export for multiple target ad networks."
                  }
                </p>
              </div>

              {/* Mode Pill Toggle */}
              <div className="flex bg-black/40 p-1 rounded-full border border-white/5 shrink-0 select-none">
                <button
                  onClick={() => setIsBatchMode(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    !isBatchMode 
                      ? 'bg-white text-black shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Single File
                </button>
                <button
                  onClick={() => setIsBatchMode(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isBatchMode 
                      ? 'bg-white text-black shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Batch Mode
                </button>
              </div>
            </div>

            {/* Modal Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Settings Configuration Column */}
              <div className="md:col-span-7 space-y-5">
                {!isBatchMode && (
                  <>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
                      Naming Configuration
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 flex items-center gap-1">
                          <Gamepad2 className="w-3.5 h-3.5" /> Game Name
                        </label>
                        <input 
                          type="text" 
                          value={gameName}
                          onChange={(e) => setGameName(e.target.value)}
                          placeholder="e.g. MyGame" 
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" /> PA Name
                        </label>
                        <input 
                          type="text" 
                          value={paName}
                          onChange={(e) => setPaName(e.target.value)}
                          placeholder="e.g. PA" 
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-white/50 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Level Name
                        </label>
                        <input 
                          type="text" 
                          value={levelName}
                          onChange={(e) => setLevelName(e.target.value)}
                          placeholder="e.g. 01" 
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/35 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Custom Links Override */}
                <div className="pt-2 space-y-3">
                  <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={overrideLinks}
                      onChange={(e) => setOverrideLinks(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-black/40 focus:ring-0 focus:ring-offset-0 text-indigo-500"
                    />
                    <span className="uppercase tracking-wider font-semibold">Override Store Links</span>
                  </label>

                  {overrideLinks && (
                    <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/5 animate-fade-in-up">
                      <div className="space-y-1">
                        <label className="text-[11px] text-white/40">Android Link</label>
                        <input 
                          type="text" 
                          value={androidLink}
                          onChange={(e) => setAndroidLink(e.target.value)}
                          placeholder="https://play.google.com/store/apps/..." 
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-white/40">iOS Link</label>
                        <input 
                          type="text" 
                          value={iosLink}
                          onChange={(e) => setIosLink(e.target.value)}
                          placeholder="https://apps.apple.com/app/id..." 
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/25 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Networks selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Target Ad Networks
                    </h3>
                    <button 
                      onClick={toggleSelectAll}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
                    >
                      {selectedNetworkIds.length === NETWORKS.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 select-none border border-white/5 p-2 rounded-xl bg-black/20">
                    {NETWORKS.map(net => {
                      const isChecked = selectedNetworkIds.includes(net.id);
                      return (
                        <label 
                          key={net.id}
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                            isChecked 
                              ? 'border-indigo-500/50 bg-indigo-500/5' 
                              : 'border-white/5 bg-white/0 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => toggleNetwork(net.id)}
                              className="w-3.5 h-3.5 rounded border-white/10 bg-black/40 text-indigo-500 focus:ring-0"
                            />
                            <span className="text-xs text-white/80">{net.name}</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/50">
                            {net.abb}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Upload Dropzone & Action Column */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider border-b border-white/10 pb-2 mb-4">
                    {isBatchMode ? 'Luna Batch Files Upload' : 'Luna File Upload'}
                  </h3>

                  {isBatchMode && uploadedFilesList.length > 0 ? (
                    <div className="space-y-3 w-full text-left animate-fade-in-up">
                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-xs font-semibold text-white/50">
                          Uploaded Files ({uploadedFilesList.length})
                        </span>
                        <button 
                          onClick={() => setUploadedFilesList([])}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                        {uploadedFilesList.map((file, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs">
                            <div className="flex items-center gap-2 truncate flex-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="truncate font-medium text-white/90">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-2">
                              <span className="text-[10px] text-white/40">{file.size} MB</span>
                              <button 
                                onClick={() => setUploadedFilesList(prev => prev.filter((_, i) => i !== idx))}
                                className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-rose-400 transition-all cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 border border-dashed border-white/15 hover:border-white/30 rounded-xl text-center text-xs font-medium text-white/60 hover:text-white transition-all cursor-pointer bg-white/0 hover:bg-white/5"
                      >
                        + Add More Files
                      </button>
                    </div>
                  ) : (
                    /* Dropzone */
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`rounded-2xl p-6 border border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[180px] ${
                        isDragging 
                          ? 'border-indigo-400 bg-indigo-950/20' 
                          : (isBatchMode ? uploadedFilesList.length > 0 : uploadedHtmlContent)
                            ? 'border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500/60' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".html" 
                        multiple={isBatchMode}
                        className="hidden"
                      />
                      
                      <div className="space-y-2 pointer-events-none">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border ${
                          (!isBatchMode && uploadedHtmlContent) || (isBatchMode && uploadedFilesList.length > 0)
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-white/60'
                        }`}>
                          {(!isBatchMode && uploadedHtmlContent) || (isBatchMode && uploadedFilesList.length > 0) ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <UploadCloud className="w-6 h-6" />
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-white/90 truncate max-w-[200px] mx-auto">
                            {isBatchMode 
                              ? 'Upload HTML Files' 
                              : (uploadedFileName || 'Upload HTML')
                            }
                          </h4>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            {isBatchMode 
                              ? 'Drop one or more HTML files' 
                              : (uploadedFileSize ? `${uploadedFileSize} MB - Ready` : 'Drop Luna build HTML')
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversion trigger */}
                <div className="space-y-4">
                  <button 
                    onClick={handleConvert}
                    disabled={
                      (isBatchMode ? uploadedFilesList.length === 0 : !uploadedHtmlContent) || 
                      isConverting || 
                      selectedNetworkIds.length === 0
                    }
                    className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all select-none cursor-pointer ${
                      (isBatchMode ? uploadedFilesList.length === 0 : !uploadedHtmlContent) || selectedNetworkIds.length === 0
                        ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                        : isConverting
                          ? 'bg-indigo-600 text-white cursor-wait'
                          : 'bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isConverting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Convert & Download</span>
                      </>
                    )}
                  </button>

                  {/* Terminal Console Logs */}
                  {showLogs && (
                    <div className="flex flex-col bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner h-40">
                      <div className="bg-white/5 px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/50 flex items-center gap-1 uppercase tracking-wide">
                          <Terminal className="w-3 h-3 text-indigo-400" /> Console Logs
                        </span>
                        <button 
                          onClick={() => {
                            setLogs(['Waiting for file...']);
                            setShowLogs(false);
                          }}
                          className="text-[9px] text-white/40 hover:text-white/80 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="p-3 overflow-y-auto font-mono text-[10px] leading-relaxed text-white/70 space-y-0.5 scrollbar-thin">
                        {logs.map((log, index) => {
                          let color = 'text-white/70';
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
        </div>
      )}
    </div>
  );
}

