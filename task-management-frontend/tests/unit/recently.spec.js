import { shallowMount } from "@vue/test-utils";
import recently from '../../src/views/AdminPage/RecentlyViewed.vue';
it('should render the component', () => {
    const wrapper = shallowMount(recently,{ 
        propsData: {
            Update_tid:"",
            project_Id:""
                  },  mocks: {
                    $store: {
                      state: {
                         TaskId:'',
                         projectId:''
                      }
}}}
);

    expect(wrapper.exists()).toBe(true);
  });