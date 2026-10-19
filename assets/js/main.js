gsap.registerPlugin(Draggable);

// elements

const loader = document.querySelector(".loader");
const loaderValue = document.querySelector(".loader-value");
const loaderProgress = document.querySelector(".loader-progress");
const loaderBall = document.querySelector(".loader-ball");
const loaderStatus = document.querySelector(".loader-status");

const page = document.querySelector(".page");
const titleLines = document.querySelectorAll(".title-line span");
const heroImage = document.querySelector(".hero-image");
const orb = document.querySelector(".elastic-orb");
const heroCta = document.querySelector(".hero-cta");

// state

gsap.set(page, {
    autoAlpha: 0,
});

gsap.set(titleLines, {
    yPercent: 130,
    rotate: 5,
});

gsap.set(
    [
        ".header",
        ".hero-label",
        ".hero-bottom",
        ".art-label",
        ".art-star",
        ".hero-side-note",
        ".footer",
    ],
    {
        autoAlpha: 0,
        y: 25,
    },
);

gsap.set(heroImage, {
    autoAlpha: 0,
    scale: 0.55,
    rotation: -20,
    transformOrigin: "50% 50%",
});

gsap.set(orb, {
    scale: 0,
    rotation: -90,
});

// preloader

const loading = { value: 0 };

const loaderTimeline = gsap.timeline({
    defaults: {
        ease: "none",
    },

    onComplete: startIntro,
});

loaderTimeline.to(loading, {
    value: 100,
    duration: 2.1,

    onUpdate: () => {
        const progress = Math.round(loading.value);

        loaderValue.textContent = String(progress).padStart(3, "0");

        gsap.set(loaderProgress, {
            width: `${progress}%`,
        });

        if (progress < 35) {
            loaderStatus.textContent = "INITIALIZING";
        } else if (progress < 75) {
            loaderStatus.textContent = "BENDING REALITY";
        } else {
            loaderStatus.textContent = "READY TO PLAY";
        }
    },
});

// loader ball

gsap.to(loaderBall, {
    keyframes: [
        {
            scaleX: 1.35,
            scaleY: 0.72,
            duration: 0.25,
        },
        {
            scaleX: 0.8,
            scaleY: 1.3,
            duration: 0.25,
        },
        {
            scaleX: 1,
            scaleY: 1,
            duration: 0.35,
        },
    ],

    repeat: -1,
    repeatDelay: 0.15,
    ease: "power2.inOut",
});

// menu

const menuButton = document.querySelector(".menu-button");
const menuOverlay = document.querySelector(".menu-overlay");
const menuLinks = gsap.utils.toArray(".menu-link");
const menuLinkTexts = gsap.utils.toArray(".menu-link-text");
const menuDecoration = document.querySelector(".menu-decoration");

let menuOpen = false;
let menuAnimating = false;

gsap.set(menuLinks, {
    y: 65,
    scaleY: 0.65,
    autoAlpha: 0,
    transformOrigin: "left bottom",
});

gsap.set(menuLinkTexts, {
    x: -35,
    skewX: 8,
});

gsap.set(menuDecoration, {
    scale: 0.3,
    rotation: -45,
});

const menuTimeline = gsap.timeline({
    paused: true,

    onStart: () => {
        menuAnimating = true;
        menuOverlay.style.pointerEvents = "auto";
    },

    onComplete: () => {
        menuAnimating = false;
    },

    onReverseComplete() {
        menuAnimating = false;
        menuOverlay.style.pointerEvents = "none";
        menuOverlay.setAttribute("aria-hidden", "true");

        gsap.set(menuLinks, {
            y: 65,
            scaleY: 0.65,
            autoAlpha: 0,
        });

        gsap.set(menuLinkTexts, {
            x: -35,
            skewX: 8,
        });
    },
});

