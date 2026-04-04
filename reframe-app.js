/* ═══════════════════════════════════════════════
   REFRAME — Design System Interactions
   GSAP-powered micro-interaction demos
═══════════════════════════════════════════════ */

'use strict';

/* ─── Utility ────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════ */
function initTheme() {
  const btn = $('#themeBtn');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
    gsap.to(btn, { rotation: '+=180', duration: 0.4, ease: 'back.out(1.4)' });
  });
}

/* ═══════════════════════════════════════════════
   SEGMENTED CONTROL
═══════════════════════════════════════════════ */
function initSegmentedControl() {
  const seg    = $('#viewSeg');
  const slider = $('#segSlider');
  const opts   = $$('.seg__opt', seg);

  function positionSlider(el) {
    const segRect = seg.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    gsap.to(slider, {
      left:     elRect.left - segRect.left + 3,
      width:    elRect.width - 6,
      duration: 0.3,
      ease:     'back.out(1.4)',
    });
  }

  function initSliderPos() {
    const active = seg.querySelector('.seg__opt.active');
    if (!active) return;
    const segRect = seg.getBoundingClientRect();
    const elRect  = active.getBoundingClientRect();
    gsap.set(slider, {
      left:   elRect.left - segRect.left + 3,
      width:  elRect.width - 6,
      height: 'calc(100% - 6px)',
      top:    3,
    });
  }

  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      positionSlider(opt);

      const view = opt.dataset.view;
      $$('.panel').forEach(p => p.classList.remove('active'));
      const panel = $(`#panel-${view}`);
      panel.classList.add('active');

      gsap.fromTo(panel,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    });
  });

  window.addEventListener('load', initSliderPos);
  window.addEventListener('resize', () => {
    const active = seg.querySelector('.seg__opt.active');
    if (active) positionSlider(active);
  });
}

/* ═══════════════════════════════════════════════
   COLLECTION PANEL
═══════════════════════════════════════════════ */

window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(InertiaPlugin)

    let oldX = 0, 
        oldY = 0, 
        deltaX = 0,
        deltaY = 0
    
    const root = document.querySelector('.mwg_effect000')
    root.addEventListener("mousemove", (e) => {
        // Calculate horizontal movement since the last mouse position
        deltaX = e.clientX - oldX;

        // Calculate vertical movement since the last mouse position
        deltaY = e.clientY - oldY;

        // Update old coordinates with the current mouse position
        oldX = e.clientX;
        oldY = e.clientY;
    })

    root.querySelectorAll('.media').forEach(el => {

        // Add an event listener for when the mouse enters each media
        el.addEventListener('mouseenter', () => {
            
            const tl = gsap.timeline({ 
                onComplete: () => {
                    tl.kill()
                }
            })
            tl.timeScale(1.2) // Animation will play 20% faster than normal
            
            const image = el.querySelector('img')
            tl.to(image, {
               inertia: {
                    x: {
                        velocity: deltaX * 30, // Higher number = movement amplified
                        end: 0 // Go back to the initial position
                    },
                    y: {
                        velocity: deltaY * 30, // Higher number = movement amplified
                        end: 0 // Go back to the initial position
                    },
                },
            })
            tl.fromTo(image, {
                rotate: 0
            }, {
                duration: 0.4,
                rotate:(Math.random() - 0.5) * 30, // Returns a value between -15 & 15
                yoyo: true, 
                repeat: 1,
                ease: 'power1.inOut' // Will slow at the begin and the end
            }, '<') // The animation starts at the same time as the previous tween
        })
    })
})

/* ═══════════════════════════════════════════════
   EASING DEMOS
═══════════════════════════════════════════════ */
function initEasingDemos() {
  $$('#easeDemo .ease-item').forEach(item => {
    const ball  = item.querySelector('.ease-ball');
    const track = item.querySelector('.ease-track');

    item.addEventListener('click', () => {
      const ease   = item.dataset.ease;
      const dur    = parseFloat(item.dataset.dur);
      const trackW = track.offsetWidth - 14;

      gsap.fromTo(ball,
        { left: 0 },
        {
          left: trackW,
          duration: dur,
          ease,
          onComplete: () => {
            gsap.to(ball, { left: 0, duration: 0.2, ease: 'power2.in', delay: 0.2 });
          }
        }
      );
    });
  });
}

