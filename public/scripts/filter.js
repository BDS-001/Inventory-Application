document.addEventListener('DOMContentLoaded', () => {
    const filterType = document.getElementById('filterType');
    const filterValue = document.getElementById('filterValue');
    
    const fetchFilterOptions = async (filterType) => {
        try {
            const response = await fetch(`/api/filters/${filterType}`);
            if (!response.ok) {
                throw new Error('Failed to fetch filter options');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching filter options:', error);
            return [];
        }
    };

    const updateFilterValueOptions = async (selectedType) => {
        filterValue.innerHTML = '<option value="">Select a value</option>';
        filterValue.disabled = true;
        if (!selectedType) return;
        
        try {
            const options = await fetchFilterOptions(selectedType);
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.id;
                optionElement.textContent = option.name;
                if (option.id.toString() === filterValue.dataset.selected) {
                    optionElement.selected = true;
                }
                filterValue.appendChild(optionElement);
            });
            filterValue.disabled = false;
        } catch (error) {
            console.error('Error updating filter options:', error);
            filterValue.innerHTML = '<option value="">Error loading options</option>';
        }
    };

    if (filterType.value) {
        updateFilterValueOptions(filterType.value);
    }

    filterType.addEventListener('change', (e) => {
        updateFilterValueOptions(e.target.value);
    });
});