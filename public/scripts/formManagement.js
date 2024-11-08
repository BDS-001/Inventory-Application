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

        newItems[formType].push(name)

        if (formType === 'studio') {
            const developerSelect = document.querySelector('#developer_id');
            const publisherSelect = document.querySelector('#publisher_id');
            
            const option = `<option value="new_${newItems.studios.length - 1}">${name}</option>`;
            developerSelect.insertAdjacentHTML('beforeend', option);
            publisherSelect.insertAdjacentHTML('beforeend', option);
        } else if (formType === 'series') {
            const seriesSelect = document.querySelector('#series_id');
            const option = `<option value="new_${newItems.series.length - 1}">${name}</option>`;
            seriesSelect.insertAdjacentHTML('beforeend', option);
        } else if (formType === 'genre') {
            const genreGroup = document.querySelector('.checkbox-group');
            const checkboxItem = `
                <div class="checkbox-item">
                    <input type="checkbox" 
                           id="genre_new_${newItems.genres.length - 1}" 
                           name="genres[]" 
                           value="new_${newItems.genres.length - 1}"
                           checked>
                    <label for="genre_new_${newItems.genres.length - 1}">${name}</label>
                </div>`;
            genreGroup.insertAdjacentHTML('beforeend', checkboxItem);
        }

        nameInput.value = '';
        form.closest('.subForm').style.display = 'none';

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