/* ═══════════════════════════════════════════════
   BOOKMARK — ink-stroke animation
═══════════════════════════════════════════════ */
function initBookmark() {
  const btn   = $('#bmBtn');
  const path  = $('#bmPath');
  const label = $('#bmLabel');
  let saved = false;

  btn.addEventListener('click', () => {
    saved = !saved;
    btn.classList.toggle('saved', saved);

    if (saved) {
      label.textContent = 'Saved!';
      // Stroke-dashoffset draw-on animation
      gsap.set(path, {
        strokeDasharray: 60,
        strokeDashoffset: 60,
        fill: 'none',
        stroke: 'var(--am-light)',
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        fill: 'var(--am-light)',
        duration: 0.45,
        ease: 'power2.out',
      });
      // Elastic bounce
      gsap.fromTo(btn,
        { scale: 0.85 },
        {
          scale: 1.2,
          duration: 0.18,
          ease: 'power2.out',
          onComplete: () => gsap.to(btn, { scale: 1, duration: 0.45, ease: 'elastic.out(1.5, 0.5)' })
        }
      );
    } else {
      label.textContent = 'Click to save';
      gsap.set(path, { fill: 'none', stroke: 'currentColor', strokeDasharray: 'none', strokeDashoffset: 0 });
      gsap.fromTo(btn,
        { scale: 0.9 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)' }
      );
    }
  });
}

/* ═══════════════════════════════════════════════
   LIKE — number roll + elastic heart
═══════════════════════════════════════════════ */
function initLike() {
  const btn       = $('#likeBtn');
  const countEl   = $('#likeCount');
  const heartPath = $('#heartPath');
  let liked = false;
  let count = 42;

  btn.addEventListener('click', () => {
    liked  = !liked;
    count += liked ? 1 : -1;
    const dir = liked ? 1 : -1;

    btn.classList.toggle('liked', liked);

    // Heart bounce
    gsap.to(btn, {
      scale: liked ? 1.3 : 0.9,
      duration: 0.14,
      ease: 'power2.out',
      onComplete: () => gsap.to(btn, { scale: 1, duration: 0.4, ease: 'elastic.out(1.4, 0.5)' })
    });

    // Number roll
    gsap.to(countEl, {
      y: -8 * dir,
      opacity: 0,
      duration: 0.14,
      ease: 'power2.in',
      onComplete: () => {
        countEl.textContent = count;
        gsap.fromTo(countEl,
          { y: 8 * dir, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }
        );
      }
    });

    if (liked) {
      gsap.set(heartPath, { attr: { fill: 'var(--tc-mid)', stroke: 'var(--tc-mid)' } });
    } else {
      gsap.set(heartPath, { attr: { fill: 'none', stroke: 'currentColor' } });
    }
  });
}

/* ═══════════════════════════════════════════════
   AUDIO PLAYER — play/pause morph + progress
═══════════════════════════════════════════════ */
function initAudioPlayer() {
  const btn        = $('#playerBtn');
  const playIcon   = $('#pPlayIcon');
  const pauseIcon  = $('#pPauseIcon');
  const fill       = $('#playerFill');
  const timeEl     = $('#playerTime');
  let playing  = false;
  let audioTween   = null;
  let elapsed  = 0;

  btn.addEventListener('click', () => {
    playing = !playing;
    btn.classList.toggle('playing', playing);
    playIcon.style.display  = playing ? 'none'  : 'block';
    pauseIcon.style.display = playing ? 'block' : 'none';

    if (playing) {
      // Elastic entrance
      gsap.fromTo(btn,
        { scale: 0.85 },
        { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.5)' }
      );

      const remaining = 100 - elapsed;
      audioTween = gsap.to(fill, {
        width: '100%',
        duration: remaining * 0.12,
        ease: 'none',
        onUpdate: function () {
          const pct  = parseFloat(fill.style.width || '0');
          const secs = Math.round(pct * 0.12 * 60 / 100);
          const m    = Math.floor(secs / 60);
          const s    = secs % 60;
          timeEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
          elapsed = pct;
        }
      });
    } else {
      gsap.to(btn, {
        scale: 0.92,
        duration: 0.08,
        onComplete: () => gsap.to(btn, { scale: 1, duration: 0.2 })
      });
      if (audioTween) audioTween.pause();
    }
  });
}

