import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/homePage.vue';
import ShoppingBag from '@/components/shoppingBag.vue';
import UserRegistration from '@/components/registration.vue';
import UserProfile from '@/components/userProfile.vue';
import ShirtDetails from '@/components/shirtDetails.vue';
import CheckoutPage from '@/components/checkout.vue';
import ConfirmationPage from '@/components/confirmationPage.vue';
import AccountSettings from '@/components/userAccount/accountSettings.vue';
import EditDetails from '@/components/userAccount/EditDetails.vue';
import AddressBook from '@/components/userAccount/AddressBook.vue';
import UserSecurity from '@/components/userAccount/UserSecurity.vue';
import UserFeedback from '@/components/userAccount/UserFeedback.vue';
import ContactUs from '@/components/userAccount/ContactUs.vue';
import OrderHistory from '@/components/userAccount/OrderHistory.vue';
import ViewOrderHistory from '@/components/orderHistoryFlow/viewOrderHistory.vue';
import SearchOrderHistory from '@/components/orderHistoryFlow/orderSearch.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/shirts/:productId', component: ShirtDetails},
  { path: '/shoppingBag', component: ShoppingBag },
  { path: '/registration', component: UserRegistration },
  { path: '/UserProfile', component: UserProfile },
  { path: '/checkout', component: CheckoutPage },
  { path: '/checkout-successful', 
    component: ConfirmationPage,
    name: 'ConfirmationPage',
    props: route => ({
      orderData: route.query.orderData
    })
  },
  {
    path: '/UserProfile',
    component: UserProfile,
    children: [
      { 
        path: 'AccountSettings', 
        component: AccountSettings,
        children: [
          { path: 'edit-details', component: EditDetails },
          { path: 'address-book', component: AddressBook },
          { path: 'user-security', component: UserSecurity }
        ]
      },

      { path: 'Contact-us', component: ContactUs },
      { path: 'Feedback', component: UserFeedback },
      { 
        path: 'Order-History', 
        component: OrderHistory, 
        redirect: { name: 'ViewOrderHistory' }, 
        children: [
          { path: 'order-history-view', component: ViewOrderHistory, name: 'ViewOrderHistory' },
          { path: 'order-history-search', component: SearchOrderHistory },
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
