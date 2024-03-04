import addProject from "../../src/views/AdminPage/AddProjectModal.vue";
import { mount ,shallowMount} from "@vue/test-utils";
import { VTextField } from 'vuetify/lib';
import { DatePicker } from 'vuetify';



describe('MyComponent', () => {

test("add project Component renders the correct text", () => {
    const wrapper = mount(addProject);
    // const forgotten = wrapper.get('[data-test="forgotten"');
    const Msg1 = wrapper.get('[data-test="addProject"]');
    expect(Msg1.text()).toBe("Add Project")
});



test('Check weather field appears on add project page', async () => {
    const wrapper = mount(addProject);
    expect(wrapper.find('[type="text"]')).toBeDefined();
    expect(wrapper.find('[type="text"]')).toBeDefined();
    expect(wrapper.find('[type="date"]')).toBeDefined();

});



test('Check submit button in login page', async () => {
    const wrapper = mount(addProject);
    expect(wrapper.find('[data-test="addBtn"]').exists()).toBe(true);
});
it('should have a text field', () => {
    // Shallow mount the MyComponent
    const wrapper = shallowMount(addProject, {
      stubs: {
        VTextField, // Stub the VTextField component
      },
    });

    // Use wrapper.find() to find the VTextField component
    const textField = wrapper.findComponent(VTextField);

    // Use .exists() to check if the VTextField component exists
    expect(textField.exists()).toBe(true); // Assert that it exists
  });

  it('should not have a text field', () => {
    // Shallow mount the MyComponent without rendering the VTextField component
    const wrapper = shallowMount(addProject, {
      stubs: {
        VTextField: false, // Stub the VTextField component to not render
      },
    });

    // Use wrapper.find() to try to find the VTextField component
    const textField = wrapper.findComponent(VTextField);

    // Use .exists() to check if the VTextField component exists
    expect(textField.exists()).toBe(false); // Assert that it does not exist
  });


  it('should have a date picker', () => {
    // Shallow mount the MyComponent
    const wrapper = shallowMount(addProject);

    // Use wrapper.find() to find the date picker element by its Vue component instance
    const datePicker = wrapper.findComponent(addProject);

    // Use .exists() to check if the date picker element exists
    expect(datePicker.exists()).toBe(true); // Assert that it exists
  });








});