menuTimeline
    .set(menuOverlay, {
        visibility: "visible",
    })

    .to(menuOverlay, {
        clipPath: "circle(150% at calc(100% - 65px) 55px)",
        duration: 0.9,
        ease: "elastic.out(1, 0.72)",
    })

    .to(
        menuDecoration,
        {
            scale: 1,
            rotation: 0,
            duration: 1.1,
            ease: "elastic.out(1, 0.45)",
        },
        "-=0.65",
    )

    .to(
        menuLinks,
        {
            y: 0,
            scaleY: 1,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: "elastic.out(1, 0.55)",
        },
        "-=0.7",
    )

    .to(
        menuLinkTexts,
        {
            x: 0,
            skewX: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "back.out(1.8)",
        },
        "<",
    );

// toggle menu

function toggleMenu(forceClose = false) {
    if (menuAnimating) return;

    const shouldOpen = forceClose ? false : !menuOpen;

    if (shouldOpen === menuOpen) return;

    menuOpen = shouldOpen;

    document.body.classList.toggle("menu-open", menuOpen);

    menuButton.classList.toggle("is-active", menuOpen);
    menuButton.setAttribute("aria-expanded", String(menuOpen));

    if (menuOpen) {
        menuOverlay.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        menuTimeline.play();
    } else {
        document.body.style.overflow = "";

        menuTimeline.reverse();
    }
}

menuButton.setAttribute("aria-controls", "menu-overlay");
menuButton.setAttribute("aria-expanded", "false");

menuButton.addEventListener("click", () => {
    toggleMenu();
});

menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        toggleMenu(true);
    });
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) {
        toggleMenu(true);
    }
});

// bg path animation

function startElasticLines() {
    const paths = gsap.utils.toArray(".elastic-line");

    const alternatePaths = [
        "M -100 250 C 180 120, 350 20, 520 180 S 920 480, 1100 240 S 1350 0, 1540 220",

        "M -100 320 C 180 460, 350 580, 520 400 S 900 100, 1080 330 S 1350 640, 1540 350",

        "M -100 680 C 180 520, 370 730, 600 520 S 950 350, 1130 650 S 1380 610, 1540 500",
    ];

    paths.forEach((path, index) => {
        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0,
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            opacity: [0.25, 0.16, 0.11][index],
            duration: 1.6 + index * 0.35,
            delay: index * 0.16,
            ease: "power3.out",

            onComplete: () => {
                gsap.set(path, {
                    strokeDasharray: "none",
                    strokeDashoffset: 0,
                });

                gsap.to(path, {
                    attr: {
                        d: alternatePaths[index],
                    },

                    duration: 3.5 + index * 0.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            },
        });
    });

    gsap.to(".elastic-lines-group", {
        x: 12,
        y: -8,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });
}

// intro

let isMobile = null;

function startIntro() {
    gsap.killTweensOf(loaderBall);

    const intro = gsap.timeline();

    intro.set(page, {
        autoAlpha: 1,
    });

    // hide loader
    intro.to(loader, {
        scaleY: 0,
        transformOrigin: "50% 0%",
        duration: 0.85,
        ease: "elastic.inOut(1, 0.55)",
    });

    intro.set(loader, {
        display: "none",
    });

    // call lines
    intro.call(startElasticLines);

    // show header

    intro.to(
        ".header",
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
        },
        "-=0.25",
    );

    // show label

    intro.to(
        ".hero-label",
        {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
        },
        "-=0.4",
    );

    // show title

    intro.to(
        titleLines,
        {
            yPercent: 0,
            rotate: 0,
            duration: 1.25,
            stagger: 0.12,
            ease: "elastic.out(1, 0.65)",
        },
        "-=0.2",
    );

    // show image

    intro.to(
        heroImage,
        {
            autoAlpha: 1,
            scale: 1,
            rotation: -8,
            duration: 1.5,
            ease: "elastic.out(1, 0.48)",
        },
        "-=0.95",
    );

    // decor & details

    intro
        .to(
            [".art-label", ".art-star", ".hero-side-note"],
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
            },
            "-=0.8",
        )

        .to(
            ".hero-bottom",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.5)",
            },
            "-=0.65",
        )

        .to(
            orb,
            {
                scale: 1,
                rotation: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.35)",
            },
            "-=0.7",
        )

        .to(
            ".footer",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            },
            "-=0.55",
        );

    intro.call(startIdleAnimation);
    intro.call(startAutumnAnimation);
}

// floating

