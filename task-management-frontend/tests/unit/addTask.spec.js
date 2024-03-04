

import addTask from "../../src/views/AdminPage/AddTask.vue";
import {shallowMount} from "@vue/test-utils";


it('should render the component', () => {
  const wrapper = shallowMount(addTask,{ 
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


