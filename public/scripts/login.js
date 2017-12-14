$(document).ready(() => {
  $('#login').submit((e) => {
    e.preventDefault();
    const button = $('.btn-flat');
    const spinner = $('#spinner');
    /* #### Form Validation #### */

    // store form elements in var
    const email = $('input[name=email]').val();
    const password = $('input[name=password]').val();

    // create an empty array for storing errors
    const errors = [];

    // validate each fields now

    // validate email
    /* regex credit goes to http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
    const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regexEmail.test(email)) {
      errors.push('Please enter a valid email');
    }

    // validate password
    if (password.length <= 4) {
      errors.push('Please enter a valid password');
    }

    // in case any validation error
    if (errors.length !== 0) {
      const arrToStr = errors.join('\n');
      sweetAlert('Error!', arrToStr, 'error');
      spinner.fadeOut();
    }

    /* ##### The entire form validation ends here ##### */

    /* #### Ajax #### */
    // if no error, then send ajax request
    if (errors.length === 0) {
      const login = $('#login');
      const data = {
        contactEmail: email,
        password,
      };
      // send the ajax request now

      button.prop({ disabled: true });
      spinner.fadeIn('fast');

      $.ajax({
        type: login.attr('method'),
        url: '/api/auth',
        data,
        success(response) {
          console.log(response);
          if (response.error !== 'false') {
            swal('Error!', response.message, 'error');
            spinner.fadeOut('slow');
          } else {
            // do whatever is necessary because user info is valid
            localStorage.setItem('token', response.token);
            window.location.href = '/';
          }
        },
        complete() {
          button.prop({ disabled: false });
          spinner.fadeOut('slow');
        },
      });
    }
  });
});
