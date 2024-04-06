const app = () => { 
// Query Selectors
const form = document.querySelector('.chat-from')
const formInput = document.getElementById('chat-input')

// Functions 
// const apiFetch = async() => {
//     try {
//         const response = fetch(, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 message: [],
//                 model: 'gbt-3.5-turbo',
//             })
//         })
//     } catch (error) {
//         console.log(error , 'Failed to fetch');
//     }
// }

// Event Listeners
form.addEventListener('submit', function (event) {
    event.preventDefault()
    console.log(event.target);
    // apiFetch()
})

}
