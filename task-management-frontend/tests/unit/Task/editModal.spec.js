import { shallowMount } from '@vue/test-utils';

import MyComponent from '../../../src/views/AdminPage/EditModal.vue';




it('should render the component', () => {
    const wrapper = shallowMount(MyComponent,{ 
       mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
}}}
);



    expect(wrapper.exists()).toBe(true);
  });

