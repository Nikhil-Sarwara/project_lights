
// Client Side
async function handleSubmit(event, led, state){
    event.preventDefault();
    console.log("submit")

    const response = await fetch("http://localhost:3000/api/handler", {
        method: 'POST',
        body: JSON.stringify({
           value: state,
            led: led,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
