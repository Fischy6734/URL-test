/**
 * Fischyweb SDK Engine v1.0.0
 * Professional website enhancement engine with pr
 * 
 * Features:
 * - Powered by Fischyweb animated startup
 * - Anti-copy protection (blocks proxy, HTML downloaders, text selection on protected elements)
 * - Smooth scrolling engine with easing
 * - Performance optimizations
 * - CSS/DOM injection from .fischyweb packages
 * 
 * Usage: <script src="fischyweb-engine.js"></script>
 */
(function() {
  'use strict';

  var VERSION = '1.0.0';
  var STARTUP_SHOWN = false;

  // ============================================
  // STARTUP ANIMATION
  // ============================================
  function showStartupAnimation() {
    if (STARTUP_SHOWN) return Promise.resolve();
    STARTUP_SHOWN = true;

    return new Promise(function(resolve) {
      var overlay = document.createElement('div');
      overlay.id = 'fischyweb-startup';
      overlay.innerHTML = `
        <style>
          #fischyweb-startup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
          }
          
          .fischyweb-logo-container {
            position: relative;
            width: 120px;
            height: 120px;
            margin-bottom: 30px;
          }
          
          .fischyweb-logo-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 3px solid transparent;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: fischyweb-spin 1s linear infinite;
          }
          
          .fischyweb-logo-ring:nth-child(2) {
            width: 90%;
            height: 90%;
            top: 5%;
            left: 5%;
            border-top-color: #764ba2;
            animation-duration: 1.5s;
            animation-direction: reverse;
          }
          
          .fischyweb-logo-ring:nth-child(3) {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            border-top-color: #f64f59;
            animation-duration: 2s;
          }
          
          .fischyweb-logo-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
            animation: fischyweb-pulse 1.5s ease-in-out infinite;
          }
          
          @keyframes fischyweb-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fischyweb-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
          }
          
          .fischyweb-title {
            color: white;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 8px;
            opacity: 0;
            animation: fischyweb-fadeIn 0.5s ease-out 0.3s forwards;
          }
          
          .fischyweb-subtitle {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0;
            animation: fischyweb-fadeIn 0.5s ease-out 0.5s forwards;
          }
          
          .fischyweb-version {
            position: absolute;
            bottom: 30px;
            color: rgba(255, 255, 255, 0.3);
            font-size: 12px;
            letter-spacing: 1px;
          }
          
          .fischyweb-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }
          
          .fischyweb-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: fischyweb-float 3s ease-in-out infinite;
          }
          
          @keyframes fischyweb-float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
          }
          
          @keyframes fischyweb-fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fischyweb-fadeOut {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
          }
          
          .fischyweb-loading-bar {
            width: 200px;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            margin-top: 30px;
            overflow: hidden;
            opacity: 0;
            animation: fischyweb-fadeIn 0.5s ease-out 0.7s forwards;
          }
          
          .fischyweb-loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2, #f64f59);
            border-radius: 3px;
            animation: fischyweb-loading 1.5s ease-out forwards;
          }
          
          @keyframes fischyweb-loading {
            from { width: 0%; }
            to { width: 100%; }
          }
        </style>
        
        <div class="fischyweb-particles">
          <div class="fischyweb-particle" style="left: 62.19899801550692%; animation-delay: 1.22468764197669s; animation-duration: 3.0003331822284824s;"></div><div class="fischyweb-particle" style="left: 66.9445546307342%; animation-delay: 0.6942286719693093s; animation-duration: 3.0111923377986702s;"></div><div class="fischyweb-particle" style="left: 89.65583293901155%; animation-delay: 0.6645470955959298s; animation-duration: 2.565711637350599s;"></div><div class="fischyweb-particle" style="left: 47.915602217425125%; animation-delay: 1.8838929785557368s; animation-duration: 2.931967658112277s;"></div><div class="fischyweb-particle" style="left: 51.18384755028348%; animation-delay: 0.30940065277468753s; animation-duration: 3.709600273248032s;"></div><div class="fischyweb-particle" style="left: 61.99052771565301%; animation-delay: 0.09112653643002466s; animation-duration: 2.698763072512307s;"></div><div class="fischyweb-particle" style="left: 92.87976862144744%; animation-delay: 2.751073969244861s; animation-duration: 3.695402828996434s;"></div><div class="fischyweb-particle" style="left: 16.185535243055593%; animation-delay: 2.0041463459978885s; animation-duration: 3.7251923966441485s;"></div><div class="fischyweb-particle" style="left: 83.52183858055508%; animation-delay: 0.7444364594141843s; animation-duration: 3.7721831877724146s;"></div><div class="fischyweb-particle" style="left: 79.75781045368734%; animation-delay: 0.5081477244037299s; animation-duration: 2.4260744619944634s;"></div><div class="fischyweb-particle" style="left: 34.14728989591384%; animation-delay: 2.850165368623018s; animation-duration: 3.2576006361742964s;"></div><div class="fischyweb-particle" style="left: 46.109594673468216%; animation-delay: 0.3859602074758044s; animation-duration: 3.8051377999796294s;"></div><div class="fischyweb-particle" style="left: 45.92901107203468%; animation-delay: 1.5243398182131385s; animation-duration: 3.4933903893713447s;"></div><div class="fischyweb-particle" style="left: 53.62963324850328%; animation-delay: 0.6857843579398722s; animation-duration: 2.4916645410740372s;"></div><div class="fischyweb-particle" style="left: 78.76939539812655%; animation-delay: 2.785138286955866s; animation-duration: 2.326384557217857s;"></div><div class="fischyweb-particle" style="left: 31.349248633676453%; animation-delay: 2.7125993803988884s; animation-duration: 3.3522739654277345s;"></div><div class="fischyweb-particle" style="left: 36.14648687182596%; animation-delay: 0.07215284144291101s; animation-duration: 3.6053246481885672s;"></div><div class="fischyweb-particle" style="left: 10.98278571421144%; animation-delay: 0.2878034551340741s; animation-duration: 2.5660753966355814s;"></div><div class="fischyweb-particle" style="left: 43.74552066569286%; animation-delay: 0.7675239094041036s; animation-duration: 3.8662175539789185s;"></div><div class="fischyweb-particle" style="left: 47.48537345125433%; animation-delay: 1.5409609359559573s; animation-duration: 2.710536867483591s;"></div>
        </div>
        
        <div class="fischyweb-logo-container">
          <div class="fischyweb-logo-ring"></div>
          <div class="fischyweb-logo-ring"></div>
          <div class="fischyweb-logo-ring"></div>
          <div class="fischyweb-logo-icon">⚡</div>
        </div>
        
        <div class="fischyweb-title">Fischyweb</div>
        <div class="fischyweb-subtitle">Powered by SDK Engine</div>
        
        <div class="fischyweb-loading-bar">
          <div class="fischyweb-loading-progress"></div>
        </div>
        
        <div class="fischyweb-version">v1.0.0</div>
      `;
      
      document.body.appendChild(overlay);
      
      // Fade out after animation
      setTimeout(function() {
        overlay.style.animation = 'fischyweb-fadeOut 0.5s ease-out forwards';
        setTimeout(function() {
          overlay.remove();
          resolve();
        }, 500);
      }, 2000);
    });
  }

  // ============================================
  // ANTI-COPY PROTECTION
  // ============================================
  function initProtection() {
    console.log('[Fischyweb] Initializing protection layer...');
    
    // Detect common bot/scraper patterns
    var isBot = /bot|crawler|spider|scraper|curl|wget|python|java|headless/i.test(navigator.userAgent);
    
    // Block right-click on protected elements
    document.addEventListener('contextmenu', function(e) {
      if (e.target.closest('[data-fischyweb-protected]') || document.body.hasAttribute('data-fischyweb-protected')) {
        e.preventDefault();
        showProtectionWarning('Right-click disabled');
        return false;
      }
    });
    
    // Block text selection on protected elements
    document.addEventListener('selectstart', function(e) {
      if (e.target.closest('[data-fischyweb-protected]') || document.body.hasAttribute('data-fischyweb-protected')) {
        e.preventDefault();
        return false;
      }
    });
    
    // Block common keyboard shortcuts for copying/saving
    document.addEventListener('keydown', function(e) {
      var isProtected = document.body.hasAttribute('data-fischyweb-protected');
      if (!isProtected) return;
      
      // Block Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12
      if ((e.ctrlKey && (e.key === 's' || e.key === 'u')) || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          e.key === 'F12') {
        e.preventDefault();
        showProtectionWarning('This action is disabled');
        return false;
      }
      
      // Block Ctrl+C on protected content
      if (e.ctrlKey && e.key === 'c') {
        var selection = window.getSelection();
        if (selection.anchorNode && selection.anchorNode.parentElement) {
          if (selection.anchorNode.parentElement.closest('[data-fischyweb-protected]')) {
            e.preventDefault();
            showProtectionWarning('Copying disabled');
            return false;
          }
        }
      }
    });
    
    // Block drag on images
    document.addEventListener('dragstart', function(e) {
      if (e.target.tagName === 'IMG' && 
          (e.target.closest('[data-fischyweb-protected]') || document.body.hasAttribute('data-fischyweb-protected'))) {
        e.preventDefault();
        return false;
      }
    });
    
    // Anti-iframe embedding (clickjacking protection)
    if (window.top !== window.self) {
      try {
        if (!document.referrer.includes(window.location.hostname)) {
          console.warn('[Fischyweb] Possible iframe embedding detected');
        }
      } catch(e) {}
    }
    
    // Obfuscate content periodically (makes scraping harder)
    setInterval(function() {
      document.querySelectorAll('[data-fischyweb-protected]').forEach(function(el) {
        el.setAttribute('data-fischyweb-ts', Date.now());
      });
    }, 5000);
    
    // Disable print screen message
    document.addEventListener('keyup', function(e) {
      if (e.key === 'PrintScreen' && document.body.hasAttribute('data-fischyweb-protected')) {
        showProtectionWarning('Screenshots are discouraged');
      }
    });
    
    // Console warning
    console.log('%c⚠️ FISCHYWEB PROTECTED', 'font-size: 24px; font-weight: bold; color: #f64f59;');
    console.log('%cThis site is protected by Fischyweb SDK. Unauthorized copying or scraping may be detected.', 'font-size: 14px; color: #667eea;');
    
    // Detect DevTools (basic)
    var devtools = { open: false };
    var threshold = 160;
    setInterval(function() {
      var widthThreshold = window.outerWidth - window.innerWidth > threshold;
      var heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        if (!devtools.open && document.body.hasAttribute('data-fischyweb-protected')) {
          console.log('%c[Fischyweb] DevTools detected', 'color: #f64f59;');
        }
        devtools.open = true;
      } else {
        devtools.open = false;
      }
    }, 500);
    
    console.log('[Fischyweb] Protection layer initialized');
  }

  function showProtectionWarning(msg) {
    var existing = document.getElementById('fischyweb-protection-warning');
    if (existing) existing.remove();
    
    var warning = document.createElement('div');
    warning.id = 'fischyweb-protection-warning';
    warning.innerHTML = `
      <style>
        #fischyweb-protection-warning {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #f64f59, #c471ed);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          font-weight: 600;
          z-index: 2147483646;
          box-shadow: 0 4px 20px rgba(246, 79, 89, 0.4);
          animation: fischyweb-warning-in 0.3s ease-out;
        }
        @keyframes fischyweb-warning-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
      🛡️ ${msg}
    `;
    warning.innerHTML = warning.innerHTML.replace('${msg}', msg);
    document.body.appendChild(warning);
    
    setTimeout(function() {
      warning.remove();
    }, 2000);
  }

  // ============================================
  // SMOOTH SCROLLING ENGINE
  // ============================================
  function initSmoothEngine() {
    console.log('[Fischyweb] Initializing smooth engine...');
    
    // Smooth scroll for anchor links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (link) {
        var targetId = link.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          smoothScrollTo(target, 800);
        }
      }
    });
    
    // Smooth momentum scrolling
    var scrollState = {
      target: 0,
      current: 0,
      ease: 0.1,
      rafId: null
    };
    
    // Add smooth class to body for CSS optimization
    var smoothStyle = document.createElement('style');
    smoothStyle.id = 'fischyweb-smooth-styles';
    smoothStyle.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      body.fischyweb-smooth * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      body.fischyweb-smooth img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      @media (prefers-reduced-motion: no-preference) {
        body.fischyweb-smooth {
          scroll-behavior: smooth;
        }
        
        body.fischyweb-smooth .fischyweb-animate {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
      
      /* GPU acceleration for animated elements */
      body.fischyweb-smooth [data-fischyweb-animated] {
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      /* Smooth image loading */
      body.fischyweb-smooth img {
        transition: opacity 0.3s ease;
      }
      
      body.fischyweb-smooth img[data-loaded="false"] {
        opacity: 0;
      }
      
      body.fischyweb-smooth img[data-loaded="true"] {
        opacity: 1;
      }
    `;
    document.head.appendChild(smoothStyle);
    document.body.classList.add('fischyweb-smooth');
    
    // Smooth image loading
    document.querySelectorAll('img').forEach(function(img) {
      if (!img.complete) {
        img.setAttribute('data-loaded', 'false');
        img.onload = function() {
          img.setAttribute('data-loaded', 'true');
        };
      }
    });
    
    // Observe new images
    var imgObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'IMG' && !node.complete) {
            node.setAttribute('data-loaded', 'false');
            node.onload = function() {
              node.setAttribute('data-loaded', 'true');
            };
          }
        });
      });
    });
    imgObserver.observe(document.body, { childList: true, subtree: true });
    
    console.log('[Fischyweb] Smooth engine initialized');
  }

  function smoothScrollTo(target, duration) {
    var start = window.pageYOffset;
    var targetPos = target.getBoundingClientRect().top + start - 100;
    var distance = targetPos - start;
    var startTime = null;
    
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = easeOutCubic(progress);
      
      window.scrollTo(0, start + distance * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }
    
    requestAnimationFrame(animation);
  }

  // ============================================
  // PERFORMANCE OPTIMIZER
  // ============================================
  function initPerformanceOptimizer() {
    console.log('[Fischyweb] Optimizing performance...');
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
      var lazyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              lazyObserver.unobserve(img);
            }
          }
        });
      }, { rootMargin: '100px' });
      
      document.querySelectorAll('img[data-src]').forEach(function(img) {
        lazyObserver.observe(img);
      });
    }
    
    // Defer non-critical animations
    requestAnimationFrame(function() {
      document.body.classList.add('fischyweb-loaded');
    });
    
    // Reduce layout thrashing
    var throttle = function(fn, wait) {
      var time = Date.now();
      return function() {
        if ((time + wait - Date.now()) < 0) {
          fn.apply(this, arguments);
          time = Date.now();
        }
      };
    };
    
    // Throttled scroll handler
    window.addEventListener('scroll', throttle(function() {
      document.body.setAttribute('data-scroll-y', Math.round(window.scrollY));
    }, 100), { passive: true });
    
    console.log('[Fischyweb] Performance optimizations applied');
  }

  // ============================================
  // IO Utilities
  // ============================================
  var textEncoder = new TextEncoder();
  var textDecoder = new TextDecoder();
  
  function stringToBytes(str) { return textEncoder.encode(str); }
  function bytesToString(bytes) { return textDecoder.decode(bytes); }
  function bytesToBase64(bytes) {
    var binary = '';
    for (var i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // ============================================
  // ZIP Parser
  // ============================================
  function readUint16LE(data, offset) { return data[offset] | (data[offset + 1] << 8); }
  function readUint32LE(data, offset) { 
    return (data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0; 
  }
  
  function parseZip(data) {
    var bytes = new Uint8Array(data);
    var files = {};
    var endOffset = bytes.length - 22;
    while (endOffset >= 0) {
      if (bytes[endOffset] === 0x50 && bytes[endOffset + 1] === 0x4B && 
          bytes[endOffset + 2] === 0x05 && bytes[endOffset + 3] === 0x06) break;
      endOffset--;
    }
    if (endOffset < 0) throw new Error('Invalid ZIP file');
    
    var centralDirOffset = readUint32LE(bytes, endOffset + 16);
    var entryCount = readUint16LE(bytes, endOffset + 10);
    var offset = centralDirOffset;
    
    for (var i = 0; i < entryCount; i++) {
      var nameLength = readUint16LE(bytes, offset + 28);
      var extraLength = readUint16LE(bytes, offset + 30);
      var commentLength = readUint16LE(bytes, offset + 32);
      var localHeaderOffset = readUint32LE(bytes, offset + 42);
      var filename = bytesToString(bytes.slice(offset + 46, offset + 46 + nameLength));
      var localNameLength = readUint16LE(bytes, localHeaderOffset + 26);
      var localExtraLength = readUint16LE(bytes, localHeaderOffset + 28);
      var compressedSize = readUint32LE(bytes, localHeaderOffset + 18);
      var dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
      files[filename] = bytes.slice(dataStart, dataStart + compressedSize);
      offset += 46 + nameLength + extraLength + commentLength;
    }
    return files;
  }

  // ============================================
  // State Management
  // ============================================
  var currentThemeStyle = null;
  var appliedPatches = [];
  var originalStates = [];
  var currentPackage = null;
  var engineConfig = {
    showStartup: true,
    enableProtection: true,
    enableSmooth: true,
    enableOptimizations: true
  };

  // ============================================
  // Theme CSS Functions
  // ============================================
  function applyTheme(css) {
    console.log('[Fischyweb] Applying theme CSS...');
    removeTheme();
    
    var style = document.createElement('style');
    style.id = 'fischyweb-theme-' + Date.now();
    style.setAttribute('data-fischyweb', 'true');
    style.textContent = css;
    document.head.appendChild(style);
    currentThemeStyle = style;
    console.log('[Fischyweb] Theme applied');
  }

  function removeTheme() {
    if (currentThemeStyle) {
      currentThemeStyle.remove();
      currentThemeStyle = null;
    }
  }

  // ============================================
  // DOM Patch Functions
  // ============================================
  function applyPatches(patches) {
    console.log('[Fischyweb] Applying DOM patches...');
    revertPatches();
    
    patches.forEach(function(patch, idx) {
      try {
        var target = document.querySelector(patch.selector);
        if (!target) return;
        
        var state = { selector: patch.selector, action: patch.action };
        
        switch (patch.action) {
          case 'prepend':
          case 'append':
            var div = document.createElement('div');
            div.innerHTML = patch.html || '';
            div.classList.add('fischyweb-patch');
            div.setAttribute('data-fischyweb-patch', idx);
            if (patch.action === 'prepend') target.prepend(div);
            else target.append(div);
            break;
          case 'add-class':
            var cls = (patch.html || '').trim();
            if (cls) { state.classAdded = cls; target.classList.add(cls); }
            break;
          case 'remove-class':
            var clsRm = (patch.html || '').trim();
            if (clsRm) { state.classRemoved = clsRm; state.hadClass = target.classList.contains(clsRm); target.classList.remove(clsRm); }
            break;
          case 'set-attr':
            if (patch.attrs) {
              state.originalAttrs = {};
              for (var key in patch.attrs) { state.originalAttrs[key] = target.getAttribute(key); target.setAttribute(key, patch.attrs[key]); }
            }
            break;
          case 'replace':
            state.originalHTML = target.innerHTML;
            target.innerHTML = patch.html || '';
            break;
        }
        originalStates.push(state);
        appliedPatches.push(patch);
      } catch (e) { console.error('[Fischyweb] Patch error:', e); }
    });
  }

  function revertPatches() {
    document.querySelectorAll('.fischyweb-patch').forEach(function(el) { el.remove(); });
    originalStates.forEach(function(state) {
      try {
        var target = document.querySelector(state.selector);
        if (!target) return;
        if (state.classAdded) target.classList.remove(state.classAdded);
        if (state.classRemoved && state.hadClass) target.classList.add(state.classRemoved);
        if (state.originalAttrs) {
          for (var key in state.originalAttrs) {
            if (state.originalAttrs[key] === null) target.removeAttribute(key);
            else target.setAttribute(key, state.originalAttrs[key]);
          }
        }
        if (state.originalHTML !== undefined) target.innerHTML = state.originalHTML;
      } catch (e) {}
    });
    appliedPatches = [];
    originalStates = [];
  }

  // ============================================
  // Package Loading
  // ============================================
  function loadPackage(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        try {
          var files = parseZip(reader.result);
          if (!files['manifest.json']) throw new Error('Invalid package');
          
          var manifest = JSON.parse(bytesToString(files['manifest.json']));
          var themeCSS = files['theme.css'] ? bytesToString(files['theme.css']) : null;
          var modHTML = files['mod.html'] ? bytesToString(files['mod.html']) : null;
          
          var pkg = { manifest: manifest, themeCSS: themeCSS, modHTML: modHTML, files: files };
          console.log('[Fischyweb] Package loaded:', manifest.metadata?.name || 'Unknown');
          resolve(pkg);
        } catch (e) { reject(e); }
      };
      reader.onerror = function() { reject(new Error('Read error')); };
      reader.readAsArrayBuffer(file);
    });
  }

  // ============================================
  // UI Creation
  // ============================================
  function createUI() {
    var container = document.createElement('div');
    container.id = 'fischyweb-loader-ui';
    container.innerHTML = `
      <style>
        #fischyweb-loader-ui { position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        #fischyweb-loader-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; font-size: 24px; }
        #fischyweb-loader-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5); }
        #fischyweb-loader-panel { display: none; position: absolute; bottom: 70px; right: 0; width: 340px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); overflow: hidden; animation: fischySlideUp 0.3s ease; }
        @keyframes fischySlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        #fischyweb-loader-panel.open { display: block; }
        .fischyweb-header { padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; justify-content: space-between; align-items: center; }
        .fischyweb-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
        .fischyweb-body { padding: 20px; }
        .fischyweb-dropzone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 30px; text-align: center; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
        .fischyweb-dropzone:hover { border-color: #667eea; background: #f1f5f9; }
        .fischyweb-dropzone.dragover { border-color: #667eea; background: #eef2ff; border-style: solid; }
        .fischyweb-info { margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #667eea; }
        .fischyweb-info h4 { margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b; }
        .fischyweb-info p { margin: 0; font-size: 13px; color: #64748b; }
        .fischyweb-actions { margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .fischyweb-btn { padding: 12px 20px; border-radius: 10px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; text-align: center; }
        .fischyweb-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .fischyweb-btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .fischyweb-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        .fischyweb-btn-secondary { background: #f1f5f9; color: #475569; }
        .fischyweb-btn-secondary:hover:not(:disabled) { background: #e2e8f0; }
        .fischyweb-btn-danger { background: #fef2f2; color: #dc2626; grid-column: 1 / -1; }
        .fischyweb-btn-danger:hover:not(:disabled) { background: #fee2e2; }
        .fischyweb-status { margin-top: 12px; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 500; text-align: center; }
        .fischyweb-status.success { background: #f0fdf4; color: #16a34a; }
        .fischyweb-status.error { background: #fef2f2; color: #dc2626; }
        .fischyweb-close-btn { background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; }
        .fischyweb-close-btn:hover { background: rgba(255,255,255,0.3); }
        #fischyweb-file-input { display: none; }
        .fischyweb-badge { display: inline-block; padding: 4px 10px; background: rgba(102, 126, 234, 0.1); color: #667eea; border-radius: 6px; font-size: 11px; font-weight: 600; margin-top: 4px; }
        .fischyweb-powered { text-align: center; padding: 12px; background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1)); border-top: 1px solid rgba(102,126,234,0.2); font-size: 11px; color: #667eea; }
      </style>
      
      <button id="fischyweb-loader-btn" title="Fischyweb Engine">⚡</button>
      
      <div id="fischyweb-loader-panel">
        <div class="fischyweb-header">
          <h3>⚡ Fischyweb Engine</h3>
          <button class="fischyweb-close-btn" id="fischyweb-close-btn">×</button>
        </div>
        
        <div class="fischyweb-body">
          <div id="fischyweb-dropzone" class="fischyweb-dropzone">
            <div style="font-size: 40px; margin-bottom: 12px;">📦</div>
            <div style="font-weight: 600; margin-bottom: 6px; color: #1e293b;">Drop .fischyweb file</div>
            <div style="font-size: 13px; color: #94a3b8;">or click to browse</div>
          </div>
          
          <input type="file" id="fischyweb-file-input" accept=".fischyweb" />
          
          <div id="fischyweb-loaded-info" style="display: none;">
            <div class="fischyweb-info">
              <h4 id="fischyweb-pkg-name">Package Name</h4>
              <p id="fischyweb-pkg-meta">Loading...</p>
              <span class="fischyweb-badge" id="fischyweb-pkg-status">Ready</span>
            </div>
            
            <div class="fischyweb-actions">
              <button class="fischyweb-btn fischyweb-btn-primary" id="fischyweb-apply-theme-btn">🎨 Apply Theme</button>
              <button class="fischyweb-btn fischyweb-btn-secondary" id="fischyweb-apply-patches-btn">🔧 Apply Patches</button>
            </div>
            
            <div class="fischyweb-actions">
              <button class="fischyweb-btn fischyweb-btn-danger" id="fischyweb-revert-btn">↩️ Revert All</button>
            </div>
            
            <div id="fischyweb-status" class="fischyweb-status" style="display: none;"></div>
          </div>
        </div>
        
        <div class="fischyweb-powered">
          🛡️ Protected by Fischyweb SDK v1.0.0
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Get elements & bind events
    var btn = document.getElementById('fischyweb-loader-btn');
    var panel = document.getElementById('fischyweb-loader-panel');
    var closeBtn = document.getElementById('fischyweb-close-btn');
    var dropzone = document.getElementById('fischyweb-dropzone');
    var fileInput = document.getElementById('fischyweb-file-input');
    var loadedInfo = document.getElementById('fischyweb-loaded-info');
    var pkgName = document.getElementById('fischyweb-pkg-name');
    var pkgMeta = document.getElementById('fischyweb-pkg-meta');
    var pkgStatus = document.getElementById('fischyweb-pkg-status');
    var applyThemeBtn = document.getElementById('fischyweb-apply-theme-btn');
    var applyPatchesBtn = document.getElementById('fischyweb-apply-patches-btn');
    var revertBtn = document.getElementById('fischyweb-revert-btn');
    var status = document.getElementById('fischyweb-status');

    function showStatus(msg, isError) {
      status.textContent = msg;
      status.className = 'fischyweb-status ' + (isError ? 'error' : 'success');
      status.style.display = 'block';
      setTimeout(function() { status.style.display = 'none'; }, 3000);
    }

    btn.onclick = function() { panel.classList.toggle('open'); };
    closeBtn.onclick = function() { panel.classList.remove('open'); };
    dropzone.onclick = function() { fileInput.click(); };
    
    dropzone.ondragover = function(e) { e.preventDefault(); dropzone.classList.add('dragover'); };
    dropzone.ondragleave = function(e) { e.preventDefault(); dropzone.classList.remove('dragover'); };
    dropzone.ondrop = function(e) { e.preventDefault(); dropzone.classList.remove('dragover'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
    fileInput.onchange = function() { if (fileInput.files[0]) handleFile(fileInput.files[0]); };

    function handleFile(file) {
      loadPackage(file).then(function(pkg) {
        currentPackage = pkg;
        pkgName.textContent = pkg.manifest.metadata?.name || 'Unnamed Package';
        pkgMeta.textContent = 'v' + (pkg.manifest.metadata?.version || '1.0.0') + (pkg.manifest.metadata?.author ? ' • ' + pkg.manifest.metadata.author : '');
        var stats = [];
        if (pkg.themeCSS) stats.push('Theme CSS');
        if (pkg.manifest.domPatches?.length) stats.push(pkg.manifest.domPatches.length + ' patches');
        pkgStatus.textContent = stats.join(' • ') || 'Ready';
        dropzone.style.display = 'none';
        loadedInfo.style.display = 'block';
        showStatus('✓ Package loaded!', false);
      }).catch(function(e) { showStatus('✗ ' + e.message, true); });
    }

    applyThemeBtn.onclick = function() {
      if (currentPackage?.themeCSS) { applyTheme(currentPackage.themeCSS); showStatus('✓ Theme applied!', false); }
      else showStatus('✗ No theme CSS', true);
    };
    applyPatchesBtn.onclick = function() {
      if (currentPackage?.manifest.domPatches?.length) { applyPatches(currentPackage.manifest.domPatches); showStatus('✓ Patches applied!', false); }
      else showStatus('✗ No patches', true);
    };
    revertBtn.onclick = function() { removeTheme(); revertPatches(); showStatus('✓ Reverted!', false); };
  }

  // ============================================
  // Initialize Engine
  // ============================================
  async function initEngine(config) {
    config = config || {};
    Object.assign(engineConfig, config);
    
    console.log('[Fischyweb] ⚡ Engine v' + VERSION + ' starting...');
    
    // Show startup animation
    if (engineConfig.showStartup) {
      await showStartupAnimation();
    }
    
    // Initialize protection
    if (engineConfig.enableProtection) {
      initProtection();
    }
    
    // Initialize smooth engine
    if (engineConfig.enableSmooth) {
      initSmoothEngine();
    }
    
    // Initialize performance optimizations
    if (engineConfig.enableOptimizations) {
      initPerformanceOptimizer();
    }
    
    // Create UI
    createUI();
    
    console.log('[Fischyweb] ⚡ Engine ready!');
  }

  // ============================================
  // Auto-initialize on DOM ready
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initEngine(); });
  } else {
    initEngine();
  }

  // ============================================
  // Public API
  // ============================================
  window.FischywebEngine = {
    version: VERSION,
    init: initEngine,
    loadPackage: loadPackage,
    applyTheme: applyTheme,
    removeTheme: removeTheme,
    applyPatches: applyPatches,
    revertPatches: revertPatches,
    getCurrentPackage: function() { return currentPackage; },
    protect: function(selector) {
      if (selector) document.querySelectorAll(selector).forEach(function(el) { el.setAttribute('data-fischyweb-protected', 'true'); });
      else document.body.setAttribute('data-fischyweb-protected', 'true');
    },
    unprotect: function(selector) {
      if (selector) document.querySelectorAll(selector).forEach(function(el) { el.removeAttribute('data-fischyweb-protected'); });
      else document.body.removeAttribute('data-fischyweb-protected');
    },
    showStartup: showStartupAnimation
  };

  // Legacy API compatibility
  window.FischywebLoader = window.FischywebEngine;

})();
