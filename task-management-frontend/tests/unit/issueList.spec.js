import { shallowMount } from '@vue/test-utils';
import IssueType from '../../src/views/AdminPage/IssueList.vue';




it('should render the component', () => {
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

