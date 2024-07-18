document.getElementById('connect-button').addEventListener('click', connectUser);
document.getElementById('edit-button').addEventListener('click', showModal);
document.getElementById('logout-button').addEventListener('click', logoutUser);
document.getElementById('save-button').addEventListener('click', saveCredentials);
document.getElementById('clear-button').addEventListener('click', clearCredentials);
document.querySelector('.close').addEventListener('click', closeModal);

function showModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

async function connectUser() {
    chrome.storage.local.get(['username', 'password'], function(result) {
        if (result.username && result.password) {
            // Credentials exist, proceed with login
            login(result.username, result.password);
        } else {
            // Show modal to enter credentials
            showModal();
        }
    });
}

async function saveCredentials() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Save credentials to Chrome storage
    chrome.storage.local.set({username: username, password: password}, function() {
        console.log('Credentials saved');
        closeModal();
        showLoggedInState();
        login(username, password);
    });
}

async function clearCredentials() {
    // Clear storage
    chrome.storage.local.remove(['username', 'password'], function() {
        console.log('Credentials cleared');
        closeModal();
        showLoggedOutState();
        updateStatusMessage('Credentials cleared', 'red');
    });
}

async function login(username, password) {
    try {
        await fetch("https://hfw.vitap.ac.in:8090/login.xml", {
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua":
                    '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Linux"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            referrer: "https://hfw.vitap.ac.in:8090/",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: `mode=191&username=${username}&password=${password}&a=1721159328590&producttype=0`,
            method: "POST",
            mode: "cors",
            credentials: "include",
        });
        updateStatusMessage('Login successful', 'green');
    } catch (error) {
        updateStatusMessage('Login failed', 'red');
    }
}

async function logoutUser() {
    chrome.storage.local.get(['username'], async function(result) {
        if (result.username) {
            try {
                await logout(result.username);
                // Clear storage
                chrome.storage.local.remove(['username', 'password'], function() {
                    console.log('Credentials removed');
                    showLoggedOutState();
                    updateStatusMessage('Logout successful', 'green');
                });
            } catch (error) {
                updateStatusMessage('Logout failed', 'red');
            }
        }
    });
}

async function logout(username) {
    await fetch("https://hfw.vitap.ac.in:8090/logout.xml", {
        headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua":
                '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        referrer: "https://hfw.vitap.ac.in:8090/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `mode=193&username=${username}&a=1721159483216&producttype=0`,
        method: "POST",
        mode: "cors",
        credentials: "include",
    });
}

function updateStatusMessage(message, color) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.style.color = color;
}

function showLoggedInState() {
    document.getElementById('connect-button').style.display = 'none';
    document.getElementById('edit-button').style.display = 'block';
    document.getElementById('logout-button').style.display = 'block';
}

function showLoggedOutState() {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('edit-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';
}

// Check if the user is already logged in
chrome.storage.local.get(['username'], function(result) {
    if (result.username) {
        showLoggedInState();
    } else {
        showLoggedOutState();
    }
});
