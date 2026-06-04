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
]; //

const elements = {
    gameName: document.getElementById('gameName'),
    paName: document.getElementById('paName'),
    creatorName: document.getElementById('creatorName'),
    dateCode: document.getElementById('dateCode'),
    networksContainer: document.getElementById('networksContainer'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    fileInput: document.getElementById('fileInput'),
    dropzone: document.getElementById('dropzone'),
    dropzoneTitle: document.getElementById('dropzoneTitle'),
    dropzoneSubtitle: document.getElementById('dropzoneSubtitle'),
    dropzoneIcon: document.getElementById('dropzoneIcon'),
    convertBtn: document.getElementById('convertBtn'),
    logArea: document.getElementById('logArea'),
    overrideLinksCb: document.getElementById('overrideLinksCb'),
    customLinksContainer: document.getElementById('customLinksContainer'),
    androidLinkInput: document.getElementById('androidLinkInput'),
    iosLinkInput: document.getElementById('iosLinkInput')
};

let uploadedHtmlContent = null;
let uploadedFileName = null;
let isAllSelected = true;

// Initialize Date
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yy = String(today.getFullYear()).slice(-2);
elements.dateCode.value = `${dd}${mm}${yy}`;

// Render network checkboxes
function renderNetworks() {
    elements.networksContainer.innerHTML = '';
    NETWORKS.forEach(net => {
        const label = document.createElement('label');
        label.className = `flex items-center p-3 rounded-lg border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-700/50 transition-colors group relative overflow-hidden`;

        label.innerHTML = `
            <div class="flex items-center space-x-3 z-10">
                <input type="checkbox" value="${net.id}" checked class="network-cb w-4 h-4 text-indigo-500 bg-gray-900 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2">
                <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">${net.name} <span class="text-gray-500 text-xs ml-1">(${net.abb})</span></span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
        `;
        elements.networksContainer.appendChild(label);
    });
}
renderNetworks();

// Store Link Overrides Toggle
elements.overrideLinksCb.addEventListener('change', (e) => {
    if (e.target.checked) {
        elements.customLinksContainer.classList.remove('opacity-50', 'pointer-events-none');
        elements.androidLinkInput.disabled = false;
        elements.iosLinkInput.disabled = false;
    } else {
        elements.customLinksContainer.classList.add('opacity-50', 'pointer-events-none');
        elements.androidLinkInput.disabled = true;
        elements.iosLinkInput.disabled = true;
    }
});

// Select All Toggle
elements.selectAllBtn.addEventListener('click', () => {
    isAllSelected = !isAllSelected;
    document.querySelectorAll('.network-cb').forEach(cb => {
        cb.checked = isAllSelected;
    });
    elements.selectAllBtn.textContent = isAllSelected ? 'Deselect All' : 'Select All';
});

// File Handling
elements.fileInput.addEventListener('change', handleFileSelect);
elements.dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropzone.classList.add('border-indigo-500', 'bg-gray-800/80');
});
elements.dropzone.addEventListener('dragleave', () => {
    elements.dropzone.classList.remove('border-indigo-500', 'bg-gray-800/80');
});
elements.dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.dropzone.classList.remove('border-indigo-500', 'bg-gray-800/80');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
    }
});

function handleFileSelect(e) {
    if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
    }
}

