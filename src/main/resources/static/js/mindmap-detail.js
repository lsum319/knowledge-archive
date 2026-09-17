const mindmapId = window.mindmapId;
const materialSearchForm = document.getElementById('materialSearchForm');
const materialSearchKeyword = document.getElementById('materialSearchKeyword');
const materialSuggestions = document.getElementById('materialSuggestions');
const materialList = document.getElementById('materialList');
const materialEmptyMessage = document.querySelector('.empty');
const mindmapMessage = document.getElementById('mindmapMessage');

const removeMaterial = async event => {
    event.stopPropagation();
    const button = event.currentTarget;
    if (!confirm('Remove this material from the mindmap?')) return;

    const response = await fetch(`/mindmap/${encodeURIComponent(mindmapId)}/${encodeURIComponent(button.dataset.id)}`, {
        method: 'DELETE',
        credentials: 'same-origin'
    });
    if (!response.ok) {
        setMessage('Failed to remove material.');
        return;
    }

    button.closest('.material').remove();
    updateMaterialEmptyState();
    setMessage('Material removed.', true);
};

const setMessage = (text, success = false) => {
    mindmapMessage.textContent = text;
    mindmapMessage.className = `message${success ? ' success' : ' error'}`;
};

const hideSuggestions = () => {
    materialSuggestions.hidden = true;
    materialSuggestions.replaceChildren();
};

const addMaterial = async materialId => {
    const response = await fetch(`/mindmap/${encodeURIComponent(mindmapId)}/${encodeURIComponent(materialId)}`, {
        method: 'POST',
        credentials: 'same-origin'
    });
    if (!response.ok) {
        setMessage('Failed to add material.');
        return;
    }

    const materialsResponse = await fetch(`/mindmap/${encodeURIComponent(mindmapId)}`, {credentials: 'same-origin'});
    if (materialsResponse.ok) renderCurrentMaterials(await materialsResponse.json());
    materialSearchKeyword.value = '';
    hideSuggestions();
    setMessage('Material added.', true);
};

const renderSuggestions = materials => {
    materialSuggestions.replaceChildren(...materials.map(material => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tag-suggestion';
        button.role = 'option';
        button.textContent = material.title;
        button.addEventListener('click', () => addMaterial(material.id));
        return button;
    }));
    materialSuggestions.hidden = materials.length === 0;
};

const loadSuggestions = async () => {
    const keyword = materialSearchKeyword.value.trim();
    if (!keyword) {
        hideSuggestions();
        return;
    }

    const response = await fetch(`/material?title=${encodeURIComponent(keyword)}`, {credentials: 'same-origin'});
    if (!response.ok) {
        hideSuggestions();
        return;
    }
    renderSuggestions(await response.json());
};

const renderCurrentMaterials = materials => {
    materialList.replaceChildren(...materials.map(material => {
        const card = document.createElement('article');
        card.className = 'material';
        card.dataset.id = material.id;
        card.tabIndex = 0;
        card.innerHTML = '<h2><a></a></h2><p>Open material details</p><button class="button danger material-remove" type="button">Remove</button>';
        const link = card.querySelector('a');
        link.href = `/material-detail.html?id=${encodeURIComponent(material.id)}`;
        link.textContent = material.title;
        const removeButton = card.querySelector('.material-remove');
        removeButton.dataset.id = material.id;
        removeButton.addEventListener('click', removeMaterial);
        card.addEventListener('click', event => {
            if (!event.target.closest('a, button')) window.location.href = link.href;
        });
        card.addEventListener('keydown', event => {
            if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button')) {
                event.preventDefault();
                window.location.href = link.href;
            }
        });
        return card;
    }));
    materialList.hidden = materials.length === 0;
    materialEmptyMessage.hidden = materials.length !== 0;
};

const updateMaterialEmptyState = () => {
    const hasMaterials = materialList.children.length > 0;
    materialList.hidden = !hasMaterials;
    materialEmptyMessage.hidden = hasMaterials;
};

materialSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    loadSuggestions();
});
materialSearchKeyword.addEventListener('input', loadSuggestions);
document.addEventListener('click', event => {
    if (!event.target.closest('.search-input-wrap')) hideSuggestions();
});

document.querySelectorAll('.material').forEach(card => {
    const detailUrl = `/material-detail.html?id=${encodeURIComponent(card.dataset.id)}`;
    card.querySelector('.material-remove')?.addEventListener('click', removeMaterial);
    card.addEventListener('click', event => {
        if (!event.target.closest('a, button')) window.location.href = detailUrl;
    });
    card.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button')) {
            event.preventDefault();
            window.location.href = detailUrl;
        }
    });
});