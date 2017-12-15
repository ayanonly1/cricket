function bet(question_id) {
  console.log(question_id);
  const amount = $(`#${question_id}_amount`).val();
  const opinion_true = $(`#${question_id}_opinion_true`).is(':checked');
  const opinion_false = $(`#${question_id}_opinion_false`).is(':checked');
  if (!opinion_true && !opinion_false) {
    return swal('Please choose any one of the option');
  }
  const data = { question_id, amount, opinion: (opinion_true || opinion_false) };
  
  $.post('/api/bet', data, (data) => {
    if (data.error) {
      swal('Error!', data.message, 'error');
    } else {
      window.location.reload();
    }
  });
}
