export default class UsefulModal {
  constructor(options) {
    this.modal = document.querySelector('.modal');
    this.modalCard = false;
    this.isOpen = false;
    this.previousFocusElement = false;
    this.animation = options.animation ? options.animation : 'fade';
    this.animationDuration = options.animationDuration ? options.animationDuration : 0;
    this._focusElements = [
      'a[href]',
      'input',
      'select',
      'textarea',
      'button',
      'iframe',
      '[tabindex]:not([tabindex^="-"])',
    ];
    this.events();
  }

  events() {
    document.addEventListener('click', function(e) {
      const clickedElement = e.target;

      if (clickedElement.closest(`[data-modal-path]`)) {
        const target = clickedElement.dataset.modalPath;

        this.modalCard = document.querySelector(`[data-modal-target="${target}"]`);

        this.open();
        return;
      }

      if (clickedElement.closest('.modal__close')) {
        this.close();
        return;
      }

      if (clickedElement.classList.contains('modal') && this.isOpen) {
        this.close();
      }
    }.bind(this))

    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }

      if (e.key === 'Tab' && this.isOpen) {
        this.catchFocus(e);
      }
    }.bind(this))
  }

  open() {
    this.isOpen = true;

    this.modal.style.setProperty('--transition-duration', `${this.animationDuration}ms`);
    this.modal.classList.add('is-open');
    this.modalCard.classList.add(this.animation);
    this.modalCard.classList.add('modal-open');

    this.disableScroll();

    setTimeout(() => {
      this.modalCard.classList.add('open-animate');

      this.toggleFocus();
    }, this.animationDuration)
  }

  close() {
    this.isOpen = false;

    this.modalCard.classList.remove('open-animate');

    this.enableScroll();

    setTimeout(() => {
      this.modalCard.classList.remove('modal-open');
      this.modalCard.classList.remove(this.animation);
      this.modal.classList.remove('is-open');

      this.toggleFocus()
    }, this.animationDuration)
  }

  disableScroll() {
    this.lockOffset();

    document.body.classList.add('dis-scroll');
  }

  enableScroll() {
    this.unlockOffset();

    document.body.classList.remove('dis-scroll');
  }

  lockOffset() {
    const lockedOffset = window.innerWidth - document.body.offsetWidth + 'px';

    this.modal.style.paddingRight = lockedOffset;
    document.body.style.paddingRight = lockedOffset;
  }

  unlockOffset() {
    this.modal.style.paddingRight = '0';
    document.body.style.paddingRight = '0';
  }

  toggleFocus() {
    const focusElements = this.modalCard.querySelectorAll(this._focusElements);

    if (this.isOpen) {
      this.previousFocusElement = document.activeElement;

      focusElements[0].focus();
    } else {
      this.previousFocusElement.focus();
    }
  }

  catchFocus(e) {
    const focusElements = this.modalCard.querySelectorAll(this._focusElements);

    if (!e.shiftKey && document.activeElement === focusElements[focusElements.length - 1]) {
      focusElements[0].focus();

      e.preventDefault();
    }

    if (e.shiftKey && document.activeElement === focusElements[0]) {
      focusElements[focusElements.length - 1].focus();

      e.preventDefault();
    }
  }
}