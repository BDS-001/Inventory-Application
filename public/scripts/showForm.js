document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.subForm');
    const showFormButtons = document.querySelectorAll('.showSubForm');
    
    const showForm = (e) => {
        e.preventDefault();
        const buttonFormType = e.target.dataset.form;
        forms.forEach(form => {
            form.style.display = form.dataset.form === buttonFormType ? 'block' : 'none';
        });
    };

    const closeForm = (e) => {
        e.preventDefault();
        const form = e.target.closest('.subForm');
        if (form) {
            form.style.display = 'none';
        }
    };

    //event listeners
    showFormButtons.forEach((button) => {
        button.addEventListener('click', (e) => showForm(e));
    });

    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach((button) => {
        button.addEventListener('click', (e) => closeForm(e));
    });
});