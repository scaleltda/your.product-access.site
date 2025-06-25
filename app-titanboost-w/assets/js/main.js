// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('active');
}

// Audio Player Functionality
class AudioPlayer {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 180; // 3 minutes default
        this.interval = null;
        this.tracks = [
            { name: 'Instant Confidence Activation', duration: 180, frequency: 40 },
            { name: 'Performance Anxiety Destroyer', duration: 210, frequency: 10 },
            { name: 'Alpha Male Activation', duration: 165, frequency: 30 }
        ];
        this.currentTrack = 0;
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        const playBtn = document.getElementById('playBtn');
        const resetBtn = document.getElementById('resetBtn');
        const muteBtn = document.getElementById('muteBtn');
        const trackBtns = document.querySelectorAll('.track-btn');

        if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (muteBtn) muteBtn.addEventListener('click', () => this.toggleMute());
        
        trackBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => this.selectTrack(index));
        });
    }

    async createAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    async togglePlay() {
        if (this.isPlaying) {
            this.stop();
        } else {
            await this.play();
        }
    }

    async play() {
        try {
            await this.createAudioContext();
            
            this.oscillator = this.audioContext.createOscillator();
            this.gainNode = this.audioContext.createGain();
            
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            const track = this.tracks[this.currentTrack];
            this.oscillator.frequency.setValueAtTime(track.frequency, this.audioContext.currentTime);
            this.oscillator.type = 'sine';
            
            this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            
            this.oscillator.start();
            this.isPlaying = true;
            
            this.interval = setInterval(() => {
                this.currentTime++;
                this.updateDisplay();
                
                if (this.currentTime >= this.duration) {
                    this.stop();
                }
            }, 1000);
            
            this.updatePlayButton();
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }

    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator = null;
        }
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.isPlaying = false;
        this.updatePlayButton();
    }

    reset() {
        this.stop();
        this.currentTime = 0;
        this.updateDisplay();
    }

    toggleMute() {
        if (this.gainNode) {
            const currentGain = this.gainNode.gain.value;
            this.gainNode.gain.setValueAtTime(currentGain > 0 ? 0 : 0.1, this.audioContext.currentTime);
        }
    }

    selectTrack(index) {
        this.stop();
        this.currentTrack = index;
        this.duration = this.tracks[index].duration;
        this.currentTime = 0;
        this.updateDisplay();
        this.updateTrackButtons();
    }

    updateDisplay() {
        const currentTimeEl = document.getElementById('currentTime');
        const totalTimeEl = document.getElementById('totalTime');
        const progressBar = document.getElementById('progressBar');
        
        if (currentTimeEl) currentTimeEl.textContent = this.formatTime(this.currentTime);
        if (totalTimeEl) totalTimeEl.textContent = this.formatTime(this.duration);
        if (progressBar) {
            const progress = (this.currentTime / this.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '⏸️' : '▶️';
        }
    }

    updateTrackButtons() {
        const trackBtns = document.querySelectorAll('.track-btn');
        trackBtns.forEach((btn, index) => {
            if (index === this.currentTrack) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize audio player when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio player if on audio page
    if (document.getElementById('audioPlayer')) {
        const player = new AudioPlayer();
        player.init();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileNav && mobileNav.classList.contains('active')) {
        if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.module-card, .bonus-card, .benefit-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});