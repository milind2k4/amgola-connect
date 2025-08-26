import { auth, db } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Initialize auth state listener
export function initAuth() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
        const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
        const userDropdown = document.getElementById('userDropdown');

        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.classList.add('d-none');
            if (userDropdown) {
                userDropdown.classList.remove('d-none');
                // Update the user's name in the dropdown if needed
                const profileLink = document.getElementById('profileLink');
                if (profileLink && user.displayName) {
                    profileLink.innerHTML = `<i class="bi-person me-2"></i>${user.displayName}`;
                }
            }
        } else {
            // User is signed out
            if (loginBtn) {
                loginBtn.classList.remove('d-none');
                loginBtn.innerHTML = '<i class="bi-box-arrow-in-right me-1"></i> Login';
                loginBtn.classList.remove('btn-light');
                loginBtn.classList.add('btn-outline-light');
                loginBtn.setAttribute('data-bs-target', '#loginModal');
            }
            if (userDropdown) userDropdown.classList.add('d-none');
        }
    });

    // Initialize login form
    initLoginForm();
    // Initialize signup form
    initSignupForm();
    // Initialize password toggle
    initPasswordToggle();
}

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const loginBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = loginBtn.innerHTML;

        try {
            // Show loading state
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...';

            // Sign in with Firebase
            await signInWithEmailAndPassword(auth, email, password);

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();

            // Show success message
            showToast('Login successful!', 'success');
        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message, 'danger');
        } finally {
            // Reset button state
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnText;
        }
    });
}

function initSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const signupBtn = signupForm.querySelector('button[type="submit"]');
        const originalBtnText = signupBtn.innerHTML;

        try {
            // Show loading state
            signupBtn.disabled = true;
            signupBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';

            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: name,
                email: email,
                createdAt: new Date().toISOString()
            });

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();

            // Show success message
            showToast('Account created successfully!', 'success');
        } catch (error) {
            console.error('Signup error:', error);
            showToast(error.message, 'danger');
        } finally {
            // Reset button state
            signupBtn.disabled = false;
            signupBtn.innerHTML = originalBtnText;
        }
    });
}

function initPasswordToggle() {
    // Toggle password visibility for login
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#loginPassword');
    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    // Toggle password visibility for signup
    const toggleSignupPassword = document.querySelector('#toggleSignupPassword');
    const signupPassword = document.querySelector('#signupPassword');
    if (toggleSignupPassword && signupPassword) {
        toggleSignupPassword.addEventListener('click', function () {
            const type = signupPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            signupPassword.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }
}

function showToast(message, type = 'info') {
    const toastEl = document.getElementById('loginToast');
    if (!toastEl) return;

    const toastBody = toastEl.querySelector('.toast-body');
    const toastHeader = toastEl.querySelector('.toast-header');
    const progressBar = toastEl.querySelector('.progress-bar');
    const toast = new bootstrap.Toast(toastEl, { autohide: false });

    // Set message and style
    toastBody.textContent = message;

    // Set header color based on type
    const headerClass = type === 'success' ? 'bg-success' :
        type === 'danger' ? 'bg-danger' : 'bg-primary';
    toastHeader.className = `toast-header text-white ${headerClass}`;

    // Reset and show toast
    toastEl.classList.add('show');
    toast.show();

    // Animate progress bar
    progressBar.style.width = '100%';
    progressBar.style.transition = 'width 2s linear';

    // Start progress bar animation
    setTimeout(() => {
        progressBar.style.width = '0%';
    }, 10);

    // Auto-hide after 2 seconds
    setTimeout(() => {
        toast.hide();
    }, 2000);

    // Remove show class after hide animation completes
    toastEl.addEventListener('hidden.bs.toast', function onHidden() {
        toastEl.classList.remove('show');
        toastEl.removeEventListener('hidden.bs.toast', onHidden);
    });
}

// Logout function
export async function logout() {
    try {
        await signOut(auth);
        showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'danger');
    }
}