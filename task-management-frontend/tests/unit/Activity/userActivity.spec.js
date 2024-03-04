

import userActivity from "../../../src/views/AdminPage/UserActivity/UserActivity.vue"
import {shallowMount} from "@vue/test-utils";


it('should render the component', () => {
  const wrapper = shallowMount(userActivity,{ 
    propsData: {
      projectData: [],
          },  
     mocks: {
                  $store: {
                    state: {
                      projectId: '',
                      task_id:''
                    }
}}}
);

  expect(wrapper.exists()).toBe(true);
});

