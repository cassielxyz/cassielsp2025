const headerText = "cassiel.ae";
const typingSpeed = 150;
const backspacingSpeed = 80;
const pauseBetweenLoops = 2000;
const cursorBlinkSpeed = 530;

function getRandomTypingDelay() {
    return typingSpeed + Math.random() * 100 - 50;
}

async function typeWriter(element, text) {
    let cursorVisible = true;
    let typingInProgress = false;
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    
    const cursorInterval = setInterval(() => {
        if (!typingInProgress) {
            cursorVisible = !cursorVisible;
            cursor.style.opacity = cursorVisible ? '1' : '0';
        } else {
            cursor.style.opacity = '1';
        }
    }, cursorBlinkSpeed);

    while (true) {
        typingInProgress = true;
        
        for (let i = 0; i <= text.length; i++) {
            element.innerHTML = text.substring(0, i);
            element.appendChild(cursor);
            
            const delay = getRandomTypingDelay();
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        typingInProgress = false;
        await new Promise(resolve => setTimeout(resolve, pauseBetweenLoops));

        typingInProgress = true;
        for (let i = text.length; i >= 0; i--) {
            element.innerHTML = text.substring(0, i);
            element.appendChild(cursor);
            await new Promise(resolve => setTimeout(resolve, backspacingSpeed));
        }
        
        typingInProgress = false;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const headerElement = document.getElementById("header");
    if (headerElement) {
        console.log("Header found! Starting animation...");
        typeWriter(headerElement, headerText);
    } else {
        console.error("Header not found!");
    }
});

function toggleMode() {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
    
    const toggleSwitch = document.getElementById("modeToggle");
    if (toggleSwitch) {
        toggleSwitch.checked = document.body.classList.contains("dark-mode");
    }
}

// Updated YouTube API Search using Serverless Function
async function searchYouTube() {
    const query = document.getElementById("searchQuery").value.trim();
    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    // Use the serverless function endpoint
    const url = `/api/youtube?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch videos");
        }

        const data = await response.json();
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
        resultsDiv.style.opacity = 1;

        let videoElements = [];
        let preloadPromises = [];

        data.items.forEach(video => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const description = video.snippet.description;
            const thumbnail = video.snippet.thumbnails.medium.url;
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const channelName = video.snippet.channelTitle;

            const videoElement = document.createElement("div");
            videoElement.classList.add("video");
            videoElement.innerHTML = `
                <img src="${thumbnail}" alt="${title}" loading="lazy">
                <h3>${title}</h3>
                <p>${description}</p>
                <button class="watch-btn" onclick="window.open('${videoUrl}', '_blank')">Watch</button>
                <button class="download-btn" onclick="showDownloadOptions('${videoUrl}', '${channelName.replace(/'/g, "\\'")}')">Download</button>
            `;

            videoElements.push(videoElement);

            const img = new Image();
            img.src = thumbnail;
            preloadPromises.push(new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            }));
        });

        await Promise.all(preloadPromises);

        videoElements.forEach(videoElement => {
            resultsDiv.appendChild(videoElement);

            setTimeout(() => {
                videoElement.style.opacity = 1;
            }, 100);
        });

    } catch (error) {
        console.error("Error fetching YouTube data:", error);
        alert("An error occurred while fetching YouTube results. Please try again.");
    }
}

function showDownloadOptions(videoUrl, channelName) {
    navigator.clipboard.writeText(videoUrl).then(() => {
        console.log('URL copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy URL:', err);
    });

    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeDownloadModal()">&times;</span>
            <h2>Choose YouTube Downloader</h2>
            <p class="credit-text">Please give credits to <strong>"${channelName}"</strong></p>
            <p class="clipboard-text">✅ Video URL copied to clipboard!</p>
            
            <div class="downloader-grid">
                <a href="https://ytmp3.nu/2SRH/" target="_blank" class="downloader-option">
                    <h3>YTMP3</h3>
                    <p>Fast & reliable, MP3/MP4 downloads</p>
                </a>
                
                <a href="https://yt5s.biz/enxj100/" target="_blank" class="downloader-option">
                    <h3>YT5s</h3>
                    <p>HD quality, multiple formats</p>
                </a>
                
                <a href="https://en.savefrom.net/" target="_blank" class="downloader-option">
                    <h3>SaveFrom</h3>
                    <p>Simple & fast downloads</p>
                </a>
                
                <a href="https://www.y2mate.com/" target="_blank" class="downloader-option">
                    <h3>Y2Mate</h3>
                    <p>High quality, all formats</p>
                </a>
                
                <a href="https://loader.to/" target="_blank" class="downloader-option">
                    <h3>Loader.to</h3>
                    <p>No ads, premium quality</p>
                </a>
                
                <a href="https://ssyoutube.com/" target="_blank" class="downloader-option">
                    <h3>SSYouTube</h3>
                    <p>Add 'ss' before youtube.com</p>
                </a>
                
                <a href="https://cobalt.tools/" target="_blank" class="downloader-option">
                    <h3>Cobalt</h3>
                    <p>Privacy-focused, no tracking</p>
                </a>
                
                <a href="https://ytmp4.pro/" target="_blank" class="downloader-option">
                    <h3>YTMP4</h3>
                    <p>Quick MP4 conversion</p>
                </a>
            </div>
            
            <div style="margin-top: 20px; text-align: center; opacity: 0.8;">
                <small>Paste the copied URL into any downloader above</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal();
        }
    });
}

function closeDownloadModal() {
    const modal = document.querySelector('.download-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDownloadModal();
    }
});
