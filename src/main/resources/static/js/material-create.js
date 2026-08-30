const tagContainer = document.getElementById('tags');
const message = document.getElementById('message');
const tagOptionTemplate = document.getElementById('tagOptionTemplate');
fetch('/tag').then(response => response.json()).then(data => tagContainer.replaceChildren(...data.map(tag => {
    const option = tagOptionTemplate.content.cloneNode(true);
    const input = option.querySelector('input');
    input.value = tag.id;
    option.querySelector('.tag-name').textContent = tag.name;
    return option;
}))).catch(() => tagContainer.textContent = 'Tags could not be loaded.');
document.getElementById('form').addEventListener('submit', async event => {
    event.preventDefault();
    try {
        const response = await fetch('/material', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title.value.trim(),
                url: url.value.trim(),
                memo: memo.value.trim(),
                tagIds: Array.from(tagContainer.querySelectorAll('input:checked')).map(input => Number(input.value))
            })
        });
        if (!response.ok) throw new Error();
        message.textContent = 'Material created successfully.';
        message.className = 'message success';
        setTimeout(() => location.href = '/materials.html', 500)
    } catch (error) {
        console.error(error);
        message.textContent = 'Failed to create material.'
    }
});
