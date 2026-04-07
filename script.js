document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust scroll position if header is fixed
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                // Optional: stop observing once triggered for one-time animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with .hidden-element class
    document.querySelectorAll('.hidden-element').forEach((el) => {
        observer.observe(el);
    });

    // Generate a synthetic "Sea Texture" for ripples to render
    // jquery.ripples requires a background image texture to distort.
    function generateSeaTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#0f172a'); // Background dark color
        gradient.addColorStop(0.5, '#1e3c72'); // Sea blue
        gradient.addColorStop(1, '#2c5364'); // Teal
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Add subtle pixel noise for light refraction
        const imgData = ctx.getImageData(0, 0, 512, 512);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 12;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    // Apply the synthetic texture and initialize WebGL Water Ripples
    try {
        const waterBg = document.getElementById('water-bg');
        if (waterBg) {
            waterBg.style.backgroundImage = `url(${generateSeaTexture()})`;
            
            $('#water-bg').ripples({
                resolution: 512,       // Higher resolution for smoother ripples
                dropRadius: 25,        // Larger drop size with mouse
                perturbance: 0.05,     // More aggressive, interactive waves
                interactive: true
            });

            // Add automated slow rippling to simulate a constant stable water body
            setInterval(function() {
                var $el = $('#water-bg');
                var x = Math.random() * $el.outerWidth();
                var y = Math.random() * $el.outerHeight();
                var dropRadius = 25;
                var strength = 0.03 + Math.random() * 0.03;

                $el.ripples('drop', x, y, dropRadius, strength);
            }, 3000);
        }
    } catch (e) {
        console.log("Ripples effect failed to load / WebGL not supported", e);
    }
});
