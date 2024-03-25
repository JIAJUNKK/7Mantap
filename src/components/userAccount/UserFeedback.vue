<template>        
    <div class="big-information-container">
        <h1>Help Us Improve</h1><br>
        <div class="rating-section">
            <p>Rate your experience with 7Mantap</p>
            <div class="star-rating" v-for="rating in 5" :key="rating" @click="selectRating(rating)">
                <span :class="{ 'filled': rating <= selectedRating }">&#9733;</span>
            </div>
        </div>

        <div class="feedback-section">
            <p>Share your feedback with us and help us improve</p>
            <small>Your feedback will be kept anonymous</small><br><br>
            <textarea v-model="feedbackText" rows="10" maxlength="1024"></textarea>
            <div class="char-count">{{ charCount }}/1024</div>

            <button class="big-submit-button" @click="submitFeedback" type = "submit">Submit</button>
            <button class="big-cancel-button" @click="goBack" type = "button">Back</button>
        </div>

    </div>
</template>

<script>
export default {
    name: 'UserFeedback',
    data() {
        return {
            selectedRating: 0,
            feedbackText: ''
        };
    },
    methods: {
        selectRating(rating) {
            this.selectedRating = rating;
        },
        submitFeedback() {
            const token = localStorage.getItem('token');
            const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
            const feedbackData = {
                rating: this.selectedRating,
                feedback: this.feedbackText,
                dateCreated: currentDate
            };
            this.$axios.post(`${this.$api_path}/feedback`, feedbackData, { headers: { Authorization: token }})
                .then(response => {
                    alert('Feedback submitted. Thanks for your feedback', response.data);
                    this.selectedRating = 0;
                    this.feedbackText = '';
                })
                .catch(error => {
                    console.error('Error submitting feedback:', error);
                });
        },
        logout() {
            localStorage.removeItem('token');
            this.$emit('logoutUser');
            this.$router.push('/registration');
            localStorage.clear();
            setTimeout(() => {
            window.location.reload();
            }, 0); // 2000 milliseconds (2 seconds) delay before reloading
        },
        goBack() {
            this.$router.go(-1);
        },
    },
    computed: {
        charCount() {
            return this.feedbackText.length;
        }
    },
}
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/buttons.css';
@import '@/style/mobileView.css';

.big-information-container{
    margin-right: 10%; 
    text-align: center;
}
.rating-section {
    margin-bottom: 20px;
}

.star-rating {
    display: inline-block;
    font-size: 30px;
    cursor: pointer;
    color: #ccc;
}

.filled {
    color: #ffbf00 !important;
}

.feedback-section textarea {
    max-width: 80%; min-width: 80%;
    background-color: white; color: black; 
    font-weight: bold; font-size: 1rem;
    padding: 10px;
    width: 90%;
    margin-bottom: 5%; margin-left: 20px;
    cursor: pointer;
    border: 2px solid black; 
    text-align: left; 
}
.char-count{
    text-align: right;
    margin-right: 10%; margin-top: -10%;
}
</style>
