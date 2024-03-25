<template>
    <div class="form-container">
        <h1 class="big-title">Change Password</h1>
        <form @submit.prevent="updatePassword">
            <div>
            <label>Current Password<span class="required">*</span></label><br>
            <input class ="big-input-field" type="password" v-model="currentPassword" required>
            </div>

            <div>
            <label>New Password<span class="required">*</span></label><br>
            <input class ="big-input-field" type="password" v-model="newPassword" required>
            </div>

            <div>
            <label>Confirm Password<span class="required">*</span></label><br>
            <input class ="big-input-field" type="password" v-model="confirmPassword" required>
            </div>
            
            <button class ="big-submit-button" type="submit">Save Changes</button>
            <button class ="big-cancel-button" @click="goBack" type="button">Cancel</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'UserSecurity',
    data() {
        return {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    },
    methods:{
        async updatePassword() {
            if (this.newPassword !== this.confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
            }
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await this.$axios.post(`${this.$api_path}/updatePassword`, { currentPassword: this.currentPassword, newPassword: this.newPassword, confirmPassword: this.confirmPassword}, 
                    {headers: { Authorization: token }});
                    alert('Password updated successfully.');
                    this.logout();
                } catch (error) {
                    console.error('Error updating password:', error);
                    alert('Failed to update password. Please try again later.');
                }
            } else {
            console.error('User not authorized');
                alert('User not authorized. Please login again.');
            }
        },
        goBack() {
            this.$emit('editingFinished'); // Emit event to notify the parent component
            this.$router.go(-1);
            window.location.reload();
        },
        logout() {
            localStorage.removeItem('token');
            this.$emit('logoutUser');
            this.$router.push('/registration');
            localStorage.clear();
            setTimeout(() => {
                window.location.reload();
            }, 0); 
        }
    }
}
</script>

<style scoped>
@import '@/style/buttons.css';
@import '@/style/textStyle.css';
@import '@/style/inputField.css';
@import '@/style/containers.css';

</style>
