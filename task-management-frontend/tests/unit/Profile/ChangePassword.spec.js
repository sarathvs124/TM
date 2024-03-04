import { shallowMount } from '@vue/test-utils';
import changePassword from '../../../src/views/AdminPage/ChangePassword.vue';




it('should render the component', () => {
    const wrapper = shallowMount(changePassword,{ 
          }
);

    expect(wrapper.exists()).toBe(true);
  });
