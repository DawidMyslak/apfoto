(() => {
  'use strict';

  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  // --- Nav: transparent → solid on scroll ---
  const navObserver = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('nav--scrolled', !entry.isIntersecting),
    { threshold: 0.05 }
  );
  navObserver.observe(hero);

  // --- Mobile menu toggle ---
  toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );

  // --- Smooth scroll with nav offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- Scroll reveal (Intersection Observer) ---
  const reveals = document.querySelectorAll('.reveal, .reveal-fade');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => revealObserver.observe(el));

  // --- Gallery stagger delays ---
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.style.setProperty('--stagger', `${i * 0.08}s`);
  });

  // --- Active nav link tracking ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link =>
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.25, rootMargin: '-20% 0px -60% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  // --- Subtle hero parallax ---
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = `translateY(${y * 0.25}px) scale(1.05)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    heroBg.style.transform = 'translateY(0) scale(1.05)';
  }
})();
