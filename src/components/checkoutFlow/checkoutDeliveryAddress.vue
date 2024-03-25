<template>
    <div v-if="userAddresses.length > 0">
        <div v-if="editSection != 'deliveryAddress'" class="inner-information-container">
            <div class="edit-title-header">
                <h1>We Will Deliver to This Address</h1>
                <span class="edit-text-toggle" @click="toggleEdit('deliveryAddress')">Edit</span>
            </div>
            <div>
                <h5>{{ selectedAddress.firstName + " " + selectedAddress.lastName }}</h5>
                <h5>{{ selectedAddress.addressLine1 }}</h5>
                <h5>{{ selectedAddress.addressLine2 }}</h5>
                <h5>{{ selectedAddress.city }}</h5>
                <h5>{{ selectedAddress.state }}</h5>
                <h5>{{ selectedAddress.postcode }}</h5>
            </div>
        </div>

        <div v-if="editSection === 'deliveryAddress'" class="form-container">
            <div class = "edit-title-header">
                <h1>Edit Selected Delivery Address</h1>
                <span @click="cancelEdit" class = "edit-text-toggle">Cancel</span>
            </div>
            <form>
                <div>
                <label for="firstName">First Name<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="editingAddress.firstName" required>
                </div>
                <div>
                <label for="lastName">Last Name<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="editingAddress.lastName" required>
                </div>
                <div>
                <label for="addressLine1">Address Line 1<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="editingAddress.addressLine1" required>
                </div>
                <div>
                <label for="addressLine2">Address Line 2</label>
                <input class = "big-input-field" type="text" v-model="editingAddress.addressLine2">
                </div>
                <div>
                <label for="city">City<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="editingAddress.city" required>
                </div>
                <div>
                <label for="state">State<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="editingAddress.state" required>
                </div>
                <div>
                <label for="postcode">Postcode<span class="required">*</span></label>
                <input class = "big-input-field" type="text" v-model="editingAddress.postcode" required>
                </div>
                <button class = "big-submit-button" type="submit" @click="updateSelectedDeliveryAddress(editingAddress, selectedAddressIndex)">Save Edit</button>
                <button @click="cancelEdit" class = "big-cancel-button">Close</button>
            </form>
        </div>
    </div>
    <br>
    <div v-if="showOtherAddresses">
        <div v-for="(address, index) in userAddresses" :key="index" class="delivery-address-container">
            <div class="delivery-address-container-header">
                <h2>{{ index === 0 ? 'Default Delivery Address' : 'Delivery Address ' + index }}</h2>
                <input type="radio" :value="index" v-model="selectedAddressIndex" @change="updateSelectedAddressIndex">
            </div>
            <div class="delivery-address-detail-container" v-show="!address.isEditDeliveryVisible">
                <div class="address-line">
                    <div>
                        <small>First Name</small>
                        <h5>{{ address.firstName }}</h5>
                    </div>
                    <div>
                        <small>Last Name</small>
                        <h5>{{ address.lastName }}</h5>
                    </div>
                </div>
                <div class="address-line">
                    <div>
                        <small>Address Line 1</small>
                        <h5>{{ address.addressLine1 }}</h5>
                    </div>
                    <div>
                        <small>Address Line 2</small>
                        <h5>{{ address.addressLine2 }}</h5>
                    </div>
                </div>
                <div class="address-line">
                    <div>
                        <small>Postcode</small>
                        <h5>{{ address.postcode }}</h5>
                    </div>
                    <div>
                        <small>City</small>
                        <h5>{{ address.city }}</h5>
                    </div>
                    <div>
                        <small>State</small>
                        <h5>{{ address.state }}</h5>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <button v-show="userAddresses.length>0 && !showOtherAddresses && editSection != 'deliveryAddress'" @click="toggleOtherAddresses" class = "big-submit-button">Choose Other Addresses</button>
    <button v-show="showOtherAddresses" @click="toggleOtherAddresses" class = "big-cancel-button">Close</button>
    <button @click="toggleForm" class="big-cancel-button" v-show="!isFormExpanded && !showOtherAddresses && editSection != 'deliveryAddress'">Add New Delivery Address</button><br>

    <div class="form-container" v-show="isFormExpanded">
        <div class ="edit-title-header">
            <h2>Add A Delivery Address</h2><br>
            <span @click="toggleForm" class = "edit-text-toggle">Cancel</span>
        </div>
        <form @submit.prevent="createUserAddress">
        <div>
            <label for="firstName">First Name<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.firstName" required>
        </div>
        <div>
            <label for="lastName">Last Name<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.lastName" required>
        </div>
        <div>
            <label for="addressLine1">Address Line 1<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.addressLine1" required>
        </div>
        <div>
            <label for="addressLine2">Address Line 2</label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.addressLine2">
        </div>
        <div>
            <label for="city">City<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.city" required>
        </div>
        <div>
            <label for="state">State<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.state" required>
        </div>
        <div>
            <label for="postcode">Postcode<span class="required">*</span></label>
            <input class = "big-input-field" type="text" v-model="addingDeliveryAddress.postcode" required>
        </div>
        <button class = "big-submit-button" type="submit">Save Address</button>
        <button class = "big-cancel-button" type="button" @click="toggleForm">Cancel</button>
        </form>
    </div>
