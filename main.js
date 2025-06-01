// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const audioToggle = document.getElementById('audioToggle');
    const soundItems = document.querySelectorAll('.sound-item');
    
    // Set initial active states
    updateActiveNav('home');
    
    // Navigation click handlers
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showSection(target);
            updateActiveNav(target);
            
            // Add click feedback
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add hover sound effect (visual feedback)
        item.addEventListener('mouseenter', function() {
            this.style.letterSpacing = '2px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.letterSpacing = '1px';
        });
    });
    
    // Show specific section
    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
                // Add entrance animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 10);
            } else {
                section.classList.remove('active');
                section.style.opacity = '';
                section.style.transform = '';
                section.style.transition = '';
            }
        });
    }
    
    // Update active navigation state
    function updateActiveNav(activeTarget) {
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === activeTarget) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Audio control functionality
    let audioPlaying = false;
    
    audioToggle.addEventListener('click', function() {
        audioPlaying = !audioPlaying;
        
        const soundWaves = this.querySelectorAll('.sound-wave');
        const audioControl = this.querySelector('.audio-control') || this;
        
        if (audioPlaying) {
            // Start "playing" animation
            soundWaves.forEach((wave, index) => {
                wave.style.animationPlayState = 'running';
                wave.style.animationDuration = `${1.2 + (index * 0.1)}s`;
            });
            audioControl.style.background = '#ffffff';
            audioControl.style.color = '#000000';
            
            // Show playing state
            setTimeout(() => {
                if (audioPlaying) {
                    showNotification('♪ Campus sounds playing...');
                }
            }, 300);
            
        } else {
            // Stop animation
            soundWaves.forEach(wave => {
                wave.style.animationPlayState = 'paused';
            });
            audioControl.style.background = '#000000';
            audioControl.style.color = '#ffffff';
        }
        
        // Add click feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Sound item interactions with actual audio playback
    soundItems.forEach((item, index) => {
        const waveform = item.querySelector('.waveform');
        const audio = item.querySelector('audio');
        const soundTitle = item.querySelector('.sound-title').textContent;
        let isPlaying = false;
        
        item.addEventListener('click', function() {
            // Stop all other audio first
            soundItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAudio = otherItem.querySelector('audio');
                    const otherWaveform = otherItem.querySelector('.waveform');
                    if (otherAudio && !otherAudio.paused) {
                        otherAudio.pause();
                        otherAudio.currentTime = 0;
                        otherWaveform.style.animationPlayState = 'paused';
                        otherItem.classList.remove('playing');
                    }
                }
            });
            
            if (audio) {
                if (isPlaying) {
                    // Stop current audio
                    audio.pause();
                    audio.currentTime = 0;
                    isPlaying = false;
                    
                    // Stop visual effects
                    waveform.style.animationPlayState = 'paused';
                    this.classList.remove('playing');
                    
                    showNotification(`⏹ ${soundTitle} stopped`);
                } else {
                    // Play audio
                    audio.play().then(() => {
                        isPlaying = true;
                        
                        // Start visual effects
                        waveform.style.animationPlayState = 'running';
                        waveform.style.animationDuration = '1.5s';
                        this.classList.add('playing');
                        
                        showNotification(`▶ ${soundTitle} playing...`);
                        
                        // Handle audio end
                        audio.addEventListener('ended', () => {
                            isPlaying = false;
                            waveform.style.animationPlayState = 'paused';
                            this.classList.remove('playing');
                            showNotification(`✓ ${soundTitle} completed`);
                        });
                        
                    }).catch(error => {
                        console.log('Audio playback failed:', error);
                        showNotification(`⚠ Could not play ${soundTitle}`);
                    });
                }
            }
            
            // Visual feedback
            this.style.transform = 'translateY(-8px) scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Hover effects for waveforms
        item.addEventListener('mouseenter', function() {
            waveform.style.opacity = '0.8';
            waveform.style.filter = 'brightness(1.2)';
            
            if (!isPlaying) {
                this.style.borderColor = '#ffffff';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            waveform.style.opacity = '1';
            waveform.style.filter = 'brightness(1)';
            
            if (!isPlaying) {
                this.style.borderColor = '#333333';
            }
        });
        
        // Add keyboard support for audio items
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Notification system
    function showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #000000;
            padding: 15px 25px;
            border: 2px solid #000000;
            font-weight: 600;
            letter-spacing: 1px;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const currentActive = document.querySelector('.nav-item.active');
        const currentIndex = Array.from(navItems).indexOf(currentActive);
        
        let newIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : navItems.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = currentIndex < navItems.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (currentActive) {
                    currentActive.click();
                }
                return;
        }
        
        if (newIndex !== currentIndex) {
            const newTarget = navItems[newIndex].getAttribute('data-target');
            showSection(newTarget);
            updateActiveNav(newTarget);
        }
    });
    
    // Scroll-based effects for poem stanzas
    if (window.IntersectionObserver) {
        const stanzaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                } else {
                    entry.target.style.transform = 'translateX(-20px)';
                    entry.target.style.opacity = '0.3';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe stanzas when poem section is active
        const observeStanzas = () => {
            const stanzas = document.querySelectorAll('.stanza');
            stanzas.forEach(stanza => {
                stanza.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
                stanza.style.transform = 'translateX(-20px)';
                stanza.style.opacity = '0.3';
                stanzaObserver.observe(stanza);
            });
        };
        
        // Initialize stanza observation when poem section becomes active
        const poemSection = document.getElementById('poem');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('active')) {
                    setTimeout(observeStanzas, 300);
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(poemSection);
    }
    
    // Video button interaction
    const videoButton = document.querySelector('.video-button');
    if (videoButton) {
        videoButton.addEventListener('click', function(e) {
            // Add dramatic click effect
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.background = '#ffffff';
            this.style.color = '#000000';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.background = '';
                this.style.color = '';
            }, 200);
            
            showNotification('→ Opening film in new tab...');
        });
    }
    
    // Cassette player interactions
    const cassetteControls = document.querySelectorAll('.control-btn');
    const iframe = document.querySelector('.video-container iframe');
    const reels = document.querySelectorAll('.reel');
    
    cassetteControls.forEach(control => {
        control.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Control actions
            switch(action) {
                case 'play':
                    // Start reel animations
                    reels.forEach(reel => {
                        reel.style.animationPlayState = 'running';
                    });
                    showNotification('▶ Playing campus sounds...');
                    
                    // Simulate play command to iframe (YouTube API would be needed for actual control)
                    if (iframe) {
                        iframe.style.filter = 'brightness(1.1)';
                        setTimeout(() => {
                            iframe.style.filter = 'brightness(1)';
                        }, 500);
                    }
                    break;
                    
                case 'rewind':
                    showNotification('⏪ Rewinding...');
                    // Speed up left reel animation
                    document.querySelector('.left-reel').style.animation = 'reelSpin 2s linear infinite';
                    setTimeout(() => {
                        document.querySelector('.left-reel').style.animation = 'reelSpin 8s linear infinite';
                    }, 1000);
                    break;
                    
                case 'forward':
                    showNotification('⏩ Fast forwarding...');
                    // Speed up right reel animation
                    document.querySelector('.right-reel').style.animation = 'reelSpin 2s linear infinite reverse';
                    setTimeout(() => {
                        document.querySelector('.right-reel').style.animation = 'reelSpin 12s linear infinite reverse';
                    }, 1000);
                    break;
            }
            
            // Add click sound effect (visual)
            this.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.5)';
            setTimeout(() => {
                this.style.boxShadow = '';
            }, 200);
        });
        
        // Hover effects for cassette controls
        control.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        control.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Cassette reel click interactions
    reels.forEach(reel => {
        reel.addEventListener('click', function() {
            // Toggle reel animation
            const isRunning = this.style.animationPlayState !== 'paused';
            this.style.animationPlayState = isRunning ? 'paused' : 'running';
            
            const reelSide = this.classList.contains('left-reel') ? 'LEFT' : 'RIGHT';
            const state = isRunning ? 'STOPPED' : 'SPINNING';
            showNotification(`${reelSide} REEL ${state}`);
            
            // Visual feedback
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Cassette header click for "ejecting"
    const cassetteHeader = document.querySelector('.cassette-header');
    if (cassetteHeader) {
        cassetteHeader.addEventListener('click', function() {
            showNotification('🎵 CAMPUS SOUNDS 90" - TYPE I CASSETTE');
            
            // Glitch effect on cassette label
            const label = this.querySelector('.cassette-label');
            const originalText = label.textContent;
            label.textContent = '█ █ █ █ █ █ █ █ █ █';
            
            setTimeout(() => {
                label.textContent = originalText;
            }, 300);
        });
    }
    
    // Add typing effect to action text on home page
    const actionText = document.querySelector('.action-text');
    if (actionText) {
        const originalText = actionText.textContent;
        
        function typeText() {
            actionText.textContent = '';
            let i = 0;
            
            const typeInterval = setInterval(() => {
                actionText.textContent += originalText.charAt(i);
                i++;
                
                if (i >= originalText.length) {
                    clearInterval(typeInterval);
                }
            }, 100);
        }
        
        // Start typing effect after page loads
        setTimeout(typeText, 1500);
    }
    
    // Random glitch effect for main title
    const mainTitles = document.querySelectorAll('.main-title');
    
    function addGlitchEffect() {
        const randomTitle = mainTitles[Math.floor(Math.random() * mainTitles.length)];
        const originalText = randomTitle.textContent;
        
        // Glitch characters
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        
        // Create glitch text
        let glitchedText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.1) {
                glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitchedText += originalText[i];
            }
        }
        
        randomTitle.textContent = glitchedText;
        
        // Restore original text
        setTimeout(() => {
            randomTitle.textContent = originalText;
        }, 100);
    }
    
    // Trigger glitch effect occasionally
    setInterval(addGlitchEffect, 8000);
    
    console.log('🎵 Campus speaks... Website loaded successfully');
});
