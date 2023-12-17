const BASE_URL = "http://localhost:8000";
function postData(data) {
    return fetch(`${BASE_URL}/login`, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            "accept": "application/json"
        }, body: JSON.stringify(data)
    }).then(res => res.json());
}

export { postData }