</template>

<script>
export default {
    name: "CheckoutDeliveryAddress",
    data() {
        return {
        editSection: null,
        addingDeliveryAddress: {
            firstName: '',
            lastName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postcode: ''
        },
        editingAddress: { 
        },
        
        userAddresses: [],
        isFormExpanded: false,
        showOtherAddresses: false, 
        selectedAddressIndex: 0, 
        defaultAddressIndex: 0,
    }
        
    },
    created() {
        this.getUserDetails();
    },
    computed: {
        selectedAddress() {
            if (this.selectedAddressIndex === 0) {
                return this.userAddresses[this.defaultAddressIndex];
            }
            return this.userAddresses[this.selectedAddressIndex];
        },
    },
    methods: {
        async getUserDetails() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                const AddressResponse = await this.$axios.post(`${this.$api_path}/getUserAddress`, null, { headers: { Authorization: token } });
                if (AddressResponse.data && AddressResponse.data.address) {
                    this.userAddresses = AddressResponse.data.address;
                    if (AddressResponse.data.selectedAddressIndex === undefined){
                        this.selectedAddressIndex = 0;
                    }else{

                        this.selectedAddressIndex = AddressResponse.data.selectedAddressIndex;
                    }
                }
                } catch (error) {
                console.error('Error fetching user address:', error);
                }
            }
        },
        async createUserAddress() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const addressData = {
                        firstName: this.addingDeliveryAddress.firstName,
                        lastName: this.addingDeliveryAddress.lastName,
                        addressLine1: this.addingDeliveryAddress.addressLine1,
                        addressLine2: this.addingDeliveryAddress.addressLine2,
                        city: this.addingDeliveryAddress.city,
                        state: this.addingDeliveryAddress.state,
                        postcode: this.addingDeliveryAddress.postcode
                    };
                    await this.$axios.post(`${this.$api_path}/createUserAddress`, { address: addressData }, { headers: { Authorization: token } });
                    this.reset();
                    setTimeout(() => {
                        window.location.reload();
                    }, 0);
                } catch (error) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 0);
                }
            }
            this.toggleForm();
        },
        toggleEdit(section) {
            this.editSection = section;
            this.editingAddress = { ...this.selectedAddress };
        },
        cancelEdit() {
            this.editSection = null;
        },
        toggleOtherAddresses() {
            this.showOtherAddresses = !this.showOtherAddresses;
        },
        toggleForm() {
            this.isFormExpanded = !this.isFormExpanded;
        },
        updateSelectedAddressIndex() {
            this.selectedAddress = this.userAddresses[this.selectedAddressIndex];
            const token = localStorage.getItem('token');
            if (token) {
                this.$axios.post(`${this.$api_path}/updateSelectedAddress`, { addressIndex: this.selectedAddressIndex }, { headers: { Authorization: token } })
                setTimeout(() => {
                    window.location.reload();
                }, 0);
            }

        },
        async updateSelectedDeliveryAddress(address, index){
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const addressData = {
                        firstName: address.firstName,
                        lastName: address.lastName,
                        addressLine1: address.addressLine1,
                        addressLine2: address.addressLine2,
                        city: address.city,
                        state: address.state,
                        postcode: address.postcode
                    };
                    console.log(addressData, index)
                    await this.$axios.post(`${this.$api_path}/updateUserAddress/${index}`, { address: addressData }, { headers: { Authorization: token } });
                    alert("Delivery Address Has Been Updated Successfully!");
                    this.reset();
                    this.toggleEdit(index); 
                    setTimeout(() => {
                        window.location.reload();
                    }, 0);
                } catch (error) {
                    console.error('Error updating user address:', error);
                }
            }
        },
    },
}
</script>

<style scoped>
@import '@/style/containers.css';
@import '@/style/textStyle.css';
@import '@/style/buttons.css';
@import '@/style/inputField.css';
.delivery-address-detail-container {
    padding: 2%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    border: 2.5px solid black;
}

.address-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.address-line div {
    flex: 1; /* Make each address field take up equal space */
    display: flex;
    flex-direction: column;
}
</style>
