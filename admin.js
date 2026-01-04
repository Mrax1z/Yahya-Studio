// Admin Dashboard System
// This handles all admin functionality including bookings, chat, and settings

class AdminDashboardSystem {
    constructor() {
        this.checkAuthentication();
        this.initializeAdminElements();
        this.setupAdminEventListeners();
        this.loadDashboardData();
        this.initializeAdminChat();
        this.loadBookings();
        this.loadSettings();
        this.setupRealTimeUpdates();
    }

    checkAuthentication() {
        // Check if admin is logged in
        const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
        
        if (!isAdminLoggedIn) {
            // Redirect to main page if not logged in
            window.location.href = 'index.html';
            return;
        }
    }

    initializeAdminElements() {
        // Dashboard Elements
        this.dashboardSidebar = document.getElementById('dashboard-sidebar');
        this.adminMobileMenuBtn = document.getElementById('admin-mobile-menu-btn');
        this.navItems = document.querySelectorAll('.nav-item');
        this.dashboardSections = document.querySelectorAll('.dashboard-section');
        this.dashboardTitle = document.getElementById('dashboard-title');
        this.logoutBtn = document.getElementById('logout-btn');
        
        // Stats Elements
        this.totalBookingsEl = document.getElementById('total-bookings');
        this.activeChatsEl = document.getElementById('active-chats');
        this.onlineUsersEl = document.getElementById('online-users');
        this.totalRevenueEl = document.getElementById('total-revenue');
        
        // Booking Elements
        this.recentBookingsBody = document.getElementById('recent-bookings-body');
        this.allBookingsBody = document.getElementById('all-bookings-body');
        this.addBookingBtn = document.getElementById('add-booking-btn');
        this.addBookingModal = document.getElementById('add-booking-modal');
        this.addBookingClose = document.getElementById('add-booking-close');
        this.cancelAddBooking = document.getElementById('cancel-add-booking');
        this.addBookingForm = document.getElementById('add-booking-form');
        
        // Chat Elements
        this.adminChatStatus = document.getElementById('admin-chat-status');
        this.onlineUsersCount = document.getElementById('online-users-count');
        this.toggleOnlineStatusBtn = document.getElementById('toggle-online-status');
        this.userListBody = document.getElementById('user-list-body');
        this.adminChatMessages = document.getElementById('admin-chat-messages');
        this.adminMessageInput = document.getElementById('admin-message-input');
        this.adminSendMessage = document.getElementById('admin-send-message');
        this.adminChatInput = document.getElementById('admin-chat-input');
        this.currentUserAvatar = document.getElementById('current-user-avatar');
        this.currentUserName = document.getElementById('current-user-name');
        this.currentUserStatus = document.getElementById('current-user-status');
        
        // Settings Elements
        this.saveSettingsBtn = document.getElementById('save-settings-btn');
        this.resetSettingsBtn = document.getElementById('reset-settings-btn');
        this.autoReplyToggle = document.getElementById('auto-reply-toggle');
        this.autoReplyMessage = document.getElementById('auto-reply-message');
        
        // Notification Elements
        this.adminNotificationBadge = document.getElementById('admin-notification-badge');
        this.chatNotificationBadge = document.getElementById('chat-notification-badge');
        this.bookingNotificationBadge = document.getElementById('booking-notification-badge');
        
        // State
        this.isAdminOnline = localStorage.getItem('adminOnlineStatus') === 'true' || false;
        this.currentChatUser = null;
        this.allUsers = [];
        this.bookings = [];
        this.filter = 'all';
    }

