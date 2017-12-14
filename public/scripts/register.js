$(document).ready(() => {
  $('#register').submit((e) => {
    e.preventDefault();

    const button = $('.btn-flat');
    const spinner = $('#spinner');
    // form validation goes here
    // create an empty array for storing errors
    const errors = [];
    // get the values for all fields

    const fn = $('input[name=full-name]').val();
    const email = $('input[name=email]').val();
    const pass1 = $('input[name=password1]').val();
    const pass2 = $('input[name=password2]').val();
    // validate each fields now

    // validate full name
    if (fn.length < 5 || fn.length > 39) {
      errors.push('Please enter a valid first name');
    }
    // validate email
    /* regex credit goes to http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
    const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regexEmail.test(email)) {
      errors.push('Please enter a valid email');
    }
    // validate password now
    if (pass1.length >= 4) {
      if (pass1 !== pass2) {
        errors.push("Passwords don't match");
      }
    } else {
      errors.push('Please enter a password of at least 4 characters');
    }
    // if there's any error, show the error message using sweet alert
    if (errors.length !== 0) {
      const arrToStr = errors.join('\n');
      sweetAlert('Error!', arrToStr, 'error');
    }
    // no validation error. Now ready for sending ajax request
    if (errors.length === 0) {
      button.prop({ disabled: true });
      spinner.fadeIn('fast');
      const regForm = $('#register');
      const data = {
        contactEmail: email,
        name: fn,
        password: pass1,
      };

      $.ajax({
        type: 'POST',
        url: '/api/register',
        data,
        success(response) {
          // console.log(response);
          if (response.error) { // email already exists
            swal('Error!', 'This email address already exists', 'error');
          } else { // successful register
            swal({ title: 'Success!', text: 'Registered Successfully!', type: 'success' }, () => {
              window.location.href = '/account/login';
            });
          }
        },
        error(err) {
          console.log(err);
        },
        complete() {
          button.prop({ disabled: false });

          spinner.fadeOut('fast');
        },
      });
    }
  });
});
