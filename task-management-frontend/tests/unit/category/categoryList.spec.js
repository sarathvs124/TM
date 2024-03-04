import { shallowMount } from '@vue/test-utils';
import IssueType from '../../../src/views/AdminPage/CategoryList.vue';




it('should render the component', async () => {
    const wrapper = shallowMount(IssueType,{ 
        propsData: {
            category:[]
                  },  mocks: {
                    $store: {
                      state: {
                        projectId: '',
                        taskId:''
                      }
}}}
);

    expect(wrapper.exists()).toBe(true);
  });

