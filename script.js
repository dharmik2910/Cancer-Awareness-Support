// script.js — improved UI interactions: toast, smooth-scroll, accessible quote loading
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const year = document.getElementById('year');
  const toast = document.getElementById('toast');
  year.textContent = new Date().getFullYear();

  function showToast(msg, timeout = 3500){
    if (!toast) {
      // Fallback: display message inline in the form feedback if toast is not available
      if (feedback) {
        feedback.textContent = msg;
        feedback.style.color = 'green';
        setTimeout(() => { feedback.textContent = ''; }, timeout);
      }
      return;
    }

    toast.textContent = msg;
    toast.style.display = '';
    toast.setAttribute('aria-hidden','false');
    toast.classList.add('show');
    // Allow click to dismiss
    const hideOnClick = () => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden','true');
      toast.removeEventListener('click', hideOnClick);
    };
    toast.addEventListener('click', hideOnClick);
    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden','true');
      // hide visually after animation
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, timeout);
  }

  // smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        target.focus({preventScroll:true});
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'feedback';

    const nameInput = form.name;
    const emailInput = form.email;
    const messageInput = form.message;
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Clear all error states
    [nameInput, emailInput, messageInput].forEach(f => f.classList.remove('error', 'valid'));
    [nameError, emailError, messageError].forEach(e => e.classList.remove('show'));

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    // Validate name
    if (!name) {
      nameError.textContent = 'Please enter your name';
      nameError.classList.add('show');
      nameInput.classList.add('error');
      isValid = false;
    } else {
      nameInput.classList.add('valid');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      emailError.textContent = 'Please enter your email';
      emailError.classList.add('show');
      emailInput.classList.add('error');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email address';
      emailError.classList.add('show');
      emailInput.classList.add('error');
      isValid = false;
    } else {
      emailInput.classList.add('valid');
    }

    // Validate message
    if (!message) {
      messageError.textContent = 'Please write a message';
      messageError.classList.add('show');
      messageInput.classList.add('error');
      isValid = false;
    } else if (message.length < 10) {
      messageError.textContent = 'Message should be at least 10 characters';
      messageError.classList.add('show');
      messageInput.classList.add('error');
      isValid = false;
    } else {
      messageInput.classList.add('valid');
    }

    if (!isValid) {
      return;
    }

    // Show success feedback
    feedback.textContent = '✓ Thank you — we received your message!';
    feedback.className = 'feedback success show';
    showToast('Message sent successfully!');
    
    // Reset form after 1.5s
    setTimeout(() => {
      form.reset();
      [nameInput, emailInput, messageInput].forEach(f => f.classList.remove('error', 'valid'));
      document.getElementById('charCount').textContent = '0 / 500 characters';
      feedback.classList.remove('show');
      setTimeout(() => { feedback.textContent = ''; }, 300);
    }, 1500);
  });

  // Real-time validation on input
  const nameInput = form.name;
  const emailInput = form.email;
  const messageInput = form.message;
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const charCount = document.getElementById('charCount');

  nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim()) {
      nameInput.classList.remove('error');
      nameError.classList.remove('show');
      nameInput.classList.add('valid');
    }
  });

  emailInput.addEventListener('blur', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() && emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.remove('error');
      emailError.classList.remove('show');
      emailInput.classList.add('valid');
    }
  });

  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCount.textContent = len + ' / 500 characters';
    if (len > 500) {
      messageInput.value = messageInput.value.substring(0, 500);
      charCount.textContent = '500 / 500 characters (limit reached)';
    }
  });

  messageInput.addEventListener('blur', () => {
    const msg = messageInput.value.trim();
    if (msg && msg.length >= 10) {
      messageInput.classList.remove('error');
      messageError.classList.remove('show');
      messageInput.classList.add('valid');
    }
  });

  // Quotes
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const newQuoteBtn = document.getElementById('newQuote');
  const quoteBox = document.getElementById('quoteBox');
  const quoteContent = document.getElementById('quoteContent');
  const toggleAutoBtn = document.getElementById('toggleAuto');
  const quoteIntervalText = document.getElementById('quoteIntervalText');

  let autoRotate = true;
  const baseInterval = 15000;
  let intervalId = null;
  let wasAutoBeforeHover = false;

  async function fetchQuote(){
    if (!quoteText || !newQuoteBtn) return;
    try{
      // UI: disable and show loading states
      newQuoteBtn.disabled = true;
      newQuoteBtn.classList.add('loading');
      quoteBox.classList.add('loading');
      quoteBox.setAttribute('aria-busy','true');
      if (quoteContent) quoteContent.classList.add('is-updating');

      // small pause to allow fade-out
      await new Promise(r => setTimeout(r, 200));

      quoteText.textContent = 'Loading…';
      quoteAuthor.textContent = '';

      // Primary and backup API endpoints
      const API_ENDPOINTS = [
        'https://api.quotable.io/random',
        'https://zenquotes.io/api/random',
        'https://api.goprogram.ai/inspiration'
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      let quote = null;
      let error = null;

      // Try each endpoint until we get a quote
      for (const endpoint of API_ENDPOINTS) {
        try {
          const res = await fetch(endpoint, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Origin': window.location.origin
            },
            mode: 'cors'
          });

          if (!res.ok) throw new Error('API status ' + res.status);
          const data = await res.json();

          // Handle different API response formats
          if (endpoint.includes('quotable.io')) {
            quote = { text: data.content, author: data.author };
          } else if (endpoint.includes('zenquotes.io')) {
            quote = { text: data[0].q, author: data[0].a };
          } else if (endpoint.includes('goprogram.ai')) {
            quote = { text: data.quote, author: data.author };
          }

          if (quote && quote.text) break; // Valid quote found
        } catch (e) {
          error = e;
          console.warn('API endpoint ' + endpoint + ' failed:', e);
          continue; // Try next endpoint
        }
      }

      clearTimeout(timeoutId);

      // If no APIs worked, fall back to local quotes
      if (!quote) {
        const fallbackQuotes = [
          { text: "Hope is being able to see that there is light despite all of the darkness.", author: "Desmond Tutu" },
          { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
          { text: "Once you choose hope, anything's possible.", author: "Christopher Reeve" }
        ];
        quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      }

      // Update DOM and fade back in
      quoteText.textContent = '"' + quote.text + '"';
      quoteAuthor.textContent = '— ' + quote.author;
      if (quoteContent) setTimeout(() => { quoteContent.classList.remove('is-updating'); }, 20);

    } catch(err){
      let errorMessage = 'Unable to fetch quote - using inspiration from our collection.';
      quoteText.textContent = errorMessage;
      quoteAuthor.textContent = '';
      console.error('All quote services failed:', err);
      // Try again in 5s instead of 15s when errors occur
      setTimeout(fetchQuote, 5000);
    } finally{
      newQuoteBtn.disabled = false;
      newQuoteBtn.classList.remove('loading');
      quoteBox.classList.remove('loading');
      quoteBox.removeAttribute('aria-busy');
    }
  }

  // Debounce the quote button to prevent spam
  let fetchTimeout;
  newQuoteBtn.addEventListener('click', () => {
    if (fetchTimeout) return;
    fetchTimeout = setTimeout(() => { fetchTimeout = null; }, 1000);
    fetchQuote();
  });

  // Add a subtle press animation (keeps previous behavior but uses classes)
  newQuoteBtn.addEventListener('click', function() {
    this.style.opacity = '0.7';
    setTimeout(() => this.style.opacity = '1', 200);
  });

  // Auto-rotate control
  function startAutoRotate(){
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(fetchQuote, baseInterval + Math.random() * 2000);
    if (toggleAutoBtn){ toggleAutoBtn.textContent = 'Pause'; toggleAutoBtn.setAttribute('aria-pressed','false'); }
    autoRotate = true;
  }
  function stopAutoRotate(){
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    if (toggleAutoBtn){ toggleAutoBtn.textContent = 'Resume'; toggleAutoBtn.setAttribute('aria-pressed','true'); }
    autoRotate = false;
  }

  if (toggleAutoBtn){
    toggleAutoBtn.addEventListener('click', () => {
      if (autoRotate) stopAutoRotate(); else startAutoRotate();
    });
  }

  // Pause auto-rotation when user hovers the quote area, resume afterward
  if (quoteBox){
    quoteBox.addEventListener('mouseenter', () => {
      if (autoRotate){ wasAutoBeforeHover = true; stopAutoRotate(); } else { wasAutoBeforeHover = false; }
    });
    quoteBox.addEventListener('mouseleave', () => { if (wasAutoBeforeHover) startAutoRotate(); });
  }

  // keyboard shortcut: 'n' = new quote
  document.addEventListener('keydown', (e) => { if (e.key && e.key.toLowerCase() === 'n') fetchQuote(); });

  // initial fetch + start auto rotate
  setTimeout(fetchQuote, 100);
  startAutoRotate();

  // Newsletter form handling
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
      }
      showToast('Thanks — you are subscribed!');
      newsletterForm.reset();
    });
  }

  // FAQ interactions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', (e) => {
      if (e.target.open) {
        e.target.querySelectorAll('p').forEach(p => {
          p.style.animation = 'slideDown 0.3s ease';
        });
      }
    });
  });
});
