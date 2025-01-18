// Initialize Clerk with your publishable key
const clerk = window.Clerk('pk_test_d2lyZWQtYWtpdGEtMS5jbGVyay5hY2NvdW50cy5kZXYk');

// Function to initialize Clerk and handle user authentication state
async function initClerk() {
    await clerk.load();

    // Check if the user is signed in
    if (clerk.user) {
        console.log('User is signed in:', clerk.user);
        document.getElementById('user-profile-btn').style.display = 'block';
        document.getElementById('sign-in-btn').style.display = 'none';
    } else {
        console.log('No user signed in');
        document.getElementById('user-profile-btn').style.display = 'none';
        document.getElementById('sign-in-btn').style.display = 'block';
    }
}

// Function to open the sign-in dialog and redirect on success
function openSignIn() {
    clerk.openSignIn({
        afterSignInUrl: 'profile.html', // Redirect to profile page after sign-in
    });
}

// Function to open the sign-up dialog and redirect on success
function openSignUp() {
    clerk.openSignUp({
        afterSignUpUrl: 'profile.html', // Redirect to profile page after sign-up
    });
}

// Function to open the user profile
function openUserProfile() {
    clerk.openUserProfile();
}

// Function to handle sign-out
async function signOut() {
    await clerk.signOut();
    console.log('User signed out');
    document.getElementById('user-profile-btn').style.display = 'none';
    document.getElementById('sign-in-btn').style.display = 'block';
}

// Initialize Clerk
initClerk();
