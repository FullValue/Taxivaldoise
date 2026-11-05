(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Menu mobile */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.classList.toggle('open', open);
    };
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.matchMedia('(min-width: 1041px)').addEventListener('change', function () { setMenu(false); });
  }

  /* Apparition au défilement */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Validation */
  var PHONE = /^(?:(?:\+|00)33[\s.\-]?(?:\(0\)[\s.\-]?)?|0)[1-9](?:[\s.\-]?\d{2}){4}$/;
  function nirValid(raw) {
    var v = raw.replace(/\s/g, '').toUpperCase();
    if (!/^[1-478]\d{4}(?:\d{2}|2A|2B)\d{6}\d{2}$/.test(v)) return false;
    var body = v.slice(0, 13).replace('2A', '19').replace('2B', '18');
    var rest = 0;
    for (var i = 0; i < body.length; i++) rest = (rest * 10 + Number(body[i])) % 97;
    return 97 - rest === Number(v.slice(13));
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var MAX_FILE = 4 * 1024 * 1024;
  var FILE_EXT = /\.(pdf|jpe?g|png|webp|heic)$/i;

  function messageFor(el) {
    var v = el.value.trim();
    if (el.type === 'checkbox') return el.required && !el.checked ? 'Veuillez cocher cette case pour continuer.' : '';
    if (el.type === 'radio') {
      var g = $$('input[name="' + el.name + '"]', el.form);
      return el.required && !g.some(function (r) { return r.checked; }) ? 'Veuillez choisir une option.' : '';
    }
    if (el.type === 'file') {
      var f = el.files && el.files[0];
      if (!f) return '';
      if (f.size > MAX_FILE) return 'Le fichier dépasse 4 Mo. Envoyez une photo plus légère, ou remettez-le au chauffeur.';
      return FILE_EXT.test(f.name) ? '' : 'Format accepté : PDF, JPG, PNG, WEBP ou HEIC.';
    }
    if (!v) return el.required ? 'Ce champ est obligatoire.' : '';
    var kind = el.dataset.check;
    if (kind === 'phone' && !PHONE.test(v)) return 'Numéro invalide. Exemple : 07 63 76 45 92.';
    if (kind === 'cp' && !/^\d{5}$/.test(v)) return 'Le code postal doit contenir 5 chiffres.';
    if (kind === 'nir' && !nirValid(v)) return 'Numéro invalide : vérifiez les 15 caractères de votre carte Vitale.';
    if (kind === 'future' && v < today()) return 'La date ne peut pas être dans le passé.';
    if (kind === 'past' && v >= today()) return 'Veuillez saisir une date de naissance valide.';
    if (el.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'Adresse e-mail invalide.';
    if (el.type === 'number') {
      var n = Number(v);
      if (!Number.isInteger(n) || n < Number(el.min) || n > Number(el.max)) return 'Indiquez un nombre entre ' + el.min + ' et ' + el.max + '.';
    }
    return '';
  }

  function showError(el, msg) {
    var field = el.closest('.field');
    if (!field) return;
    var box = field.querySelector('.field__err');
    field.classList.toggle('has-err', !!msg);
    if (box) box.textContent = msg;
    if (el.type === 'radio') {
      $$('input[name="' + el.name + '"]', el.form).forEach(function (r) { msg ? r.setAttribute('aria-invalid', 'true') : r.removeAttribute('aria-invalid'); });
    } else if (msg) {
      el.setAttribute('aria-invalid', 'true');
    } else {
      el.removeAttribute('aria-invalid');
    }
  }

  function validate(scope) {
    var first = null;
    var seen = {};
    $$('input, textarea, select', scope).forEach(function (el) {
      if (el.disabled || el.type === 'hidden' || el.closest('.hp')) return;
      if (el.type === 'radio') { if (seen[el.name]) return; seen[el.name] = 1; }
      var msg = messageFor(el);
      showError(el, msg);
      if (msg && !first) first = el;
    });
    if (first) first.focus({ preventScroll: false });
    return !first;
  }

  /* Formulaires */
  $$('form[data-form]').forEach(function (form) {
    form.noValidate = true;
    var steps = $$('.fstep', form);
    var dots = $$('.stepper li', form);
    var prev = form.querySelector('[data-prev]');
    var next = form.querySelector('[data-next]');
    var submit = form.querySelector('[type=submit]');
    var msgBox = form.querySelector('.form-msg');
    var current = 0;

    /* Champs conditionnels */
    function isConventionne() {
      var service = form.elements.service ? form.elements.service.value : '';
      var pec = form.elements.prise_en_charge ? form.elements.prise_en_charge.value : '';
      return service === 'conventionne' || (service === 'pmr' && pec === 'conventionne');
    }
    function applyConditions() {
      var service = form.elements.service ? form.elements.service.value : '';
      var state = {
        conv: isConventionne(),
        notconv: !isConventionne(),
        pmr: service === 'pmr',
        convonly: service === 'conventionne',
        societe: form.elements.profil ? form.elements.profil.value === 'societe' : false
      };
      $$('[data-show]', form).forEach(function (block) {
        var on = !!state[block.dataset.show];
        block.hidden = !on;
        $$('input, textarea, select', block).forEach(function (el) { el.disabled = !on; });
      });
    }
    form.addEventListener('change', applyConditions);
    applyConditions();

    /* Contraintes dynamiques de dates */
    $$('[data-check=future]', form).forEach(function (el) { el.min = today(); });
    $$('[data-check=past]', form).forEach(function (el) { el.max = today(); });

    /* Compteur du numéro de sécurité sociale */
    $$('[data-check=nir]', form).forEach(function (el) {
      var counter = el.closest('.field').querySelector('[data-count]');
      el.addEventListener('input', function () {
        if (counter) counter.textContent = el.value.replace(/\s/g, '').length + ' / 15';
      });
    });

    /* Étapes */
    function showStep(i, focus) {
      current = i;
      steps.forEach(function (s, n) { s.hidden = n !== i; });
      dots.forEach(function (d, n) {
        d.classList.toggle('on', n <= i);
        if (n === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      if (prev) prev.hidden = i === 0;
      if (next) next.hidden = i === steps.length - 1;
      if (submit) submit.hidden = steps.length > 1 && i !== steps.length - 1;
      if (focus) {
        var top = form.getBoundingClientRect().top + window.scrollY - 110;
        if (window.scrollY > top) window.scrollTo({ top: top });
        var heading = steps[i].querySelector('legend, .fgroup__title');
        if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      }
    }
    if (next) next.addEventListener('click', function () { if (validate(steps[current])) showStep(current + 1, true); });
    if (prev) prev.addEventListener('click', function () { showStep(current - 1, true); });
    if (steps.length > 1) showStep(0, false);

    /* Effacer l'erreur dès que l'utilisateur corrige */
    form.addEventListener('input', function (e) {
      var field = e.target.closest && e.target.closest('.field');
      if (field && field.classList.contains('has-err')) showError(e.target, messageFor(e.target));
    });
    form.addEventListener('change', function (e) {
      if (e.target.type === 'radio' || e.target.type === 'checkbox' || e.target.type === 'file') showError(e.target, messageFor(e.target));
    });

    /* Entrée dans un champ : passer à l'étape suivante plutôt que soumettre */
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && next && !next.hidden) { e.preventDefault(); next.click(); }
    });

    /* Envoi */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      msgBox.className = 'form-msg';
      for (var i = 0; i < steps.length; i++) {
        var hiddenState = steps[i].hidden;
        steps[i].hidden = false;
        var ok = validate(steps[i]);
        steps[i].hidden = hiddenState;
        if (!ok) { showStep(i, false); validate(steps[i]); return; }
      }
      if (!validate(form)) return;
      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Envoi en cours…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (data) {
            if (!r.ok || !data.ok) throw new Error(data.error || '');
          });
        })
        .then(function () {
          var done = document.createElement('div');
          done.className = 'form-done';
          done.setAttribute('role', 'status');
          done.tabIndex = -1;
          done.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>' +
            '<h3>Demande bien reçue</h3><p>Nous revenons vers vous rapidement pour confirmer. Pour un trajet urgent, appelez-nous au <a href="tel:+33763764592">07 63 76 45 92</a>.</p>';
          form.replaceWith(done);
          done.focus();
        })
        .catch(function (err) {
          msgBox.textContent = err.message || "L'envoi a échoué. Réessayez ou appelez-nous au 07 63 76 45 92.";
          msgBox.className = 'form-msg err';
          msgBox.setAttribute('role', 'alert');
          submit.disabled = false;
          submit.textContent = label;
        });
    });
  });
})();
