// script.js for FitPlaner - trening plan

// Formularz kontaktowy
const kontaktForm = document.getElementById('kontaktForm');
const wypelnijPrzyklad = document.getElementById('wypelnijPrzyklad');

if (kontaktForm && wypelnijPrzyklad) {
  wypelnijPrzyklad.addEventListener('click', () => {
    // Wypełnij pola tekstowe
    document.getElementById('imie').value = 'Jan';
    document.getElementById('nazwisko').value = 'Kowalski';
    document.getElementById('email').value = 'jan.kowalski@example.com';
    document.getElementById('telefon').value = '123456789';
    
    // Zaznacz radio button
    const radioEmail = kontaktForm.querySelector('input[value="email"]');
    if (radioEmail) radioEmail.checked = true;
    
    // Zaznacz checkboxy
    const zainteresowania = kontaktForm.querySelectorAll('input[name="zainteresowania"]');
    zainteresowania.forEach(z => {
      if (['trening', 'dieta'].includes(z.value)) {
        z.checked = true;
      }
    });
    
    // Wybierz poziom
    document.getElementById('poziom').value = 'poczatkujacy';
    
    // Wybierz godziny
    const godziny = document.getElementById('godziny');
    if (godziny) {
      Array.from(godziny.options).forEach(option => {
        if (['rano', 'poludnie'].includes(option.value)) {
          option.selected = true;
        }
      });
    }
    
    // Wypełnij wiadomość
    document.getElementById('wiadomosc').value = 'Dzień dobry,\n\nChciałbym uzyskać więcej informacji na temat planów treningowych i dietetycznych. Jestem początkujący i potrzebuję profesjonalnego wsparcia.\n\nPozdrawiam,\nJan';
  });
  
  kontaktForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(kontaktForm);
    const data = Object.fromEntries(formData.entries());
    data.zainteresowania = formData.getAll('zainteresowania');
    data.godziny = formData.getAll('godziny');
    
    console.log('Wysłane dane:', data);
    alert('Formularz został wysłany! Dziękujemy za kontakt.');
    kontaktForm.reset();
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
      `<li><b>${plan.dzien}:</b> ${plan.cwiczenia.join(', ')} | Poziom: ${plan.poziom} ` +
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

  document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const images = document.querySelectorAll('#galeriaZdjec img');
    let currentImageIndex = 0;

    // Open modal when clicking an image
    images.forEach((img, index) => {
      img.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.classList.add('fade');
        captionText.textContent = this.getAttribute('data-title');
        currentImageIndex = index;
        checkArrowVisibility();
      });
    });

    // Close modal
    function closeModal() {
      modal.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Navigate between images
    function showImage(index) {
      if (index >= 0 && index < images.length) {
        currentImageIndex = index;
        modalImg.src = images[index].src;
        modalImg.classList.add('fade');
        captionText.textContent = images[index].getAttribute('data-title');
        checkArrowVisibility();
      }
    }

    function checkArrowVisibility() {
      prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'block';
      nextBtn.style.display = currentImageIndex === images.length - 1 ? 'none' : 'block';
    }

    prevBtn.addEventListener('click', function() {
      showImage(currentImageIndex - 1);
    });

    nextBtn.addEventListener('click', function() {
      showImage(currentImageIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
          showImage(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight') {
          showImage(currentImageIndex + 1);
        } else if (e.key === 'Escape') {
          closeModal();
        }
      }
    });
  });