function startIdleAnimation() {
    isMobile = window.matchMedia("(max-width: 600px)").matches;

    gsap.to(heroImage, {
        y: isMobile ? -140 : -20,
        rotation: isMobile ? -6 : -5,
        duration: isMobile ? 6 : 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });

    gsap.to(".art-star", {
        scale: 1.12,
        rotation: 4,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });
}

// draggable

let previousX = 0;
let previousY = 0;

Draggable.create(orb, {
    type: "x,y",

    onPress() {
        previousX = this.x;
        previousY = this.y;

        gsap.killTweensOf(orb);

        gsap.to(orb, {
            scale: 0.92,
            duration: 0.2,
            ease: "power2.out",
        });
    },

    onDrag() {
        const deltaX = this.x - previousX;
        const deltaY = this.y - previousY;

        previousX = this.x;
        previousY = this.y;

        const stretch = Math.min(Math.hypot(deltaX, deltaY) * 0.012, 0.3);

        const direction = deltaX >= 0 ? 1 : -1;

        gsap.to(orb, {
            scaleX: 1 + stretch,
            scaleY: 1 - stretch * 0.7,
            rotation: this.x * 0.04,

            duration: 0.18,
            overwrite: "auto",
            ease: "power2.out",
        });

        gsap.to(orb, {
            skewX: direction * Math.min(Math.abs(deltaX) * 0.5, 12),
            duration: 0.15,
            overwrite: "auto",
        });
    },

    onRelease() {
        gsap.to(orb, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            skewX: 0,

            duration: 1.5,
            overwrite: "auto",
            ease: "elastic.out(1, 0.35)",
        });
    },
});

// autumn leafs

const autumnContainer = document.querySelector(".autumn-particles");

const autumnEmojis = ["🍂", "🍁", "🍂", "🍁", "🍂"];

let autumnAnimationsStarted = false;

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createAutumnLeaves() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 600px)").matches;
    const leafCount = mobile ? 9 : 18;

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement("span");

        leaf.classList.add("autumn-leaf");
        leaf.textContent =
            autumnEmojis[Math.floor(Math.random() * autumnEmojis.length)];

        autumnContainer.appendChild(leaf);

        const size = randomBetween(mobile ? 12 : 16, mobile ? 22 : 30);

        gsap.set(leaf, {
            x: randomBetween(0, autumnContainer.clientWidth),
            y: randomBetween(-autumnContainer.clientHeight, 0),

            fontSize: size,
            opacity: randomBetween(0.35, 0.85),
            rotation: randomBetween(0, 360),
            scale: randomBetween(0.8, 1.2),
        });
    }
}

function startAutumnAnimation() {
    if (autumnAnimationsStarted) return;

    autumnAnimationsStarted = true;

    const leaves = gsap.utils.toArray(".autumn-leaf");
    const mobile = window.matchMedia("(max-width: 600px)").matches;

    leaves.forEach((leaf) => {
        const duration = randomBetween(mobile ? 7 : 8, mobile ? 13 : 17);
        const wind = randomBetween(mobile ? -65 : -110, mobile ? 65 : 110);

        gsap.to(leaf, {
            y: () => autumnContainer.clientHeight + 60,
            x: `+=${wind}`,

            rotation: `+=${randomBetween(240, 600)}`,

            duration: duration,
            ease: "none",
            repeat: -1,
            repeatRefresh: true,
            delay: randomBetween(0, 8),

            modifiers: {
                x: (value) => {
                    const width = autumnContainer.clientWidth;

                    return `${gsap.utils.wrap(
                        -60,
                        width + 60,
                        parseFloat(value),
                    )}px`;
                },
            },
        });

        gsap.to(leaf, {
            x: `+=${randomBetween(-35, 35)}`,
            duration: randomBetween(1.5, 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    });
}

createAutumnLeaves();

// cta btns

heroCta.addEventListener("mouseenter", () => {
    gsap.to(heroCta, {
        scaleX: 1.06,
        scaleY: 0.94,
        duration: 0.25,
        ease: "power2.out",
    });
});

heroCta.addEventListener("mouseleave", () => {
    gsap.to(heroCta, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.35)",
    });
});

// resize

window.addEventListener("resize", () => location.reload());
