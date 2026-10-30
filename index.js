import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

const fotos = document.querySelectorAll('.galeria-recepta');

// La galeria nomes s'activa a les pagines que tenen fotos ampliables://
if (fotos.length > 0) {
  let fotoOrigen;
  const regions = document.querySelectorAll('body > header, body > main, body > footer, body > .salta-contingut');

  fotos.forEach((foto) => {
    foto.href = foto.querySelector('img').src;
    foto.addEventListener('click', () => {
      fotoOrigen = foto;
    }, true);
  });

  const galeria = GLightbox({
    selector: '.galeria-recepta',
    touchNavigation: true,
    keyboardNavigation: true,
    loop: false,
    openEffect: 'fade',
    closeEffect: 'fade'
  });

  galeria.on('open', () => {
    const modal = document.querySelector('.glightbox-container');
    modal.setAttribute('aria-label', 'Galeria de fotografies de la recepta');
    modal.setAttribute('aria-modal', 'true');

    modal.querySelector('.gclose').setAttribute('aria-label', 'Tanca la galeria');
    modal.querySelector('.gprev').setAttribute('aria-label', 'Fotografia anterior');
    modal.querySelector('.gnext').setAttribute('aria-label', 'Fotografia següent');
    modal.querySelector('.gclose').focus();

    regions.forEach((region) => {
      region.setAttribute('aria-hidden', 'true');
    });

    // Tab i Mayus+Tab mantenen el focus dins de la finestra oberta: //
    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;

      const controls = Array.from(modal.querySelectorAll('button:not([disabled]):not(.disabled), a[href]'))
        .filter((control) => control.getClientRects().length > 0 && getComputedStyle(control).visibility !== 'hidden');

      if (controls.length === 0) return;

      event.preventDefault();
      event.stopPropagation();
      const current = controls.indexOf(document.activeElement);
      const direction = event.shiftKey ? -1 : 1;
      const next = (current + direction + controls.length) % controls.length;
      controls[next].focus();
    });
  });

  galeria.on('close', () => {
    regions.forEach((region) => {
      region.removeAttribute('aria-hidden');
    });

    if (fotoOrigen) fotoOrigen.focus();
  });
}
