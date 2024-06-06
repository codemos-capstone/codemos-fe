import { useCallback } from 'react';

export default function useRegister() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

    return useCallback((email, username, password) => {
        fetch(`${serverAddress}/auth/sign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, nickname: username })
        })
        .then(response => {
            // JSON 파싱 시도
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch {
                    return { message: text };
                }
            });
        })
        .then(data => {
            if (!data.message) {
                throw new Error('Failed to register. Please try again.');
            }
            alert(data.message);
        })
        .catch(err => {
            alert(err.message);
        });
    }, [serverAddress]);
}
