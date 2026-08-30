const materialId = new URLSearchParams(location.search).get('id');
const tagContainer = document.getElementById('tags');
const message = document.getElementById('message');
const tagOptionTemplate = document.getElementById('tagOptionTemplate');
const request = async (path, options) => {
    const response = await fetch(path, {...options, credentials: 'same-origin'});
    const body = await response.text();
    if (!response.ok) throw new Error(body);
    return body.trim() ? JSON.parse(body) : null
};
Promise.all([request(`/material/${encodeURIComponent(materialId)}`, {method: 'GET'}), request('/tag', {method: 'GET'})]).then(([material, tags]) => {
    title.value = material.title || '';
    url.value = material.url || '';
    memo.value = material.memo || '';
    const selected = (material.tags || []).map(tag => tag.id);
    tagContainer.replaceChildren(...tags.map(tag => {
        const option = tagOptionTemplate.content.cloneNode(true);
        const input = option.querySelector('input');
        input.value = tag.id;
        input.checked = selected.includes(tag.id);
        option.querySelector('.tag-name').textContent = tag.name;
        return option;
    }))
}).catch(() => message.textContent = 'Unable to load material.');
document.getElementById('form').addEventListener('submit', async event => {
    event.preventDefault();
    try {
        await request(`/material/${encodeURIComponent(materialId)}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title.value.trim(),
                url: url.value.trim(),
                memo: memo.value.trim(),
                tagIds: Array.from(tagContainer.querySelectorAll('input:checked')).map(input => Number(input.value))
            })
        });
        message.textContent = 'Material updated successfully.';
        message.className = 'message success';
        setTimeout(() => location.href = `/material-detail.html?id=${encodeURIComponent(materialId)}`, 500)
    } catch (error) {
        console.error(error);
        message.textContent = 'Failed to update material.'
    }
});
