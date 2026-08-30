const tagList = document.getElementById('list');
const message = document.getElementById('message');
const tagRowTemplate = document.getElementById('tagRowTemplate');
const request = async (path, options) => {
    const response = await fetch(path, {...options, credentials: 'same-origin'});
    const body = await response.text();
    if (!response.ok) throw new Error(body);
    return body.trim() ? JSON.parse(body) : null
};

async function load() {
    const tags = await request('/tag', {method: 'GET'});
    if (!tags.length) {
        tagList.textContent = 'No tags registered.';
        return;
    }
    tagList.replaceChildren(...tags.map(tag => {
        const row = tagRowTemplate.content.cloneNode(true);
        row.querySelector('.tag-name').textContent = tag.name;
        row.querySelector('.edit-tag').dataset.id = tag.id;
        row.querySelector('.edit-tag').dataset.name = tag.name;
        row.querySelector('.delete-tag').dataset.id = tag.id;
        return row;
    }));
}

tagList.addEventListener('click', event => {
    const editButton = event.target.closest('.edit-tag');
    if (editButton) return editTag(editButton.dataset.id, editButton.dataset.name);
    const deleteButton = event.target.closest('.delete-tag');
    if (deleteButton) deleteTag(deleteButton.dataset.id);
});

document.getElementById('create').addEventListener('submit', async event => {
    event.preventDefault();
    try {
        await request('/tag', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newName.value.trim()})
        });
        newName.value = '';
        message.textContent = 'Tag added successfully.';
        message.className = 'message success';
        await load()
    } catch (error) {
        console.error(error);
        message.textContent = 'Failed to add tag.'
    }
});

async function editTag(id, current) {
    const name = prompt('Enter a new tag name.', current);
    if (name === null || !name.trim()) return;
    try {
        await request(`/tag/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name.trim()})
        });
        await load()
    } catch (error) {
        console.error(error);
        message.textContent = 'Failed to update tag.'
    }
}

async function deleteTag(id) {
    if (!confirm('Delete this tag?')) return;
    try {
        await request(`/tag/${id}`, {method: 'DELETE'});
        await load()
    } catch (error) {
        console.error(error);
        message.textContent = 'Failed to delete tag.'
    }
}

load().catch(() => message.textContent = 'Unable to load tags.');
