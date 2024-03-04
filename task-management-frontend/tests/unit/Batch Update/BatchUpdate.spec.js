import Batch from '../../../src/views/AdminPage/BatchUpdate.vue';
import { shallowMount } from '@vue/test-utils';


it('should render the component', () => {
    const wrapper = shallowMount(Batch,{ 
        propsData: {
            Update_tid:Number,
                  },  mocks: {
                    $store: {
                      state: {
                         taskId:''
                      }
}}}
);

    expect(wrapper.exists()).toBe(true);
  });