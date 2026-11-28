/*
 * Hidden QA page: compact index of all 25 readings.
 * Links use ?qa=1 so every day opens even during the colleague rehearsal.
 */
(function () {
  'use strict';

  var Calendar = window.Calendar;
  var index = document.getElementById('preview-index');
  if (!Calendar || !index) return;

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  function isMissing(value) {
    return typeof value !== 'string' || !value.trim() || value.trim().indexOf('[MISSING') === 0;
  }

  function renderIndex(entries) {
    index.replaceChildren();
    for (var day = 1; day <= Calendar.TOTAL_DAYS; day += 1) {
      var entry = entries.find(function (item) { return item && item.day === day; });
      var item = document.createElement(entry ? 'a' : 'span');
      item.className = 'preview-index__item' + (entry ? '' : ' preview-index__item--missing');

      if (entry) {
        item.href = 'day.html?day=' + day + '&qa=1';
      } else {
        item.setAttribute('aria-disabled', 'true');
      }

      item.appendChild(createElement('span', 'preview-index__day', Calendar.t('dayLabel', { day: day })));
      var reference = createElement(
        'span',
        'preview-index__ref',
        entry && !isMissing(entry.ref_sv) ? entry.ref_sv : Calendar.t('previewMissing')
      );
      if (entry && isMissing(entry.ref_sv)) reference.classList.add('is-placeholder');
      item.appendChild(reference);
      index.appendChild(item);
    }
  }

  function showError() {
    index.replaceChildren();
    index.appendChild(createElement('p', 'notice', Calendar.t('loadError')));
  }

  fetch('data/readings.json')
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (entries) {
      if (!Array.isArray(entries)) throw new Error('Invalid readings data');
      renderIndex(entries);
    })
    .catch(showError);
})();
