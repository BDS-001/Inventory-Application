document.addEventListener('DOMContentLoaded', () => {
    const filterType = document.getElementById('filterType');
    const filterValue = document.getElementById('filterValue');
    
    const updateFilterValueOptions = async (selectedType) => {
        filterValue.innerHTML = '<option value="">Select a value</option>';
        
        if (!selectedType) {
            filterValue.disabled = true;
            return;
        }
        
        filterValue.disabled = false;
    };
    
    filterType.addEventListener('change', (e) => {
        updateFilterValueOptions(e.target.value);
    });
});