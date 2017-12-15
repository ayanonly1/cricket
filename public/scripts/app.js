function bet(question_id) {
  console.log(question_id);
  const amount = $(`#${question_id}_amount`).val();
  const opinion_true = $(`#${question_id}_opinion_true`).is(':checked');
  const opinion_false = $(`#${question_id}_opinion_false`).is(':checked');
  if (!opinion_true && !opinion_false) {
    return swal('Please choose any one of the option');
  }

  let opinion;
  if (opinion_true) {
    opinion = true;
  }
  if (opinion_false) {
    opinion = false;
  }

  const data = { question_id, amount, opinion };

  $.post('/api/bet', data, (data) => {
    if (data.error) {
      swal('Error!', data.message, 'error');
    } else {
      updateUI(question_id, amount, opinion);
    }
  });
}


function updateUI(question_id, amount, opinion) {
  $(`#${question_id}`).find('.amount').html(amount);
  const yesOrno = opinion === true ? 'Yes' : 'No';
  $(`#${question_id}`).find('.opinion').html(yesOrno);
  $(`#${question_id}`).find('.action').html('Locked');
  $(`#${question_id}`).addClass('success');
}

/*
$(document).ready(() => {
  const trs = $('#tbody').children();
  trs.each((tr) => {
    (function (row) {
      const id = row.id;
      $.get(`/api/bet/${id}`, (d) => {
        $(`#${id}`).append(`<td>${d.data.forOp}</td>`);
        $(`#${id}`).append(`<td>${d.data.aginstOp}</td>`);
      });
    }(trs[tr]));
  });
});
*/
