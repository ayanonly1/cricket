// list all questions

function get(sel) {
  return document.querySelector(sel);
}

function createRow(container, id, description) {
  const description_field = document.createElement('span');
  description_field.className = 'description';
  description_field.innerHTML = `<br>${description}`;
  description_field.id = id;

  const inputField = document.createElement('input');
  inputField.className = 'amount';
  inputField.type = 'number';
  inputField.placeholder = 'Amount';


  const check_yes = document.createElement('input');
  const check_no = document.createElement('input');
  check_no.type = 'radio';
  check_yes.type = 'radio';
  check_yes.className = 'yes_radio';
  check_no.name = 'opinion';
  check_yes.name = 'opinion';
  check_no.value = 'no';
  check_yes.value = 'yes';

  const yes = document.createElement('span');
  yes.innerText = 'Yes';
  const no = document.createElement('span');
  no.innerText = 'No';


  const lockBtn = document.createElement('button');
  lockBtn.innerText = 'Save';

  (function (question_id, amount, opinion) {
    lockBtn.addEventListener('click', () => {
      $.post('/api/bet', { question_id, amount: amount.value, opinion: opinion.checked }, (data) => {
        if (data.error) {
          swal('Error!', data.message, 'error');
        } else {
          console.log(data);
        }
      });
    });
  }(id, inputField, check_yes));


  container.appendChild(description_field);
  container.appendChild(inputField);

  container.appendChild(check_yes);
  container.appendChild(yes);

  container.appendChild(check_no);
  container.appendChild(no);

  container.appendChild(lockBtn);
}

$.get('/api/question', (res) => {
  const container = get('#container');
  if (!res.error) {
    res.data.forEach((item) => {
      createRow(container, item._id, item.description);
    });
  }
});
