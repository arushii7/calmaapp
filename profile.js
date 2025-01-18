// Initialize Clerk with your publishable key
const clerk = new window.Clerk('pk_test_d2lyZWQtYWtpdGEtMS5jbGVyay5hY2NvdW50cy5kZXYk');

async function initializeClerk() {
    try {
        await clerk.load();
        
        if (!clerk.user) {
            updateNavigation();
        } else {
            updateNavigation();
            loadUserProfile();
        }
    } catch (error) {
        console.error('Failed to initialize Clerk:', error);
    }
}

function updateNavigation() {
    const signInBtn = document.getElementById('sign-in-btn');
    const userProfile = document.getElementById('user-profile');
    
    if (clerk.user) {
        signInBtn.style.display = 'none';
        userProfile.style.display = 'block';
        // Set email display
        document.getElementById('user-email').textContent = clerk.user.primaryEmailAddress;
    } else {
        signInBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

async function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const errorElement = document.getElementById('signin-error');

    try {
        await clerk.signIn.create({
            identifier: email,
            password: password
        });
        
        closeModal();
        updateNavigation();
        loadUserProfile();
        showSuccessMessage('Successfully signed in!');
    } catch (error) {
        errorElement.textContent = error.message || 'Failed to sign in. Please try again.';
        errorElement.style.display = 'block';
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorElement = document.getElementById('signup-error');

    try {
        await clerk.signUp.create({
            emailAddress: email,
            password: password
        });

        switchTab('signin');
        showSuccessMessage('Account created successfully! Please sign in.');
    } catch (error) {
        errorElement.textContent = error.message || 'Failed to create account. Please try again.';
        errorElement.style.display = 'block';
    }
}

async function loadUserProfile() {
    if (!clerk.user) return;

    try {
        // Get session token for authentication
        const token = await clerk.session.getToken();
        
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load profile');
        
        const userData = await response.json();
        
        // Update form fields with the returned data
        document.getElementById('name').value = userData.displayName || '';
        document.getElementById('stress-level').value = userData.stressLevel || '';
        document.getElementById('daily-reminder').checked = userData.dailyReminders || false;
        document.getElementById('weekly-report').checked = userData.weeklyReports || false;
        document.getElementById('tips').checked = userData.tipsEnabled || false;

    } catch (error) {
        console.error('Failed to load user profile:', error);
        showSuccessMessage('Failed to load profile data', 'error');
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    
    if (!clerk.user) return;

    const formData = {
        displayName: document.getElementById('name').value,
        stressLevel: parseInt(document.getElementById('stress-level').value),
        dailyReminders: document.getElementById('daily-reminder').checked,
        weeklyReports: document.getElementById('weekly-report').checked,
        tipsEnabled: document.getElementById('tips').checked,
        timestamp: new Date().toISOString()
    };

    try {
        // Get session token for authentication
        const token = await clerk.session.getToken();
        
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update profile');
        
        showSuccessMessage('Profile updated successfully!');
    } catch (error) {
        console.error('Failed to update profile:', error);
        showSuccessMessage('Failed to update profile. Please try again.', 'error');
    }
}

// Helper functions for UI management
function openModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    // Reset forms and errors
    document.getElementById('signin-error').style.display = 'none';
    document.getElementById('signup-error').style.display = 'none';
    document.getElementById('signin-form').reset();
    document.getElementById('signup-form').reset();
}

function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-container');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'signin') {
        tabs[0].classList.add('active');
        document.getElementById('signin-form').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('signup-form').classList.add('active');
    }
}

async function handleSignOut() {
    try {
        await clerk.signOut();
        updateNavigation();
        showSuccessMessage('Successfully signed out!');
    } catch (error) {
        console.error('Failed to sign out:', error);
    }
}

function showSuccessMessage(message, type = 'success') {
    const messageElement = document.getElementById('success-message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    messageElement.style.color = type === 'success' ? '#155724' : '#721c24';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeClerk);