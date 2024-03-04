import { shallowMount } from "@vue/test-utils";
import TaskList from '../../src/views/AdminPage/TaskView.vue';
import axios from 'axios';

// jest.mock('axios', () => ({
//   get: jest.fn()
// }));

it('should render the component', async () => {
//   axios.get.mockResolvedValue({ data: [] });

  const wrapper = shallowMount(TaskList, { 
    mocks: {
      $store: {
        state: {
          TaskId:'',
          projectId:''                      
        }
      }
    }
  });

  await wrapper.vm.$nextTick();
  expect(wrapper.exists()).toBe(true);
}, 5000);
