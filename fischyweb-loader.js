/**
 * Fischyweb Loader Script v1.0.0
 * Standalone script to load .fischyweb mods on any website
 * MIT License
 * 
 * Usage: <script src="fischyweb-loader.js"></script>
 */
(function() {
  'use strict';

  console.log('[Fischyweb] Loader initializing...');

  // ============================================
  // IO Utilities
  // ============================================
  var textEncoder = new TextEncoder();
  var textDecoder = new TextDecoder();
  
  function stringToBytes(str) { 
    return textEncoder.encode(str); 
  }
  
  function bytesToString(bytes) { 
    return textDecoder.decode(bytes); 
  }
  
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
  function readUint16LE(data, offset) { 
    return data[offset] | (data[offset + 1] << 8); 
  }
  
  function readUint32LE(data, offset) { 
    return (data[offset] | (data[offset + 1] << 8) | 
            (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0; 
  }
  
  function parseZip(data) {
    var bytes = new Uint8Array(data);
    var files = {};
    
    // Find end of central directory
    var endOffset = bytes.length - 22;
    while (endOffset >= 0) {
      if (bytes[endOffset] === 0x50 && bytes[endOffset + 1] === 0x4B && 
          bytes[endOffset + 2] === 0x05 && bytes[endOffset + 3] === 0x06) {
        break;
      }
      endOffset--;
    }
    
    if (endOffset < 0) {
      throw new Error('Invalid ZIP file');
    }
    
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

  // ============================================
  // Theme CSS Functions
  // ============================================
  function applyTheme(css) {
    console.log('[Fischyweb] Applying theme CSS...');
    console.log('[Fischyweb] CSS length:', css.length, 'characters');
    console.log('[Fischyweb] CSS preview:', css.substring(0, 200));
    
    removeTheme();
    
    var style = document.createElement('style');
    style.id = 'fischyweb-theme-' + Date.now();
    style.setAttribute('data-fischyweb', 'true');
    style.textContent = css;
    
    // Ensure we're appending to head
    if (!document.head) {
      console.error('[Fischyweb] No <head> element found!');
      return;
    }
    
    document.head.appendChild(style);
    currentThemeStyle = style;
    
    console.log('[Fischyweb] Theme CSS applied. Style element:', style);
    console.log('[Fischyweb] Total style tags in head:', document.head.querySelectorAll('style').length);
    
    // Verify it was added
    var verify = document.getElementById(style.id);
    if (verify) {
      console.log('[Fischyweb] ✓ Style element verified in DOM');
    } else {
      console.error('[Fischyweb] ✗ Style element NOT found in DOM after insertion!');
    }
  }

  function removeTheme() {
    if (currentThemeStyle) {
      console.log('[Fischyweb] Removing theme CSS...');
      currentThemeStyle.remove();
      currentThemeStyle = null;
    }
  }

  // ============================================
  // DOM Patch Functions
  // ============================================
  function applyPatches(patches) {
    console.log('[Fischyweb] Applying', patches.length, 'DOM patches...');
    revertPatches();
    
    patches.forEach(function(patch, idx) {
      try {
        var target = document.querySelector(patch.selector);
        if (!target) {
          console.warn('[Fischyweb] Target not found for selector:', patch.selector);
          return;
        }
        
        var state = { selector: patch.selector, action: patch.action };
        
        switch (patch.action) {
          case 'prepend':
          case 'append':
            var div = document.createElement('div');
            div.innerHTML = patch.html || '';
            div.classList.add('fischyweb-patch');
            div.setAttribute('data-fischyweb-patch', idx);
            if (patch.action === 'prepend') {
              target.prepend(div);
            } else {
              target.append(div);
            }
            break;
            
          case 'add-class':
            var cls = (patch.html || '').trim();
            if (cls) {
              state.classAdded = cls;
              target.classList.add(cls);
            }
            break;
            
          case 'remove-class':
            var clsRm = (patch.html || '').trim();
            if (clsRm) {
              state.classRemoved = clsRm;
              state.hadClass = target.classList.contains(clsRm);
              target.classList.remove(clsRm);
            }
            break;
            
          case 'set-attr':
            if (patch.attrs) {
              state.originalAttrs = {};
              for (var key in patch.attrs) {
                state.originalAttrs[key] = target.getAttribute(key);
                target.setAttribute(key, patch.attrs[key]);
              }
            }
            break;
            
          case 'replace':
            state.originalHTML = target.innerHTML;
            target.innerHTML = patch.html || '';
            break;
        }
        
        originalStates.push(state);
        appliedPatches.push(patch);
        
      } catch (e) {
        console.error('[Fischyweb] Patch error:', e);
      }
    });
    
    console.log('[Fischyweb] DOM patches applied');
  }

  function revertPatches() {
    console.log('[Fischyweb] Reverting DOM patches...');
    
    // Remove injected elements
    document.querySelectorAll('.fischyweb-patch').forEach(function(el) {
      el.remove();
    });
    
    // Restore original states
    originalStates.forEach(function(state) {
      try {
        var target = document.querySelector(state.selector);
        if (!target) return;
        
        if (state.classAdded) {
          target.classList.remove(state.classAdded);
        }
        
        if (state.classRemoved && state.hadClass) {
          target.classList.add(state.classRemoved);
        }
        
        if (state.originalAttrs) {
          for (var key in state.originalAttrs) {
            if (state.originalAttrs[key] === null) {
              target.removeAttribute(key);
            } else {
              target.setAttribute(key, state.originalAttrs[key]);
            }
          }
        }
        
        if (state.originalHTML !== undefined) {
          target.innerHTML = state.originalHTML;
        }
        
      } catch (e) {
        console.error('[Fischyweb] Revert error:', e);
      }
    });
    
    appliedPatches = [];
    originalStates = [];
    console.log('[Fischyweb] Patches reverted');
  }

  // ============================================
  // Package Loading
  // ============================================
  function loadPackage(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      
      reader.onload = function() {
        try {
          console.log('[Fischyweb] Parsing package...');
          var files = parseZip(reader.result);
          
          if (!files['manifest.json']) {
            throw new Error('No manifest.json in package');
          }
          
          var manifest = JSON.parse(bytesToString(files['manifest.json']));
          var themeCSS = files['theme.css'] ? bytesToString(files['theme.css']) : null;
          var modHTML = files['mod.html'] ? bytesToString(files['mod.html']) : null;
          
          console.log('[Fischyweb] Files in package:', Object.keys(files));
          console.log('[Fischyweb] theme.css found?', 'theme.css' in files);
          if (themeCSS) {
            console.log('[Fischyweb] Theme CSS loaded, length:', themeCSS.length);
          }
          
          var pkg = {
            manifest: manifest,
            themeCSS: themeCSS,
            modHTML: modHTML,
            files: files
          };
          
          console.log('[Fischyweb] Package loaded:', manifest.metadata.name);
          console.log('[Fischyweb] Package object:', pkg);
          resolve(pkg);
          
        } catch (e) {
          console.error('[Fischyweb] Parse error:', e);
          reject(e);
        }
      };
      
      reader.onerror = function() {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  // ============================================
  // UI Creation
  // ============================================
  function createUI() {
    console.log('[Fischyweb] Creating UI...');
    
    var container = document.createElement('div');
    container.id = 'fischyweb-loader-ui';
    container.innerHTML = `
      <style>
        #fischyweb-loader-ui {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        #fischyweb-loader-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 24px;
        }
        
        #fischyweb-loader-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        
        #fischyweb-loader-panel {
          display: none;
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 340px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        #fischyweb-loader-panel.open {
          display: block;
        }
        
        .fischyweb-header {
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .fischyweb-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .fischyweb-body {
          padding: 20px;
        }
        
        .fischyweb-dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f8fafc;
        }
        
        .fischyweb-dropzone:hover {
          border-color: #667eea;
          background: #f1f5f9;
        }
        
        .fischyweb-dropzone.dragover {
          border-color: #667eea;
          background: #eef2ff;
          border-style: solid;
        }
        
        .fischyweb-info {
          margin-top: 16px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }
        
        .fischyweb-info h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }
        
        .fischyweb-info p {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }
        
        .fischyweb-actions {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        
        .fischyweb-btn {
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          text-align: center;
        }
        
        .fischyweb-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .fischyweb-btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .fischyweb-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .fischyweb-btn-secondary {
          background: #f1f5f9;
          color: #475569;
        }
        
        .fischyweb-btn-secondary:hover:not(:disabled) {
          background: #e2e8f0;
        }
        
        .fischyweb-btn-danger {
          background: #fef2f2;
          color: #dc2626;
          grid-column: 1 / -1;
        }
        
        .fischyweb-btn-danger:hover:not(:disabled) {
          background: #fee2e2;
        }
        
        .fischyweb-status {
          margin-top: 12px;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
        }
        
        .fischyweb-status.success {
          background: #f0fdf4;
          color: #16a34a;
        }
        
        .fischyweb-status.error {
          background: #fef2f2;
          color: #dc2626;
        }
        
        .fischyweb-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .fischyweb-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        #fischyweb-file-input {
          display: none;
        }
        
        .fischyweb-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          margin-top: 4px;
        }
      </style>
      
      <button id="fischyweb-loader-btn" title="Load Fischyweb Mod">
        📦
      </button>
      
      <div id="fischyweb-loader-panel">
        <div class="fischyweb-header">
          <h3>Fischyweb Loader</h3>
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
              <button class="fischyweb-btn fischyweb-btn-primary" id="fischyweb-apply-theme-btn">
                🎨 Apply Theme
              </button>
              <button class="fischyweb-btn fischyweb-btn-secondary" id="fischyweb-apply-patches-btn">
                🔧 Apply Patches
              </button>
            </div>
            
            <div class="fischyweb-actions">
              <button class="fischyweb-btn fischyweb-btn-danger" id="fischyweb-revert-btn">
                ↩️ Revert All Changes
              </button>
            </div>
            
            <div id="fischyweb-status" class="fischyweb-status" style="display: none;"></div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Get elements
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

    // Helper functions
    function showStatus(msg, isError) {
      status.textContent = msg;
      status.className = 'fischyweb-status ' + (isError ? 'error' : 'success');
      status.style.display = 'block';
      setTimeout(function() {
        status.style.display = 'none';
      }, 3000);
    }

    // Event handlers
    btn.onclick = function() {
      panel.classList.toggle('open');
    };

    closeBtn.onclick = function() {
      panel.classList.remove('open');
    };

    dropzone.onclick = function() {
      fileInput.click();
    };

    dropzone.ondragover = function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    };

    dropzone.ondragleave = function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    };

    dropzone.ondrop = function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
      
      var file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    };

    fileInput.onchange = function() {
      if (fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    };

    function handleFile(file) {
      console.log('[Fischyweb] Loading file:', file.name);
      
      loadPackage(file).then(function(pkg) {
        currentPackage = pkg;
        
        pkgName.textContent = pkg.manifest.metadata.name || 'Unnamed Package';
        pkgMeta.textContent = 'v' + (pkg.manifest.metadata.version || '1.0.0') + 
          (pkg.manifest.metadata.author ? ' • ' + pkg.manifest.metadata.author : '');
        
        var stats = [];
        if (pkg.themeCSS) stats.push('Theme CSS');
        if (pkg.manifest.domPatches && pkg.manifest.domPatches.length) {
          stats.push(pkg.manifest.domPatches.length + ' patches');
        }
        pkgStatus.textContent = stats.join(' • ') || 'Ready';
        
        dropzone.style.display = 'none';
        loadedInfo.style.display = 'block';
        
        showStatus('✓ Package loaded successfully!', false);
        
      }).catch(function(e) {
        showStatus('✗ Error: ' + e.message, true);
        console.error('[Fischyweb] Load error:', e);
      });
    }

    applyThemeBtn.onclick = function() {
      if (!currentPackage) {
        showStatus('✗ No package loaded', true);
        return;
      }
      
      console.log('[Fischyweb] Apply theme clicked');
      console.log('[Fischyweb] Package:', currentPackage);
      console.log('[Fischyweb] Theme CSS exists?', !!currentPackage.themeCSS);
      
      if (currentPackage.themeCSS) {
        console.log('[Fischyweb] Theme CSS content:', currentPackage.themeCSS);
        applyTheme(currentPackage.themeCSS);
        showStatus('✓ Theme CSS applied! Check browser console for details.', false);
      } else {
        showStatus('✗ No theme CSS in this package', true);
        console.warn('[Fischyweb] Package has no themeCSS property');
      }
    };

    applyPatchesBtn.onclick = function() {
      if (!currentPackage) return;
      
      if (currentPackage.manifest.domPatches && currentPackage.manifest.domPatches.length > 0) {
        applyPatches(currentPackage.manifest.domPatches);
        showStatus('✓ DOM patches applied (' + currentPackage.manifest.domPatches.length + ')', false);
      } else {
        showStatus('✗ No DOM patches in this package', true);
      }
    };

    revertBtn.onclick = function() {
      removeTheme();
      revertPatches();
      showStatus('✓ All changes reverted!', false);
    };
    
    console.log('[Fischyweb] UI created successfully');
  }

  // ============================================
  // Initialize
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
  } else {
    createUI();
  }

  // ============================================
  // Public API
  // ============================================
  window.FischywebLoader = {
    version: '1.0.0',
    loadPackage: loadPackage,
    applyTheme: applyTheme,
    removeTheme: removeTheme,
    applyPatches: applyPatches,
    revertPatches: revertPatches,
    getCurrentPackage: function() {
      return currentPackage;
    }
  };

  console.log('[Fischyweb] Loader ready. API available at window.FischywebLoader');

})();