function processFile(file) {
    if (!file.name.toLowerCase().endsWith('.html')) {
        alert('Please select a valid HTML file.');
        return;
    }

    elements.dropzoneTitle.textContent = file.name;
    elements.dropzoneSubtitle.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB - Ready to convert!`;
    elements.dropzoneIcon.classList.remove('text-indigo-400');
    elements.dropzoneIcon.classList.add('text-green-400', 'bg-green-500/20', 'border-green-500/30');
    elements.dropzoneIcon.innerHTML = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    const reader = new FileReader();
    reader.onload = function (e) {
        uploadedHtmlContent = e.target.result;
        uploadedFileName = file.name;
        elements.convertBtn.disabled = false;
        logMessage(`File loaded successfully: ${file.name}`);
    };
    reader.readAsText(file);
}

// Logging
function logMessage(msg) {
    elements.logArea.classList.remove('hidden');
    const div = document.createElement('div');
    div.textContent = `> ${msg}`;
    div.className = 'text-gray-300 mb-1';
    elements.logArea.appendChild(div);
    elements.logArea.scrollTop = elements.logArea.scrollHeight;
}

// Convert
elements.convertBtn.addEventListener('click', async () => {
    if (!uploadedHtmlContent) return;

    const game = elements.gameName.value.trim() || 'Game';
    const pa = elements.paName.value.trim() || 'PA';
    const creator = elements.creatorName.value.trim() || 'Creator';
    const date = elements.dateCode.value.trim() || '000000';

    // Get selected networks
    const selectedIds = Array.from(document.querySelectorAll('.network-cb:checked')).map(cb => cb.value);
    const selectedNetworks = NETWORKS.filter(n => selectedIds.includes(n.id));

    if (selectedNetworks.length === 0) {
        alert('Please select at least one network!');
        return;
    }

    elements.convertBtn.disabled = true;
    elements.convertBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> <span>Converting...</span>`;

    logMessage(`--- Starting Conversion ---`);
    const zip = new JSZip();
    const zipPromises = [];

    try {
        selectedNetworks.forEach(net => {
            logMessage(`Processing ${net.name}...`);
            let newContent = uploadedHtmlContent;

            // 0. Remove the Luna Remote Debugging script (console.re wrapper)
            // This explicitly fixes the "Do not override global console method" error for Mintegral/AppLovin
            newContent = newContent.replace(/<script>\(\(\)\s*=>\s*\{\s*let\s+[a-zA-Z_]\s*=\s*window\.insertYourRemoteDebuggingTokenHere[\s\S]*?\}\)\(\)<\/script>/g, '');

            // 0.1 Remove all external tracking, debugging, and CDN URLs (EXCEPT Play Store / App Store links).
            // and prevents the playable from trying to download assets from outside sources.
            newContent = newContent.replace(/https?:\/\/(?!(play\.google\.com|itunes\.apple\.com|apps\.apple\.com))[a-zA-Z0-9\.\-\/\?\&\=\_]+/gi, '');

            // 0.2 Find and remove the last two <script> tags unconditionally
            // This guarantees we eliminate the CTA click handler and the viewability tracker natively regardless of regex mismatches
            const scriptMatches = newContent.match(/<script[^>]*>[\s\S]*?<\/script>/ig);
            if (scriptMatches && scriptMatches.length >= 2) {
                const lastScript = scriptMatches[scriptMatches.length - 1];
                const secondToLastScript = scriptMatches[scriptMatches.length - 2];

                // Replace them string-wise from the end to avoid matching identical earlier scripts
                const lastIdx = newContent.lastIndexOf(lastScript);
                if (lastIdx !== -1) newContent = newContent.substring(0, lastIdx) + newContent.substring(lastIdx + lastScript.length);

                const secondLastIdx = newContent.lastIndexOf(secondToLastScript);
                if (secondLastIdx !== -1) newContent = newContent.substring(0, secondLastIdx) + newContent.substring(secondLastIdx + secondToLastScript.length);
            }

            // 1. Replace targetPlatform
            // Regex to find targetPlatform:"some_network" or targetPlatform: "some_network"
            newContent = newContent.replace(/targetPlatform:\s*"[^"]+"/g, `targetPlatform:"${net.id}"`);

            // 3. Add extra requirements & specific scripts based on network

            let extraScripts = "";

            switch (net.id) {
                // =============== MRAID NETWORKS ===============
                // These networks natively support the MRAID SDK for click & state tracking
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
                // These are HTML networks that rely on ExitApi standard and require explicit ad size wrapper
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

                // =============== STANDARD WINDOW.OPEN FALLBACK (Facebook, Tencent, etc.) ===============
                case 'facebook':
                case 'fbgaming':
                case 'appreciate':
                case 'liftoff':
                case 'remerge':
                case 'tencent':
                default:
                    // FB / Standard Networks usually default back to traditional target=_blank clicks
                    extraScripts = `
<script>!function(){function a(){document.hidden?(window.dispatchEvent(new Event("luna:pause")),window.dispatchEvent(new Event("luna:unsafe:mute"))):(window.dispatchEvent(new Event("luna:resume")),window.dispatchEvent(new Event("luna:unsafe:unmute")))}window.addEventListener("luna:build",(function(){window.pi.logLoaded(),window.dispatchEvent(new Event("luna:start")),document.addEventListener("visibilitychange",a)}))}()</script>
<script>window.addEventListener("luna:build", (function () { Bridge.ready((function () { Luna.Unity.Playable.InstallFullGame = function (n, i) { window.pi.logCta(), n = n || window.$environment.packageConfig.iosLink, i = i || window.$environment.packageConfig.androidLink; const o = /iphone|ipad|ipod|macintosh/i.test(window.navigator.userAgent.toLowerCase()) ? n : i; window.open(o, "_blank"); } })) }))</script>`;
                    break;
            }

            // Handle Custom Links Replacement
            if (elements.overrideLinksCb && elements.overrideLinksCb.checked) {
                const customAndroid = elements.androidLinkInput.value.trim();
                const customIos = elements.iosLinkInput.value.trim();

                if (customAndroid) {
                    // Update in our injected scripts
                    extraScripts = extraScripts.replace(/window\.\$environment\.packageConfig\.androidLink/g, `"${customAndroid}"`);
                    // Attempt to patch any inline declarations if they exist in the original content
                    newContent = newContent.replace(/androidLink\s*:\s*"[^"]*"/g, `androidLink: "${customAndroid}"`);
                }
                if (customIos) {
                    // Update in our injected scripts
                    extraScripts = extraScripts.replace(/window\.\$environment\.packageConfig\.iosLink/g, `"${customIos}"`);
                    // Attempt to patch any inline declarations if they exist in the original content
                    newContent = newContent.replace(/iosLink\s*:\s*"[^"]*"/g, `iosLink: "${customIos}"`);
                }
            }

            // Append extra scripts before closing body
            if (extraScripts !== "") {
                newContent = newContent.replace('</body>', extraScripts + '\n</body>');
            }

            // Generate Filename
            // Convention: {NetworkName}_{GameName}_{PA}_{Creator}{DDMMYY}
            // Remove spaces from network name for cleaner filenames
            const cleanNetworkName = net.name.replace(/[^a-zA-Z0-9]/g, '');
            const baseFilename = `${cleanNetworkName}_${game}_${pa}_${creator}${date}`;

            // Add to zip structure
            if (net.zip) {
                // Generate inner zip for this network
                const innerZip = new JSZip();
                innerZip.file('index.html', newContent);
                const innerZipPromise = innerZip.generateAsync({ type: "blob" }).then(blob => {
                    zip.file(`${baseFilename}.zip`, blob);
                    logMessage(`Created ${baseFilename}.zip`);
                });
                zipPromises.push(innerZipPromise);
            } else {
                // Standalone html
                zip.file(`${baseFilename}.html`, newContent);
                logMessage(`Created ${baseFilename}.html`);
            }
        });

        await Promise.all(zipPromises);

        // Generate Master ZIP
        logMessage(`Zipping files... Please wait.`);
        const masterZipContent = await zip.generateAsync({ type: "blob" });

        saveAs(masterZipContent, `${game}_Playables_${date}.zip`);
        logMessage(`✓ Done! Download triggered.`);

    } catch (err) {
        logMessage(`❌ Error: ${err.message}`);
        console.error(err);
    }

    // Reset button
    setTimeout(() => {
        elements.convertBtn.disabled = false;
        elements.convertBtn.innerHTML = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> <span>Convert & Download ZIP</span>`;
    }, 1000);
});
