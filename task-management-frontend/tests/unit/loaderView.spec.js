import { shallowMount } from '@vue/test-utils';
import loaderView from "../../src/views/AdminPage/Loader/loaderView.vue"; 

describe('LdsSpinner.vue', () => {
  it('renders the spinner component', () => {
    const wrapper = shallowMount(loaderView);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes('lds-spinner')).toBe(false); 
    expect(wrapper.findAll('div').length).toBe(14); 
  });
});