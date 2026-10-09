(() => {
  'use strict';
  const form = document.getElementById('appointment-form');
  const summary = document.getElementById('error-summary');
  const list = document.getElementById('error-list');
  const preview = document.getElementById('request-preview');
  const details = document.getElementById('preview-details');
  const originalTitle = document.title;
  const fields = ['name', 'email', 'service', 'date'];
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  document.getElementById('date').min = today();
  const scrollToAppointment = () => {
    document.getElementById('appointment').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    document.getElementById('service').focus({preventScroll: true});
  };
  document.querySelectorAll('.select-service').forEach(button => button.addEventListener('click', () => {
    document.getElementById('service').value = button.dataset.service;
    preview.hidden = true; form.hidden = false; scrollToAppointment();
  }));
  document.querySelector('[data-help]').addEventListener('click', () => {
    document.getElementById('service').value = 'Help me decide'; preview.hidden = true; form.hidden = false;
  });
  function clearErrors() {
    fields.forEach(id => {
      const field = document.getElementById(id);
      field.removeAttribute('aria-invalid');
      field.setAttribute('aria-describedby', id === 'date' ? 'date-hint' : '');
      document.getElementById(`${id}-error`).hidden = true;
    });
    list.replaceChildren(); summary.hidden = true; document.title = originalTitle;
  }
  function validate() {
    const errors = [];
    const values = Object.fromEntries(new FormData(form));
    if (!values.name.trim()) errors.push(['name', 'Enter your name.']);
    if (!values.email.trim()) errors.push(['email', 'Enter your email address.']);
    else if (!document.getElementById('email').validity.valid) errors.push(['email', 'Enter an email address like name@example.com.']);
    if (!values.service) errors.push(['service', 'Choose a service, or select Help me decide.']);
    if (!values.date) errors.push(['date', 'Choose a preferred drop-off date.']);
    else {
      const date = new Date(`${values.date}T12:00:00`);
      if (values.date < today()) errors.push(['date', 'Choose today or a future date.']);
      else if ([0,1].includes(date.getDay())) errors.push(['date', 'Choose a Tuesday, Wednesday, Thursday, Friday, or Saturday.']);
    }
    return {errors, values};
  }
  form.addEventListener('submit', event => {
    event.preventDefault(); clearErrors();
    const {errors, values} = validate();
    if (errors.length) {
      errors.forEach(([id, message]) => {
        const field = document.getElementById(id); const fieldError = document.getElementById(`${id}-error`);
        fieldError.textContent = message; fieldError.hidden = false;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${id === 'date' ? 'date-hint ' : ''}${id}-error`);
        const item = document.createElement('li'); const link = document.createElement('a');
        link.href = `#${id}`; link.textContent = message;
        link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
        item.append(link); list.append(item);
      });
      summary.hidden = false; document.title = `Error: ${originalTitle}`; summary.focus(); return;
    }
    details.replaceChildren();
    const date = new Date(`${values.date}T12:00:00`);
    const rows = [['Name', values.name.trim()], ['Email', values.email.trim()], ['Service', values.service], ['Preferred date', date.toLocaleDateString('en-GB',{weekday:'long', day:'numeric', month:'long', year:'numeric'})]];
    if (values.notes.trim()) rows.push(['Notes', values.notes.trim()]);
    rows.forEach(([label, value]) => { const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; row.append(dt,dd); details.append(row); });
    form.hidden = true; preview.hidden = false; preview.focus();
  });
  document.getElementById('edit-request').addEventListener('click', () => { preview.hidden = true; form.hidden = false; document.getElementById('name').focus(); });
})();
