// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

//   the forms we want to apply custom Bootstrap validation styles to// Fetch all 
  const forms = document.querySelectorAll('.needs-validation')

 
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()