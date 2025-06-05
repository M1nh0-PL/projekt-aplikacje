// script.js for FitPlaner - trening plan

// Hamburger menu logic (always visible)
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.classList.toggle('active', isOpen);
    });
    // Close menu on link click (UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.classList.remove('active');
      });
    });
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburger) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.classList.remove('active');
      }
    });
  }

  // Trening plan logic
  const form = document.getElementById('treningForm');
  const planDiv = document.getElementById('planTreningowy');

  if (form && planDiv) {
    displayPlan();

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Get form values
      const dzien = document.getElementById('dzien').value;
      const cwiczenia = Array.from(form.querySelectorAll('input[name="cwiczenie"]:checked')).map(cb => cb.value);
      const poziom = form.querySelector('input[name="poziom"]:checked')?.value;

      if (!dzien || cwiczenia.length === 0 || !poziom) {
        alert('Wypełnij wszystkie pola!');
        return;
      }

      // Prepare plan object
      const plan = {
        dzien,
        cwiczenia,
        poziom
      };

      // Save to localStorage
      let plany = JSON.parse(localStorage.getItem('planyTreningowe') || '[]');
      // Remove previous plan for this day
      plany = plany.filter(p => p.dzien !== dzien);
      plany.push(plan);
      localStorage.setItem('planyTreningowe', JSON.stringify(plany));

      displayPlan();
      form.reset();
    });
  }

  function displayPlan() {
    const plany = JSON.parse(localStorage.getItem('planyTreningowe') || '[]');
    if (!planDiv) return;
    if (plany.length === 0) {
      planDiv.innerHTML = '<p>Brak zapisanych planów.</p>';
      return;
    }
    planDiv.innerHTML = '<ul>' + plany.map((plan, idx) =>
      `<li><b>${plan.dzien}:</b> ${plan.cwiczenia.join(', ')} | Poziom: ${plan.poziom.charAt(0).toUpperCase() + plan.poziom.slice(1)} ` +
      `<button class="usun-trening" data-idx="${idx}" style="margin-left:10px;">Usuń</button></li>`
    ).join('') + '</ul>';

    // Add delete listeners
    planDiv.querySelectorAll('.usun-trening').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-idx'));
        let plany = JSON.parse(localStorage.getItem('planyTreningowe') || '[]');
        plany.splice(idx, 1);
        localStorage.setItem('planyTreningowe', JSON.stringify(plany));
        displayPlan();
      });
    });
  }
});