/* ═══════════════════════════════════════════════
   STREAM TABS — sliding indicator + crossfade
═══════════════════════════════════════════════ */
function initStreamTabs() {
  const tabs    = $$('#streamTabs .stream-tab');
  const slider  = $('#streamSlider');
  const content = $('#streamContentDemo');
  let active = 0;

  const texts = [
    'Monet described this series as his most ambitious work — the <span class="term">[water lilies]</span> becoming an obsession at Giverny.',
    'Painted during WWI, these works carry hidden weight. While Europe burned, Monet <span class="term">[retreated]</span> into his garden.',
    'Working with <span class="term">[Impressionist brushwork]</span> at scale, Monet used panoramic format to dissolve spatial certainty.',
    "Jeff Koons referenced this series. Monet's palette appears in the <span class=\"term\">[Lo-fi aesthetic]</span> dominating streaming playlists.",
  ];

  // Initialise slider position
  gsap.set(slider, {
    left: '0%',
    width: '25%',
    top: 0,
    bottom: 0,
    borderRadius: 'calc(var(--r8) - 2px)',
  });

  function switchTab(idx) {
    if (idx === active) return;
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));

    gsap.to(slider, { left: `${idx * 25}%`, duration: 0.28, ease: 'back.out(1.4)' });

    // Crossfade content
    gsap.to(content, {
      opacity: 0,
      y: -6,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        content.innerHTML = texts[idx];
        gsap.fromTo(content,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }
    });
    active = idx;
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      gsap.to(tab, {
        scale: 0.94,
        duration: 0.08,
        onComplete: () => gsap.to(tab, { scale: 1, duration: 0.28, ease: 'back.out(2)' })
      });
      switchTab(i);
    });
  });
}

/* ═══════════════════════════════════════════════
   POI DOTS — entrance + tap to reveal card
═══════════════════════════════════════════════ */
function initPOIDots() {
  const stage    = $('#poiStage');
  const poi1     = $('#poi1');
  const poi2     = $('#poi2');
  const card     = $('#poiCardDemo');
  let open   = false;

  // Animate dots in on interaction panel show
  function animateDots() {
    gsap.fromTo([poi1, poi2],
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'elastic.out(1.2, 0.5)', delay: 0.1 }
    );
    poi2.style.opacity = '0.4';
  }

  // Trigger entrance when panel becomes visible
  const observer = new MutationObserver(() => {
    if ($('#panel-interactions').classList.contains('active')) {
      setTimeout(animateDots, 150);
    }
  });
  observer.observe($('#panel-interactions'), { attributes: true, attributeFilter: ['class'] });

  poi1.addEventListener('click', e => {
    e.stopPropagation();
    open = !open;

    gsap.to(poi1, {
      scale: 0.82,
      duration: 0.1,
      onComplete: () => gsap.to(poi1, { scale: 1, duration: 0.4, ease: 'elastic.out(1.5, 0.5)' })
    });

    if (open) {
      gsap.to(poi2, { opacity: 0.15, duration: 0.25 });
      card.style.display = 'block';
      gsap.fromTo(card,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.38, ease: 'power3.out' }
      );
    } else {
      gsap.to(poi2, { opacity: 0.4, duration: 0.25 });
      gsap.to(card, {
        y: '100%',
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => { card.style.display = 'none'; }
      });
    }
  });

  // Close on stage click
  stage.addEventListener('click', () => {
    if (!open) return;
    open = false;
    gsap.to(poi2, { opacity: 0.4 });
    gsap.to(card, {
      y: '100%', opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => { card.style.display = 'none'; }
    });
  });
}

