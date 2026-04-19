document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Existing: Smooth scrolling for navigation links
    // ----------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ----------------------------------------------------
    // New: Prepare H2s for Staggered Reveal
    // ----------------------------------------------------
    document.querySelectorAll('h2').forEach(h2 => {
        const text = h2.innerText;
        h2.innerHTML = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char; // Keep spaces
            span.classList.add('reveal-char');
            span.style.transitionDelay = `${i * 0.05}s`;
            h2.appendChild(span);
        });
        h2.classList.add('hidden-element'); // ensures it gets observed
    });

    // ----------------------------------------------------
    // Existing + Modified: Intersection Observer
    // ----------------------------------------------------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hidden-element').forEach((el) => {
        observer.observe(el);
    });

    // ----------------------------------------------------
    // New: Typewriter Effect
    // ----------------------------------------------------
    const typeTarget = document.getElementById('typewriter-text');
    if (typeTarget) {
        const textToType = "Developer.";
        let charIndex = 0;
        
        // Add cursor initially
        const cursorNode = document.createElement('span');
        cursorNode.className = 'cursor';
        typeTarget.parentNode.insertBefore(cursorNode, typeTarget.nextSibling);

        function typeChar() {
            if (charIndex < textToType.length) {
                typeTarget.innerHTML += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 100);
            } else {
                setTimeout(() => {
                    if (cursorNode && cursorNode.parentNode) {
                        cursorNode.parentNode.removeChild(cursorNode);
                    }
                }, 1500);
            }
        }
        setTimeout(typeChar, 800);
    }

    // ----------------------------------------------------
    // New: Cursor Glow Trail
    // ----------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    let cursorTicking = false;
    document.addEventListener('mousemove', (e) => {
        if (!cursorTicking) {
            window.requestAnimationFrame(() => {
                if (cursorGlow) {
                    cursorGlow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
                }
                cursorTicking = false;
            });
            cursorTicking = true;
        }
    });

    // ----------------------------------------------------
    // New: Magnetic Social Buttons
    // ----------------------------------------------------
    document.querySelectorAll('.social-btn').forEach(btn => {
        let isMagnetTicking = false;
        btn.addEventListener('mousemove', (e) => {
            if (!isMagnetTicking) {
                window.requestAnimationFrame(() => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    const maxNudge = 8;
                    
                    const nudgeX = (x / rect.width) * maxNudge;
                    const nudgeY = (y / rect.height) * maxNudge;
                    
                    btn.style.transform = `translate(${nudgeX}px, ${nudgeY}px)`;
                    isMagnetTicking = false;
                });
                isMagnetTicking = true;
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // ----------------------------------------------------
    // New: Nav Scroll Shrink and Progress Bar
    // ----------------------------------------------------
    const header = document.querySelector('header');
    const progressBar = document.getElementById('scroll-progress');
    let scrollTicking = false;
    
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('shrink');
                } else {
                    header.classList.remove('shrink');
                }
                
                if (progressBar) {
                    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrollFraction = window.scrollY / docHeight;
                    progressBar.style.width = `${scrollFraction * 100}%`;
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // ----------------------------------------------------
    // New: 3D Card Tilt Effect
    // ----------------------------------------------------
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.glass-card, .glass-panel');
        tiltCards.forEach(card => {
            let tiltTicking = false;
            
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform';
            });
            
            card.addEventListener('mousemove', (e) => {
                if (!tiltTicking) {
                    window.requestAnimationFrame(() => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const xPct = (x / rect.width) - 0.5;
                        const yPct = (y / rect.height) - 0.5;
                        
                        let tiltX = -yPct * 8; 
                        let tiltY = xPct * 8;
                        
                        tiltX = Math.min(Math.max(tiltX, -4), 4);
                        tiltY = Math.min(Math.max(tiltY, -4), 4);
                        
                        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                        tiltTicking = false;
                    });
                    tiltTicking = true;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
                card.style.transition = 'transform 0.5s ease';
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
                // Remove transition after it finished so it doesn't fight mousemove next time
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });
        });
    }

    // ----------------------------------------------------
    // New: Mouse-Interactive Ember Particle Canvas
    // ----------------------------------------------------
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: -3;
        pointer-events: none;
        will-change: transform;
    `;
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particleCount = isTouchDevice ? 80 : 200;
    const particles = [];
    const emberColors = ['#f0b429', '#ff6000', '#e07b39', '#c96a00', '#ffaa00', '#ff3d00', '#ffd000'];
    const sparks = [];

    for (let i = 0; i < particleCount; i++) {
        // Size Tiers: 50% small, 35% med, 15% large
        const rand = Math.random();
        let radius, opacity, speedY;
        if (rand < 0.5) {
            // Small
            radius = 1 + Math.random() * 1;
            opacity = 0.2 + Math.random() * 0.2;
            speedY = -2.0 - Math.random() * 1.2;
        } else if (rand < 0.85) {
            // Medium
            radius = 2 + Math.random() * 1.5;
            opacity = 0.4 + Math.random() * 0.2;
            speedY = -1.7 - Math.random() * 1.3;
        } else {
            // Large
            radius = 3.5 + Math.random() * 2.0;
            opacity = 0.5 + Math.random() * 0.25;
            speedY = -1.5 - Math.random() * 1.0;
        }

        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: radius,
            color: emberColors[Math.floor(Math.random() * emberColors.length)],
            opacity: opacity,
            speedY: speedY,
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.01 + Math.random() * 0.02,
            wobbleAmplitude: 0.3 + Math.random() * 0.7,
            glowRadius: 6 + Math.random() * 8,
            vx: 0,
            vy: 0,
            currentOpacity: 0,
            currentGlow: 0,
            currentRadius: 0
        });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let mouseTicking = false;

    if (isTouchDevice) {
        document.addEventListener('touchmove', (e) => {
            if (!mouseTicking) {
                window.requestAnimationFrame(() => {
                    mouseX = e.touches[0].clientX;
                    mouseY = e.touches[0].clientY;
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        }, {passive: true});
    } else {
        document.addEventListener('mousemove', (e) => {
            if (!mouseTicking) {
                window.requestAnimationFrame(() => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        });
    }

    let animPaused = false;
    let animFrameId = null;
    document.addEventListener('visibilitychange', () => {
        animPaused = document.hidden;
        if (animPaused) {
            cancelAnimationFrame(animFrameId);
        } else {
            animFrameId = requestAnimationFrame(animateParticles);
        }
    });

    function animateParticles() {
        if (!animPaused) {
            ctx.clearRect(0, 0, width, height);
            
            // Draw #080808 background
            ctx.fillStyle = '#080808';
            ctx.fillRect(0, 0, width, height);

            // Draw vignette
            const vignette = ctx.createRadialGradient(
                width / 2, height / 2, height * 0.3,
                width / 2, height / 2, height * 0.9
            );
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, width, height);

            let targetX = mouseX;
            let targetY = mouseY;
            
            if (isTouchDevice && mouseX === -1000) {
                targetX = width / 2 + Math.cos(Date.now() * 0.001) * width * 0.3;
                targetY = height / 2 + Math.sin(Date.now() * 0.001) * height * 0.3;
            }

            // Mouse velocity
            let mouseVelocity = 0;
            if (mouseX !== -1000 && lastMouseX !== -1000) {
                mouseVelocity = Math.sqrt(
                    (mouseX - lastMouseX) ** 2 + (mouseY - lastMouseY) ** 2
                );
            }

            if (mouseVelocity > 8) {
                for (let i = 0; i < 4; i++) {
                    sparks.push({
                        x: mouseX + (Math.random() - 0.5) * 20,
                        y: mouseY + (Math.random() - 0.5) * 20,
                        radius: 1 + Math.random() * 2,
                        color: ['#f0b429','#ff6000','#ffaa00'][Math.floor(Math.random()*3)],
                        opacity: 0.9,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -1 - Math.random() * 3,
                        life: 1.0, 
                        decay: 0.025 + Math.random() * 0.02
                    });
                }
                if (sparks.length > 40) {
                    sparks.splice(0, sparks.length - 40);
                }
            }
            
            lastMouseX = mouseX;
            lastMouseY = mouseY;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Flicker opacity
                p.opacity += (Math.random() - 0.5) * 0.04;
                p.opacity = Math.min(Math.max(p.opacity, 0.15), 0.75);

                // Wobble
                p.wobbleOffset += p.wobbleSpeed;
                p.x += Math.sin(p.wobbleOffset) * p.wobbleAmplitude;
                
                p.y += p.speedY;
                
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                
                const dx = p.x - targetX;
                const dy = p.y - targetY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 220;
                
                if (dist < repelRadius && targetX !== -1000) {
                    const force = (repelRadius - dist) / repelRadius;
                    p.vx += (dx / dist) * force * 6;
                    p.vy += (dy / dist) * force * 6;
                }
                
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.88;
                p.vy *= 0.88;

                if (dist < repelRadius && targetX !== -1000) {
                    const force = (repelRadius - dist) / repelRadius;
                    p.currentOpacity = Math.min(p.opacity + force * 0.4, 0.95);
                    p.currentGlow = p.glowRadius + force * 26; // jump up to max ~40px
                    p.currentRadius = p.radius * (1 + force * 1.5);
                } else {
                    p.currentOpacity = p.opacity;
                    p.currentGlow = p.glowRadius;
                    p.currentRadius = p.radius;
                }
                
                ctx.save();
                ctx.shadowBlur = p.currentGlow;
                ctx.shadowColor = p.color;
                ctx.globalAlpha = p.currentOpacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();
            }

            // Draw sparks
            for (let i = sparks.length - 1; i >= 0; i--) {
                const spark = sparks[i];
                spark.x += spark.vx;
                spark.y += spark.vy;
                spark.vy -= 0.05; 
                spark.life -= spark.decay;
                spark.opacity = spark.life;

                if (spark.life <= 0) {
                    sparks.splice(i, 1);
                } else {
                    ctx.save();
                    ctx.globalAlpha = spark.opacity;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = spark.color;
                    ctx.beginPath();
                    ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
                    ctx.fillStyle = spark.color;
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
        animFrameId = requestAnimationFrame(animateParticles);
    }
    
    // Start particle loop
    animFrameId = requestAnimationFrame(animateParticles);
});

