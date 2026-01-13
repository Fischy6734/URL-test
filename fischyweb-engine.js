/**
 * Fischyweb SDK Engine v2.0.0
 * Professional website enhancement engine
 * 
 * Features:
 * - Animated startup splash screen
 * - Content protection (right-click, copy, selection blocking)
 * - Scroll animations (fade-in, slide-up, zoom elements on scroll)
 * - Parallax effects
 * - Image lazy loading with blur-up effect
 * - Tooltip system
 * - Modal/lightbox system
 * - Custom cursor effects
 * - Text effects (typewriter, gradient text)
 * - Dark mode toggle
 * - Sticky elements
 * - Back to top button
 * - Reading progress bar
 * - .fischyweb package loader
 * 
 * Usage: <script src="fischyweb-engine.js"></script>
 */
(function() {
  'use strict';

  var VERSION = '2.0.0';
  var STARTUP_SHOWN = false;
  var config = {
    showStartup: true,
    enableProtection: false,
    enableScrollAnimations: true,
    enableParallax: true,
    enableLazyLoad: true,
    enableTooltips: true,
    enableBackToTop: true,
    enableProgressBar: true,
    enableDarkMode: false,
    protectionLevel: 'medium'
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function debounce(fn, wait) {
    var timeout;
    return function() {
      var ctx = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() { fn.apply(ctx, args); }, wait);
    };
  }

  function throttle(fn, limit) {
    var waiting = false;
    return function() {
      if (!waiting) {
        fn.apply(this, arguments);
        waiting = true;
        setTimeout(function() { waiting = false; }, limit);
      }
    };
  }

  // ============================================
  // STARTUP ANIMATION
  // ============================================
  function showStartupAnimation() {
    if (STARTUP_SHOWN) return Promise.resolve();
    STARTUP_SHOWN = true;

    return new Promise(function(resolve) {
      var overlay = document.createElement('div');
      overlay.id = 'fischyweb-startup';
      
      var style = document.createElement('style');
      style.textContent = '#fischyweb-startup{position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%);z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow:hidden;transition:opacity 0.5s}.fischyweb-logo-container{position:relative;width:100px;height:100px;margin-bottom:24px}.fischyweb-logo-ring{position:absolute;width:100%;height:100%;border:3px solid transparent;border-top-color:#667eea;border-radius:50%;animation:fw-spin 1s linear infinite}.fischyweb-logo-ring:nth-child(2){width:85%;height:85%;top:7.5%;left:7.5%;border-top-color:#764ba2;animation-duration:1.5s;animation-direction:reverse}.fischyweb-logo-ring:nth-child(3){width:70%;height:70%;top:15%;left:15%;border-top-color:#f64f59;animation-duration:2s}.fischyweb-logo-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:32px;animation:fw-pulse 1.5s ease-in-out infinite}@keyframes fw-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes fw-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1}50%{transform:translate(-50%,-50%) scale(1.1);opacity:0.8}}.fischyweb-title{color:white;font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;opacity:0;animation:fw-fadeIn 0.5s ease-out 0.3s forwards}.fischyweb-subtitle{color:rgba(255,255,255,0.6);font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0;animation:fw-fadeIn 0.5s ease-out 0.5s forwards}.fischyweb-loading-bar{width:180px;height:3px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:24px;overflow:hidden;opacity:0;animation:fw-fadeIn 0.5s ease-out 0.6s forwards}.fischyweb-loading-progress{height:100%;background:linear-gradient(90deg,#667eea,#764ba2,#f64f59);border-radius:3px;animation:fw-loading 1.5s ease-out forwards}@keyframes fw-fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes fw-loading{from{width:0%}to{width:100%}}';
      document.head.appendChild(style);
      
      overlay.innerHTML = '<div class="fischyweb-logo-container"><div class="fischyweb-logo-ring"></div><div class="fischyweb-logo-ring"></div><div class="fischyweb-logo-ring"></div><div class="fischyweb-logo-icon">⚡</div></div><div class="fischyweb-title">Fischyweb</div><div class="fischyweb-subtitle">Powered by SDK Engine</div><div class="fischyweb-loading-bar"><div class="fischyweb-loading-progress"></div></div>';
      
      document.body.appendChild(overlay);
      
      setTimeout(function() {
        overlay.style.opacity = '0';
        setTimeout(function() {
          overlay.remove();
          resolve();
        }, 500);
      }, 2000);
    });
  }

  // ============================================
  // CONTENT PROTECTION
  // ============================================
  function initProtection(level) {
    level = level || 'medium';
    console.log('[Fischyweb] Protection level:', level);
    
    var protectStyle = document.createElement('style');
    protectStyle.id = 'fischyweb-protection-styles';
    protectStyle.textContent = '[data-fw-protected],[data-fischyweb-protected]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}[data-fw-protected] img,[data-fischyweb-protected] img{pointer-events:none;-webkit-user-drag:none;user-drag:none}';
    document.head.appendChild(protectStyle);

    // Block right-click
    document.addEventListener('contextmenu', function(e) {
      if (e.target.closest('[data-fw-protected]') || e.target.closest('[data-fischyweb-protected]') || document.body.hasAttribute('data-fw-protected')) {
        e.preventDefault();
        showToast('🛡️ Right-click is disabled', 'warning');
        return false;
      }
    }, true);

    // Block text selection
    document.addEventListener('selectstart', function(e) {
      if (e.target.closest('[data-fw-protected]') || e.target.closest('[data-fischyweb-protected]') || document.body.hasAttribute('data-fw-protected')) {
        e.preventDefault();
        return false;
      }
    }, true);

    // Block copy
    document.addEventListener('copy', function(e) {
      if (document.body.hasAttribute('data-fw-protected')) {
        e.preventDefault();
        showToast('🛡️ Copying is disabled', 'warning');
        return false;
      }
    }, true);

    // Block keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (!document.body.hasAttribute('data-fw-protected') && level !== 'high') return;
      
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'u' || e.key === 'p')) {
        e.preventDefault();
        showToast('🛡️ This action is disabled', 'warning');
        return false;
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        if (level === 'high') {
          e.preventDefault();
          showToast('🛡️ Developer tools disabled', 'warning');
          return false;
        }
      }
    }, true);

    // Block image drag
    document.addEventListener('dragstart', function(e) {
      if (e.target.tagName === 'IMG' && (e.target.closest('[data-fw-protected]') || document.body.hasAttribute('data-fw-protected'))) {
        e.preventDefault();
        return false;
      }
    }, true);

    console.log('[Fischyweb] Protection initialized');
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    var style = document.createElement('style');
    style.id = 'fischyweb-scroll-animations';
    style.textContent = '[data-fw-animate]{opacity:0;transition:all 0.6s cubic-bezier(0.4,0,0.2,1)}[data-fw-animate].fw-visible{opacity:1}[data-fw-animate="fade-up"]{transform:translateY(40px)}[data-fw-animate="fade-up"].fw-visible{transform:translateY(0)}[data-fw-animate="fade-down"]{transform:translateY(-40px)}[data-fw-animate="fade-down"].fw-visible{transform:translateY(0)}[data-fw-animate="fade-left"]{transform:translateX(40px)}[data-fw-animate="fade-left"].fw-visible{transform:translateX(0)}[data-fw-animate="fade-right"]{transform:translateX(-40px)}[data-fw-animate="fade-right"].fw-visible{transform:translateX(0)}[data-fw-animate="zoom-in"]{transform:scale(0.8)}[data-fw-animate="zoom-in"].fw-visible{transform:scale(1)}[data-fw-animate="zoom-out"]{transform:scale(1.2)}[data-fw-animate="zoom-out"].fw-visible{transform:scale(1)}[data-fw-animate="flip"]{transform:perspective(500px) rotateY(90deg)}[data-fw-animate="flip"].fw-visible{transform:perspective(500px) rotateY(0)}[data-fw-animate="bounce"]{transform:translateY(40px)}[data-fw-animate="bounce"].fw-visible{animation:fw-bounce 0.6s}@keyframes fw-bounce{0%{transform:translateY(40px)}50%{transform:translateY(-10px)}100%{transform:translateY(0)}}';
    document.head.appendChild(style);

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-fw-delay') || 0;
          setTimeout(function() {
            entry.target.classList.add('fw-visible');
          }, parseInt(delay));
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-fw-animate]').forEach(function(el) {
      observer.observe(el);
    });

    // Re-observe on new elements
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.hasAttribute && node.hasAttribute('data-fw-animate')) {
              observer.observe(node);
            }
            node.querySelectorAll && node.querySelectorAll('[data-fw-animate]').forEach(function(el) {
              observer.observe(el);
            });
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });

    console.log('[Fischyweb] Scroll animations initialized');
  }

  // ============================================
  // PARALLAX EFFECTS
  // ============================================
  function initParallax() {
    var parallaxElements = [];

    function updateParallax() {
      var scrollY = window.pageYOffset;
      parallaxElements.forEach(function(item) {
        var speed = parseFloat(item.el.getAttribute('data-fw-parallax')) || 0.5;
        var yPos = -(scrollY * speed);
        item.el.style.transform = 'translate3d(0, ' + yPos + 'px, 0)';
      });
    }

    function collectElements() {
      parallaxElements = [];
      document.querySelectorAll('[data-fw-parallax]').forEach(function(el) {
        parallaxElements.push({ el: el });
      });
    }

    collectElements();
    window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
    window.addEventListener('resize', debounce(collectElements, 200));

    console.log('[Fischyweb] Parallax initialized');
  }

  // ============================================
  // LAZY LOADING WITH BLUR-UP
  // ============================================
  function initLazyLoad() {
    var style = document.createElement('style');
    style.id = 'fischyweb-lazy-styles';
    style.textContent = '[data-fw-src]{filter:blur(20px);transition:filter 0.5s}[data-fw-src].fw-loaded{filter:blur(0)}';
    document.head.appendChild(style);

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          var src = img.getAttribute('data-fw-src');
          if (src) {
            img.src = src;
            img.onload = function() {
              img.classList.add('fw-loaded');
              img.removeAttribute('data-fw-src');
            };
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('[data-fw-src]').forEach(function(img) {
      observer.observe(img);
    });

    console.log('[Fischyweb] Lazy loading initialized');
  }

  // ============================================
  // TOOLTIP SYSTEM
  // ============================================
  function initTooltips() {
    var style = document.createElement('style');
    style.id = 'fischyweb-tooltip-styles';
    style.textContent = '.fw-tooltip{position:fixed;background:#1e293b;color:white;padding:8px 12px;border-radius:6px;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;z-index:999999;pointer-events:none;opacity:0;transform:translateY(5px);transition:all 0.2s;max-width:250px;box-shadow:0 4px 12px rgba(0,0,0,0.15)}.fw-tooltip.fw-show{opacity:1;transform:translateY(0)}.fw-tooltip::after{content:"";position:absolute;border:6px solid transparent}.fw-tooltip.fw-top::after{top:100%;left:50%;transform:translateX(-50%);border-top-color:#1e293b}.fw-tooltip.fw-bottom::after{bottom:100%;left:50%;transform:translateX(-50%);border-bottom-color:#1e293b}';
    document.head.appendChild(style);

    var tooltip = document.createElement('div');
    tooltip.className = 'fw-tooltip fw-top';
    document.body.appendChild(tooltip);

    document.addEventListener('mouseenter', function(e) {
      var target = e.target.closest('[data-fw-tooltip]');
      if (!target) return;
      
      var text = target.getAttribute('data-fw-tooltip');
      var pos = target.getAttribute('data-fw-tooltip-pos') || 'top';
      var rect = target.getBoundingClientRect();
      
      tooltip.textContent = text;
      tooltip.className = 'fw-tooltip fw-' + pos;
      
      var left = rect.left + rect.width / 2;
      var top = pos === 'bottom' ? rect.bottom + 10 : rect.top - 10;
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      tooltip.style.transform = 'translateX(-50%)' + (pos === 'bottom' ? '' : ' translateY(-100%)');
      
      setTimeout(function() { tooltip.classList.add('fw-show'); }, 10);
    }, true);

    document.addEventListener('mouseleave', function(e) {
      if (e.target.closest('[data-fw-tooltip]')) {
        tooltip.classList.remove('fw-show');
      }
    }, true);

    console.log('[Fischyweb] Tooltips initialized');
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  function showToast(message, type) {
    type = type || 'info';
    var colors = {
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    };

    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:white;color:#1e293b;padding:14px 20px;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;z-index:2147483646;box-shadow:0 4px 20px rgba(0,0,0,0.15);border-left:4px solid ' + colors[type] + ';opacity:0;transform:translateX(20px);transition:all 0.3s';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'fw-back-to-top';
    btn.innerHTML = '↑';
    btn.style.cssText = 'position:fixed;bottom:90px;right:20px;width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;cursor:pointer;font-size:20px;opacity:0;visibility:hidden;transition:all 0.3s;z-index:999998;box-shadow:0 4px 12px rgba(102,126,234,0.4)';
    document.body.appendChild(btn);

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btn.addEventListener('mouseenter', function() {
      btn.style.transform = 'scale(1.1)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'scale(1)';
    });

    window.addEventListener('scroll', throttle(function() {
      if (window.pageYOffset > 300) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
      }
    }, 100), { passive: true });

    console.log('[Fischyweb] Back to top initialized');
  }

  // ============================================
  // READING PROGRESS BAR
  // ============================================
  function initProgressBar() {
    var bar = document.createElement('div');
    bar.id = 'fw-progress-bar';
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#667eea,#764ba2,#f64f59);z-index:2147483645;width:0%;transition:width 0.1s';
    document.body.appendChild(bar);

    window.addEventListener('scroll', throttle(function() {
      var scrollTop = window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, 16), { passive: true });

    console.log('[Fischyweb] Progress bar initialized');
  }

  // ============================================
  // DARK MODE TOGGLE
  // ============================================
  function initDarkMode() {
    var style = document.createElement('style');
    style.id = 'fischyweb-darkmode-styles';
    style.textContent = 'body.fw-dark{background:#0f172a!important;color:#e2e8f0!important}body.fw-dark *{border-color:#334155!important}body.fw-dark a{color:#93c5fd}body.fw-dark img{opacity:0.9}';
    document.head.appendChild(style);

    // Check saved preference
    if (localStorage.getItem('fw-dark') === 'true') {
      document.body.classList.add('fw-dark');
    }

    console.log('[Fischyweb] Dark mode initialized');
  }

  function toggleDarkMode() {
    document.body.classList.toggle('fw-dark');
    localStorage.setItem('fw-dark', document.body.classList.contains('fw-dark'));
    showToast(document.body.classList.contains('fw-dark') ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
  }

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================
  function typewriter(element, text, speed) {
    speed = speed || 50;
    element.textContent = '';
    var i = 0;
    var timer = setInterval(function() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return timer;
  }

  // ============================================
  // LIGHTBOX / MODAL
  // ============================================
  function initLightbox() {
    var style = document.createElement('style');
    style.id = 'fischyweb-lightbox-styles';
    style.textContent = '.fw-lightbox{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:2147483646;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:all 0.3s}.fw-lightbox.fw-open{opacity:1;visibility:visible}.fw-lightbox img{max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.5);transform:scale(0.9);transition:transform 0.3s}.fw-lightbox.fw-open img{transform:scale(1)}.fw-lightbox-close{position:absolute;top:20px;right:20px;width:40px;height:40px;background:white;border:none;border-radius:50%;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center}';
    document.head.appendChild(style);

    var lightbox = document.createElement('div');
    lightbox.className = 'fw-lightbox';
    lightbox.innerHTML = '<button class="fw-lightbox-close">×</button><img src="" alt="">';
    document.body.appendChild(lightbox);

    var img = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.fw-lightbox-close');

    document.addEventListener('click', function(e) {
      var trigger = e.target.closest('[data-fw-lightbox]');
      if (trigger) {
        var src = trigger.getAttribute('data-fw-lightbox') || trigger.src;
        img.src = src;
        lightbox.classList.add('fw-open');
      }
    });

    closeBtn.addEventListener('click', function() {
      lightbox.classList.remove('fw-open');
    });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('fw-open');
      }
    });

    console.log('[Fischyweb] Lightbox initialized');
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounter(element, target, duration) {
    duration = duration || 2000;
    var start = 0;
    var startTime = null;
    
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * target);
      element.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target.toLocaleString();
      }
    }
    
    requestAnimationFrame(step);
  }

  function initCounters() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-fw-counter')) || 0;
          var duration = parseInt(el.getAttribute('data-fw-duration')) || 2000;
          animateCounter(el, target, duration);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-fw-counter]').forEach(function(el) {
      observer.observe(el);
    });

    console.log('[Fischyweb] Counters initialized');
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (link) {
        var targetId = link.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          var offset = parseInt(link.getAttribute('data-fw-offset')) || 80;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });

    console.log('[Fischyweb] Smooth scroll initialized');
  }

  // ============================================
  // STICKY ELEMENTS
  // ============================================
  function initSticky() {
    var style = document.createElement('style');
    style.id = 'fischyweb-sticky-styles';
    style.textContent = '[data-fw-sticky]{position:sticky;top:0;z-index:100}[data-fw-sticky].fw-stuck{box-shadow:0 2px 10px rgba(0,0,0,0.1)}';
    document.head.appendChild(style);

    document.querySelectorAll('[data-fw-sticky]').forEach(function(el) {
      var offset = parseInt(el.getAttribute('data-fw-sticky')) || 0;
      el.style.top = offset + 'px';
    });

    console.log('[Fischyweb] Sticky elements initialized');
  }

  // ============================================
  // ZIP PARSER & PACKAGE LOADER
  // ============================================
  var textEncoder = new TextEncoder();
  var textDecoder = new TextDecoder();
  
  function stringToBytes(str) { return textEncoder.encode(str); }
  function bytesToString(bytes) { return textDecoder.decode(bytes); }

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
  // STATE & THEME MANAGEMENT
  // ============================================
  var currentThemeStyle = null;
  var appliedPatches = [];
  var originalStates = [];
  var currentPackage = null;

  function applyTheme(css) {
    removeTheme();
    var style = document.createElement('style');
    style.id = 'fischyweb-theme-' + Date.now();
    style.setAttribute('data-fischyweb', 'true');
    style.textContent = css;
    document.head.appendChild(style);
    currentThemeStyle = style;
    showToast('🎨 Theme applied!', 'success');
  }

  function removeTheme() {
    if (currentThemeStyle) {
      currentThemeStyle.remove();
      currentThemeStyle = null;
    }
  }

  function applyPatches(patches) {
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
            if (patch.action === 'prepend') target.prepend(div);
            else target.append(div);
            break;
          case 'add-class':
            var cls = (patch.html || '').trim();
            if (cls) { state.classAdded = cls; target.classList.add(cls); }
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
    if (patches.length) showToast('🔧 ' + patches.length + ' patches applied!', 'success');
  }

  function revertPatches() {
    document.querySelectorAll('.fischyweb-patch').forEach(function(el) { el.remove(); });
    originalStates.forEach(function(state) {
      try {
        var target = document.querySelector(state.selector);
        if (!target) return;
        if (state.classAdded) target.classList.remove(state.classAdded);
        if (state.originalHTML !== undefined) target.innerHTML = state.originalHTML;
      } catch (e) {}
    });
    appliedPatches = [];
    originalStates = [];
  }

  function loadPackage(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        try {
          var files = parseZip(reader.result);
          if (!files['manifest.json']) throw new Error('Invalid package');
          var manifest = JSON.parse(bytesToString(files['manifest.json']));
          var themeCSS = files['theme.css'] ? bytesToString(files['theme.css']) : null;
          var pkg = { manifest: manifest, themeCSS: themeCSS, files: files };
          currentPackage = pkg;
          resolve(pkg);
        } catch (e) { reject(e); }
      };
      reader.onerror = function() { reject(new Error('Read error')); };
      reader.readAsArrayBuffer(file);
    });
  }

  // ============================================
  // FLOATING UI
  // ============================================
  function createUI() {
    var container = document.createElement('div');
    container.id = 'fischyweb-ui';
    container.innerHTML = '<style>#fischyweb-ui{position:fixed;bottom:20px;right:20px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}#fw-btn{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;cursor:pointer;box-shadow:0 4px 15px rgba(102,126,234,0.4);font-size:22px;transition:all 0.3s}#fw-btn:hover{transform:scale(1.1)}#fw-panel{display:none;position:absolute;bottom:60px;right:0;width:300px;background:white;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.2);overflow:hidden}#fw-panel.open{display:block;animation:fwSlide 0.3s}@keyframes fwSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fw-header{padding:16px;background:linear-gradient(135deg,#667eea,#764ba2);color:white}.fw-header h3{margin:0;font-size:16px}.fw-body{padding:16px}.fw-drop{border:2px dashed #cbd5e1;border-radius:8px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s}.fw-drop:hover{border-color:#667eea;background:#f8fafc}.fw-info{margin-top:12px;padding:12px;background:#f8fafc;border-radius:8px;display:none}.fw-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.fw-b{padding:10px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s}.fw-b-p{background:linear-gradient(135deg,#667eea,#764ba2);color:white}.fw-b-s{background:#f1f5f9;color:#475569}.fw-b-d{background:#fef2f2;color:#dc2626;grid-column:1/-1}</style><button id="fw-btn" title="Fischyweb">⚡</button><div id="fw-panel"><div class="fw-header"><h3>⚡ Fischyweb Engine v2.0</h3></div><div class="fw-body"><div id="fw-drop" class="fw-drop"><div style="font-size:32px;margin-bottom:8px">📦</div><div style="font-weight:600;color:#1e293b">Drop .fischyweb file</div><div style="font-size:12px;color:#94a3b8">or click to browse</div></div><input type="file" id="fw-file" accept=".fischyweb" style="display:none"><div id="fw-info" class="fw-info"><strong id="fw-name">Package</strong><p id="fw-meta" style="margin:4px 0 0;font-size:12px;color:#64748b"></p></div><div class="fw-btns" id="fw-btns" style="display:none"><button class="fw-b fw-b-p" id="fw-theme">🎨 Theme</button><button class="fw-b fw-b-s" id="fw-patches">🔧 Patches</button><button class="fw-b fw-b-d" id="fw-revert">↩️ Revert</button></div></div></div>';
    document.body.appendChild(container);

    var btn = document.getElementById('fw-btn');
    var panel = document.getElementById('fw-panel');
    var drop = document.getElementById('fw-drop');
    var fileInput = document.getElementById('fw-file');
    var info = document.getElementById('fw-info');
    var btns = document.getElementById('fw-btns');
    var name = document.getElementById('fw-name');
    var meta = document.getElementById('fw-meta');

    btn.onclick = function() { panel.classList.toggle('open'); };
    drop.onclick = function() { fileInput.click(); };
    drop.ondragover = function(e) { e.preventDefault(); drop.style.borderColor = '#667eea'; };
    drop.ondragleave = function() { drop.style.borderColor = '#cbd5e1'; };
    drop.ondrop = function(e) { e.preventDefault(); drop.style.borderColor = '#cbd5e1'; if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
    fileInput.onchange = function() { if (fileInput.files[0]) handleFile(fileInput.files[0]); };

    function handleFile(file) {
      loadPackage(file).then(function(pkg) {
        name.textContent = pkg.manifest.metadata?.name || 'Unnamed';
        meta.textContent = 'v' + (pkg.manifest.metadata?.version || '1.0');
        drop.style.display = 'none';
        info.style.display = 'block';
        btns.style.display = 'grid';
        showToast('📦 Package loaded!', 'success');
      }).catch(function(e) { showToast('❌ ' + e.message, 'error'); });
    }

    document.getElementById('fw-theme').onclick = function() {
      if (currentPackage?.themeCSS) applyTheme(currentPackage.themeCSS);
      else showToast('No theme CSS', 'warning');
    };
    document.getElementById('fw-patches').onclick = function() {
      if (currentPackage?.manifest.domPatches?.length) applyPatches(currentPackage.manifest.domPatches);
      else showToast('No patches', 'warning');
    };
    document.getElementById('fw-revert').onclick = function() {
      removeTheme();
      revertPatches();
      showToast('↩️ Reverted!', 'info');
    };
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init(userConfig) {
    Object.assign(config, userConfig || {});
    console.log('[Fischyweb] ⚡ Engine v' + VERSION + ' starting...');

    var initPromise = config.showStartup ? showStartupAnimation() : Promise.resolve();

    initPromise.then(function() {
      if (config.enableProtection) initProtection(config.protectionLevel);
      if (config.enableScrollAnimations) initScrollAnimations();
      if (config.enableParallax) initParallax();
      if (config.enableLazyLoad) initLazyLoad();
      if (config.enableTooltips) initTooltips();
      if (config.enableBackToTop) initBackToTop();
      if (config.enableProgressBar) initProgressBar();
      if (config.enableDarkMode) initDarkMode();
      
      initLightbox();
      initCounters();
      initSmoothScroll();
      initSticky();
      createUI();

      console.log('[Fischyweb] ⚡ Engine ready!');
    });
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(); });
  } else {
    init();
  }

  // Public API
  window.FischywebEngine = {
    version: VERSION,
    init: init,
    protect: function(sel) {
      if (sel) document.querySelectorAll(sel).forEach(function(el) { el.setAttribute('data-fw-protected', ''); });
      else document.body.setAttribute('data-fw-protected', '');
    },
    unprotect: function(sel) {
      if (sel) document.querySelectorAll(sel).forEach(function(el) { el.removeAttribute('data-fw-protected'); });
      else document.body.removeAttribute('data-fw-protected');
    },
    toggleDark: toggleDarkMode,
    toast: showToast,
    typewriter: typewriter,
    animateCounter: animateCounter,
    loadPackage: loadPackage,
    applyTheme: applyTheme,
    removeTheme: removeTheme,
    applyPatches: applyPatches,
    revertPatches: revertPatches,
    showStartup: showStartupAnimation,
    getPackage: function() { return currentPackage; }
  };

  window.FischywebLoader = window.FischywebEngine;

})();
