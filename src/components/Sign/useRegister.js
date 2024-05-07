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
                    // JSON으로 변환하려고 시도
                    return JSON.parse(text);
                } catch {
                    // JSON이 아닌 텍스트면 그대로 반환
                    return { message: text };
                }
            });
        })
        .then(data => {
            if (!data.message) {
                throw new Error('Failed to register. Please try again.');
            }
            alert(data.message); // 서버에서 제공한 메시지 또는 기본 메시지 사용
        })
        .catch(err => {
            alert(err.message); // 에러 메시지 표시
        });
    }, [serverAddress]);
}
