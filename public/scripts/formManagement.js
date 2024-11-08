document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.subForm');
    const showFormButtons = document.querySelectorAll('.showSubForm');

    const newItems = {
        studio: [],
        genre: [],
        series: []
    };

    const handleSubFormSubmit = (e) => {
        e.preventDefault()
        const form = e.target
        const subForm = form.closest('.subForm')
        const formType = subForm.dataset.form;
        const nameInput = form.querySelector('#name');
        const name = nameInput.value.trim();

        if (!name) return;

        newItems[formType].push(name)
        const newIndex = newItems[formType].length - 1

        switch(formType) {
            case 'studio':
                const developerSelect = document.querySelector('#developer_id');
                const publisherSelect = document.querySelector('#publisher_id');
                const studioOption = `<option value="new_${newIndex}">${name}</option>`;
                developerSelect.insertAdjacentHTML('beforeend', studioOption);
                publisherSelect.insertAdjacentHTML('beforeend', studioOption);
                break;
                
            case 'series':
                const seriesSelect = document.querySelector('#series_id');
                const seriesOption = `<option value="new_${newIndex}">${name}</option>`;
                seriesSelect.insertAdjacentHTML('beforeend', seriesOption);
                break;
                
            case 'genre':
                const genreGroup = document.querySelector('.checkbox-group');
                const checkboxItem = `
                    <div class="checkbox-item">
                        <input type="checkbox" 
                               id="genre_new_${newIndex}" 
                               name="genres[]" 
                               value="new_${newIndex}"
                               checked>
                        <label for="genre_new_${newIndex}">${name}</label>
                    </div>`;
                genreGroup.insertAdjacentHTML('beforeend', checkboxItem);
                break;
        }

        nameInput.value = '';
        form.closest('.subForm').style.display = 'none';

        return
    }

    const createNewEntity = async (entityType, index, name) => {
        try {
            const response = await fetch(`/api/${entityType}s`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0]?.msg || `Failed to create ${entityType}`);
            }

            if (entityType === 'studio') {
                document.querySelectorAll(`option[value="new_${index}"]`)
                    .forEach(option => { option.value = data.id; });
            } else if (entityType === 'genre') {
                const checkbox = document.querySelector(`input[value="new_${index}"]`);
                if (checkbox) checkbox.value = data.id;
            } else if (entityType === 'series') {
                const option = document.querySelector(`option[value="new_${index}"]`);
                if (option) option.value = data.id;
            }

            return data.id;
        } catch (error) {
            console.error(`Error creating ${entityType}:`, error);
            throw error;
        }
    };

    const handleMainFormSubmit = async (e) => {
        e.preventDefault()
        const form = e.target

        try {
            for (let i = 0; i < newItems.studio.length; i++) {
                await createNewEntity('studio', i, newItems.studio[i]);
            }

            for (let i = 0; i < newItems.genre.length; i++) {
                await createNewEntity('genre', i, newItems.genre[i]);
            }

            for (let i = 0; i < newItems.series.length; i++) {
                await createNewEntity('series', i, newItems.series[i]);
            }

            form.submit();
        } catch (error) {
            console.error('Error processing form:', error);
            alert('An error occurred while processing the form. Please try again.');
        }
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