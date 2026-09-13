/**
 * AI-Powered Chatbot Assistant - Client Controller
 * Powers the new theme, pastel action cards, 3-panel layout,
 * light/dark theme toggle, search filter, voice STT/TTS,
 * and SSE streaming chat.
 */

(function () {
    'use strict';

    // Application State
    const STATE = {
        sessions: [],
        currentSessionId: null,
        activePersona: 'general',
        personas: {},
        activeDoc: null,
        theme: 'theme-light',
        settings: {
            provider: 'gemini',
            apiKey: '',
            voice: ''
        },
        isStreaming: false,
        abortController: null,
        speechRecognition: null,
        isListening: false
    };

    // DOM Elements
    const elements = {
        body: document.body,
        sidebarLeft: document.getElementById('sidebarLeft'),
        sidebarRight: document.getElementById('sidebarRight'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        collapseSidebarBtn: document.getElementById('collapseSidebarBtn'),
        historyToggleHeaderBtn: document.getElementById('historyToggleHeaderBtn'),
        navHistoryToggleBtn: document.getElementById('navHistoryToggleBtn'),
        navChatBtn: document.getElementById('navChatBtn'),
        navDocsBtn: document.getElementById('navDocsBtn'),
        uploadNavBadge: document.getElementById('uploadNavBadge'),
        navHistoryCount: document.getElementById('navHistoryCount'),
        sessionSearchInput: document.getElementById('sessionSearchInput'),
        personaNavList: document.getElementById('personaNavList'),
        lightThemeBtn: document.getElementById('lightThemeBtn'),
        darkThemeBtn: document.getElementById('darkThemeBtn'),
        pageTitle: document.getElementById('pageTitle'),
        upgradeBtn: document.getElementById('upgradeBtn'),
        exportBtn: document.getElementById('exportBtn'),
        chatViewport: document.getElementById('chatViewport'),
        welcomeContainer: document.getElementById('welcomeContainer'),
        messagesStream: document.getElementById('messagesStream'),
        chatInput: document.getElementById('chatInput'),
        sendBtn: document.getElementById('sendBtn'),
        charCounter: document.getElementById('charCounter'),
        attachBtn: document.getElementById('attachBtn'),
        fileInput: document.getElementById('fileInput'),
        voiceBtn: document.getElementById('voiceBtn'),
        browsePromptsBtn: document.getElementById('browsePromptsBtn'),
        documentChip: document.getElementById('documentChip'),
        chipFilename: document.getElementById('chipFilename'),
        chipWords: document.getElementById('chipWords'),
        removeDocBtn: document.getElementById('removeDocBtn'),
        railCount: document.getElementById('railCount'),
        newProjectBtn: document.getElementById('newProjectBtn'),
        railNewCardBtn: document.getElementById('railNewCardBtn'),
        clearAllHistoryBtn: document.getElementById('clearAllHistoryBtn'),
        railSessionsList: document.getElementById('railSessionsList'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        openHelpBtn: document.getElementById('openHelpBtn'),
        settingsModal: document.getElementById('settingsModal'),
        closeSettingsModalBtn: document.getElementById('closeSettingsModalBtn'),
        cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        apiProviderSelect: document.getElementById('apiProviderSelect'),
        geminiApiKey: document.getElementById('geminiApiKey'),
        geminiKeyGroup: document.getElementById('geminiKeyGroup'),
        speechVoiceSelect: document.getElementById('speechVoiceSelect'),
        resetAllDataBtn: document.getElementById('resetAllDataBtn'),
        floatingOrb: document.getElementById('floatingOrb'),
        toast: document.getElementById('toast')
    };

    // Initialize App
    async function init() {
        loadTheme();
        loadSettings();
        await loadPersonas();
        loadSessions();
        initSpeechRecognition();
        initSpeechSynthesis();
        setupEventListeners();
    }

    // --- Theme Switching ---
    function loadTheme() {
        const savedTheme = localStorage.getItem('nexus_theme') || 'theme-light';
        setTheme(savedTheme);
    }

    function setTheme(theme) {
        STATE.theme = theme;
        elements.body.className = theme;
        localStorage.setItem('nexus_theme', theme);

        if (theme === 'theme-light') {
            elements.lightThemeBtn.classList.add('active');
            elements.darkThemeBtn.classList.remove('active');
        } else {
            elements.lightThemeBtn.classList.remove('active');
            elements.darkThemeBtn.classList.add('active');
        }
    }

    // --- Settings & Storage ---
    function loadSettings() {
        try {
            const saved = localStorage.getItem('nexus_ai_settings');
            if (saved) {
                STATE.settings = { ...STATE.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }

    function saveSettings() {
        STATE.settings.provider = elements.apiProviderSelect.value;
        STATE.settings.apiKey = elements.geminiApiKey.value.trim();
        STATE.settings.voice = elements.speechVoiceSelect.value;

        localStorage.setItem('nexus_ai_settings', JSON.stringify(STATE.settings));
        closeModal();
        showToast('Settings saved successfully!');
    }

    // --- Personas Management ---
    async function loadPersonas() {
        try {
            const res = await fetch('/api/personas');
            if (res.ok) {
                const list = await res.json();
                list.forEach(p => {
                    STATE.personas[p.id] = p;
                });
            }
        } catch (e) {
            STATE.personas = {
                general: { id: 'general', name: 'General Assistant', avatar: 'AI', badge: 'Versatile' },
                coder: { id: 'coder', name: 'Code Architect', avatar: 'DEV', badge: 'Python, JS' },
                tutor: { id: 'tutor', name: 'Academic Tutor', avatar: 'EDU', badge: 'Concepts' },
                writer: { id: 'writer', name: 'Creative Writer', avatar: 'TXT', badge: 'Copy & Content' },
                career: { id: 'career', name: 'Career Coach', avatar: 'PRO', badge: 'Interviews' }
            };
        }
        renderPersonaNav();
    }

    function renderPersonaNav() {
        elements.personaNavList.innerHTML = '';
        Object.values(STATE.personas).forEach(p => {
            const btn = document.createElement('button');
            btn.className = `persona-nav-item ${p.id === STATE.activePersona ? 'active' : ''}`;
            btn.innerHTML = `
                <span class="persona-icon">${p.avatar}</span>
                <span class="nav-label">${p.name}</span>
            `;
            btn.addEventListener('click', () => setPersona(p.id));
            elements.personaNavList.appendChild(btn);
        });
    }

    function setPersona(personaId) {
        if (!STATE.personas[personaId]) return;
        STATE.activePersona = personaId;
        renderPersonaNav();

        const p = STATE.personas[personaId];
        elements.pageTitle.textContent = `${p.name}`;

        const session = getCurrentSession();
        if (session) {
            session.persona = personaId;
            saveSessionsToStorage();
        }
        showToast(`Switched persona to ${p.name}`);
    }

    // --- Sessions Management ---
    function loadSessions() {
        try {
            const saved = localStorage.getItem('nexus_ai_sessions');
            if (saved) {
                STATE.sessions = JSON.parse(saved);
            }
        } catch (e) {
            STATE.sessions = [];
        }

        if (STATE.sessions.length === 0) {
            createNewSession();
        } else {
            switchSession(STATE.sessions[0].id);
        }
        renderSessionsList();
    }

    function saveSessionsToStorage() {
        try {
            localStorage.setItem('nexus_ai_sessions', JSON.stringify(STATE.sessions));
        } catch (e) {
            console.error('Failed to save sessions:', e);
        }
    }

    function createNewSession() {
        const newId = 'session_' + Date.now();
        const newSession = {
            id: newId,
            title: 'New Conversation',
            persona: STATE.activePersona,
            messages: [],
            docContext: null,
            createdAt: new Date().toISOString()
        };
        STATE.sessions.unshift(newSession);
        saveSessionsToStorage();
        switchSession(newId);
        renderSessionsList();
    }

    function switchSession(sessionId) {
        STATE.currentSessionId = sessionId;
        const session = getCurrentSession();
        if (!session) return;

        if (session.persona && STATE.personas[session.persona]) {
            STATE.activePersona = session.persona;
            renderPersonaNav();
        }

        if (session.docContext) {
            STATE.activeDoc = session.docContext;
            showDocumentChip(session.docContext.filename, session.docContext.wordCount);
        } else {
            clearDocumentContext();
        }

        renderMessages();
        renderSessionsList();
        elements.chatInput.focus();
    }

    function deleteSession(sessionId, e) {
        if (e) e.stopPropagation();
        STATE.sessions = STATE.sessions.filter(s => s.id !== sessionId);
        if (STATE.sessions.length === 0) {
            createNewSession();
        } else if (STATE.currentSessionId === sessionId) {
            switchSession(STATE.sessions[0].id);
        }
        saveSessionsToStorage();
        renderSessionsList();
        showToast('Chat deleted');
    }

    function getCurrentSession() {
        return STATE.sessions.find(s => s.id === STATE.currentSessionId);
    }

    function renderSessionsList(filterQuery = '') {
        elements.railSessionsList.innerHTML = '';
        const count = STATE.sessions.length;
        elements.railCount.textContent = `(${count})`;
        elements.navHistoryCount.textContent = `${count}`;

        const filtered = filterQuery
            ? STATE.sessions.filter(s => s.title.toLowerCase().includes(filterQuery.toLowerCase()))
            : STATE.sessions;

        filtered.forEach(s => {
            const card = document.createElement('div');
            card.className = `rail-session-card ${s.id === STATE.currentSessionId ? 'active' : ''}`;

            const lastMsg = s.messages.length > 0 ? s.messages[s.messages.length - 1].content : 'No messages yet...';
            const snippet = lastMsg.replace(/[#*`_]/g, '').substring(0, 36) + '...';

            card.innerHTML = `
                <div class="rail-card-body">
                    <div class="rail-card-title">${escapeHtml(s.title)}</div>
                    <div class="rail-card-snippet">${escapeHtml(snippet)}</div>
                </div>
                <button class="rail-delete-btn" title="Delete conversation">✕</button>
            `;
            card.addEventListener('click', () => switchSession(s.id));
            card.querySelector('.rail-delete-btn').addEventListener('click', (e) => deleteSession(s.id, e));
            elements.railSessionsList.appendChild(card);
        });
    }

    // --- Message Rendering & Markdown ---
    function renderMessages() {
        const session = getCurrentSession();
        if (!session || session.messages.length === 0) {
            elements.welcomeContainer.style.display = 'flex';
            elements.messagesStream.innerHTML = '';
            return;
        }

        elements.welcomeContainer.style.display = 'none';
        elements.messagesStream.innerHTML = '';

        session.messages.forEach(msg => {
            appendMessageNode(msg.role, msg.content, false);
        });

        scrollToBottom();
    }

    function appendMessageNode(role, content, isStreaming = false) {
        elements.welcomeContainer.style.display = 'none';
        const p = STATE.personas[STATE.activePersona] || STATE.personas.general;

        const row = document.createElement('div');
        row.className = `message-row ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'user' ? 'U' : (p.avatar || 'AI');

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        if (role === 'user') {
            bubble.textContent = content;
        } else {
            bubble.innerHTML = renderMarkdown(content);
            if (isStreaming) {
                const cursor = document.createElement('span');
                cursor.className = 'streaming-cursor';
                cursor.id = 'activeStreamingCursor';
                bubble.appendChild(cursor);
            } else {
                appendMessageActions(bubble, content);
            }
        }

        row.appendChild(avatar);
        row.appendChild(bubble);
        elements.messagesStream.appendChild(row);
        scrollToBottom();

        return bubble;
    }

    function appendMessageActions(bubble, content) {
        const actions = document.createElement('div');
        actions.className = 'message-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-chip-btn';
        copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(content);
            showToast('Copied to clipboard!');
        });

        const speakBtn = document.createElement('button');
        speakBtn.className = 'action-chip-btn';
        speakBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Read Aloud`;
        speakBtn.addEventListener('click', () => readAloud(content, speakBtn));

        actions.appendChild(copyBtn);
        actions.appendChild(speakBtn);
        bubble.appendChild(actions);

        bubble.querySelectorAll('.code-container').forEach(block => {
            const btn = block.querySelector('.copy-code-btn');
            const code = block.querySelector('pre code');
            if (btn && code) {
                btn.addEventListener('click', () => {
                    navigator.clipboard.writeText(code.innerText);
                    btn.textContent = 'Copied!';
                    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
                });
            }
        });
    }

    function scrollToBottom() {
        elements.chatViewport.scrollTo({
            top: elements.chatViewport.scrollHeight,
            behavior: 'smooth'
        });
    }

    // --- Sending Messages & SSE Streaming ---
    async function sendMessage() {
        const text = elements.chatInput.value.trim();
        if (!text || STATE.isStreaming) return;

        elements.chatInput.value = '';
        updateInputState();

        const session = getCurrentSession();
        if (!session) return;

        if (session.messages.length === 0) {
            session.title = text.length > 26 ? text.substring(0, 26) + '...' : text;
            renderSessionsList();
        }

        session.messages.push({ role: 'user', content: text, timestamp: Date.now() });
        appendMessageNode('user', text, false);

        const payload = {
            messages: session.messages.map(m => ({ role: m.role, content: m.content })),
            persona: STATE.activePersona,
            doc_context: STATE.activeDoc ? STATE.activeDoc.text : null,
            api_key: STATE.settings.apiKey || null,
            provider: STATE.settings.provider
        };

        STATE.isStreaming = true;
        elements.sendBtn.disabled = true;
        let assistantContent = '';
        const bubble = appendMessageNode('assistant', '', true);

        STATE.abortController = new AbortController();

        try {
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: STATE.abortController.signal
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let doneStreaming = false;

            while (!doneStreaming) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunkText = decoder.decode(value, { stream: true });
                const lines = chunkText.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6).trim();
                        if (!jsonStr) continue;

                        try {
                            const data = JSON.parse(jsonStr);
                            if (data.token) {
                                assistantContent += data.token;
                                bubble.innerHTML = renderMarkdown(assistantContent) + '<span class="streaming-cursor" id="activeStreamingCursor"></span>';
                                scrollToBottom();
                            }
                            if (data.done) {
                                doneStreaming = true;
                            }
                        } catch (err) {
                            // ignore partial JSON in SSE line
                        }
                    }
                }
            }

            const cursor = bubble.querySelector('#activeStreamingCursor');
            if (cursor) cursor.remove();

            session.messages.push({ role: 'assistant', content: assistantContent, timestamp: Date.now() });
            saveSessionsToStorage();
            renderSessionsList();
            appendMessageActions(bubble, assistantContent);

        } catch (error) {
            if (error.name !== 'AbortError') {
                const cursor = bubble.querySelector('#activeStreamingCursor');
                if (cursor) cursor.remove();
                bubble.innerHTML += `<br><blockquote style="border-color: #ef4444; color: #ef4444;">Error: ${escapeHtml(error.message)}</blockquote>`;
            }
        } finally {
            STATE.isStreaming = false;
            STATE.abortController = null;
            elements.sendBtn.disabled = false;
            elements.chatInput.focus();
        }
    }

    // --- Document Upload ---
    async function handleFileUpload(file) {
        if (!file) return;

        showToast(`Processing ${file.name}...`);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Upload failed');
            }

            const data = await res.json();
            STATE.activeDoc = {
                filename: data.filename,
                text: data.text,
                wordCount: data.word_count
            };

            const session = getCurrentSession();
            if (session) {
                session.docContext = STATE.activeDoc;
                saveSessionsToStorage();
            }

            showDocumentChip(data.filename, data.word_count);
            showToast(`Document "${data.filename}" indexed! (${data.word_count} words)`);
            elements.chatInput.placeholder = `Ask anything about "${data.filename}"...`;
            elements.chatInput.focus();

        } catch (e) {
            alert(`Error uploading document: ${e.message}`);
        } finally {
            elements.fileInput.value = '';
        }
    }

    function showDocumentChip(filename, wordCount) {
        elements.chipFilename.textContent = filename;
        elements.chipWords.textContent = `${wordCount.toLocaleString()} words indexed`;
        elements.documentChip.style.display = 'flex';
    }

    function clearDocumentContext() {
        STATE.activeDoc = null;
        elements.documentChip.style.display = 'none';
        elements.chatInput.placeholder = 'Message Assistant... (Ask a question, request code, or explore)';
        const session = getCurrentSession();
        if (session) {
            session.docContext = null;
            saveSessionsToStorage();
        }
    }

    // --- Speech Recognition (Voice STT) ---
    function initSpeechRecognition() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            elements.voiceBtn.style.opacity = '0.4';
            return;
        }

        STATE.speechRecognition = new SpeechRec();
        STATE.speechRecognition.continuous = false;
        STATE.speechRecognition.interimResults = true;
        STATE.speechRecognition.lang = 'en-US';

        STATE.speechRecognition.onstart = () => {
            STATE.isListening = true;
            elements.voiceBtn.classList.add('is-recording');
            showToast('Listening... Speak now!');
        };

        STATE.speechRecognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            elements.chatInput.value = transcript;
            updateInputState();
        };

        STATE.speechRecognition.onerror = () => stopListening();
        STATE.speechRecognition.onend = () => stopListening();
    }

    function toggleListening() {
        if (!STATE.speechRecognition) {
            alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        if (STATE.isListening) {
            STATE.speechRecognition.stop();
            stopListening();
        } else {
            try {
                STATE.speechRecognition.start();
            } catch (e) {
                console.warn(e);
            }
        }
    }

    function stopListening() {
        STATE.isListening = false;
        elements.voiceBtn.classList.remove('is-recording');
    }

    // --- Speech Synthesis (Voice TTS) ---
    function initSpeechSynthesis() {
        if (!('speechSynthesis' in window)) return;

        function populateVoices() {
            const voices = window.speechSynthesis.getVoices();
            elements.speechVoiceSelect.innerHTML = '<option value="">Default Browser Voice</option>';
            voices.forEach(voice => {
                const opt = document.createElement('option');
                opt.value = voice.name;
                opt.textContent = `${voice.name} (${voice.lang})`;
                if (STATE.settings.voice === voice.name) {
                    opt.selected = true;
                }
                elements.speechVoiceSelect.appendChild(opt);
            });
        }

        populateVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoices;
        }
    }

    function readAloud(text, btn) {
        if (!('speechSynthesis' in window)) {
            alert('Speech Synthesis not supported.');
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Read Aloud`;
            return;
        }

        const cleanText = text
            .replace(/```[\s\S]*?```/g, ' Code snippet omitted. ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/[*#_>-]/g, '')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (STATE.settings.voice) {
            const selected = window.speechSynthesis.getVoices().find(v => v.name === STATE.settings.voice);
            if (selected) utterance.voice = selected;
        }

        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg> Stop`;
        utterance.onend = () => {
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Read Aloud`;
        };

        window.speechSynthesis.speak(utterance);
    }

    // --- Export Conversation ---
    function exportConversation() {
        const session = getCurrentSession();
        if (!session || session.messages.length === 0) {
            showToast('No messages to export.');
            return;
        }

        let markdown = `# ${session.title}\n\n`;
        markdown += `*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;

        session.messages.forEach(m => {
            const sender = m.role === 'user' ? '### User' : '### Assistant';
            markdown += `${sender}\n\n${m.content}\n\n---\n\n`;
        });

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${session.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Exported conversation as Markdown!');
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Send message
        elements.sendBtn.addEventListener('click', sendMessage);
        elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Input height & char counter
        elements.chatInput.addEventListener('input', updateInputState);

        // Global hotkey Ctrl+K / Cmd+K
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                createNewSession();
            }
        });

        // Session search filter
        elements.sessionSearchInput.addEventListener('input', (e) => {
            renderSessionsList(e.target.value.trim());
        });

        // New conversation buttons
        elements.navChatBtn.addEventListener('click', () => {
            elements.chatInput.focus();
        });
        elements.newProjectBtn.addEventListener('click', createNewSession);
        elements.railNewCardBtn.addEventListener('click', createNewSession);

        // Clear history button
        elements.clearAllHistoryBtn.addEventListener('click', () => {
            if (confirm('Clear all conversation history?')) {
                STATE.sessions = [];
                localStorage.removeItem('nexus_ai_sessions');
                createNewSession();
                showToast('All chats cleared');
            }
        });

        // Theme buttons
        elements.lightThemeBtn.addEventListener('click', () => setTheme('theme-light'));
        elements.darkThemeBtn.addEventListener('click', () => setTheme('theme-dark'));

        // Toggle sidebars
        elements.collapseSidebarBtn.addEventListener('click', () => {
            elements.sidebarLeft.classList.toggle('collapsed');
        });
        elements.mobileMenuBtn.addEventListener('click', () => {
            elements.sidebarLeft.classList.toggle('open');
        });
        elements.historyToggleHeaderBtn.addEventListener('click', () => {
            elements.sidebarRight.classList.toggle('hidden-rail');
        });
        elements.navHistoryToggleBtn.addEventListener('click', () => {
            elements.sidebarRight.classList.toggle('hidden-rail');
        });

        // Pastel starter cards click
        document.querySelectorAll('.pastel-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.dataset.prompt;
                if (prompt) {
                    elements.chatInput.value = prompt;
                    sendMessage();
                }
            });
        });

        // Bottom toolbar buttons
        elements.attachBtn.addEventListener('click', () => elements.fileInput.click());
        elements.navDocsBtn.addEventListener('click', () => elements.fileInput.click());
        elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
        elements.removeDocBtn.addEventListener('click', clearDocumentContext);
        elements.voiceBtn.addEventListener('click', toggleListening);
        elements.browsePromptsBtn.addEventListener('click', () => {
            elements.welcomeContainer.scrollIntoView({ behavior: 'smooth' });
            elements.chatInput.focus();
        });

        // Export button
        elements.exportBtn.addEventListener('click', exportConversation);

        // Settings modal
        elements.openSettingsBtn.addEventListener('click', openModal);
        elements.upgradeBtn.addEventListener('click', openModal);
        elements.openHelpBtn.addEventListener('click', () => {
            alert('AI-Powered Chatbot Assistant\n\n- Type prompts or click action cards\n- Use voice STT (Mic button) or TTS (Read Aloud)\n- Attach PDF/TXT documents for Q&A\n- Configure your free Google Gemini API key in Settings');
        });
        elements.closeSettingsModalBtn.addEventListener('click', closeModal);
        elements.cancelSettingsBtn.addEventListener('click', closeModal);
        elements.saveSettingsBtn.addEventListener('click', saveSettings);

        elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === elements.settingsModal) closeModal();
        });

        elements.apiProviderSelect.addEventListener('change', (e) => {
            elements.geminiKeyGroup.style.display = e.target.value === 'gemini' ? 'flex' : 'none';
        });

        elements.resetAllDataBtn.addEventListener('click', () => {
            if (confirm('This will wipe all locally stored conversations and settings. Continue?')) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    function openModal() {
        elements.apiProviderSelect.value = STATE.settings.provider;
        elements.geminiApiKey.value = STATE.settings.apiKey || '';
        elements.geminiKeyGroup.style.display = STATE.settings.provider === 'gemini' ? 'flex' : 'none';
        elements.settingsModal.style.display = 'flex';
    }

    function closeModal() {
        elements.settingsModal.style.display = 'none';
    }

    function updateInputState() {
        elements.chatInput.style.height = 'auto';
        elements.chatInput.style.height = Math.min(elements.chatInput.scrollHeight, 150) + 'px';
        const len = elements.chatInput.value.length;
        elements.charCounter.textContent = `${len.toLocaleString()} / 3,000`;
    }

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add('show');
        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 2600);
    }

    // --- Markdown Parser ---
    function renderMarkdown(text) {
        if (!text) return '';

        let html = escapeHtml(text);

        // Code Blocks with Language & Copy Header
        html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
            const displayLang = lang || 'code';
            return `
                <div class="code-container">
                    <div class="code-header">
                        <span>${displayLang.toUpperCase()}</span>
                        <button class="copy-code-btn">Copy</button>
                    </div>
                    <pre><code class="language-${displayLang}">${code.trim()}</code></pre>
                </div>
            `;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Blockquotes
        html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Bold & Italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Horizontal Rules
        html = html.replace(/^---$/gim, '<hr>');

        // Bullet lists
        html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<ul><li>$1</li></ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        // Numbered lists
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<ol><li>$1</li></ol>');
        html = html.replace(/<\/ol>\s*<ol>/g, '');

        // Paragraphs & Line Breaks
        html = html.replace(/\n\n+/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        return `<p>${html}</p>`;
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
