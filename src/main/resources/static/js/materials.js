const searchForm = document.getElementById('searchForm');
const searchType = () => document.querySelector('input[name="searchType"]:checked').value;
const searchKeyword = document.getElementById('searchKeyword');
const selectedTagsContainer = document.getElementById('selectedTagsContainer');
const materialList = document.getElementById('materialList');
const emptyMessage = document.getElementById('emptyMessage');
const tagSuggestions = document.getElementById('tagSuggestions');
const materialTemplate = document.getElementById('materialTemplate');
const tagSuggestionTemplate = document.getElementById('tagSuggestionTemplate');
let tagRequest;
let selectedTags = [];

const queryTag = new URLSearchParams(location.search).get('tag');
const queryTags = new URLSearchParams(location.search).getAll('tags');

const getTagKeywords = value => value.split(',').map(tag => tag.trim()).filter(Boolean);

const renderSelectedTags = () => {
    selectedTagsContainer.replaceChildren(...selectedTags.map(tag => {
        const chip = document.createElement('div');
        chip.className = 'selected-tag';

        const label = document.createElement('span');
        label.textContent = tag;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'selected-tag-remove';
        removeButton.textContent = '×';
        removeButton.setAttribute('aria-label', `Remove tag ${tag}`);
        removeButton.addEventListener('click', () => {
            selectedTags = selectedTags.filter(item => item !== tag);
            renderSelectedTags();
            if (isTagSearch()) loadTagSuggestions();
            searchKeyword.focus();
        });

        chip.append(label, removeButton);
        return chip;
    }));
};

const addSelectedTag = tagName => {
    const normalized = tagName.trim();
    if (!normalized || selectedTags.includes(normalized)) return;

    selectedTags.push(normalized);
    renderSelectedTags();
    searchKeyword.value = '';
    hideTagSuggestions();
    searchKeyword.focus();
};

if (queryTags.length) {
    selectedTags = [...queryTags];
    renderSelectedTags();
    document.getElementById('searchTag').checked = true;
} else if (queryTag) {
    document.getElementById('searchTag').checked = true;
    selectedTags = [queryTag];
    renderSelectedTags();
}

const attachCardNavigation = card => {
    const detailId = card.dataset.id || card.getAttribute('data-id');
    if (!detailId) return;

    const detailUrl = `/material-detail.html?id=${encodeURIComponent(detailId)}`;
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', event => {
        if (event.target.closest('.tag') || event.target.closest('.url')) return;
        window.location.href = detailUrl;
    });
    card.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button')) {
            event.preventDefault();
            window.location.href = detailUrl;
        }
    });
};

const renderMaterials = materials => {
    materialList.replaceChildren(...materials.map(material => {
        const item = materialTemplate.content.cloneNode(true);
        const card = item.querySelector('.material');
        const title = item.querySelector('.material-title');
        const urlRow = item.querySelector('.material-url-row');
        const url = item.querySelector('.material-url');

        card.dataset.id = material.id;
        attachCardNavigation(card);
        title.removeAttribute('href');
        title.textContent = material.title;
        item.querySelector('.material-created').textContent = material.createdAt;
        item.querySelector('.material-memo').textContent = material.memo || 'No memo available.';
        if (material.url) {
            url.href = material.url;
            url.textContent = material.url;
        } else {
            urlRow.remove();
        }
        item.querySelector('.material-tags').replaceChildren(...(material.tags || []).map(tag => {
            const tagElement = document.createElement('a');
            tagElement.className = 'tag';
            tagElement.href = `/materials.html?tags=${encodeURIComponent(tag.name)}`;
            tagElement.textContent = tag.name;
            tagElement.addEventListener('click', event => {
                event.stopPropagation();
            });
            return tagElement;
        }));
        return item;
    }));
    materialList.hidden = materials.length === 0;
    emptyMessage.hidden = materials.length !== 0;
};

Array.from(document.querySelectorAll('.material')).forEach(card => {
    attachCardNavigation(card);
});

const isTagSearch = () => searchType() === 'tag';

const hideTagSuggestions = () => {
    tagSuggestions.hidden = true;
    tagSuggestions.replaceChildren();
};

const renderTagSuggestions = tags => {
    tagSuggestions.replaceChildren(...tags.map(tag => {
        const suggestion = tagSuggestionTemplate.content.firstElementChild.cloneNode(true);
        suggestion.dataset.tagName = tag.name;
        suggestion.textContent = tag.name;
        return suggestion;
    }));
    tagSuggestions.hidden = tags.length === 0;
};

const loadTagSuggestions = async () => {
    const keywords = getTagKeywords(searchKeyword.value);
    const keyword = keywords.at(-1) || '';
    if (!isTagSearch() || !keyword) {
        hideTagSuggestions();
        return;
    }

    if (tagRequest) tagRequest.abort();
    tagRequest = new AbortController();
    try {
        const response = await fetch(`/tag?name=${encodeURIComponent(keyword)}`, {
            credentials: 'same-origin',
            signal: tagRequest.signal
        });
        if (!response.ok) throw new Error();
        renderTagSuggestions(await response.json());
    } catch (error) {
        if (error.name !== 'AbortError') hideTagSuggestions();
    }
};

document.querySelectorAll('input[name="searchType"]').forEach(option => {
    option.addEventListener('change', () => {
        if (isTagSearch()) loadTagSuggestions();
        else hideTagSuggestions();
    });
});
searchKeyword.addEventListener('input', loadTagSuggestions);
searchKeyword.addEventListener('keydown', event => {
    if (event.key === 'Backspace' && !searchKeyword.value && selectedTags.length) {
        event.preventDefault();
        selectedTags.pop();
        renderSelectedTags();
        return;
    }

    if (event.key === 'Enter' || event.key === ',') {
        const currentValue = searchKeyword.value.trim();
        if (!currentValue) return;
        event.preventDefault();
        addSelectedTag(currentValue);
    }
});
tagSuggestions.addEventListener('click', event => {
    const suggestion = event.target.closest('.tag-suggestion');
    if (!suggestion) return;
    addSelectedTag(suggestion.dataset.tagName);
});

document.addEventListener('click', event => {
    if (!event.target.closest('.search-input-wrap')) hideTagSuggestions();
});

searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    const keywords = selectedTags.length ? selectedTags : getTagKeywords(searchKeyword.value);
    const parameters = new URLSearchParams();
    if (searchType() === 'tag') {
        keywords.forEach(keyword => parameters.append('tags', keyword));
    } else {
        parameters.set('title', searchKeyword.value.trim());
    }
    const response = await fetch(`/material?${parameters}`, {
        credentials: 'same-origin'
    });
    if (!response.ok) return;
    renderMaterials(await response.json());
});

if (queryTag || queryTags.length) searchForm.requestSubmit();