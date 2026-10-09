'use strict';
const form = document.getElementById('enquiry-form');
const summary = document.getElementById('error-summary');
const errorList = document.getElementById('error-list');
const preview = document.getElementById('enquiry-preview');
const details = document.getElementById('preview-details');
const title = document.title;
const fields = ['name', 'email', 'project', 'notes'];
const labels = { name: 'Your name', email: 'Email address', project: 'Project type', notes: 'What would you like to change?' };
function clearErrors() {
  errorList.replaceChildren();
  for (const id of fields) {
    document.getElementById(id).removeAttribute('aria-invalid');
    document.getElementById(id + '-error').hidden = true;
  }
  summary.hidden = true;
  document.title = title;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  clearErrors();
  const values = Object.fromEntries(fields.map(id => [id, form.elements[id].value.trim()]));
  const errors = {};
  if (!values.name) errors.name = 'Enter your name.';
  if (!values.email) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter an email address like name@example.com.';
  if (!values.project) errors.project = 'Choose a project type.';
  if (!values.notes) errors.notes = 'Tell us what you would like to change.';
  if (Object.keys(errors).length) {
    for (const [id, message] of Object.entries(errors)) {
      const field = document.getElementById(id);
      field.setAttribute('aria-invalid', 'true');
      const error = document.getElementById(id + '-error');
      error.textContent = message;
      error.hidden = false;
      const link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = message;
      link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
      const item = document.createElement('li');
      item.append(link);
      errorList.append(item);
    }
    summary.hidden = false;
    document.title = 'Error: ' + title;
    summary.focus();
    return;
  }
  details.replaceChildren();
  for (const id of fields) {
    const term = document.createElement('dt');
    const definition = document.createElement('dd');
    term.textContent = labels[id];
    definition.textContent = values[id];
    details.append(term, definition);
  }
  form.hidden = true;
  preview.hidden = false;
  preview.focus();
});
document.getElementById('edit-enquiry').addEventListener('click', () => {
  preview.hidden = true;
  form.hidden = false;
  document.getElementById('name').focus();
});
document.querySelectorAll('a[href="#main"]').forEach(link => link.addEventListener('click', () => document.getElementById('main').focus()));
