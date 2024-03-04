import Profile from "../../../src/views/AdminPage/AdminProfile.vue";
import { mount, shallowMount } from "@vue/test-utils";
describe('Profile Page', () => {

    it('should render the component', () => {
        const wrapper = shallowMount(Profile,{ 
              }
    );
    
        expect(wrapper.exists()).toBe(true);
      });
    

});