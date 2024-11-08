document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.subForm');
    const showFormButtons = document.querySelectorAll('.showSubForm');

    const newItems = {
        studios: [],
        genres: [],
        series: []
    }

    const handleSubFormSubmit = (e) => {
        e.preventDefault()
        const form = e.target
        const formType = form.closest('.subForm').dataset.form;
        const nameInput = form.querySelector('#name');
        const name = nameInput.value;

        if (!name) return;
        return
    }

    const handleMainFormSubmit = () => {
        return
    }
    
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

    showFormButtons.forEach((button) => {
        button.addEventListener('click', (e) => showForm(e));
    });

    document.querySelectorAll('.close-button').forEach((button) => {
        button.addEventListener('click', (e) => closeForm(e));
    });

    document.querySelectorAll('.subForm form').forEach(form => {
        form.addEventListener('submit', handleSubFormSubmit);
    });

    document.querySelector('form[action^="/addGame"], form[action^="/editGame"]')
        .addEventListener('submit', handleMainFormSubmit);
});