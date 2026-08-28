const tagList = document.getElementById('list');
const message = document.getElementById('message');
const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
const request = async (path, options) => {
    const response = await fetch(path, {...options, credentials: 'same-origin'});
    const body = await response.text();
    if (!response.ok) throw new Error(body);
    return body.trim() ? JSON.parse(body) : null
};

async function load() {
    const tags = await request('/tag', {method: 'GET'});
    tagList.innerHTML = tags.length ? tags.map(tag => `<div class="tag-row"><strong>${escapeHtml(tag.name)}</strong><div class="tag-actions"><button class="button secondary" onclick="editTag(${tag.id},'${escapeHtml(tag.name)}')">Edit</button><button class="button danger" onclick="deleteTag(${tag.id})">Delete</button></div></div>`).join('') : 'No tags registered.'
}

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
