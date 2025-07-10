document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const email = emailInput.value.trim();
            if (email === "") {
                emailError.textContent = "The email field cannot be empty.";
                return;
            }
            if (!isValidEmail(email)) {
                emailError.textContent = "Please enter a valid email format (example@domain.com).";
                return;
            }
            emailError.textContent = "";
            window.location.href = "membros.html";
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Logic for module page (modulo.html)
    const moduleTitleDisplay = document.getElementById("moduleTitleDisplay");
    const ebookContentDiv = document.getElementById("ebookContent");
    const videoAreaDiv = document.getElementById("videoArea");
    const videoPlayerEmbedDiv = document.getElementById("videoPlayerEmbed");
    const videoPlaylistUl = document.getElementById("videoPlaylist");
    const prevVideoButton = document.getElementById("prevVideo");
    const nextVideoButton = document.getElementById("nextVideo");
    const currentVideoTitleSpan = document.getElementById("currentVideoTitle");
    const mainHeaderTitle = document.getElementById("mainHeaderTitle");

    if (moduleTitleDisplay) { // Check if we're on the module page
        const params = new URLSearchParams(window.location.search);
        const moduleType = params.get("type");
        const moduleName = decodeURIComponent(params.get("name") || "Module");
        const moduleSrc = decodeURIComponent(params.get("src") || "");
        const moduleVideosParam = params.get("videos");
        let moduleVideos = [];

        if (moduleVideosParam) {
            try {
                moduleVideos = JSON.parse(decodeURIComponent(moduleVideosParam));
            } catch (e) {
                console.error("Error parsing videos:", e);
                moduleTitleDisplay.textContent = "Error loading data.";
                return;
            }
        }

        document.title = `${moduleName} - Members Area`;
        if(mainHeaderTitle) mainHeaderTitle.textContent = moduleName;
        moduleTitleDisplay.textContent = moduleName;

        if (moduleType === "ebook") {
            if (ebookContentDiv && moduleSrc) {
                ebookContentDiv.style.display = "block";
                videoAreaDiv.style.display = "none";
                ebookContentDiv.querySelector("iframe").src = moduleSrc;
            } else {
                 moduleTitleDisplay.textContent = "Ebook content not found.";
            }
        } else if (moduleType === "video" && moduleVideos.length > 0) {
            ebookContentDiv.style.display = "none";
            videoAreaDiv.style.display = "flex";
            let currentVideoIndex = 0;

            function getYouTubeVideoId(url) {
                const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                const match = url.match(regex);
                return match ? match[1] : null;
            }

            function loadVideo(index) {
                if (index >= 0 && index < moduleVideos.length) {
                    const video = moduleVideos[index];
                    const videoId = getYouTubeVideoId(video.url);
                    if (videoId) {
                        videoPlayerEmbedDiv.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    } else {
                        videoPlayerEmbedDiv.innerHTML = `<p>Error: Invalid video URL.</p>`;
                    }
                    currentVideoTitleSpan.textContent = `${video.title} (Class ${index + 1} of ${moduleVideos.length})`;
                    currentVideoIndex = index;
                    updateVideoNavButtons();
                    updatePlaylistActiveState();
                }
            }

            function updateVideoNavButtons() {
                if (prevVideoButton) prevVideoButton.disabled = currentVideoIndex === 0;
                if (nextVideoButton) nextVideoButton.disabled = currentVideoIndex === moduleVideos.length - 1;
            }

            function updatePlaylistActiveState() {
                const playlistItems = videoPlaylistUl.querySelectorAll("li");
                playlistItems.forEach((item, idx) => {
                    if (idx === currentVideoIndex) {
                        item.classList.add("active-video");
                    } else {
                        item.classList.remove("active-video");
                    }
                });
            }

            videoPlaylistUl.innerHTML = ""; 
            moduleVideos.forEach((video, index) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<span class="video-item-title">${index + 1}. ${video.title}</span>`;
                listItem.addEventListener("click", () => {
                    loadVideo(index);
                });
                videoPlaylistUl.appendChild(listItem);
            });

            if (prevVideoButton) {
                prevVideoButton.addEventListener("click", () => {
                    if (currentVideoIndex > 0) {
                        loadVideo(currentVideoIndex - 1);
                    }
                });
            }

            if (nextVideoButton) {
                nextVideoButton.addEventListener("click", () => {
                    if (currentVideoIndex < moduleVideos.length - 1) {
                        loadVideo(currentVideoIndex + 1);
                    }
                });
            }

            loadVideo(0);
        } else {
            moduleTitleDisplay.textContent = "Content not found or invalid type.";
            ebookContentDiv.style.display = "none";
            videoAreaDiv.style.display = "none";
        }
    }
});

