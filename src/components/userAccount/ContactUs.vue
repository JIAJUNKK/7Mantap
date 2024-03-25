<template>
    <div class="big-information-container">
        <h1>Contact Us</h1>

        <div class="contact-info">
            <div class="contact-item">
                <h1 class="fas fa-envelope"></h1> <!-- Font Awesome email icon -->
                <p>kongjiajun040103@gmail.com</p>
            </div>
            <div class="contact-item">
                <h1 class="fab fa-whatsapp"></h1> <!-- Font Awesome WhatsApp icon -->
                <p>+60123456789</p>
            </div>
        </div>

    </div>   

</template>


<script>
export default {
    name: 'ContactUs',
}
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
@import '@/style/textStyle.css';
.big-information-container{
    margin-right: 10%; 
    text-align: center;
}
.contact-info{
    display: flex; flex-direction: column; justify-content: center;
    margin-top: 10%;
}

</style>
