import { shallowMount } from '@vue/test-utils';
import SearchTask from '../../src/views/AdminPage/SearchTask.vue';

test('Check weather search field login page', async () => {
    const wrapper = shallowMount(SearchTask);
    expect(wrapper.find('[type="search"]')).toBeDefined();
    
});