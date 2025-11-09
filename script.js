// Admin credentials
const ADMIN_CREDENTIALS = {
    id: 'Azeez1459',
    password: 'inscryption#T32'
};

// State
let isAdminMode = false;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const adminBtn = document.getElementById('adminBtn');
const viewerBtn = document.getElementById('viewerBtn');
const closeBtn = document.querySelector('.close');
const adminPanel = document.getElementById('adminPanel');
const saveBtn = document.getElementById('saveBtn');
const logoutBtn = document.getElementById('logoutBtn');
const errorMessage = document.getElementById('errorMessage');

// Editable elements
const movieTitle = document.getElementById('movieTitle');
const castCrew = document.getElementById('castCrew');
const about = document.getElementById('about');
const credits = document.getElementById('credits');
const videoLinkInput = document.getElementById('videoLinkInput');
const editVideoLink = document.getElementById('editVideoLink');
const movieVideo = document.getElementById('movieVideo');

// Disable right-click on video
document.getElementById('videoWrapper').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Prevent keyboard shortcuts for downloading
document.addEventListener('keydown', (e) => {
    // Disable Ctrl+S, Ctrl+P, etc. on video wrapper
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        if (document.activeElement.closest('#videoWrapper')) {
            e.preventDefault();
            return false;
        }
    }
});

// Load saved data from localStorage
function loadData() {
    const savedData = localStorage.getItem('azeurixData');
    if (savedData) {
        const data = JSON.parse(savedData);
        movieTitle.textContent = data.movieTitle || movieTitle.textContent;
        castCrew.innerHTML = data.castCrew || castCrew.innerHTML;
        about.innerHTML = data.about || about.innerHTML;
        credits.innerHTML = data.credits || credits.innerHTML;
        
        // Load logo
        const logoContainer = document.getElementById('logoContainer');
        const logoText = document.getElementById('logoText');
        if (data.logo) {
            if (data.logo.startsWith('http') || data.logo.startsWith('data:')) {
                logoContainer.innerHTML = `<img src="${data.logo}" alt="Azeurix Studios" class="logo" style="height: 50px; width: auto;">`;
            } else {
                logoText.textContent = data.logo;
            }
        }
        
        // Load video link
        if (data.videoLink) {
            updateVideoSource(data.videoLink);
        }
    }
}

// Extract Google Drive file ID from link
function extractDriveId(link) {
    // If it's already just an ID
    if (link.length < 50 && !link.includes('/') && !link.includes('http')) {
        return link;
    }
    
    // Extract from full Google Drive link
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return link; // Return as is if no pattern matches
}

// Update video source
function updateVideoSource(link) {
    const fileId = extractDriveId(link);
    movieVideo.src = `https://drive.google.com/file/d/${fileId}/preview`;
    videoLinkInput.value = fileId;
}

// Save data to localStorage
function saveData() {
    const logoContainer = document.getElementById('logoContainer');
    const logoImg = logoContainer.querySelector('img');
    const logoText = document.getElementById('logoText');
    
    const data = {
        movieTitle: movieTitle.textContent.trim(),
        castCrew: castCrew.innerHTML,
        about: about.innerHTML,
        credits: credits.innerHTML,
        logo: logoImg ? logoImg.src : (logoText ? logoText.textContent : 'Azeurix Studios'),
        videoLink: videoLinkInput.value.trim()
    };
    
    localStorage.setItem('azeurixData', JSON.stringify(data));
    alert('Changes saved successfully!');
}

