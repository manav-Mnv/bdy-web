// Helper to trigger confetti
function fireConfetti() {
    var count = 200;
    var defaults = {
        origin: { y: 0.7 },
        zIndex: 100
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

// Stage Navigation
function nextStage(stageNum) {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    // Show target stage
    const target = document.getElementById(`stage-${stageNum}`);
    target.classList.remove('hidden');
    target.classList.add('active');

    // Special initialization for specific stages
    if (stageNum === 3) {
        initAnnoyingButton();
    } else if (stageNum === 5) {
        // Delay confetti slightly for dramatic effect
        setTimeout(fireConfetti, 500);

        // GSAP Animations for final page
        gsap.from(".grand-title", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.2
        });

        gsap.from(".wish-text p", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out",
            delay: 0.8
        });
    }
}

// Stage 2 Logic
function wrongAnswer() {
    const errorMsg = document.getElementById('error-message');
    // Simple shake animation using GSAP
    gsap.to(errorMsg, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut"
    });
    errorMsg.classList.add('visible');
}

// Stage 3 Logic (Annoying Button)
let moveCount = 0;
const MAX_MOVES = 15; // After this many moves, let them click it

function initAnnoyingButton() {
    moveCount = 0;
    const btn = document.getElementById('annoying-btn');
    btn.style.top = '50%';
    btn.style.left = '50%';
    btn.innerHTML = 'Unlock Message 🔓';
}

function moveButton() {
    if (moveCount >= MAX_MOVES) {
        const btn = document.getElementById('annoying-btn');
        btn.innerHTML = 'Okay fine, click me 🙄';
        return; // Stop moving
    }

    const container = document.querySelector('.annoying-btn-container');
    const btn = document.getElementById('annoying-btn');

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    // Calculate random position (ensuring it stays within bounds)
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));

    // Using percentages for responsiveness if window resizes, but px is fine inside container too
    btn.style.transform = 'translate(0, 0)'; // Reset translate
    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;

    const taunts = ['Too slow! 😂', 'Nope! 🏃‍♂️', 'Try again! 👀', 'Almost! 🤏', 'Missed me! 👻', 'Too slow! 🐢'];
    btn.innerHTML = taunts[moveCount % taunts.length];

    moveCount++;
}

// Stage 4 Logic (Fake Loading)
function startLoading() {
    nextStage(4);

    const progressBar = document.getElementById('progress-bar');
    const percentage = document.getElementById('loading-percentage');
    const loadingText = document.getElementById('loading-text');
    const crashMsg = document.getElementById('crash-message');

    let progress = 0;

    // Non-linear progress simulation
    const intervals = [
        { dest: 10, time: 500 },
        { dest: 32, time: 1000 },
        { dest: 64, time: 800 },
        { dest: 89, time: 1500 },
        { dest: 99, time: 2000 }
    ];

    let currentInterval = 0;

    function updateProgress() {
        if (currentInterval >= intervals.length) {
            // "Crash"
            clearInterval(loadingInterval);
            progressBar.style.background = 'var(--accent)'; // Turn red
            loadingText.innerHTML = "SYSTEM OVERLOAD 🚨";
            loadingText.style.color = "var(--accent)";
            crashMsg.style.display = 'block';

            // Shake the container
            gsap.to(".glass-container", {
                x: [-15, 15, -10, 10, -5, 5, 0],
                duration: 0.5,
            });

            // Redirect to final page after brief delay
            setTimeout(() => {
                nextStage(5);
            }, 2500);
            return;
        }

        let target = intervals[currentInterval].dest;

        if (progress < target) {
            // Increment randomly
            progress += Math.floor(Math.random() * 3) + 1;
            if (progress > target) progress = target;

            progressBar.style.width = `${progress}%`;
            percentage.innerHTML = `${progress}%`;
        } else {
            currentInterval++;
        }
    }

    const loadingInterval = setInterval(updateProgress, 100);
}

// Stage 5 Logic (AI Roast)
function generateRoast() {
    const btn = document.querySelector('.roast-section .outline-btn');
    if (btn.disabled) return;

    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';

    const roastBox = document.getElementById('roast-output');
    roastBox.style.display = 'block';
    roastBox.innerHTML = 'Analyzing...';

    const roasts = [
        "Analysis complete:\n\nIQ: Low\nEQ: Questionable\nTolerance for nonsense: Maximum\n\nConclusion:\nStill a legend somehow. Happy Birthday!",
        "System Output:\n\nIQ: Low\nMaturity level: Pending...\nVibe check: 100% Passed\n\nResult:\nYou're aging like fine wine, but acting like a kid. Keep it up.",
        "Scanning target...\n\nIQ: Low\nMain character energy: Maximum\nDelusion level: Through the roof\n\nVerdict:\nToo iconic to roast. Have the best birthday!",
        "Diagnostic Report:\n\nIQ: Low\nSarcasm levels: Dangerously high\nBrain cells remaining: 2 (and they are currently fighting)\n\nConclusion:\nSomehow you're still winning at life. Happy Birthday!",
        "Running diagnostics...\n\nIQ: Low\nRed flags: Many\nSelf-awareness: 404 Not Found\n\nResult:\nWe wouldn't have you any other way. Happy Cake Day!",
        "Vibe Analysis:\n\nIQ: Low\nAesthetic: Flawless\nDecision making skills: Please try again later\n\nVerdict:\nYou are the main character today. Enjoy it!"
    ];

    // Ensure we don't get the same roast twice in a row if possible
    let newRoast;
    do {
        newRoast = roasts[Math.floor(Math.random() * roasts.length)];
    } while (newRoast === window.lastRoast && roasts.length > 1);

    window.lastRoast = newRoast;

    // Typewriter effect
    let i = 0;

    function typeWriter() {
        if (i === 0) {
            roastBox.innerHTML = '';
        }
        if (i < newRoast.length) {
            roastBox.innerHTML += newRoast.charAt(i);
            i++;
            setTimeout(typeWriter, 30); // slightly faster typing speed
        } else {
            // Re-enable button
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }

    // Start typing after initial delay representing "thinking"
    setTimeout(typeWriter, 500);
}
