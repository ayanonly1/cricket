/* eslint-disable */
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
window.realBal = 0;
function updateBetStats() {
  const trs = $('#tbody').children();
  trs.each((tr) => {
    (function (row) {
      const id = row.id;
      $.get(`/api/bet/${id}`, (d) => {
        $(`#for-${id}`).text(d.data.forOp);
        $(`#against-${id}`).text(d.data.aginstOp);
        const myAmount = Number($(`#${id}`).find('.amount-value').html().trim());
        // window.balance += myAmount;

        window.realBal += myAmount;
        const myOpinion = String($(`#${id}`).find('.opinion-value').html().trim()) === 'Yes';
        if ($(`#${id}`).hasClass('success')) {
          const result = String($(`#${id}`).find('.result').html().trim()) === 'Yes';
          // console.log(d.data, myAmount, myOpinion);
          if (result === myOpinion) {
            // I am correct
            if (result) {
              // for is correct
              if (d.data.forC === 1 && d.data.forOp === myAmount && d.data.againstC === 0) {
                console.log('Only I am for');
                window.balance += myAmount;
                $('#'+id).find('.text-result').text('You won ' + myAmount);
              } else {
                var extraGet = (myAmount / d.data.forOp ) * d.data.aginstOp;
                var gain = (extraGet + myAmount);
                window.balance += gain;
                $('#'+id).find('.text-result').text('You won ' + gain.toFixed(2));
              }
            } else {
              // aginst is correct
              if (d.data.againstC === 1 && d.data.aginstOp === myAmount && d.data.forC === 0) {
                console.log('Only I am against');
                window.balance += myAmount;
                $('#'+id).find('.text-result').text('You won ' + myAmount);
              } else {
                var extraGet = (myAmount / d.data.aginstOp ) * d.data.forOp;
                var gain = (extraGet + myAmount);
                window.balance += gain;
                $('#'+id).find('.text-result').text('You won ' + gain.toFixed(2));
              }
            }
          } else {
            // I am wrong
            if (myOpinion) {
              if (d.data.againstC === 0) {
                console.log('Only I am wrong, no oponent');
                // window.balance += myAmount;
                $('#'+id).find('.text-result').text('As a donation ' + myAmount);
              } else {
                $('#'+id).find('.text-result').text('You lost ' + myAmount);
              }
            } else {
              if (d.data.forC === 0) {
              console.log('Only I am wrong, no oponent');
              // window.balance += myAmount;
              $('#'+id).find('.text-result').text('As a donation ' + myAmount);
            } else {
              $('#'+id).find('.text-result').text('You lost ' + myAmount);
            }
          }
          }
        }
        let bal = Math.round(balance* 100) / 100;
        $('#balance').text(bal);
      });
    }(trs[tr]));
  });
}

$(document).ready(() => {
  updateBetStats();
});

