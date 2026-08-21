/* =========================================================
   JAE PORTFOLIO — SCRIPT.JS
   Vanilla JS only. Sections:
   1. Live Philippine Time
   2. Navbar scroll state + active link
   3. Mobile menu
   4. Smooth scroll
   5. Scroll reveal animations
   6. Role rotator (typing animation)
   7. Animated counters
   8. Skill bar animation
   9. Portfolio filtering
   10. Contact form validation
   11. Ripple button effect
   12. Back to top
   13. Custom REC cursor
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. LIVE PHILIPPINE TIME (GMT+8)
  --------------------------------------------------- */
  function updatePhilippineTime(){
    const now = new Date();
    // Get UTC then add 8 hours for Philippine Time
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const phDate = new Date(utcMs + (8 * 60 * 60 * 1000));

    const hh = String(phDate.getHours()).padStart(2,'0');
    const mm = String(phDate.getMinutes()).padStart(2,'0');
    const ss = String(phDate.getSeconds()).padStart(2,'0');
    const timeStr = `${hh}:${mm}:${ss}`;

    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const dateStr = `${days[phDate.getDay()]}`;

    const topClock = document.getElementById('phTime');
    if(topClock) topClock.textContent = `${dateStr} ${timeStr}`;

    const footerClock = document.getElementById('footerTime');
    if(footerClock) footerClock.textContent = `${timeStr} GMT+8`;

    const contactClock = document.getElementById('contactTime');
    if(contactClock) contactClock.textContent = `${timeStr} · GMT+8`;
  }
  updatePhilippineTime();
  setInterval(updatePhilippineTime, 1000);

  /* ---------------------------------------------------
     2. NAVBAR SCROLL STATE + ACTIVE LINK
  --------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id], header[id]');

  function handleNavbarScroll(){
    if(window.scrollY > 40){
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function handleActiveLink(){
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if(scrollPos >= top && scrollPos < top + height){
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if(link.getAttribute('href') === `#${current}`){
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleActiveLink();
    handleBackToTop();
  }, { passive:true });

  handleNavbarScroll();
  handleActiveLink();

  /* ---------------------------------------------------
     3. MOBILE MENU
  --------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('[data-nav-mobile]');

  function closeMobileMenu(){
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------------------------------------------------
     4. SMOOTH SCROLL (with fixed header offset)
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if(targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if(!target) return;
      e.preventDefault();

      const offset = 120;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior:'smooth' });
    });
  });

  const scrollDownBtn = document.getElementById('scrollDown');
  if(scrollDownBtn){
    scrollDownBtn.addEventListener('click', () => {
      const about = document.getElementById('about');
      if(about){
        window.scrollTo({ top: about.offsetTop - 100, behavior:'smooth' });
      }
    });
  }

  /* ---------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');

        // Trigger counters when about stats appear
        if(entry.target.classList.contains('about-copy')){
          animateCounters();
        }
        // Trigger skill bars when skills grid appears
        if(entry.target.classList.contains('skills-grid')){
          animateSkillBars();
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     6. ROLE ROTATOR (typing animation)
  --------------------------------------------------- */
  const roles = [
    'Strategic Video Editor',
    'Graphic Designer',
    'UI/UX Designer',
    'Encoder',
    'Social Media Manager'
  ];
  const rotatorEl = document.getElementById('roleRotator');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeRole(){
    if(!rotatorEl) return;
    const currentRole = roles[roleIndex];

    if(isDeleting){
      charIndex--;
    } else {
      charIndex++;
    }

    rotatorEl.textContent = currentRole.substring(0, charIndex);

    let typeSpeed = isDeleting ? 35 : 65;

    if(!isDeleting && charIndex === currentRole.length){
      typeSpeed = 1600; // pause at full word
      isDeleting = true;
    } else if(isDeleting && charIndex === 0){
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 300;
    }

    setTimeout(typeRole, typeSpeed);
  }
  typeRole();

  /* ---------------------------------------------------
     7. ANIMATED COUNTERS
  --------------------------------------------------- */
  let countersAnimated = false;
  function animateCounters(){
    if(countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 1400;
      const startTime = performance.now();

      function update(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if(progress < 1){
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  /* ---------------------------------------------------
     8. SKILL BARS
  --------------------------------------------------- */
  let skillsAnimated = false;
  function animateSkillBars(){
    if(skillsAnimated) return;
    skillsAnimated = true;

    document.querySelectorAll('.skill-row').forEach((row, i) => {
      const level = row.getAttribute('data-level');
      const fill = row.querySelector('.skill-fill');
      setTimeout(() => {
        if(fill) fill.style.width = `${level}%`;
      }, i * 80);
    });
  }

  /* ---------------------------------------------------
     9. PORTFOLIO FILTERING
  --------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || filter === category;

        if(show){
          item.classList.remove('hidden-item');
          item.style.animation = 'fadeIn .5s ease forwards';
        } else {
          item.classList.add('hidden-item');
        }
      });
    });
  });

  /* ---------------------------------------------------
     10. CONTACT FORM VALIDATION (frontend only)
  --------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function showError(fieldName, message){
    const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
    const input = document.getElementById(fieldName);
    if(errorEl) errorEl.textContent = message;
    if(input) input.classList.toggle('invalid', !!message);
  }

  function validateField(name, value){
    switch(name){
      case 'fullName':
        if(!value.trim()) return 'Please enter your full name.';
        if(value.trim().length < 2) return 'Name looks too short.';
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!value.trim()) return 'Please enter your email.';
        if(!emailRegex.test(value)) return 'Please enter a valid email.';
        return '';
      case 'projectType':
        if(!value) return 'Please select a project type.';
        return '';
      case 'message':
        if(!value.trim()) return 'Please add a short message.';
        if(value.trim().length < 10) return 'Please add a bit more detail.';
        return '';
      default:
        return '';
    }
  }

  if(contactForm){
    const fields = ['fullName','email','projectType','message'];

    fields.forEach(name => {
      const input = document.getElementById(name);
      if(!input) return;
      input.addEventListener('blur', () => {
        const error = validateField(name, input.value);
        showError(name, error);
      });
      input.addEventListener('input', () => {
        if(input.classList.contains('invalid')){
          const error = validateField(name, input.value);
          showError(name, error);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      fields.forEach(name => {
        const input = document.getElementById(name);
        const error = validateField(name, input.value);
        showError(name, error);
        if(error) isValid = false;
      });

      if(isValid){
        formSuccess.classList.add('show');
        contactForm.reset();
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        formSuccess.classList.remove('show');
        const firstInvalid = contactForm.querySelector('.invalid');
        if(firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ---------------------------------------------------
     11. BUTTON RIPPLE EFFECT
  --------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add('ripple-effect');
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------------------------------------------
     12. BACK TO TOP
  --------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop(){
    if(!backToTop) return;
    if(window.scrollY > 600){
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  if(backToTop){
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }
  handleBackToTop();

  /* ---------------------------------------------------
     13. CUSTOM REC CURSOR (desktop only)
  --------------------------------------------------- */
  const recCursor = document.getElementById('recCursor');
  if(recCursor && window.matchMedia('(hover: hover)').matches){
    document.addEventListener('mousemove', (e) => {
      recCursor.style.left = `${e.clientX}px`;
      recCursor.style.top = `${e.clientY}px`;
      recCursor.classList.add('visible');
    });
    document.addEventListener('mouseleave', () => {
      recCursor.classList.remove('visible');
    });
  }

  /* ---------------------------------------------------
     PLAY BUTTON (intro video)
  --------------------------------------------------- */
  const playBtn = document.getElementById('playBtn');
  const introVideo = document.getElementById('introVideo');
  if(playBtn && introVideo){
    playBtn.addEventListener('click', () => {
      if(introVideo.paused){
        introVideo.play().catch(() => {});
        playBtn.style.opacity = '0';
      } else {
        introVideo.pause();
        playBtn.style.opacity = '1';
      }
    });
    introVideo.addEventListener('click', () => playBtn.click());
  }

  /* ---------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

});