    setupAdminEventListeners() {
        // Mobile menu toggle
        this.adminMobileMenuBtn.addEventListener('click', () => this.toggleAdminMobileMenu());
        
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e, item));
        });
        
        // Logout
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Online status toggle
        this.toggleOnlineStatusBtn.addEventListener('click', () => this.toggleOnlineStatus());
        
        // Booking filters
        document.getElementById('filter-pending').addEventListener('click', () => this.filterBookings('pending'));
        document.getElementById('filter-confirmed').addEventListener('click', () => this.filterBookings('confirmed'));
        document.getElementById('filter-all').addEventListener('click', () => this.filterBookings('all'));
        
        // Add booking
        this.addBookingBtn.addEventListener('click', () => this.showAddBookingModal());
        this.addBookingClose.addEventListener('click', () => this.hideAddBookingModal());
        this.cancelAddBooking.addEventListener('click', () => this.hideAddBookingModal());
        this.addBookingForm.addEventListener('submit', (e) => this.handleAddBooking(e));
        
        // Admin chat
        this.adminSendMessage.addEventListener('click', () => this.sendAdminMessage());
        this.adminMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAdminMessage();
            }
        });
        
        // Settings
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());
        
        // Close modals when clicking outside
        this.addBookingModal.addEventListener('click', (e) => {
            if (e.target === this.addBookingModal) {
                this.hideAddBookingModal();
            }
        });
        
        // Set minimum date for new booking to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('new-event-date').min = today;
    }

    loadDashboardData() {
        // Load bookings from localStorage
        this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        // Calculate stats
        this.updateStats();
        
        // Load recent bookings
        this.loadRecentBookings();
        
        // Update notification badges
        this.updateNotificationBadges();
        
        // Set initial online status
        this.updateOnlineStatusUI();
    }

    initializeAdminChat() {
        // Load users from admin inbox
        this.loadUsers();
        
        // Set up periodic updates
        setInterval(() => this.updateChatData(), 3000);
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateStats();
            this.updateNotificationBadges();
            
            // Update chat if we're in chat section
            if (document.getElementById('section-admin-chat').classList.contains('active')) {
                this.updateChatData();
            }
        }, 5000);
    }

    toggleAdminMobileMenu() {
        this.dashboardSidebar.classList.toggle('active');
    }

    handleNavigation(e, item) {
        e.preventDefault();
        
        // Remove active class from all nav items
        this.navItems.forEach(navItem => navItem.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get section to show
        const section = item.getAttribute('data-section');
        
        // Hide all sections
        this.dashboardSections.forEach(sec => sec.classList.remove('active'));
        
        // Show selected section
        document.getElementById(`section-${section}`).classList.add('active');
        
        // Update dashboard title
        const titleText = item.querySelector('span').textContent;
        this.dashboardTitle.textContent = titleText;
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.dashboardSidebar.classList.remove('active');
        }
        
        // Load section-specific data
        if (section === 'admin-chat') {
            this.updateChatData();
        } else if (section === 'bookings') {
            this.loadBookings();
        }
    }

    handleLogout() {
        // Clear admin login status
        localStorage.setItem('isAdminLoggedIn', 'false');
        
        // Set admin offline
        localStorage.setItem('adminOnlineStatus', 'false');
        
        // Redirect to main page
        window.location.href = 'index.html';
    }

    updateStats() {
        // Calculate total bookings
        const totalBookings = this.bookings.length;
        this.totalBookingsEl.textContent = totalBookings;
        
        // Calculate active chats (users with unread messages)
        const adminInbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
        const uniqueUsers = [...new Set(adminInbox.map(msg => msg.userId))];
        this.activeChatsEl.textContent = uniqueUsers.length;
        
        // Calculate online users (simulated)
        const onlineUsers = Math.floor(Math.random() * 50) + 100; // 100-150 users
        this.onlineUsersEl.textContent = onlineUsers;
        this.onlineUsersCount.textContent = onlineUsers;
        
        // Calculate total revenue
        let totalRevenue = 0;
        this.bookings.forEach(booking => {
            const price = parseInt(booking.price.replace('$', '').replace(',', ''));
            if (!isNaN(price)) {
                totalRevenue += price;
            }
        });
        this.totalRevenueEl.textContent = '$' + totalRevenue.toLocaleString();
    }

    loadRecentBookings() {
        // Get recent bookings (last 5)
        const recentBookings = this.bookings.slice(-5).reverse();
        
        // Clear table
        this.recentBookingsBody.innerHTML = '';
        
        // Add bookings to table
        recentBookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(booking.eventDate);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            // Status badge
            let statusClass = '';
            let statusText = '';
            
            switch(booking.status) {
                case 'pending':
                    statusClass = 'pending';
                    statusText = 'Pending';
                    break;
                case 'confirmed':
                    statusClass = 'confirmed';
                    statusText = 'Confirmed';
                    break;
                case 'done':
                    statusClass = 'done';
                    statusText = 'Done';
                    break;
                default:
                    statusClass = 'pending';
                    statusText = 'Pending';
            }
            
            row.innerHTML = `
                <td>${booking.clientName}</td>
                <td>${booking.eventType}</td>
                <td>${formattedDate}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="adminSystem.viewBooking('${booking.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon" onclick="adminSystem.editBooking('${booking.id}')"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            `;
            
            this.recentBookingsBody.appendChild(row);
        });
        
        // If no bookings, show message
        if (recentBookings.length === 0) {
            this.recentBookingsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No bookings found</td>
                </tr>
            `;
        }
    }

    loadBookings() {
        // Filter bookings based on current filter
        let filteredBookings = this.bookings;
        
        if (this.filter !== 'all') {
            filteredBookings = this.bookings.filter(booking => booking.status === this.filter);
        }
        
        // Reverse to show newest first
        filteredBookings = filteredBookings.slice().reverse();
        
        // Clear table
        this.allBookingsBody.innerHTML = '';
        
        // Add bookings to table
        filteredBookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // Format date
            const date = new Date(booking.eventDate);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
            });
            
            // Status badge
            let statusClass = '';
            let statusText = '';
            
            switch(booking.status) {
                case 'pending':
                    statusClass = 'pending';
                    statusText = 'Pending';
                    break;
                case 'confirmed':
                    statusClass = 'confirmed';
                    statusText = 'Confirmed';
                    break;
                case 'done':
                    statusClass = 'done';
                    statusText = 'Done';
                    break;
                default:
                    statusClass = 'pending';
                    statusText = 'Pending';
            }
            
            row.innerHTML = `
                <td>${booking.clientName}</td>
                <td>${booking.package}</td>
                <td>${formattedDate}</td>
                <td>${booking.price}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="adminSystem.viewBooking('${booking.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon" onclick="adminSystem.editBooking('${booking.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon" onclick="adminSystem.deleteBooking('${booking.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            this.allBookingsBody.appendChild(row);
        });
        
        // If no bookings, show message
        if (filteredBookings.length === 0) {
            this.allBookingsBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No ${this.filter !== 'all' ? this.filter : ''} bookings found</td>
                </tr>
            `;
        }
    }

    filterBookings(filter) {
        this.filter = filter;
        this.loadBookings();
        
        // Update active filter button
        document.querySelectorAll('#section-bookings .btn-outline').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(`filter-${filter}`).classList.add('active');
    }

    showAddBookingModal() {
        this.addBookingModal.classList.add('active');
    }

    hideAddBookingModal() {
        this.addBookingModal.classList.remove('active');
        this.addBookingForm.reset();
    }

    handleAddBooking(e) {
        e.preventDefault();
        
        // Get form values
        const clientName = document.getElementById('new-client-name').value;
        const clientEmail = document.getElementById('new-client-email').value;
        const clientPhone = document.getElementById('new-client-phone').value;
        const packageText = document.getElementById('new-booking-package').value;
        const eventDate = document.getElementById('new-event-date').value;
        const status = document.getElementById('new-booking-status').value;
        
        // Extract price from package text
        let price = '$0';
        if (packageText.includes('Basic')) price = '$499';
        if (packageText.includes('Professional')) price = '$899';
        if (packageText.includes('Cinematic')) price = '$1,499';
        
        // Create booking object
        const booking = {
            id: Date.now(),
            clientName,
            clientEmail,
            clientPhone,
            package: packageText,
            price,
            eventType: packageText.split(' - ')[0],
            eventDate,
            status,
            timestamp: new Date().toISOString()
        };
        
        // Add to bookings array
        this.bookings.push(booking);
        
        // Save to localStorage
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
        
        // Hide modal and reset form
        this.hideAddBookingModal();
        
        // Reload bookings
        this.loadBookings();
        this.loadRecentBookings();
        this.updateStats();
        
        // Show success message
        alert('Booking added successfully!');
    }

    viewBooking(bookingId) {
        const booking = this.bookings.find(b => b.id == bookingId);
        
        if (booking) {
            let message = `Booking Details:\n\n`;
            message += `Client: ${booking.clientName}\n`;
            message += `Email: ${booking.clientEmail}\n`;
            message += `Phone: ${booking.clientPhone}\n`;
            message += `Package: ${booking.package}\n`;
            message += `Event Type: ${booking.eventType}\n`;
            message += `Date: ${new Date(booking.eventDate).toLocaleDateString()}\n`;
            message += `Status: ${booking.status}\n`;
            message += `Booked on: ${new Date(booking.timestamp).toLocaleString()}`;
            
            alert(message);
        }
    }

    editBooking(bookingId) {
        const booking = this.bookings.find(b => b.id == bookingId);
        
        if (booking) {
            // In a real app, this would open an edit form
            // For now, we'll just change the status as an example
            const newStatus = prompt('Change booking status (pending/confirmed/done):', booking.status);
            
            if (newStatus && ['pending', 'confirmed', 'done'].includes(newStatus)) {
                booking.status = newStatus;
                
                // Save to localStorage
                localStorage.setItem('bookings', JSON.stringify(this.bookings));
                
                // Reload bookings
                this.loadBookings();
                this.loadRecentBookings();
                
                alert('Booking status updated!');
            }
        }
    }

    deleteBooking(bookingId) {
        if (confirm('Are you sure you want to delete this booking?')) {
            // Remove booking from array
            this.bookings = this.bookings.filter(b => b.id != bookingId);
            
            // Save to localStorage
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            
            // Reload bookings
            this.loadBookings();
            this.loadRecentBookings();
            this.updateStats();
            
            alert('Booking deleted!');
        }
    }

    loadUsers() {
        // Get all unique users from admin inbox
        const adminInbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
        
        // Group messages by user
        const usersMap = new Map();
        
        adminInbox.forEach(message => {
            if (!usersMap.has(message.userId)) {
                usersMap.set(message.userId, {
                    id: message.userId,
                    name: message.userName || 'Guest User',
                    isGuest: message.isGuest || true,
                    messages: [],
                    unreadCount: 0,
                    lastMessageTime: message.timestamp
                });
            }
            
            const user = usersMap.get(message.userId);
            user.messages.push(message);
            
            if (!message.adminRead) {
                user.unreadCount++;
            }
            
            // Update last message time if this message is newer
            if (new Date(message.timestamp) > new Date(user.lastMessageTime)) {
                user.lastMessageTime = message.timestamp;
            }
        });
        
        // Convert to array and sort by last message time (newest first)
        this.allUsers = Array.from(usersMap.values()).sort((a, b) => {
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });
        
        this.renderUserList();
    }

    renderUserList() {
        // Clear user list
        this.userListBody.innerHTML = '';
        
        // Add users to list
        this.allUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            userElement.setAttribute('data-user-id', user.id);
            
            if (this.currentChatUser && this.currentChatUser.id === user.id) {
                userElement.classList.add('active');
            }
            
            // Get initials for avatar
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            
            // Format last message time
            const lastActive = new Date(user.lastMessageTime);
            const now = new Date();
            const diffHours = Math.floor((now - lastActive) / (1000 * 60 * 60));
            
            let timeText = '';
            if (diffHours < 1) {
                timeText = 'Just now';
            } else if (diffHours < 24) {
                timeText = `${diffHours} hours ago`;
            } else {
                timeText = `${Math.floor(diffHours / 24)} days ago`;
            }
            
            userElement.innerHTML = `
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-status">
                        <span class="online-dot"></span>
                        <span>${user.isGuest ? 'Guest' : 'Registered'} • ${timeText}</span>
                    </div>
                </div>
                ${user.unreadCount > 0 ? `<span class="notification-badge">${user.unreadCount}</span>` : ''}
            `;
            
            // Add click event
            userElement.addEventListener('click', () => this.selectUser(user));
            
            this.userListBody.appendChild(userElement);
        });
        
        // If no users, show message
        if (this.allUsers.length === 0) {
            this.userListBody.innerHTML = `
                <div class="empty-user-list">
                    <i class="fas fa-users fa-2x"></i>
                    <p>No conversations yet</p>
                </div>
            `;
        }
    }

    selectUser(user) {
        this.currentChatUser = user;
        
        // Update UI
        this.currentUserAvatar.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        this.currentUserName.textContent = user.name;
        this.currentUserStatus.textContent = user.isGuest ? 'Guest User' : 'Registered User';
        
        // Show chat input
        this.adminChatInput.style.display = 'flex';
        this.adminMessageInput.focus();
        
        // Load messages for this user
        this.loadUserMessages();
        
        // Mark user's messages as read
        this.markUserMessagesAsRead(user.id);
        
        // Update user list to show active state
        this.renderUserList();
    }

    loadUserMessages() {
        if (!this.currentChatUser) return;
        
        // Clear messages
        this.adminChatMessages.innerHTML = '';
        
        // Get messages for this user
        const userMessages = this.currentChatUser.messages.sort((a, b) => {
            return new Date(a.timestamp) - new Date(b.timestamp);
        });
        
        // Display messages
        userMessages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add(message.sender === 'user' ? 'user-message' : 'admin-message');
            
            const time = new Date(message.timestamp);
            const timeString = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageElement.innerHTML = `
                <div class="message-sender">${message.sender === 'user' ? this.currentChatUser.name : 'You'}</div>
                <div class="message-text">${message.message}</div>
                <div class="message-time">${timeString}</div>
            `;
            
            this.adminChatMessages.appendChild(messageElement);
        });
        
        // Scroll to bottom
        setTimeout(() => {
            this.adminChatMessages.scrollTop = this.adminChatMessages.scrollHeight;
        }, 100);
        
        // If no messages, show empty state
        if (userMessages.length === 0) {
            this.adminChatMessages.innerHTML = `
                <div class="empty-chat-message">
                    <i class="fas fa-comment fa-3x"></i>
                    <h4>No messages yet</h4>
                    <p>Start a conversation with ${this.currentChatUser.name}</p>
                </div>
            `;
        }
    }

    sendAdminMessage() {
        if (!this.currentChatUser || !this.adminMessageInput.value.trim()) return;
        
        const messageText = this.adminMessageInput.value.trim();
        
        // Create message object
        const message = {
            id: 'admin_msg_' + Date.now(),
            sender: 'admin',
            message: messageText,
            timestamp: new Date().toISOString(),
            userId: this.currentChatUser.id,
            userName: this.currentChatUser.name,
            adminRead: true
        };
        
        // Add to user's messages
        this.currentChatUser.messages.push(message);
        
        // Add to admin inbox
        let adminInbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
        adminInbox.push(message);
        localStorage.setItem('adminInbox', JSON.stringify(adminInbox));
        
        // Also add to user's chat history
        let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        chatHistory.push({
            ...message,
            read: false
        });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        
        // Clear input
        this.adminMessageInput.value = '';
        
        // Reload messages
        this.loadUserMessages();
        
        // Update user list
        this.loadUsers();
    }

    markUserMessagesAsRead(userId) {
        // Mark all messages from this user as read in admin inbox
        let adminInbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
        
        adminInbox.forEach(message => {
            if (message.userId === userId && !message.adminRead) {
                message.adminRead = true;
            }
        });
        
        localStorage.setItem('adminInbox', JSON.stringify(adminInbox));
        
        // Update notification badges
        this.updateNotificationBadges();
    }

    toggleOnlineStatus() {
        this.isAdminOnline = !this.isAdminOnline;
        
        // Save to localStorage
        localStorage.setItem('adminOnlineStatus', this.isAdminOnline.toString());
        
        // Update UI
        this.updateOnlineStatusUI();
        
        // Show notification
        alert(`You are now ${this.isAdminOnline ? 'online' : 'offline'}`);
    }

    updateOnlineStatusUI() {
        if (this.isAdminOnline) {
            this.adminChatStatus.className = 'online-indicator';
            this.toggleOnlineStatusBtn.textContent = 'Go Offline';
            this.toggleOnlineStatusBtn.classList.remove('btn-outline');
            this.toggleOnlineStatusBtn.classList.add('btn-primary');
        } else {
            this.adminChatStatus.className = 'offline-indicator';
            this.toggleOnlineStatusBtn.textContent = 'Go Online';
            this.toggleOnlineStatusBtn.classList.remove('btn-primary');
            this.toggleOnlineStatusBtn.classList.add('btn-outline');
        }
    }

    updateChatData() {
        // Reload users and messages
        this.loadUsers();
        
        // If we have a current user, reload their messages
        if (this.currentChatUser) {
            // Find updated user data
            const updatedUser = this.allUsers.find(u => u.id === this.currentChatUser.id);
            if (updatedUser) {
                this.currentChatUser = updatedUser;
                this.loadUserMessages();
            }
        }
    }

    loadSettings() {
        // Load settings from localStorage
        const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
        
        // Apply settings to form
        if (settings.adminName) {
            document.getElementById('admin-full-name').value = settings.adminName;
        }
        
        if (settings.adminEmail) {
            document.getElementById('admin-email').value = settings.adminEmail;
        }
        
        if (settings.businessHours) {
            document.getElementById('business-hours').value = settings.businessHours;
        }
        
        if (settings.autoReplyEnabled !== undefined) {
            this.autoReplyToggle.checked = settings.autoReplyEnabled;
        }
        
        if (settings.autoReplyMessage) {
            this.autoReplyMessage.value = settings.autoReplyMessage;
        }
        
        if (settings.emailNotifications !== undefined) {
            document.getElementById('email-notifications').checked = settings.emailNotifications;
        }
        
        if (settings.chatNotifications !== undefined) {
            document.getElementById('chat-notifications').checked = settings.chatNotifications;
        }
    }

    saveSettings() {
        // Get values from form
        const settings = {
            adminName: document.getElementById('admin-full-name').value,
            adminEmail: document.getElementById('admin-email').value,
            businessHours: document.getElementById('business-hours').value,
            autoReplyEnabled: this.autoReplyToggle.checked,
            autoReplyMessage: this.autoReplyMessage.value,
            emailNotifications: document.getElementById('email-notifications').checked,
            chatNotifications: document.getElementById('chat-notifications').checked,
            savedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        
        // Update auto-reply in chat system
        if (window.chatSystem) {
            window.chatSystem.autoReplyEnabled = settings.autoReplyEnabled;
        }
        
        alert('Settings saved successfully!');
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            // Clear settings
            localStorage.removeItem('adminSettings');
            
            // Reload settings
            this.loadSettings();
            
            alert('Settings reset to default!');
        }
    }

    updateNotificationBadges() {
        // Calculate unread messages
        const adminInbox = JSON.parse(localStorage.getItem('adminInbox')) || [];
        const unreadMessages = adminInbox.filter(msg => !msg.adminRead).length;
        
        // Calculate pending bookings
        const pendingBookings = this.bookings.filter(b => b.status === 'pending').length;
        
        // Calculate total notifications
        const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        const totalNotifications = adminNotifications.filter(n => !n.read).length;
        
        // Update badges
        if (this.chatNotificationBadge) {
            if (unreadMessages > 0) {
                this.chatNotificationBadge.textContent = unreadMessages > 9 ? '9+' : unreadMessages;
                this.chatNotificationBadge.style.display = 'flex';
            } else {
                this.chatNotificationBadge.style.display = 'none';
            }
        }
        
        if (this.bookingNotificationBadge) {
            if (pendingBookings > 0) {
                this.bookingNotificationBadge.textContent = pendingBookings > 9 ? '9+' : pendingBookings;
                this.bookingNotificationBadge.style.display = 'flex';
            } else {
                this.bookingNotificationBadge.style.display = 'none';
            }
        }
        
        if (this.adminNotificationBadge) {
            if (totalNotifications > 0) {
                this.adminNotificationBadge.textContent = totalNotifications > 9 ? '9+' : totalNotifications;
                this.adminNotificationBadge.style.display = 'flex';
            } else {
                this.adminNotificationBadge.style.display = 'none';
            }
        }
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminSystem = new AdminDashboardSystem();
});