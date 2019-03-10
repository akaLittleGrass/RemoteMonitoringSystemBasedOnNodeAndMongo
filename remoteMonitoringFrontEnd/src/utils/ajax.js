export default function(url, data, options){
    options = Object.assign({
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        // headers: new Headers({
        //     'Content-Type': 'application/json'
        // })
    }, options)

    return fetch(url, options)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(data => console.log(data))
}
