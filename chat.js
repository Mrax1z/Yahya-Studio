// ==========================================
// LIVE CHAT SYSTEM (CODE ASLI - TIDAK DIUBAH)
// ==========================================

class LiveChatSystem {
    constructor() {
        this.initializeChatElements();
        this.setupChatEventListeners();
        this.loadChatHistory();
        this.checkAdminOnlineStatus();
        this.setupAutoReply();
        this.initializeNotificationSystem();
    }

    initializeChatElements() {
        this.chatButton = document.getElementById('chat-button');
        this.openChatBtn = document.getElementById('open-chat-btn');
        this.openChatBtn2 = document.getElementById('open-chat-btn-2');
        this.openChatBtnMobile = document.getElementById('open-chat-btn-mobile');
        this.chatModal = document.getElementById('chat-modal');
        this.chatClose = document.getElementById('chat-close');
        this.chatSend = document.getElementById('chat-send');
        this.chatInput = document.getElementById('chat-input');
        this.chatMessages = document.getElementById('chat-messages');
        this.adminStatusIndicator = document.getElementById('admin-status-indicator');
        this.chatNotification = document.getElementById('chat-notification');

        this.chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        this.unreadMessages = 0;
        this.isAdminOnline = false;
        this.autoReplyEnabled = true;
        this.currentUser = this.getOrCreateUser();

        if (this.chatHistory.length === 0) {
            this.addWelcomeMessage();
        }
    }

    setupChatEventListeners() {
        this.chatButton?.addEventListener('click', () => this.openChatModal());
        this.openChatBtn?.addEventListener('click', () => this.openChatModal());
        this.openChatBtn2?.addEventListener('click', () => this.openChatModal());
        this.openChatBtnMobile?.addEventListener('click', () => this.openChatModal());

        this.chatClose?.addEventListener('click', () => this.closeChatModal());

        this.chatSend?.addEventListener('click', () => this.sendMessage());
        this.chatInput?.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.chatModal?.addEventListener('click', e => {
            if (e.target === this.chatModal) this.closeChatModal();
        });

        setInterval(() => this.checkForNewMessages(), 5000);
    }

    getOrCreateUser() {
        let user = localStorage.getItem('chatUser');
        if (!user) {
            user = {
                id: 'user_' + Date.now(),
                name: 'Guest',
                isGuest: true
            };
            localStorage.setItem('chatUser', JSON.stringify(user));
        } else {
            user = JSON.parse(user);
        }
        return user;
    }

    addWelcomeMessage() {
        const msg = {
            id: 'welcome_' + Date.now(),
            sender: 'admin',
            message: 'Hello! Welcome to Lumière Studio. How can I help you today?',
            timestamp: new Date().toISOString(),
            read: true
        };
        this.chatHistory.push(msg);
        this.saveChatHistory();
        this.displayMessage(msg);
    }

    openChatModal() {
        this.chatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.chatInput.focus();
        this.markAllMessagesAsRead();
    }

    closeChatModal() {
        this.chatModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    sendMessage() {
        const text = this.chatInput.value.trim();
        if (!text) return;

        const msg = {
            id: 'msg_' + Date.now(),
            sender: 'user',
            message: text,
            timestamp: new Date().toISOString(),
            read: true
        };

        this.chatHistory.push(msg);
        this.saveChatHistory();
        this.displayMessage(msg);
        this.chatInput.value = '';

        this.saveMessageToAdminInbox(msg);

        if (this.isAdminOnline) {
            setTimeout(() => this.generateAdminReply(text), 1000);
        } else {
            setTimeout(() => this.sendAutoReply(), 1500);
        }
    }

    generateAdminReply(userMessage) {
        const reply = 'Thanks for your message! We will assist you shortly.';
        const msg = {
            id: 'admin_' + Date.now(),
            sender: 'admin',
            message: reply,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.chatHistory.push(msg);
        this.saveChatHistory();
        this.displayMessage(msg);
    }

    sendAutoReply() {
        const msg = {
            id: 'auto_' + Date.now(),
            sender: 'admin',
            message: 'We are currently offline. We will respond within 24 hours.',
            timestamp: new Date().toISOString(),
            read: false
        };

        this.chatHistory.push(msg);
        this.saveChatHistory();
        this.displayMessage(msg);
    }

    displayMessage(msg) {
        const el = document.createElement('div');
        el.className = `message ${msg.sender}`;
        el.innerHTML = `<p>${msg.message}</p>`;
        this.chatMessages.appendChild(el);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        if (!this.chatModal.classList.contains('active') && msg.sender === 'admin') {
            this.unreadMessages++;
            this.updateNotificationBadge();
        }
    }

    loadChatHistory() {
        this.chatMessages.innerHTML = '';
        this.chatHistory.forEach(m => this.displayMessage(m));
    }

    saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory.slice(-50)));
    }

    saveMessageToAdminInbox(msg) {
        let inbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
        inbox.push({ ...msg, adminRead: false });
        localStorage.setItem('adminInbox', JSON.stringify(inbox.slice(-100)));
    }

    checkAdminOnlineStatus() {
        this.isAdminOnline = localStorage.getItem('adminOnlineStatus') === 'true';
        setTimeout(() => this.checkAdminOnlineStatus(), 10000);
    }

    setupAutoReply() {
        const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
        this.autoReplyEnabled = settings.autoReplyEnabled !== false;
    }

    markAllMessagesAsRead() {
        this.chatHistory.forEach(m => m.read = true);
        this.saveChatHistory();
        this.unreadMessages = 0;
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        if (!this.chatNotification) return;
        if (this.unreadMessages > 0) {
            this.chatNotification.textContent = this.unreadMessages > 9 ? '9+' : this.unreadMessages;
            this.chatNotification.style.display = 'flex';
        } else {
            this.chatNotification.style.display = 'none';
        }
    }

    initializeNotificationSystem() {
        this.updateNotificationBadge();
    }

    checkForNewMessages() {}
}

// ==========================================
// EXTENSION (FIX TANPA MENGUBAH CODE DI ATAS)
// ==========================================

LiveChatSystem.prototype.calculateUnreadMessages = function () {
    this.unreadMessages = this.chatHistory.filter(
        m => m.sender === 'admin' && !m.read
    ).length;
    this.updateNotificationBadge();
};

const _openChat = LiveChatSystem.prototype.openChatModal;
LiveChatSystem.prototype.openChatModal = function () {
    _openChat.call(this);
    this.calculateUnreadMessages();
};

LiveChatSystem.prototype.markMessagesAsReadInAdminInbox = function () {
    let inbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
    inbox.forEach(m => m.adminRead = true);
    localStorage.setItem('adminInbox', JSON.stringify(inbox));
};

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    window.chatSystem = new LiveChatSystem();
    chatSystem.calculateUnreadMessages();
});
