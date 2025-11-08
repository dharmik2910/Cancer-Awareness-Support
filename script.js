// script.js — improved UI interactions: toast, smooth-scroll, accessible quote loading
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const year = document.getElementById('year');
  const toast = document.getElementById('toast');
  year.textContent = new Date().getFullYear();

  function showToast(msg, timeout = 3500){
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), timeout);
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
    feedback.style.color = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in all fields.';
      feedback.style.color = 'crimson';
      feedback.focus && feedback.focus();
      return;
    }

    // Basic email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.style.color = 'crimson';
      return;
    }

    // no backend — show a friendly toast and reset
    showToast('Thanks — your message was recorded locally.');
    feedback.textContent = '';
    form.reset();
  });

  // Quotes
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const newQuoteBtn = document.getElementById('newQuote');
  const quoteBox = document.getElementById('quoteBox');

  async function fetchQuote(){
    if (!quoteText || !newQuoteBtn) return;
    try{
      newQuoteBtn.disabled = true;
      quoteBox.setAttribute('aria-busy','true');
      quoteText.textContent = 'Loading…';
      quoteAuthor.textContent = '';

      const res = await fetch('https://api.quotable.io/random');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      quoteText.textContent = '"' + data.content + '"';
      quoteAuthor.textContent = data.author ? `— ${data.author}` : '';
    } catch(err){
      quoteText.textContent = 'Could not load quote. Please try again.';
      quoteAuthor.textContent = '';
      console.error('Quote fetch failed', err);
      showToast('Quote service unavailable');
    } finally{
      newQuoteBtn.disabled = false;
      quoteBox.removeAttribute('aria-busy');
    }
  }

  newQuoteBtn.addEventListener('click', fetchQuote);

  // initial fetch + interval
  fetchQuote();
  setInterval(fetchQuote, 15000);
});
