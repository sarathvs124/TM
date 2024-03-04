

import editTask from "../../src/views/AdminPage/EditTask.vue";
import {shallowMount} from "@vue/test-utils";


it('should render the component', () => {
  const wrapper = shallowMount(editTask,{ 
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


