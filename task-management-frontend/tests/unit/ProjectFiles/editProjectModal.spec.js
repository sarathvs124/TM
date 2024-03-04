import { shallowMount } from '@vue/test-utils';

import MyComponent from '../../../src/views/AdminPage/EditProjectModal.vue';




it('should render the component', () => {
    const wrapper = shallowMount(MyComponent,{ 
        propsData: {
            projectData: [],
                }, 
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

