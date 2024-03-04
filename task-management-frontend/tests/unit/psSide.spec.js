import addProject from "../../src/views/AdminPage/psSidebar.vue";
import { mount } from "@vue/test-utils";

test("add project Component renders the correct text", () => {
    const wrapper = mount(addProject);
    // const forgotten = wrapper.get('[data-test="forgotten"');
    const Msg1 = wrapper.get('[data-test="heading1"]');
    expect(Msg1.text()).toBe("Project Settings")
});

