let selectedMessageId = null;

async function sendRequest(method) {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value;
    let url = '/api/messages';
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        switch(method) {
            case 'GET':
                break;
            case 'POST':
                options.body = JSON.stringify({ text });
                break;
            case 'PUT':
                if (!selectedMessageId) {
                    alert('Please select a message to update first!');
                    return;
                }
                url += `/${selectedMessageId}`;
                options.body = JSON.stringify({ text });
                break;
            case 'DELETE':
                if (!selectedMessageId) {
                    alert('Please select a message to delete first!');
                    return;
                }
                url += `/${selectedMessageId}`;
                break;
        }

        const response = await fetch(url, options);
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        if (method === 'GET') {
            const data = await response.json();
            logEntry.innerHTML = `
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
                <br>
                <strong>${method}</strong>: Retrieved ${data.length} messages
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
        } else {
            logEntry.innerHTML = `
                <span class="timestamp">${new Date().toLocaleTimeString()}</span>
                <br>
                <strong>${method}</strong>: Status ${response.status} - ${response.statusText}
            `;
        }

        const responseLog = document.getElementById('responseLog');
        responseLog.insertBefore(logEntry, responseLog.firstChild);
        messageInput.value = '';
        selectedMessageId = null;

        // Refresh messages after modification
        if (method !== 'GET') {
            sendRequest('GET');
        }
    } catch (error) {
        console.error('Error:', error);
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry error';
        logEntry.innerHTML = `
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            <br>
            <strong>ERROR</strong>: ${error.message}
        `;
        document.getElementById('responseLog').insertBefore(logEntry, responseLog.firstChild);
    }
}

// Initial load
sendRequest('GET');