const stripe = Stripe("pk_test_51PddhERu5oi1L0NTKwwgMODPHCwKfhilL5CVXXA0HzZTcuuNhKnw3QNiegO4O5N0SoDPrL7jttLJzLVfEliTWZ5Q00EsMjKPD5");
     

let medios=document.getElementById('cMedios')

medios.addEventListener('click', () => {

console.log('hola')})

const cargarMedios = async () => {

    let importe = document.getElementById("importe").value
    importe = parseFloat(importe)
    if (importe < 1 || isNaN(importe)) {
        alert("Monto erroneo")
        return
    }
    importe = importe * 100



    const response = await fetch("/api/views/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importe }),
    });
    const { clientSecret } = await response.json();
    console.log(clientSecret)


    const appearance = {
        theme: 'stripe',
    };
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElementOptions = {
        layout: "tabs",
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#metodospago");
}