/* ═══════════════════════════════════════════════
   TERM TOOLTIP — bloom up from text
═══════════════════════════════════════════════ */
function initTermTooltip() {
  const trigger = $('#termTrigger');
  const box     = $('#tooltipBox');
  let open  = false;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    open = !open;
    if (open) {
      gsap.fromTo(box,
        { opacity: 0, y: 6, pointerEvents: 'none' },
        { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.28, ease: 'power2.out' }
      );
    } else {
      gsap.to(box, { opacity: 0, y: 6, pointerEvents: 'none', duration: 0.18, ease: 'power2.in' });
    }
  });

  document.addEventListener('click', () => {
    if (!open) return;
    open = false;
    gsap.to(box, { opacity: 0, y: 6, pointerEvents: 'none', duration: 0.18, ease: 'power2.in' });
  });
}

/* ═══════════════════════════════════════════════
   SKELETON LOADER — shimmer
═══════════════════════════════════════════════ */
function initSkeletonLoader() {
  const btn   = $('#skelBtn');
  const stage = $('#skelStage');

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.textContent = 'Loading…';

    const items = $$('.skel', stage);
    gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.05 });

    setTimeout(() => {
      gsap.to(items, {
        opacity: 0,
        stagger: 0.04,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          stage.innerHTML = `
            <div id="loadedImg" style="height:90px;border-radius:8px;background:linear-gradient(145deg,#C8D5C0,#A4B890);filter:saturate(0) blur(4px);transition:filter 0.5s ease;overflow:hidden"></div>
            <div style="font-size:13px;font-weight:500;color:var(--t1);padding:4px 0">Water Lilies</div>
            <div style="font-size:11px;color:var(--t3)">Claude Monet · 1908</div>
          `;
          const img = $('#loadedImg');
          gsap.fromTo(
            stage.children,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
          );
          // Polaroid develop-in
          setTimeout(() => {
            if (img) img.style.filter = 'saturate(1) blur(0)';
          }, 80);

          btn.disabled = false;
          btn.textContent = 'Simulate load';
        }
      });
    }, 2200);
  });
}

/* ═══════════════════════════════════════════════
   PULL TO REFRESH — frame motif + stagger cards
═══════════════════════════════════════════════ */
function initPullToRefresh() {
  const btn       = $('#pullBtn');
  const indicator = $('#pullIndicator');
  const frame     = $('#pullFrame');
  const hint      = $('#pullHint');
  const content   = $('#pullContent');

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    btn.disabled = true;

    indicator.style.display = 'flex';
    gsap.fromTo(indicator,
      { height: 0, opacity: 0 },
      { height: 70, opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    gsap.to(content, { y: 70, duration: 0.3, ease: 'power2.out' });

    // Tension builds — frame turns terracotta
    setTimeout(() => {
      frame.classList.add('ready');
      hint.textContent = 'Release to refresh';
      gsap.to(frame, { rotation: 360, duration: 0.4, ease: 'back.out(1.4)' });
    }, 500);

    // Release
    setTimeout(() => {
      gsap.to(indicator, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in' });
      gsap.to(content, {
        y: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          indicator.style.display = 'none';
          indicator.style.height  = '';
          frame.classList.remove('ready');
          hint.textContent = 'Pull to refresh';
          // Staggered card cascade
          gsap.fromTo(
            content.children,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.04, duration: 0.35, ease: 'power2.out' }
          );
          btn.disabled = false;
        }
      });
    }, 1100);
  });
}