// Enable admin mode
function enableAdminMode() {
    isAdminMode = true;
    adminPanel.style.display = 'block';
    movieTitle.contentEditable = 'true';
    castCrew.contentEditable = 'true';
    about.contentEditable = 'true';
    credits.contentEditable = 'true';
    editVideoLink.style.display = 'block';
    
    // Add logo edit functionality
    const logoContainer = document.getElementById('logoContainer');
    if (!document.getElementById('logoEditBtn')) {
        const editBtn = document.createElement('button');
        editBtn.id = 'logoEditBtn';
        editBtn.className = 'btn btn-primary';
        editBtn.textContent = 'Edit Logo';
        editBtn.style.marginLeft = '1rem';
        editBtn.style.padding = '0.5rem 1rem';
        editBtn.style.fontSize = '0.8rem';
        editBtn.onclick = editLogo;
        logoContainer.appendChild(editBtn);
    }
}

// Disable admin mode
function disableAdminMode() {
    isAdminMode = false;
    adminPanel.style.display = 'none';
    movieTitle.contentEditable = 'false';
    castCrew.contentEditable = 'false';
    about.contentEditable = 'false';
    credits.contentEditable = 'false';
    editVideoLink.style.display = 'none';
    
    // Remove logo edit button
    const logoEditBtn = document.getElementById('logoEditBtn');
    if (logoEditBtn) {
        logoEditBtn.remove();
    }
}

// Edit logo
function editLogo() {
    const choice = prompt('Enter "1" to upload an image URL or "2" to change text:');
    
    if (choice === '1') {
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
            const logoContainer = document.getElementById('logoContainer');
            logoContainer.innerHTML = `<img src="${imageUrl}" alt="Azeurix Studios" class="logo" style="height: 50px; width: auto;">`;
            
            // Re-add edit button
            const editBtn = document.createElement('button');
            editBtn.id = 'logoEditBtn';
            editBtn.className = 'btn btn-primary';
            editBtn.textContent = 'Edit Logo';
            editBtn.style.marginLeft = '1rem';
            editBtn.style.padding = '0.5rem 1rem';
            editBtn.style.fontSize = '0.8rem';
            editBtn.onclick = editLogo;
            logoContainer.appendChild(editBtn);
        }
    } else if (choice === '2') {
        const newText = prompt('Enter new logo text:');
        if (newText) {
            const logoContainer = document.getElementById('logoContainer');
            logoContainer.innerHTML = `<h1 class="logo" id="logoText">${newText}</h1>`;
            
            // Re-add edit button
            const editBtn = document.createElement('button');
            editBtn.id = 'logoEditBtn';
            editBtn.className = 'btn btn-primary';
            editBtn.textContent = 'Edit Logo';
            editBtn.style.marginLeft = '1rem';
            editBtn.style.padding = '0.5rem 1rem';
            editBtn.style.fontSize = '0.8rem';
            editBtn.onclick = editLogo;
            logoContainer.appendChild(editBtn);
        }
    }
}

// Event Listeners
adminBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

viewerBtn.addEventListener('click', () => {
    disableAdminMode();
    alert('Switched to Viewer Mode');
});

closeBtn.addEventListener('click', () => {
    loginModal.style.display = 'none';
    errorMessage.textContent = '';
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        errorMessage.textContent = '';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const enteredId = document.getElementById('adminId').value;
    const enteredPassword = document.getElementById('adminPassword').value;
    
    if (enteredId === ADMIN_CREDENTIALS.id && enteredPassword === ADMIN_CREDENTIALS.password) {
        enableAdminMode();
        loginModal.style.display = 'none';
        loginForm.reset();
        errorMessage.textContent = '';
        alert('Login successful! You are now in Admin Mode.');
    } else {
        errorMessage.textContent = 'Invalid credentials. Please try again.';
    }
});

saveBtn.addEventListener('click', () => {
    // Update video if link changed
    const newVideoLink = videoLinkInput.value.trim();
    if (newVideoLink) {
        updateVideoSource(newVideoLink);
    }
    saveData();
});

logoutBtn.addEventListener('click', () => {
    disableAdminMode();
    alert('Logged out successfully!');
});

// Load data on page load
document.addEventListener('DOMContentLoaded', loadData);

// Prevent accidental navigation away
window.addEventListener('beforeunload', (e) => {
    if (isAdminMode) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});
