
import HelloWorld from "../../src/views/Login/PageNotFound";
import { mount } from "@vue/test-utils";




describe('HelloWorld', () => {

test("HelloWorld Component renders the correct text", () => {
  const wrapper = mount(HelloWorld);
  expect(wrapper.text()).toBe("𝟒𝟎𝟒 ! 𝐏𝐚𝐠𝐞 𝐍𝐨𝐭 𝐅𝐨𝐮𝐧𝐝  𝐢𝐭 𝐬𝐞𝐞𝐦𝐬 𝐲𝐨𝐮'𝐫𝐞 𝐢𝐧 𝐭𝐡𝐞 𝐰𝐫𝐨𝐧𝐠 𝐩𝐚𝐠𝐞");

  
});
});