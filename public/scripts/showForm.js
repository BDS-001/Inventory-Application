document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.subForm')
    const showFormButtons = document.querySelectorAll('.showSubForm')
    const func = (e) => {
        e.preventDefault()
        const buttonFormType = e.target.dataset.form
        forms.forEach(form => {
            form.dataset.form === buttonFormType ? form.style.display = 'block' : form.style.display = 'none'
        })
    }
    showFormButtons.forEach((button) => {
        button.addEventListener('click', (e) => func(e))
    })
});