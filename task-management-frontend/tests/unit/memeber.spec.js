
import MyComponent from '../../src/views/AdminPage/Members/memberPage.vue';
import { shallowMount } from '@vue/test-utils';


it('should render the component', () => {
    const wrapper = shallowMount(MyComponent,{
        mocks: {
            $store: {
              state: {
                projectId: '',
                taskId:''
              }
            }
        }
    }
);


    expect(wrapper.exists()).toBe(true);
  });