/* ═══════════════════════════════════════════════
   SCREEN TRANSITION — directional slide
═══════════════════════════════════════════════ */
function initScreenTransition() {
  const screenA    = $('#screenA');
  const screenB    = $('#screenB');
  const fwdBtn     = $('#transForward');
  const backBtn    = $('#transBack');
  let onB      = false;

  fwdBtn.addEventListener('click', () => {
    if (onB) return;
    onB = true;
    gsap.to(screenA, { x: '-15%', opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.fromTo(screenB,
      { x: '100%', opacity: 0.6 },
      { x: '0%', opacity: 1, duration: 0.38, ease: 'power3.out' }
    );
  });

  backBtn.addEventListener('click', () => {
    if (!onB) return;
    onB = false;
    gsap.to(screenB, { x: '100%', opacity: 0.6, duration: 0.28, ease: 'power2.in' });
    gsap.fromTo(screenA,
      { x: '-15%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 0.38, ease: 'power3.out' }
    );
  });
}

/* ═══════════════════════════════════════════════
   TOGGLE SWITCHES — snap with back easing
═══════════════════════════════════════════════ */
function initToggles() {
  $$('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
      gsap.to(toggle, {
        scale: 0.92,
        duration: 0.08,
        onComplete: () => gsap.to(toggle, { scale: 1, duration: 0.28, ease: 'back.out(2)' })
      });
    });
  });
}

/* ═══════════════════════════════════════════════
   CHIP SELECT — scale pulse + fill flood
═══════════════════════════════════════════════ */
function initChips() {
  $$('.chip-sel').forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive  = chip.classList.contains('active-chip');
      const isTeal    = chip.classList.contains('chip-sel--teal');

      chip.classList.toggle('active-chip', !isActive);

      if (!isActive) {
        if (isTeal) {
          chip.style.background   = 'var(--tl-tint)';
          chip.style.color        = 'var(--tl)';
          chip.style.borderColor  = 'rgba(15,110,86,.25)';
        } else {
          chip.style.background   = 'var(--tc-tint)';
          chip.style.color        = 'var(--tc)';
          chip.style.borderColor  = 'rgba(153,60,29,.25)';
        }
      } else {
        chip.style.background  = 'var(--bg2)';
        chip.style.color       = 'var(--t2)';
        chip.style.borderColor = 'var(--bd2)';
      }

      // Scale pulse
      gsap.to(chip, {
        scale: 1.08,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => gsap.to(chip, { scale: 1, duration: 0.28, ease: 'back.out(2)' })
      });
    });
  });
}

/* ═══════════════════════════════════════════════
   CARD HOVER LIFT
═══════════════════════════════════════════════ */
function initCardHover() {
  $$('.hover-card').forEach(card => {
    card.addEventListener('mouseenter', () =>
      gsap.to(card, { y: -4, boxShadow: '0 8px 20px rgba(44,44,42,.14)', duration: 0.2, ease: 'power2.out' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { y: 0, boxShadow: 'none', duration: 0.25, ease: 'power2.out' })
    );
    card.addEventListener('mousedown', () =>
      gsap.to(card, { scale: 0.97, duration: 0.08 })
    );
    card.addEventListener('mouseup', () =>
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'back.out(2)' })
    );
  });
}

/* ═══════════════════════════════════════════════
   GENERAL BUTTON FEEDBACK
═══════════════════════════════════════════════ */
function initButtonFeedback() {
  $$('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.97, duration: 0.08 }));
    btn.addEventListener('mouseup',   () => gsap.to(btn, { scale: 1,    duration: 0.25, ease: 'back.out(2)' }));
    btn.addEventListener('mouseleave',() => gsap.to(btn, { scale: 1,    duration: 0.15 }));
  });
}

/* ═══════════════════════════════════════════════
   HERO ENTRANCE
═══════════════════════════════════════════════ */
function animateHero() {
  gsap.fromTo(
    '.hero > *',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
  );
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSegmentedControl();
  initEasingDemos();
  initBookmark();
  initLike();
  initAudioPlayer();
  initStreamTabs();
  initPOIDots();
  initTermTooltip();
  initSkeletonLoader();
  initPullToRefresh();
  initScreenTransition();
  initToggles();
  initChips();
  initCardHover();
  initButtonFeedback();
  animateHero();
});
