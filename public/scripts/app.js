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
  $(`#bet-card-${question_id}`).addClass('locked-card');
  $(`#locktext-${question_id}`).css('display', 'block');
  $(`#input-holder-${question_id}`).css('display', 'none');
  $(`#lock-btn-${question_id}`).css('display', 'none');
  const lockedInputStat = $(`#locked-input-stat-${question_id}`);
  lockedInputStat.find('.amount-value').text(amount);

  lockedInputStat.find('.opinion-value').text(opinion === true ? 'Yes' : 'No');
  lockedInputStat.css('display', 'block');
  window.balance = balance - amount;
  $('#balance').text(balance);
  updateBetStats();
}

function updateBetStats() {
  const trs = $('#tbody').children();
  trs.each((tr) => {
    (function (row) {
      const id = row.id;
      $.get(`/api/bet/${id}`, (d) => {
        console.log(`#for-${id}`);
        $(`#for-${id}`).text(d.data.forOp);
        $(`#against-${id}`).text(d.data.aginstOp);
      });
    }(trs[tr]));
  });
}

$(document).ready(() => {
  updateBetStats();
});

